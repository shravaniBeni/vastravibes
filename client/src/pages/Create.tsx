import { Camera, Image, Video, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Create = () => {
  const createOptions = [
    {
      icon: Camera,
      title: "Photo Shoot",
      description: "Capture your outfit and share your style",
      color: "bg-pink-500",
    },
    {
      icon: Video,
      title: "Style Reel",
      description: "Create a fashion video to inspire others",
      color: "bg-purple-500",
    },
    {
      icon: Palette,
      title: "Style Board",
      description: "Curate a mood board with your favorite pieces",
      color: "bg-blue-500",
    },
    {
      icon: Sparkles,
      title: "AI Styling",
      description: "Get AI-powered outfit recommendations",
      color: "bg-green-500",
    },
  ];

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
              Express your unique style and inspire the fashion community with your creativity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {createOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className={`${option.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-serif">{option.title}</CardTitle>
                    <CardDescription className="text-base">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Creations */}
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">
              Your Recent Creations
            </h2>
            <div className="text-center py-12">
              <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Start creating to see your work here
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Create;