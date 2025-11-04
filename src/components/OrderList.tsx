"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import axiosInstance from "@/lib/axiosInstance";

interface ShippingAddress {
  fullName: string;
  city: string;
  phone: string;
}

interface Order {
  _id: string;
  shippingAddress: ShippingAddress;
  totalPrice?: number;
  status?: string;
  createdAt?: string;
}

const OrderList = ({ title }: { title: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get("/orders");
        const ordersData: Order[] = res.data?.payload || [];

        // ✅ sort by createdAt descending
        const sortedOrders = ordersData.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );

        // ✅last 10 orders ন
        const latest10Orders = sortedOrders.slice(0, 10);

        console.log("Latest 10 Orders:", latest10Orders);
        setOrders(latest10Orders);
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Failed to fetch orders";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (id: string) => {
    if (id) {
      router.push(`/dashboard/payments`);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-5">{title}</h1>

      <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order._id}
                onClick={() => handleOrderClick(order._id)}
                className="flex flex-col gap-1 p-3 cursor-pointer hover:bg-muted transition rounded-lg"
              >
                <CardTitle className="text-sm font-medium">
                  {order.shippingAddress?.fullName || "No name"}
                </CardTitle>

                <p className="text-xs text-muted-foreground">
                  📍 {order.shippingAddress?.city || "Unknown City"}
                </p>

                <p className="text-xs text-muted-foreground">
                  📞 {order.shippingAddress?.phone || "No phone"}
                </p>

                {order.totalPrice && (
                  <p className="text-xs text-muted-foreground">
                    💰 Total: ৳{order.totalPrice}
                  </p>
                )}

                {order.status && (
                  <p className="text-xs text-muted-foreground">
                    🟢 Status: {order.status}
                  </p>
                )}

                {order.createdAt && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    🕒 {new Date(order.createdAt).toLocaleString()}
                  </p>
                )}
              </Card>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderList;
