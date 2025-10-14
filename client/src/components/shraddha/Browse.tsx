import React, { useState, useEffect } from "react";
import { Heart, X, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { collection, query, getDocs, where } from "firebase/firestore";
import { fireDB } from "@/firebase/FirebaseConfig";
import { likePost } from "@/helpers/postHandler";
import { useNavigate } from "react-router-dom";
export default function Browse() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    // Fetch posts where is_video == false
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const postsRef = collection(fireDB, "Posts");
                const q = query(postsRef, where("is_video", "==", false));
                const snapshot = await getDocs(q);

                const postsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading)
        return (
            <div className="text-center py-20 text-gray-500">Loading posts...</div>
        );

    // Filter posts based on search term
    const filteredPosts = posts.filter((post) => {
        const lowerSearch = searchTerm.toLowerCase();
        const captionMatch = post.caption?.toLowerCase().includes(lowerSearch);
        const tagMatch = post.tags?.some((tag) =>
            tag.toLowerCase().includes(lowerSearch)
        );
        return captionMatch || tagMatch;
    });

    // Handle local like + Firestore like
    const handleLike = (postId: string) => {
        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
        if (selectedPost?.id === postId) {
            setSelectedPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
        }
        likePost(postId);
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-white py-10">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                            Discover Designers
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by caption or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-black/30 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Pinterest-like grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {filteredPosts.map((post) => (
                                <Card
                                    key={post.id}
                                    className="mb-4 cursor-pointer break-inside-avoid shadow-sm hover:shadow-lg transition"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <CardContent className="p-0 relative">
                                        <img
                                            onDoubleClick={() => handleLike(post.id)}
                                            src={post.media_urls[0]}
                                            alt={post.caption}
                                            className="w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm text-sm px-2 py-1 rounded text-gray-700">
                                            ❤️ {post.likes}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-20">
                            No posts found for “{searchTerm}”
                        </p>
                    )}
                </div>

                {/* Post Details Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                                onClick={() => setSelectedPost(null)}
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Scrollable Images */}
                            <div className="w-full overflow-x-auto flex space-x-3 rounded-t-2xl m-3">
                                {selectedPost.media_urls
                                    .filter((url) =>
                                        /\.(jpeg|jpg|gif|png|webp|bmp|tiff|svg)$/i.test(url)
                                    )
                                    .map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`${selectedPost.caption}-${index}`}
                                            className="h-72 flex-shrink-0 rounded-2xl object-cover"
                                        />
                                    ))}
                            </div>

                            <div className="p-6 space-y-4">
                                {/* User Info */}
                                <div onClick={() => {
                                    navigate(`/designer/${selectedPost.user_id}`)
                                }} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={selectedPost.user_avatar || ""} />
                                        <AvatarFallback>
                                            {selectedPost.user_name?.[0] || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {selectedPost.user_name || "User"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                selectedPost.created_at.seconds * 1000
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Caption */}
                                <p className="text-lg font-semibold text-gray-900">
                                    {selectedPost.caption}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {selectedPost.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedPost.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Likes + On Sale */}
                                <div className="flex items-center gap-3 mt-3">
                                    <Heart
                                        className="h-5 w-5 text-red-500 cursor-pointer hover:scale-110 transition"
                                        onClick={() => handleLike(selectedPost.id)}
                                    />
                                    <span className="text-sm">{selectedPost.likes} likes</span>

                                    {selectedPost.is_product && (
                                        <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                                            On Sale
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
