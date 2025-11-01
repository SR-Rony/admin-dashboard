"use client";

import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Homepage = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/"); // login page
  //   }
  // }, [user, loading, router]);

  // if (!user) return null; // prevent rendering before redirect

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="All User List" />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        {/* <CardList title="All User List" /> */}
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
    </div>
  );
};

export default Homepage;
