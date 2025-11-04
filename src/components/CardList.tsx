"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import axiosInstance from "@/lib/axiosInstance";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  points?: number;
  isAdmin?: boolean;
}

const CardList = ({ title }: { title: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/user");

        const usersData = res.data?.payload?.allUser || [];
        setUsers(usersData);
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || "Failed to fetch users";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ user click handler
  const handleUserClick = (id: string) => {
    if (id) {
      router.push(`/dashboard/users/${id}`);
    }
  };

  // ✅ UI rendering
  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-5">{title}</h1>

      <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {users.length > 0 ? (
            users.map((user) => (
              <Card
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex flex-row items-center justify-between p-3 cursor-pointer hover:bg-muted transition"
              >
                <div>
                  <CardTitle className="text-sm font-medium">
                    {user.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>

                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </Card>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CardList;
