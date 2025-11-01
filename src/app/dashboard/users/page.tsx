"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  points?: number;
  isAdmin?: boolean;
}

const PaymentsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get("/user"); // interceptor will handle refresh token
      const { payload } = res.data;

      const usersData: User[] = Array.isArray(payload?.allUser)
        ? payload.allUser
        : [];

      setUsers(usersData);
    } catch (err: any) {
      console.error("Fetch users error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading users...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 font-medium">{error}</p>
    );

  return (
    <div className="p-4">
      <div className="mb-6 px-4 py-3 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold text-lg">All Users</h1>
        <span className="text-sm text-muted-foreground">
          Total: {users.length}
        </span>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default PaymentsPage;
