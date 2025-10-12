import { Users, Award, Heart, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Passion for Fashion",
      description: "We believe fashion is a form of self-expression that empowers individuals to tell their unique story.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Quality First",
      description: "Every piece in our collection is carefully selected for its exceptional quality, craftsmanship, and timeless appeal.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Sustainable Style",
      description: "We're committed to ethical practices and sustainable fashion that respects both people and the planet.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Focused",
      description: "Building a community of style enthusiasts who inspire and support each other's fashion journey.",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & Creative Director",
      bio: "Former fashion editor with 15 years of experience in luxury retail and sustainable fashion.",
    },
    {
      name: "Marcus Williams",
      role: "Head of Curation",
      bio: "Expert in identifying emerging designers and timeless pieces that define contemporary style.",
    },
    {
      name: "Elena Rodriguez",
      role: "Sustainability Director",
      bio: "Passionate advocate for ethical fashion with expertise in supply chain transparency.",
    },
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6">
              About VastraVibes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Born from a passion for timeless style and sustainable fashion, VastraVibes curates 
              exceptional pieces that celebrate individuality while respecting our planet.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    VastraVibes was founded in 2020 with a simple yet powerful vision: to make exceptional 
                    fashion accessible while promoting sustainable practices throughout the industry.
                  </p>
                  <p>
                    Our journey began when our founder, Sarah Chen, recognized the need for a platform 
                    that bridges the gap between high-quality fashion and conscious consumption. After 
                    years in the fashion industry, she saw an opportunity to create something different.
                  </p>
                  <p>
                    Today, we work with carefully selected designers and brands who share our commitment 
                    to quality, sustainability, and ethical production. Every piece in our collection 
                    tells a story of craftsmanship, creativity, and conscious design.
                  </p>
                </div>
              </div>
              
              <div className="aspect-[4/5] bg-gray-200 rounded-lg">
                {/* Placeholder for story image */}
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Our Story Image
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do and every choice we make.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind VastraVibes, dedicated to bringing you the best in fashion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="aspect-square w-32 bg-gray-200 rounded-full mx-auto mb-4">
                      {/* Placeholder for team member photo */}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              Our Mission
            </h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              To redefine fashion retail by curating exceptional pieces that celebrate individual style 
              while promoting sustainable practices, ethical production, and conscious consumption. 
              We believe that great fashion should be accessible, responsible, and inspiring.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-serif font-semibold text-foreground mb-8">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Customer Service</h3>
                <p className="text-muted-foreground">hello@vastravibes.com</p>
                <p className="text-muted-foreground">1-800-VASTRA</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Press & Media</h3>
                <p className="text-muted-foreground">press@vastravibes.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Partnerships</h3>
                <p className="text-muted-foreground">partners@vastravibes.com</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default About;