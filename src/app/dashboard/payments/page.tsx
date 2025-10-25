"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, Order } from "./columns";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Access token not found. Please login.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data?.payload || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="mb-6 bg-secondary px-4 py-2 rounded-md">
        <h1 className="font-semibold text-lg">All Orders</h1>
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default OrdersPage;
