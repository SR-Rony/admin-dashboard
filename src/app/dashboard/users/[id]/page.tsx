"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "@/components/EditUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ Dynamic imports (no SSR)
const AppLineChart = dynamic(() => import("@/components/AppLineChart"), { ssr: false });
const CardList = dynamic(() => import("@/components/CardList"), { ssr: false });

const SingleUserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${id}`);
        setUser(res.data.payload.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Container */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* User Badges */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="flex gap-4 mt-4">
              {[BadgeCheck, Shield, Candy, Citrus].map((Icon, i) => (
                <HoverCard key={i}>
                  <HoverCardTrigger>
                    <Icon size={36} className="rounded-full bg-muted/30 p-2" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Badge Info</h1>
                    <p className="text-sm text-muted-foreground">
                      Example badge description.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Edit User</Button>
                </SheetTrigger>
                <EditUser user={user} />
              </Sheet>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">
                  Profile completion
                </p>
                <Progress value={70} />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Role:</span>
                <Badge>{user.isAdmin ? "Admin" :"User"}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Points:</span>
                <span>{user.points ?? 0}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Joined on {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "N/A"}
            </p>
          </div>

          {/* Transactions */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <CardList title="Recent Transactions" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold">{user.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {user.bio || "This user has no bio yet."}
            </p>
          </div>

          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Activity</h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
