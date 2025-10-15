import { useState, useContext } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner"; // for notifications
import { fireDB } from "@/firebase/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadFile } from "@/helpers/upload";
import { getAuth } from "firebase/auth";
import { handleCreatePost } from "@/helpers/postHandler";
import { MyContext } from "@/context/myContext";
const Create = () => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [isProduct, setIsProduct] = useState(false);
  const [tags, setTags] = useState("");
  const { firestoreUser } = useContext(MyContext);
  if (!firestoreUser) {
    return <div className="text-center mt-20">User data not found</div>;
  }
  // Handle file selection (multiple)
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const hasVideo = files.some((file) => file.type.startsWith("video/"));
    const hasImage = files.some((file) => file.type.startsWith("image/"));

    // Prevent mixing photos and videos
    if (hasVideo && hasImage) {
      alert("You can only upload photos OR videos, not both in the same post.");
      e.target.value = ""; // clear input
      return;
    }

    setMediaFiles(files);
  };




  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background py-8">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-semibold text-foreground mb-4">
              Create & Share
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Capture your style, add details, and share it with the community
            </p>
          </div>

          {/* Create Post Form */}
          <div className="max-w-lg mx-auto">
            <Card className="p-6">
              <CardHeader className="text-center">
                <div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Create a Post</CardTitle>
                <CardDescription className="text-base">
                  Upload photos/videos, add caption & description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Media Upload */}
                <div>
                  <label className="block mb-1 font-medium">Upload Images/Videos</label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFilesChange}
                  />
                  {mediaFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {mediaFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="block mb-1 font-medium">Caption</label>
                  <Input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a catchy caption..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details about your post..."
                  />
                </div>

                {/* Tags (Optional) */}
                <div>
                  <label className="block mb-1 font-medium">Tags (comma separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., summer, casual, outfit"
                  />
                </div>

                {/* For Sale Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isProduct}
                    onCheckedChange={setIsProduct}
                  />
                  <span>Mark as For Sale</span>
                </div>

                {/* Submit */}
                <Button className="w-full mt-4" onClick={() => {
                  const isVideo = mediaFiles.some((file) => file.type.startsWith("video/")); // true if video exists

                  handleCreatePost({
                    firestoreUser,
                    mediaFiles,
                    caption,
                    description,
                    tags,
                    isProduct,
                    is_video: isVideo, // pass here
                    uploadFile,
                    setMediaFiles,
                    setCaption,
                    setDescription,
                    setTags,
                    setIsProduct,
                  });
                }}>
                  Post Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Creations Placeholder */}
          {/* <section className="mt-16">
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">
              Your Recent Creations
            </h2>
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Start creating to see your posts here
              </p>
            </div>
          </section> */}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Create;
