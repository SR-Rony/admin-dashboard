"use client";

import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, persistor, RootState } from "@/redux/store";
import { logoutUser } from "@/redux/slices/userSlice";
import axiosInstance from "@/lib/axiosInstance";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const path = usePathname();
  const isDashboard = path.startsWith("/dashboard");

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      await persistor.purge();
      localStorage.removeItem("user");
      dispatch(logoutUser());
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      {isDashboard ? <SidebarTrigger /> : <Link href="/dashboard"><h1>Dashboard</h1></Link>}

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem]" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src={"https://api.dicebear.com/9.x/initials/svg?seed=" + (user?.name || "A")} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
