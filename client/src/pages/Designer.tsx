import React, { useState, useContext, useEffect } from "react";
import {
  Star,
  MapPin,
  Heart,
  Trash2,
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
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { fireDB } from "../firebase/FirebaseConfig";
import PostsTab from "@/components/shraddha/MyPosts";
import { fetchUserByUid } from "@/helpers/getDesigner";
// Dummy images
import ribbedSweater from "@/assets/ribbed-sweater.jpg";
import whiteShirt from "@/assets/white-shirt.jpg";
import blackDress from "@/assets/black-dress.jpg";
import linenBlazer from "@/assets/linen-blazer.jpg";

const Designer: React.FC = () => {
  const { loading, currentUser, firestoreUser, isProfileComplete } = useContext(MyContext);

  // HOOKS (must be always at top)
  const [designerPosts, setDesignerPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [featuredDesigner, setFeaturedDesigner] = useState();
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const isOwner = currentUser?.uid === id;

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    // TODO: update follow status in Firebase
  };

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(fireDB, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const setDesigner = async () => {
      if (isOwner) {
        // Owner: use firestoreUser data
        setFeaturedDesigner({
          uid: currentUser?.uid || "",
          name: `${firestoreUser?.firstName || ""} ${firestoreUser?.lastName || ""}`.trim() || "Unnamed",
          username: `@${firestoreUser?.username || "you"}`,
          specialty: firestoreUser?.specialty || "Your Specialty",
          location: firestoreUser?.location || "Your Location",
          rating: firestoreUser?.rating || 5.0,
          reviews: firestoreUser?.reviews || 0,
          products: firestoreUser?.products || 0,
          followers: firestoreUser?.followers || 0,
          following: firestoreUser?.following || 0,
          joinDate: firestoreUser?.joinDate || "Recently Joined",
          description: firestoreUser?.description || "Welcome to your profile! Start adding products and posts.",
          avatar: firestoreUser?.avatar || "/placeholder.svg",
          verified: firestoreUser?.verified || false,
          postsCount: firestoreUser?.postsCount || 0,
        });
      } else if (id) {
        // Not owner: fetch user by id
        try {
          const userData = await fetchUserByUid(id);
          setFeaturedDesigner(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
          setFeaturedDesigner(null);
        }
      }
    };

    setDesigner();
  }, [id, isOwner, currentUser, firestoreUser]);


  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;
      setLoadingProducts(true);
      try {
        const q = query(collection(fireDB, "products"), where("ownerId", "==", id));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [id]);

  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      if (!featuredDesigner || !featuredDesigner.uid) return; // ✅ prevent undefined access

      setPostsLoading(true);
      try {
        const postsRef = collection(fireDB, "Posts");
        const q = query(postsRef, where("user_id", "==", featuredDesigner.uid));
        const snapshot = await getDocs(q);

        let postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        postsData = postsData
          .sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis())
          .slice(0, 20);

        setDesignerPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [featuredDesigner]); // ✅ dependency is the object, not featuredDesigner.uid


  const posts = [
    { id: 1, thumbnail: ribbedSweater, views: "12K" },
    { id: 2, thumbnail: whiteShirt, views: "8.5K" },
    { id: 3, thumbnail: blackDress, views: "15K" },
  ];

  return (
    <>
      <Navbar />

      {loading ? (
        <div className="text-center mt-20">Loading profile...</div>
      ) : !firestoreUser ? (
        <div className="text-center mt-20">User data not found</div>
      ) : (
        <main className="min-h-screen bg-white">
          {/* Designer Profile Header */}
          <section className="bg-white py-8 border-b border-black/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              {/* Avatar */}
              <div className="relative mb-6 inline-block">
                <Avatar className="h-32 w-32 border-4 border-black/10 shadow-lg">
                  <AvatarImage src={featuredDesigner.avatar} />
                  <AvatarFallback className="text-2xl bg-gray-100 text-gray-900">
                    {featuredDesigner.name}
                  </AvatarFallback>
                </Avatar>
                {featuredDesigner.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                    <Star className="h-3 w-3 text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{featuredDesigner.name}</h1>
              <p className="text-black/60 mb-2">{featuredDesigner?.username}</p>
              <p className="text-gray-900 font-medium text-sm">{featuredDesigner.specialty}</p>

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-6 mt-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{products.length}</div>
                  <div className="text-sm text-black/60">Products</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {featuredDesigner.followers?.toLocaleString() || 1}
                  </div>
                  <div className="text-sm text-black/60">Followers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{featuredDesigner.following || 2}</div>
                  <div className="text-sm text-black/60">Following</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                  <div className="text-xl font-bold text-gray-900">{featuredDesigner.rating}</div>
                  <div className="text-sm text-black/60 ml-1">{featuredDesigner.reviews} reviews</div>
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
                    <Link to="/create-product">
                      <Button className="bg-primary text-white px-6">Add Product</Button>
                    </Link>
                    <Link to="/create">
                      <Button className="bg-secondary text-black px-6 hover:text-white">Create Post</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      className={`px-6 ${isFollowing ? "bg-gray-200 text-gray-900" : "bg-primary text-white"}`}
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
          <section className="container mx-auto max-w-4xl px-4 py-8">
            <Tabs defaultValue="posts" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>

              {/* Posts Tab */}
              {/* <TabsContent value="posts"> */}
              <PostsTab
                postsLoading={postsLoading}
                designerPosts={designerPosts}
                refreshPosts={() => { }}
              />
              {/* </TabsContent> */}

              {/* Products Tab */}
              <TabsContent value="products">
                {loadingProducts ? (
                  <div className="text-center mt-20">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="text-center mt-20">No products found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="shadow-sm">
                        <CardContent className="p-2">
                          <img src={product.image || ribbedSweater} alt={product.name} className="w-full h-40 object-cover rounded-md mb-2" />
                          <div className="flex justify-between items-center">
                            <div className="font-semibold">{product.name}</div>
                            {isOwner && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </main>
      )}

      <Footer />
    </>
  );
};

export default Designer;
