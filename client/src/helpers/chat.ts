import { fireDB } from "@/firebase/FirebaseConfig"; // Firestore instance
import { collection, doc, addDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadFile } from "./upload"; // your function

type MessageType = {
    text?: string;
    imageFile?: File;
    videoFile?: File;
};

export async function sendMessage(chatId: string, senderId: string, userIds: string[], message: MessageType) {
    try {
        let mediaUrl: string | null = null;
        let mediaType: "image" | "video" | null = null;

        // Upload image or video if provided
        if (message.imageFile) {
            mediaUrl = await uploadFile(message.imageFile);
            mediaType = "image";
        } else if (message.videoFile) {
            mediaUrl = await uploadFile(message.videoFile);
            mediaType = "video";
        }

        // Reference to messages subcollection
        const messagesRef = collection(fireDB, "chats", chatId, "messages");

        // Add message
        await addDoc(messagesRef, {
            senderId,
            text: message.text || "",
            mediaUrl: mediaUrl || null,
            mediaType: mediaType,
            timestamp: serverTimestamp(),
            readBy: [senderId],
        });

        // Update chat document (or create if it doesn't exist)
        const chatRef = doc(fireDB, "chats", chatId);
        await updateDoc(chatRef, {
            users: userIds,
            lastMessage: message.text || (mediaType === "image" ? "📷 Image" : mediaType === "video" ? "🎥 Video" : ""),
            lastUpdated: serverTimestamp(),
        }).catch(async () => {
            await setDoc(chatRef, {
                users: userIds,
                lastMessage: message.text || (mediaType === "image" ? "📷 Image" : mediaType === "video" ? "🎥 Video" : ""),
                lastUpdated: serverTimestamp(),
            });
        });

        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
