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
  phone: string;
  role: string;
  isVerified: boolean;
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
        const res = await axiosInstance.get("/user"); // ✅ must be protected route (admin only)
        const usersData = res.data?.payload?.allUser || [];
        console.log("user data",usersData);
        
        setUsers(usersData);
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to fetch users";
          console.log("errrrro",err);
          
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (id: string) => {
    if (id) router.push(`/dashboard/users/${id}`);
  };

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
                
                <CardTitle className="text-sm font-medium">
                  {user.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {user.phone}
                </p>

                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "User"}
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
