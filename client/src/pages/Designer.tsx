import React, { useState, useContext } from "react";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Play,
  Grid3X3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MyContext } from "../context/myContext";

// Dummy images
import ribbedSweater from "@/assets/ribbed-sweater.jpg";
import whiteShirt from "@/assets/white-shirt.jpg";
import blackDress from "@/assets/black-dress.jpg";
import linenBlazer from "@/assets/linen-blazer.jpg";

const Designer: React.FC = () => {
  const { currentUser } = useContext(MyContext);
  const { id } = useParams<{ id: string }>();
  const isOwner = currentUser?.uid === id;
  const { firestoreUser } = useContext(MyContext);
  console.log("firestoreUser in Designer:", firestoreUser);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    // TODO: Call API or Firebase to update follow status
  };

  const featuredDesigner = isOwner
    ? {
        uid: currentUser?.uid,
        name: firestoreUser?.name || "Your Name",
        username: `@${firestoreUser?.username || "you"}`,
        specialty: firestoreUser?.specialty || "Your Specialty",
        location: firestoreUser?.location || "Your Location",
        rating: firestoreUser?.rating || 5.0,
        reviews: firestoreUser?.reviews || 0,
        products: firestoreUser?.products || 0,
        followers: firestoreUser?.followers || 0,
        following: firestoreUser?.following || 0,
        joinDate: firestoreUser?.joinDate || "Recently Joined",
        description:
          firestoreUser?.description ||
          "Welcome to your profile! Start adding products and posts.",
        avatar: firestoreUser?.avatar || "/placeholder.svg",
        verified: firestoreUser?.verified || false,
        postsCount: firestoreUser?.postsCount || 0,
      }
    : {
        uid: id || "1",
        name: "Priya Sharma",
        username: "@priyaweaves",
        specialty: "Banarasi Silk Weaving",
        location: "Varanasi, India",
        rating: 4.8,
        reviews: 342,
        products: 145,
        followers: 12547,
        following: 89,
        joinDate: "March 2021",
        description:
          "Traditional weaver from Varanasi creating authentic Banarasi silk sarees.",
        avatar: "/placeholder.svg",
        verified: true,
        postsCount: 23,
      };

  const designerProducts = [
    {
      id: "1",
      name: "Royal Banarasi Silk Saree",
      price: 2890,
      image: ribbedSweater,
      isCustomizable: true,
      isLiked: false,
    },
    {
      id: "2",
      name: "Handwoven Wedding Saree",
      price: 4500,
      image: whiteShirt,
      isCustomizable: true,
      isLiked: true,
    },
    {
      id: "3",
      name: "Traditional Gold Work Saree",
      price: 3200,
      image: blackDress,
      isCustomizable: false,
      isLiked: false,
    },
    {
      id: "4",
      name: "Contemporary Silk Saree",
      price: 2650,
      image: linenBlazer,
      isCustomizable: true,
      isLiked: false,
    },
  ];

  const posts = [
    { id: 1, thumbnail: ribbedSweater, views: "12K" },
    { id: 2, thumbnail: whiteShirt, views: "8.5K" },
    { id: 3, thumbnail: blackDress, views: "15K" },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Designer Profile Header */}
        <section className="bg-white py-8 border-b border-black/10">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            {/* Avatar */}
            <div className="relative mb-6 inline-block">
              <Avatar className="h-24 w-24 border-4 border-black/10 shadow-lg">
                <AvatarImage src={featuredDesigner.avatar} />
                <AvatarFallback className="text-2xl bg-gray-100 text-gray-900">
                  {featuredDesigner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {featuredDesigner.verified && (
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {featuredDesigner.name}
            </h1>
            <p className="text-black/60 mb-2">{featuredDesigner.username}</p>
            <p className="text-gray-900 font-medium text-sm">
              {featuredDesigner.specialty}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6 mt-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {featuredDesigner.products}
                </div>
                <div className="text-sm text-black/60">Products</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {featuredDesigner.followers.toLocaleString()}
                </div>
                <div className="text-sm text-black/60">Followers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {featuredDesigner.following}
                </div>
                <div className="text-sm text-black/60">Following</div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                <div className="text-xl font-bold text-gray-900">
                  {featuredDesigner.rating}
                </div>
                <div className="text-sm text-black/60 ml-1">
                  {featuredDesigner.reviews} reviews
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-black/60 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
              {featuredDesigner.description}
            </p>

            {/* Location & Join */}
            <div className="flex justify-center gap-6 mb-6 text-sm text-black/60">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {featuredDesigner.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {featuredDesigner.joinDate}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {isOwner ? (
                <>
                  <Link to="/create/product">
                    <Button className="bg-primary text-white px-6">
                      Add Product
                    </Button>
                  </Link>
                  <Link to="/create/post">
                    <Button className="bg-secondary text-black px-6 hover:text-white">
                      Create Post
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    className={`px-6 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-900"
                        : "bg-primary text-white"
                    }`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Link to={`/message/${featuredDesigner.uid}`}>
                    <Button variant="outline" className="px-4">
                      Message
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-6">
          <div className="container mx-auto max-w-4xl px-4">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-black/10 rounded-none h-auto p-0">
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 rounded-none py-3 text-black/60 hover:text-gray-900 transition-colors"
                >
                  <Grid3X3 className="h-4 w-4" /> Products (
                  {featuredDesigner.products})
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 rounded-none py-3 text-black/60 hover:text-gray-900 transition-colors"
                >
                  <Play className="h-4 w-4" /> Posts (
                  {featuredDesigner.postsCount})
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designerProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="border-black/10 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardContent className="p-0 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isCustomizable && (
                            <Badge className="absolute top-2 left-2 bg-gray-900 text-white text-xs">
                              Customizable
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-black/60 hover:text-gray-900 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                product.isLiked
                                  ? "fill-gray-900 text-gray-900"
                                  : ""
                              }`}
                            />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="border-black/10 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <CardContent className="p-0 relative">
                        <img
                          src={post.thumbnail}
                          alt={`Post ${post.id}`}
                          className="w-full h-full object-cover aspect-[9/16]"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <Play className="h-6 w-6 text-gray-900 fill-current" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-black/60 text-sm font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                          {post.views} views
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Designer;
