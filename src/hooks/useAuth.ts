// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.payload);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, logout };
}
