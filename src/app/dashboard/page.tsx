"use client";

import { useSession } from "next-auth/react";

import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import OrderList from "@/components/OrderList";
import ProtectedRoute from "@/components/ProtectedRoute";

const Homepage = () => {
  const { data: session, status } = useSession(); // ✅ missing line added

  // Loading state while session is being checked
  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="New User List" />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg">
          <OrderList title="New (10) Order List" />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>

        <div className="bg-primary-foreground p-4 rounded-lg">
          <TodoList />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Homepage;
