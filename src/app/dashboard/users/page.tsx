"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  points?: number;
}

const PaymentsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Access token not found. Please login.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch users");
        }

        const data = await res.json();
        const usersData = data?.payload?.allUser || [];
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // এখন user ডাটাকে DataTable এর data prop এ পাঠাচ্ছি
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>

      {/* যদি DataTable কলাম user data অনুযায়ী কাস্টম করতে চাও */}
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default PaymentsPage;
