import { useEffect, useState, useRef } from "react";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { fireDB, auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { sendMessage } from "@/helpers/chat";

const Message = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Wait for Firebase Auth to load the current user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserId(user.uid);
    });
    return () => unsub();
  }, []);

  // ✅ Fetch all chats of current user
  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(fireDB, "chats"),
      where("users", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Sort by lastUpdated
      const sorted = chats.sort((a, b) => {
        const aTime = a.lastUpdated?.toDate ? a.lastUpdated.toDate() : 0;
        const bTime = b.lastUpdated?.toDate ? b.lastUpdated.toDate() : 0;
        return bTime - aTime;
      });

      // 🔹 Fetch other user info for each chat
      const enhancedChats = await Promise.all(
        sorted.map(async (chat) => {
          const otherUserId = chat.users.find((u) => u !== currentUserId);
          if (!otherUserId) return chat;

          try {
            const userDoc = await getDoc(doc(fireDB, "users", otherUserId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                ...chat,
                otherUser: {
                  id: otherUserId,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  avatar: userData.avatar || "",
                },
              };
            }
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
          return chat;
        })
      );

      setConversations(enhancedChats);
      console.log(enhancedChats);
      if (!selectedChat && enhancedChats.length > 0) {
        setSelectedChat(enhancedChats[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);


  // ✅ Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const q = query(
      collection(fireDB, "chats", selectedChat, "messages"),
      orderBy("timestamp", "asc"),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  // ✅ Fetch other user info
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!selectedChat || !currentUserId) return;
      const chatDoc = await getDoc(doc(fireDB, "chats", selectedChat));
      if (chatDoc.exists()) {
        const data = chatDoc.data();
        const otherUserId = data.users.find((u: string) => u !== currentUserId);
        if (otherUserId) {
          const userDoc = await getDoc(doc(fireDB, "users", otherUserId));
          if (userDoc.exists()) setOtherUser({ id: userDoc.id, ...userDoc.data() });
        }
      }
    };
    fetchOtherUser();
  }, [selectedChat, currentUserId]);

  // ✅ Search users
  const handleSearch = async (queryText: string) => {
    setSearchQuery(queryText);
    if (!queryText.trim()) {
      setSearchResults([]);
      return;
    }

    const usersRef = collection(fireDB, "users");
    const q = query(
      usersRef,
      where("firstName", ">=", queryText),
      where("firstName", "<=", queryText + "\uf8ff")
    );

    const snap = await getDocs(q);
    const users = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((u) => u.id !== currentUserId);

    setSearchResults(users);
  };

  // ✅ Send message
  const handleSendMessage = async () => {
    if (!newMessage && !mediaFile) return;
    if (!selectedChat || !currentUserId) return;

    const selectedConversation = conversations.find((c) => c.id === selectedChat);
    if (!selectedConversation) return;

    const userIds = selectedConversation.users;

    await sendMessage(selectedChat, currentUserId, userIds, {
      text: newMessage,
      imageFile: mediaFile?.type.startsWith("image/") ? mediaFile : undefined,
      videoFile: mediaFile?.type.startsWith("video/") ? mediaFile : undefined,
    });

    setNewMessage("");
    setMediaFile(null);
  };

  // ✅ Start new chat or open existing
  const startChatWithUser = async (user: any) => {
    if (!currentUserId) return;

    const chatsRef = collection(fireDB, "chats");
    const q = query(chatsRef, where("users", "array-contains", currentUserId));
    const snapshot = await getDocs(q);

    let existingChatId: string | null = null;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.users.includes(user.id)) existingChatId = docSnap.id;
    });

    if (existingChatId) {
      setSelectedChat(existingChatId);
      setSearchQuery("");
      setSearchResults([]);
      return;
    }

    const docRef = await addDoc(collection(fireDB, "chats"), {
      users: [currentUserId, user.id],
      lastUpdated: serverTimestamp(),
      lastMessage: "",
      unread: 0,
    });

    const newChat = { id: docRef.id, users: [currentUserId, user.id] };
    setConversations((prev) => [newChat, ...prev]);
    setSelectedChat(docRef.id);
    setSearchQuery("");
    setSearchResults([]);
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container-custom h-[calc(100vh-4rem)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h1 className="text-xl font-serif font-semibold mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => startChatWithUser(user)}
                        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || ""} />
                            <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{`${user.firstName} ${user.lastName}`}</h3>
                            <p className="text-sm text-muted-foreground">{user.username}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">No users found</p>
                  )
                ) : conversations.length > 0 ? (
                  conversations.map((conversation) => {
                    const otherId = conversation.users?.find((u: string) => u !== currentUserId);
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedChat === conversation.id ? "bg-muted" : ""
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {conversation.otherUser?.avatar ? (
                              <AvatarImage src={conversation.otherUser.avatar} />
                            ) : (
                              <AvatarFallback>
                                {`${conversation.otherUser?.firstName?.[0] || ""}${conversation.otherUser?.lastName?.[0] || ""}`}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium truncate">{`${conversation.otherUser.firstName} ${conversation.otherUser.lastName}` || otherId}</h3>
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastUpdated?.toDate
                                  ? conversation.lastUpdated
                                    .toDate()
                                    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  : ""}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage || ""}
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">No conversations yet</p>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation && otherUser ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={otherUser.avatar || ""} />
                        <AvatarFallback>{otherUser.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{`${otherUser.firstName} ${otherUser.lastName}`}</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${message.senderId === currentUserId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                            }`}
                        >
                          {message.mediaUrl ? (
                            message.mediaType === "image" ? (
                              <img
                                src={message.mediaUrl}
                                alt="img"
                                className="rounded-md mb-1 max-w-full"
                              />
                            ) : (
                              <video
                                src={message.mediaUrl}
                                controls
                                className="rounded-md mb-1 max-w-full"
                              />
                            )
                          ) : null}
                          {message.text && <p className="text-sm">{message.text}</p>}
                          <p
                            className={`text-xs mt-1 ${message.senderId === currentUserId
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                              }`}
                          >
                            {message.timestamp?.toDate
                              ? message.timestamp
                                .toDate()
                                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border flex items-center gap-2">
                    {/* Input container */}
                    <div className="flex items-center flex-1 bg-muted rounded-md px-3 py-1 gap-2">
                      {/* Attachment icon */}
                      <label htmlFor="fileInput" className="cursor-pointer text-muted-foreground hover:text-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 10.828V7h-2.828z"
                          />
                        </svg>
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                      />

                      {/* Text input */}
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-transparent border-none focus:ring-0 flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                    </div>

                    {/* Send button */}
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-5 w-5" />
                    </Button>

                    {/* Optional: Show selected file name */}
                    {mediaFile && (
                      <p className="absolute bottom-16 text-sm text-muted-foreground">
                        Selected: {mediaFile.name}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose or search a user to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Message;
