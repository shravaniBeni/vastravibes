import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "Ribbed Cotton Sweater",
    price: 89,
    oldPrice: 120,
    description:
      "A luxuriously soft ribbed cotton sweater that combines comfort with elegance. Perfect for layering or wearing on its own, this piece features a relaxed fit and timeless design that works for any occasion.",
    colors: ["Cream", "Navy", "Black", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 127,
    images: ["/sweater1.jpg", "/sweater2.jpg", "/sweater3.jpg"],
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left: Images */}
      <div>
        <img
          src={product.images[0]}
          alt={product.name}
          className="rounded-lg shadow-lg w-full"
        />
        <div className="flex gap-4 mt-4">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`} // ✅ Fixed template literal
              className="w-20 h-20 rounded-lg border cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase">Knitwear</h2>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-lg line-through text-gray-400">
            {formatPrice(product.oldPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          ⭐ {product.rating} ({product.reviews} reviews)
        </div>

        <p className="text-gray-700">{product.description}</p>

        {/* Colors */}
        <div>
          <h3 className="font-semibold mb-2">Color</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="font-semibold mb-2">Quantity</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>
              +
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full"
            disabled={!selectedSize || !selectedColor}
          >
            Add to Bag - {formatPrice(product.price * quantity)}
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>

            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Try-On Button */}
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground"
            onClick={() => navigate("/tryon")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Try On This Product
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="col-span-2 mt-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ul className="list-disc pl-6 space-y-2">
              <li>100% Premium Cotton</li>
              <li>Ribbed texture for added style</li>
              <li>Relaxed, comfortable fit</li>
              <li>Machine washable</li>
              <li>Available in multiple colors</li>
            </ul>
          </TabsContent>

          <TabsContent value="care">
            <p className="text-gray-700">
              Machine wash cold with similar colors. Do not bleach. Tumble dry low. 
              Iron on low heat if needed. Avoid dry cleaning for best results.
            </p>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-semibold">Jane D.</p>
                <p className="text-sm text-gray-500">⭐ ⭐ ⭐ ⭐ ⭐</p>
                <p className="mt-2">Love this sweater! Super comfy and stylish.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">Mark R.</p>
                <p className="text-sm text-gray-500">⭐ ⭐ ⭐ ⭐</p>
                <p className="mt-2">Great quality, fits well. A bit pricey but worth it.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
