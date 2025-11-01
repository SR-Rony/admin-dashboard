"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, Order } from "./columns";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get("/orders"); // interceptor handle refresh token
      const { payload } = res.data;
      

      setOrders(Array.isArray(payload) ? payload : []);
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading orders...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 font-medium">{error}</p>
    );

  return (
    <div className="p-4">
      <div className="mb-6 px-4 py-3 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold text-lg">All Orders</h1>
        <span className="text-sm text-muted-foreground">
          Total: {orders.length}
        </span>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default OrdersPage;
