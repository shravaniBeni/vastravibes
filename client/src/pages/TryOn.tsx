import { useState } from "react";
import { Camera, Upload, Sparkles, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Import product images
import ribbedSweater from "@/assets/ribbed-sweater.jpg";
import whiteShirt from "@/assets/white-shirt.jpg";
import blackDress from "@/assets/black-dress.jpg";
import linenBlazer from "@/assets/linen-blazer.jpg";

const TryOn = () => {
  const [activeDemo, setActiveDemo] = useState<'photo' | 'camera' | null>(null);

  const featuredProducts = [
    {
      id: "1",
      name: "Ribbed Cotton Sweater",
      price: 89,
      image: ribbedSweater,
      category: "Knitwear",
      isNew: true,
    },
    {
      id: "2", 
      name: "Classic White Button Shirt",
      price: 125,
      image: whiteShirt,
      category: "Shirts",
    },
    {
      id: "3",
      name: "Elegant Black Midi Dress",
      price: 165,
      image: blackDress,
      category: "Dresses",
    },
    {
      id: "4",
      name: "Tailored Linen Blazer", 
      price: 245,
      image: linenBlazer,
      category: "Outerwear",
    },
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Fitting",
      description: "Advanced AI technology analyzes your body shape and recommends the perfect fit.",
    },
    {
      icon: <Camera className="h-6 w-6 text-primary" />,
      title: "Real-Time Preview", 
      description: "See how clothes look on you instantly with our real-time rendering technology.",
    },
    {
      icon: <Upload className="h-6 w-6 text-primary" />,
      title: "Multiple Options",
      description: "Upload a photo or use your camera for the most convenient experience.",
    },
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container-custom text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
                Virtual Try-On
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience the future of online shopping. See how our clothes look and fit 
                on you before you buy, powered by cutting-edge AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveDemo('camera')}>
                  <Camera className="mr-2 h-5 w-5" />
                  Try with Camera
                </Button>
                <Button variant="outline" size="lg" onClick={() => setActiveDemo('photo')}>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Try-On Interface */}
        <section className="py-16">
          <div className="container-custom">
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="demo">Demo Experience</TabsTrigger>
                <TabsTrigger value="products">Try-On Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Virtual Try-On Interface */}
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-8">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center">
                        {activeDemo === null ? (
                          <>
                            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              Start Your Virtual Try-On
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                              Choose to use your camera or upload a photo to begin the virtual try-on experience.
                            </p>
                            <div className="flex flex-col gap-3">
                              <Button onClick={() => setActiveDemo('camera')}>
                                <Camera className="mr-2 h-4 w-4" />
                                Use Camera
                              </Button>
                              <Button variant="outline" onClick={() => setActiveDemo('photo')}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                              </Button>
                            </div>
                          </>
                        ) : activeDemo === 'camera' ? (
                          <>
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">Camera preview would appear here</p>
                                <Button className="mt-4" size="sm">
                                  Enable Camera
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground mb-3">Drag & drop your photo here</p>
                                <Button size="sm">
                                  Choose File
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instructions & Features */}
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                        How It Works
                      </h2>
                      <ol className="space-y-4">
                        <li className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                          </span>
                          <div>
                            <h3 className="font-medium text-foreground">Capture or Upload</h3>
                            <p className="text-sm text-muted-foreground">
                              Take a photo with your camera or upload an existing photo
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            2
                          </span>
                          <div>
                            <h3 className="font-medium text-foreground">Select Products</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose from our collection of try-on enabled products
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            3
                          </span>
                          <div>
                            <h3 className="font-medium text-foreground">See the Magic</h3>
                            <p className="text-sm text-muted-foreground">
                              Watch as AI instantly shows you how the clothes fit and look
                            </p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-6">
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                    Try-On Enabled Products
                  </h2>
                  <p className="text-muted-foreground">
                    These products support virtual try-on technology
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="relative">
                      <ProductCard product={product} />
                      <div className="absolute top-3 right-3">
                        <Button size="sm" className="bg-primary/90 hover:bg-primary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Try On
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-8">
              Why Virtual Try-On?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Reduce Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    See exactly how items fit before ordering, reducing the need for returns and exchanges.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Perfect Fit</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your body measurements to recommend the perfect size every time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Shop with Confidence</h3>
                  <p className="text-sm text-muted-foreground">
                    Make informed decisions with realistic previews of how clothes will look on you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default TryOn;