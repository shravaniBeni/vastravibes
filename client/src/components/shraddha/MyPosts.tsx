import { useState } from "react";
import { Play, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { deletePost, editPost } from "@/helpers/postHandler"; // your Firestore functions

export default function PostsTab({ postsLoading, designerPosts, refreshPosts }) {
    const [selectedPost, setSelectedPost] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editCaption, setEditCaption] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        await deletePost(postId);
        setSelectedPost(null);
        refreshPosts?.();
    };

    const handleEdit = async (postId) => {
        await editPost(postId, {
            caption: editCaption,
            description: editDescription,
        });
        setSelectedPost(null);
        setEditing(false);
        refreshPosts?.();
    };

    return (
        <>
            <TabsContent value="posts" className="mt-6">
                {postsLoading ? (
                    <div className="text-center text-gray-500">Loading posts...</div>
                ) : designerPosts.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No posts yet. Start creating to see them here!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {designerPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="border-black/10 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                                onClick={() => {
                                    setSelectedPost(post);
                                    setEditCaption(post.caption || "");
                                    setEditDescription(post.description || "");
                                    setEditing(false);
                                }}
                            >
                                <CardContent className="p-0 relative">
                                    {post.media_urls?.[0] && (
                                        post.media_urls[0].endsWith(".mp4") ? (
                                            <video
                                                src={post.media_urls[0]}
                                                className="w-full h-full object-cover aspect-[9/16]"
                                                muted
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={post.media_urls[0]}
                                                alt={post.caption || `Post ${post.id}`}
                                                className="w-full h-full object-cover aspect-[9/16]"
                                            />
                                        )
                                    )}


                                    {post.media_urls?.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-white/70 rounded-full p-1">
                                            <ImageIcon className="h-4 w-4 text-gray-800" />
                                        </div>
                                    )}

                                    {post.media_urls?.[0]?.includes(".mp4") && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                                <Play className="h-6 w-6 text-gray-900 fill-current" />
                                            </div>
                                        </div>
                                    )}

                                    {post.caption && (
                                        <div className="absolute bottom-2 left-2 text-black/60 text-sm font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                                            {post.caption}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Modal for post details */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">

                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
                            onClick={() => setSelectedPost(null)}
                        >
                            ✕
                        </button>

                        {/* Media carousel */}
                        <div className="flex overflow-x-auto gap-2 p-4 scrollbar-hide">
                            {selectedPost.media_urls.map((url, i) => (
                                <div key={i} className="flex-shrink-0 w-[250px] h-[400px] relative rounded-lg overflow-hidden shadow-md">
                                    {url.endsWith(".mp4") ? (
                                        <video src={url} controls className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <img src={url} alt={selectedPost.caption || `Media ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Post details */}
                        <div className="px-6 pb-6">
                            {editing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        placeholder="Caption"
                                        className="w-full border p-2 rounded"
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Description"
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-bold text-2xl mb-2">{selectedPost.caption}</h3>
                                    <p className="text-gray-700 mb-2">{selectedPost.description}</p>

                                    {/* Likes and date */}
                                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                                        <span>❤️ {selectedPost.likes} Likes</span>
                                        <span>
                                            {selectedPost.created_at?.toDate
                                                ? selectedPost.created_at.toDate().toLocaleDateString()
                                                : new Date(selectedPost.created_at).toLocaleDateString()}
                                        </span>

                                    </div>

                                    {/* Tags */}
                                    {selectedPost.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedPost.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${tag.toLowerCase() === "on sale"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-200 text-gray-800"
                                                        }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                    onClick={() => handleDelete(selectedPost.id)}
                                >
                                    Delete
                                </button>

                                {editing ? (
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                        onClick={() => handleEdit(selectedPost.id)}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
