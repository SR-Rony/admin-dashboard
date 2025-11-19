"use client";

import { useAppSelector } from "@/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    // ইউজার না থাকলে পেজ লোড হওয়া বন্ধ রাখবো
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
