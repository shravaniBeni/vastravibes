import { useEffect, useState } from "react";
import { Play, Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig" // make sure you have your firestore instance exported as db
import MaxWords from "@/components/shraddha/maxWords";
import { likePost } from "@/helpers/postHandler";
export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(fireDB, "Posts");

        // Firestore query: only fetch posts where is_video == true
        const q = query(postsRef, where("is_video", "==", true));
        const snapshot = await getDocs(q);

        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReels(postsData);
      } catch (err) {
        console.error("Error fetching video posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Reels...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-8">
        <div className="container-custom max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
              Fashion Reels
            </h1>
            <p className="text-muted-foreground">
              Discover the latest fashion trends and styling tips
            </p>
          </div>

          {reels.length === 0 ? (
            <p className="text-center text-muted-foreground">No video posts found.</p>
          ) : (
            <Swiper
              direction="vertical"
              slidesPerView={1}
              spaceBetween={30}
              mousewheel
              pagination={{ clickable: true }}
              modules={[Mousewheel, Pagination]}
              style={{ height: "70vh" }}
            >
              {reels.map((reel) => (
                <SwiperSlide key={reel.id}>
                  <div className="relative h-full group">
                    <div className="aspect-[9/16] bg-black relative h-full overflow-hidden rounded-xl">
                      {/* 🎥 Video Display */}
                      <video
                        src={reel.media_urls[0]}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {reel.user_id?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white text-sm font-medium">
                            {reel.creator || "Unknown User"}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-3">
                          {reel.caption}
                        </h3>
                        <MaxWords description={reel.description} />

                        {/* Likes / Comments */}
                        <div className="flex items-center gap-4 text-white">
                          <div onClick={() => {
                            likePost(reel.id);
                          }} className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span className="text-xs">{reel.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs">{reel.comments || 0}</span>
                          </div>
                          <Share className="h-4 w-4" />
                          <Bookmark className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
