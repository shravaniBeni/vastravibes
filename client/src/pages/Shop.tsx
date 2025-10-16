import { useState, useEffect } from "react";
import { Filter, Grid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
}

const Shop = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 500],
  });
  const [products, setProducts] = useState<any[]>([]);

  // Update state for filters
  const handleCheckboxChange = (
    type: "categories" | "sizes" | "colors",
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  // Sample products - in a real app, this would come from an API
  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(fireDB, "products");
        const snapshot = await getDocs(productsRef);
        const allProducts: any[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only push non-thrift products to Shop
          if (data.category?.toLowerCase() !== "thrift") {
            allProducts.push({ id: doc.id, ...data });
          }
        });
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    "All",
    "Knitwear",
    "Shirts",
    "Dresses",
    "Outerwear",
    "Accessories",
    "T-Shirts",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Gray", "Navy", "Beige", "Brown"];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <Label
                htmlFor={category}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
            max={500}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox id={size} />
              <Label
                htmlFor={size}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Colors</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox id={color} />
              <Label
                htmlFor={color}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-background sticky top-16 z-40">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-semibold text-foreground">
                  Shop All
                </h1>
                <p className="text-muted-foreground">
                  {products.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden sm:flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="border-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="border-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>

                {/* Mobile Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="py-6">
                      <h2 className="text-lg font-semibold mb-6">Filters</h2>
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* Desktop Filters - Collapsible */}
            <aside
              className={`w-64 flex-shrink-0 transition-all duration-300 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <Card className="p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterSidebar />
              </Card>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shop;
