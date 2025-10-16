import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MyContext } from "../context/myContext";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { fireDB, auth } from "../firebase/FirebaseConfig";

const Cart = () => {
  const { currentUser } = useContext(MyContext);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const cartRef = collection(fireDB, "users", currentUser.uid, "cart");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (!currentUser) return;
    if (newQty < 1) return removeItem(itemId); // auto-remove if quantity < 1

    const itemRef = doc(fireDB, "users", currentUser.uid, "cart", itemId);
    await updateDoc(itemRef, { quantity: newQty });
  };

  const removeItem = async (itemId: string) => {
    if (!currentUser) return;

    const itemRef = doc(fireDB, "users", currentUser.uid, "cart", itemId);
    await deleteDoc(itemRef);
  };

  const proceedToCheckout = async () => {
    if (!currentUser) return;

    // For demo, we just clear the cart
    const cartRef = collection(fireDB, "users", currentUser.uid, "cart");
    cartItems.forEach(async (item) => {
      const itemRef = doc(cartRef, item.id);
      await deleteDoc(itemRef);
    });

    alert("Checkout successful!");
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // Optional: removes decimals
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="container-custom py-16">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/shop">
                <Button size="lg">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="aspect-square w-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-foreground mb-1">
                              {item.name}
                            </h3>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({totalQuantity} items)
                      </span>
                      <span className="text-foreground">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">
                        {formatPrice(tax)}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold text-foreground mb-6">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-accent/50 rounded-lg p-3 mb-6">
                      <p className="text-sm text-muted-foreground">
                        Add {formatPrice(100 - subtotal)} more for free shipping
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={proceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <Link to="/shop">
                      <Button variant="outline" size="lg" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>Secure checkout</span>
                      <span>•</span>
                      <span>SSL encrypted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
