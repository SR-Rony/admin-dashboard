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
// logout action
import { AppDispatch, persistor } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";


const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const path = usePathname()
  const isDashboard = path.startsWith("/dashboard")

  const handleLogout = () => {
  console.log("i am log out");

  persistor.purge(); // redux-persist clear
  localStorage.removeItem("token");

  dispatch(logout()); // ✅ এখানে useDispatch নয়, dispatch ব্যবহার করো
  router.push("/");
};

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10">
      {/* LEFT */}
      {isDashboard ? <SidebarTrigger /> :<h1>Dashboard</h1> }
      {/* <Button variant="outline" onClick={toggleSidebar}>
        Custom Button
      </Button> */}
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard</Link>
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/1486366" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
