import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const Thrift = () => {
  const thriftProducts = [
    {
      id: "1",
      name: "Vintage Denim Jacket",
      price: 45,
      image: "/placeholder.svg",
      category: "jackets",
      inStock: true,
    },
    {
      id: "2",
      name: "Retro Floral Dress",
      price: 35,
      image: "/placeholder.svg",
      category: "dresses",
      inStock: true,
    },
    {
      id: "3",
      name: "Classic Leather Boots",
      price: 55,
      image: "/placeholder.svg",
      category: "shoes",
      inStock: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container-custom py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Thrift Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover unique, pre-loved fashion pieces that tell a story. Sustainable style meets vintage charm.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {thriftProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Thrift;