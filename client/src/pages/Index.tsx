import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Import product and hero images
import heroModel from "@/assets/hero-model.jpg";
import thriftHero from "@/assets/thrift-hero.jpg";
import designerHero from "@/assets/designer-hero.jpg";
import summerHero from "@/assets/summer-hero.jpg";
import ribbedSweater from "@/assets/ribbed-sweater.jpg";
import whiteShirt from "@/assets/white-shirt.jpg";
import blackDress from "@/assets/black-dress.jpg";
import linenBlazer from "@/assets/linen-blazer.jpg";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: heroModel,
      title: "Elevate Your Style",
      subtitle:
        "Discover our curated collection of premium fashion pieces that define your unique aesthetic.",
      cta: "SHOP NOW",
      link: "/shop",
    },
    {
      id: 2,
      image: thriftHero,
      title: "Thrift & Sustainable",
      subtitle:
        "Discover unique vintage pieces and sustainable fashion that's kind to the planet.",
      cta: "EXPLORE THRIFT",
      link: "/shop?collection=thrift",
    },
    {
      id: 3,
      image: designerHero,
      title: "Designer Collections",
      subtitle:
        "Exclusive pieces from emerging and established designers worldwide.",
      cta: "VIEW DESIGNERS",
      link: "/designer",
    },
    {
      id: 4,
      image: summerHero,
      title: "Summer Essentials",
      subtitle: "Fresh styles perfect for the season ahead.",
      cta: "SHOP SUMMER",
      link: "/shop?collection=summer",
    },
  ];

  const featuredProducts = [
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
    {
      id: "4",
      name: "Linen Blazer",
      price: 245,
      image: linenBlazer,
      category: "Outerwear",
    },
  ];

  const designers = [
    { name: "Bennakir", avatar: "", followers: "2.3k" },
    { name: "Christen", avatar: "", followers: "1.8k" },
    { name: "Mina Foir", avatar: "", followers: "3.2k" },
  ];

  // Auto-advance slides - SIMPLE VERSION
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        return next >= heroSlides.length ? 0 : next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next >= heroSlides.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const previous = prev - 1;
      return previous < 0 ? heroSlides.length - 1 : previous;
    });
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section - COMPLETELY FIXED */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl shadow-lg h-[500px]">
              {/* Current slide display */}
              <div className="relative w-full h-full">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-16 left-12 text-white z-10 max-w-2xl">
                  <h1 className="text-5xl font-bold mb-4">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xl mb-8 opacity-90">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  <Link to={heroSlides[currentSlide].link}>
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                    >
                      {heroSlides[currentSlide].cta}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index
                        ? "bg-white scale-110"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-12 text-center text-gray-900">
              Categories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Dresses */}
              <Link to="/shop?category=dresses">
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl aspect-[4/5] relative overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gray-200 flex items-end">
                      <div className="p-8 w-full">
                        <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          Dresses
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Tops */}
              <Link to="/shop?category=tops">
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl aspect-[4/5] relative overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gray-300 flex items-end">
                      <div className="p-8 w-full">
                        <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          Tops
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Pants */}
              <Link to="/shop?category=pants">
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl aspect-[4/5] relative overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gray-200 flex items-end">
                      <div className="p-8 w-full">
                        <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          Pants
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accessories */}
              <Link to="/shop?category=accessories">
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl aspect-[2/1] relative overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gray-300 flex items-end">
                      <div className="p-8 w-full">
                        <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          Accessories
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Jewelry */}
              <Link to="/shop?category=jewelry">
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl aspect-[2/1] relative overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gray-200 flex items-end">
                      <div className="p-8 w-full">
                        <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                          Jewelry
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Designers Section */}
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
                Featured Designers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {designers.map((designer) => (
                <Card
                  key={designer.name}
                  className="text-center group cursor-pointer transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 group-hover:scale-105 transition-transform"></div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {designer.name}
                    </h3>
                    <Button variant="outline" className="w-full font-medium">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked pieces from our latest collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-medium px-8"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-20 bg-background">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
                Trending Now
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* New Arrivals */}
              <Card className="relative overflow-hidden group border-0 shadow-lg">
                <div className="aspect-[4/5] bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <h3 className="text-3xl font-serif font-semibold text-white mb-2">
                      New Arrivals
                    </h3>
                    <p className="text-white/90 mb-4">
                      Fresh styles for the season
                    </p>
                    <Link to="/shop?collection=new-arrivals">
                      <Button
                        variant="secondary"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        Explore Collection
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Accessories */}
              <Card className="relative overflow-hidden group border-0 shadow-lg">
                <div className="aspect-[4/5] bg-gray-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <h3 className="text-3xl font-serif font-semibold text-white mb-2">
                      Accessories
                    </h3>
                    <p className="text-white/90 mb-4">Complete your look</p>
                    <Link to="/shop?collection=accessories">
                      <Button
                        variant="secondary"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        Shop Accessories
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-semibold text-foreground mb-4">
                What Our Customers Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  text: "VastraVibes has completely transformed my wardrobe. The quality is exceptional and every piece feels like luxury.",
                  rating: 5,
                },
                {
                  name: "Maria Rodriguez",
                  text: "I love the curation and attention to detail. These pieces work seamlessly together and elevate any outfit.",
                  rating: 5,
                },
                {
                  name: "Emma Chen",
                  text: "The virtual try-on feature is amazing! It helped me find the perfect fit without any guesswork.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
