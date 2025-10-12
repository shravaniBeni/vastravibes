import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Import product images
import ribbedSweater from "@/assets/ribbed-sweater.jpg";
import whiteShirt from "@/assets/white-shirt.jpg";
import blackDress from "@/assets/black-dress.jpg";

const Wishlist = () => {
  const wishlistItems = [
    {
      id: "1",
      name: "Ribbed Sweater",
      price: 89,
      image: ribbedSweater,
      category: "Knitwear",
      isNew: true,
    },
    {
      id: "2", 
      name: "White Shirt",
      price: 125,
      image: whiteShirt,
      category: "Shirts",
    },
    {
      id: "3",
      name: "Black Dress",
      price: 165,
      image: blackDress,
      category: "Dresses",
    },
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} items saved for later
            </p>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative">
                  <ProductCard product={item} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start adding items you love to save them for later
                </p>
                <Button>Continue Shopping</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Wishlist;