import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import TryOn from "./pages/TryOn";
import Wishlist from "./pages/Wishlist";
import Reels from "./pages/Reels";
import Create from "./pages/Create";
import Message from "./pages/Message";
import Designer from "./pages/Designer";
import Thrift from "./pages/Thrift";
import NotFound from "./pages/NotFound";

// Query client for React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="pb-16 md:pb-0">
            {" "}
            {/* Add padding for mobile bottom nav */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/tryon" element={<TryOn />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/create" element={<Create />} />
              <Route path="/message" element={<Message />} />
              <Route path="/designer/:id" element={<Designer />} />
              <Route path="/thrift" element={<Thrift />} />
              <Route path="/designer/:designerId" element={<Designer />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
