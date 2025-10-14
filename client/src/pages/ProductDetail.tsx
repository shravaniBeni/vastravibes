import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Heart, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  // ✅ Hooks always declared at the top level
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]); // ✅ Initially first image
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const productRef = doc(fireDB, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
        }

        const productData = productSnap.data();

        // Fetch owner/designer info
        const ownerRef = doc(fireDB, "users", productData.ownerId);
        const ownerSnap = await getDoc(ownerRef);
        let ownerData = {
          firstName: "Unknown",
          lastName: "",
          username: "user",
          avatar: "/placeholder.svg",
        };
        if (ownerSnap.exists()) {
          // Typecast Firestore DocumentData to your expected type
          ownerData = ownerSnap.data() as {
            firstName: string;
            lastName: string;
            username: string;
            avatar: string;
          };
        }

        setProduct({
          ...productData,
          ownerName: `${ownerData.firstName} ${ownerData.lastName}`.trim(),
          ownerUsername: ownerData.username,
          ownerAvatar: ownerData.avatar,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-20">Loading product...</div>;
  }
  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  // const product = {
  //   name: "Ribbed Cotton Sweater",
  //   price: 89,
  //   oldPrice: 120,
  //   description:
  //     "A luxuriously soft ribbed cotton sweater that combines comfort with elegance. Perfect for layering or wearing on its own, this piece features a relaxed fit and timeless design that works for any occasion.",
  //   colors: ["Cream", "Navy", "Black", "Gray"],
  //   sizes: ["XS", "S", "M", "L", "XL"],
  //   rating: 4.8,
  //   reviews: 127,
  //   images: ["/sweater1.jpg", "/sweater2.jpg", "/sweater3.jpg"],
  // };

  // const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="container mx-auto">
      {/* Top Profile Bar */}
      <div
        className="flex items-center gap-4 mb-6 border-b pb-4 mt-2 cursor-pointer"
       onClick={() => navigate(`/designer/${product.ownerId}`)}
      >
        <img
          src={product.ownerAvatar || "/placeholder.svg"}
          alt={product.ownerName || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {product.ownerName || "User Name"}
          </span>
          <span className="text-sm text-gray-500">
            @{product.ownerUsername || "username"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div>
          <img
            src={selectedImage || "/placeholder.png"}
            alt={product.name}
            className="rounded-lg shadow-lg w-full"
          />

          <div className="flex gap-4 mt-4">
            {product.images?.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-20 h-20 rounded-lg border cursor-pointer hover:opacity-80 ${
                  selectedImage === img ? "border-primary border-2" : "border"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Knitwear
          </h2>
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
              <Button
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
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
                Machine wash cold with similar colors. Do not bleach. Tumble dry
                low. Iron on low heat if needed. Avoid dry cleaning for best
                results.
              </p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-semibold">Jane D.</p>
                  <p className="text-sm text-gray-500">⭐ ⭐ ⭐ ⭐ ⭐</p>
                  <p className="mt-2">
                    Love this sweater! Super comfy and stylish.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <p className="font-semibold">Mark R.</p>
                  <p className="text-sm text-gray-500">⭐ ⭐ ⭐ ⭐</p>
                  <p className="mt-2">
                    Great quality, fits well. A bit pricey but worth it.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
