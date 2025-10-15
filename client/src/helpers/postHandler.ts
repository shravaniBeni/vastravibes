import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import { toast } from "sonner";
import { doc, updateDoc, deleteDoc, increment } from "firebase/firestore";

export const deletePost = async (postId) => {
    try {
        const postRef = doc(fireDB, "Posts", postId);
        await deleteDoc(postRef);
        toast.success("Post deleted successfully!");
    } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post. Try again.");
    }
};
export const likePost = async (postId: string) => {
    try {
        const postRef = doc(fireDB, "Posts", postId);

        // Increment the 'likes' field by 1
        await updateDoc(postRef, {
            likes: increment(1),
        });

        console.log("Post liked successfully!");
    } catch (error) {
        console.error("Error liking post:", error);
    }
};
export const editPost = async (postId, updatedData) => {
    try {
        const postRef = doc(fireDB, "Posts", postId);
        await updateDoc(postRef, updatedData);
        toast.success("Post updated successfully!");
    } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Failed to update post. Try again.");
    }
};

export const handleCreatePost = async ({
    firestoreUser,
    mediaFiles,
    caption,
    description,
    tags,
    isProduct,
    is_video,
    uploadFile,
    setMediaFiles,
    setCaption,
    setDescription,
    setTags,
    setIsProduct,
}: {
    firestoreUser: any,
    mediaFiles: File[];
    caption: string;
    description: string;
    tags: string;
    isProduct: boolean;
    is_video: boolean;
    uploadFile: (file: File) => Promise<string>;
    setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setCaption: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setTags: React.Dispatch<React.SetStateAction<string>>;
    setIsProduct: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    if (!mediaFiles.length) {
        toast.error("Please select at least one image or video.");
        return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        toast.error("You must be logged in to create a post.");
        return;
    }

    try {
        toast.loading("Uploading files...");

        // Upload all media files to Cloudinary
        const uploadedUrls = await Promise.all(mediaFiles.map(uploadFile));

        // Prepare post data
        const postData = {
            user_id: currentUser.uid,
            avatar: firestoreUser.avatar,
            name: `${firestoreUser?.firstName || ""} ${firestoreUser?.lastName || ""}`.trim() || "Unnamed",
            username: firestoreUser.username,
            caption,
            description,
            is_product: isProduct,
            is_video: is_video,
            tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            media_urls: uploadedUrls,
            created_at: serverTimestamp(),
        };

        console.log(postData);
        // Save post data to Firestore
        const postsRef = collection(fireDB, "Posts");
        await addDoc(postsRef, postData);

        toast.success("Post created successfully!");

        // Reset form
        setMediaFiles([]);
        setCaption("");
        setDescription("");
        setTags("");
        setIsProduct(false);
    } catch (err) {
        console.error(err);
        toast.error("Failed to create post. Please try again.");
    }
};
