import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  originalPrice?: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className="group border-0 shadow-none bg-transparent overflow-hidden">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg mb-4">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-3 left-3">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
          )}
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;