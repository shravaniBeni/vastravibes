"use client";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { MyContext } from "../context/myContext";
import { fireDB } from "../firebase/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const AddProduct = () => {
  const { currentUser } = useContext(MyContext);

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    description: "",
    colors: "",
    sizes: "",
    category: "",
    rating: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [isThrift, setIsThrift] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);

      // Append new images instead of replacing
      setImages((prev) => [...prev, ...fileArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.name || !productData.price) {
      toast({
        title: "Error",
        description: "Name and Price are required!",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    let uploadedUrls: string[] = [];

    try {
      // Upload images to Cloudinary
      if (images && images.length > 0) {
        setUploading(true);
        const uploadPromises = Array.from(images).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "frontend_upload"); // 🔥 replace
          formData.append("cloud_name", "dm81uqyqx"); // 🔥 replace

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/dm81uqyqx/image/upload`,
            formData
          );
          return res.data.secure_url;
        });

        uploadedUrls = await Promise.all(uploadPromises);
      }

      // Save product details in Firestore
      await addDoc(collection(fireDB, "products"), {
        ...productData,
        price: parseFloat(productData.price),
        oldPrice: parseFloat(productData.oldPrice),
        rating: parseFloat(productData.rating) || 0,
        colors: productData.colors.split(",").map((c) => c.trim()),
        sizes: productData.sizes.split(",").map((s) => s.trim()),
        images: uploadedUrls,
        createdAt: Timestamp.now(),
        ownerId: currentUser.uid,
        category: productData.category || "Shop",
        isThrift: isThrift, // ✅ add this line
      });

      toast({
        title: "Success",
        description: "Product added successfully!",
      });

      // Reset form
      setProductData({
        name: "",
        price: "",
        oldPrice: "",
        description: "",
        colors: "",
        sizes: "",
        category: "",
        rating: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">
            Add a New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Product Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {uploading && (
                <p className="text-sm text-blue-600 mt-1">
                  Uploading images...
                </p>
              )}
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  name="price"
                  type="number"
                  value={productData.price}
                  onChange={handleChange}
                  placeholder="89"
                  required
                />
              </div>
              <div>
                <Label>Old Price (₹)</Label>
                <Input
                  name="oldPrice"
                  type="number"
                  value={productData.oldPrice}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Colors</Label>
                <Input
                  name="colors"
                  value={productData.colors}
                  onChange={handleChange}
                  placeholder="Red, Blue, Black"
                />
              </div>
              <div>
                <Label>Sizes</Label>
                <Input
                  name="sizes"
                  value={productData.sizes}
                  onChange={handleChange}
                  placeholder="XS, S, M, L, XL"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Knitwear, Tops, Jeans"
                />
              </div>

              <div>
                <Label>Rating (1–5)</Label>
                <Input
                  name="rating"
                  type="number"
                  step="0.1"
                  value={productData.rating}
                  onChange={handleChange}
                  placeholder="4.8"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="thrift-toggle">Add to Thrift Category?</Label>
              <Switch
                id="thrift-toggle"
                checked={isThrift}
                onCheckedChange={(checked) => setIsThrift(checked as boolean)}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-primary text-primary-foreground"
            >
              {submitting ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
