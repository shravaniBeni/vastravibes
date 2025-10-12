import { Play, Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules"; // Correct import for v9+
import "swiper/css";
import "swiper/css/pagination";

const Reels = () => {
  const reels = [
    { id: 1, title: "Summer Vibes", creator: "Alice", likes: 120, comments: 15 },
    { id: 2, title: "Street Style", creator: "Bob", likes: 95, comments: 10 },
    { id: 3, title: "Evening Outfit", creator: "Charlie", likes: 210, comments: 30 },
    // Add more reels as needed
  ];

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

          <Swiper
            direction="vertical"
            slidesPerView={1}
            spaceBetween={30}
            mousewheel
            pagination={{ clickable: true }}
            modules={[Mousewheel, Pagination]} // Pass modules here
            style={{ height: "70vh" }}
          >
            {reels.map((reel) => (
              <SwiperSlide key={reel.id}>
                <div className="relative h-full">
                  <div className="aspect-[9/16] bg-gray-200 relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{reel.creator[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm font-medium">{reel.creator}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-3">{reel.title}</h3>
                      <div className="flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-xs">{reel.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{reel.comments}</span>
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Reels;
