import { useEffect, useState, useContext } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MyContext } from "../context/myContext";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";

const OwnerOrders = () => {
  const { currentUser } = useContext(MyContext);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const ordersRef = collection(fireDB, "orders");
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter only orders that include this owner's products
      const ownerOrders = allOrders.filter((order: any) =>
        order.items.some((item: any) => item.ownerId === currentUser.uid)
      );

      setOrders(ownerOrders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(fireDB, "orders", orderId), { status: newStatus });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">My Product Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-6 shadow-md">
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Order ID: {order.id}</h2>
                <p className="text-sm text-gray-500">
                  Buyer: {order.userEmail || "Unknown"}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              {order.items
                .filter((item: any) => item.ownerId === currentUser.uid)
                .map((item: any) => (
                  <div key={item.productId} className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}

              <Separator className="my-3" />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(order.id, "Pending")}
                >
                  Pending
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange(order.id, "Shipped")}
                >
                  Shipped
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleStatusChange(order.id, "Delivered")}
                >
                  Delivered
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange(order.id, "Cancelled")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OwnerOrders;
