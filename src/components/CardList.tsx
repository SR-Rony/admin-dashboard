"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  points?: number;
}

const CardList = ({ title }: { title: string }) => {
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
        console.log("order data",data);
        
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

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-5">{title}</h1>

      <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {users.length > 0 ? (
            users.map((user) => (
              <Card key={user._id} className="flex-row items-center justify-between gap-2 p-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  {/* <Image
                    src={
                      user.avatar
                      
                    }
                    alt={user.name}
                    fill
                    className="object-cover"
                  /> */}
                </div>

                {/* Name + Role */}
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
                  {/* <Badge variant="secondary">{user.role || "User"}</Badge> */}
                </CardContent>

                {/* Points */}
                <CardFooter className="p-0 text-sm font-medium text-muted-foreground">
                  {/* {user.points ? `${(user.points / 1000).toFixed(1)}K` : "N/A"} */}
                  <Badge variant="secondary">{user.isAdmin ? "Admin" : "User"}</Badge>
                </CardFooter>
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
