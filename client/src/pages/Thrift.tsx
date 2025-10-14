import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
  category?: string;
  originalPrice?: number;
  rating?: number;
  isThrift?: boolean;
}

const Thrift = () => {
  const [thriftProducts, setThriftProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThriftProducts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(fireDB, "products"),
          where("isThrift", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        setThriftProducts(products);
      } catch (error) {
        console.error("Error fetching thrift products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThriftProducts();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container-custom py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Thrift Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover unique, pre-loved fashion pieces that tell a story.
            Sustainable style meets vintage charm.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-lg">Loading thrift products...</div>
        ) : thriftProducts.length === 0 ? (
          <div className="text-center text-lg">
            No thrift products available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {thriftProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Thrift;
