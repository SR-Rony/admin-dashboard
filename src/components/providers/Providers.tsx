"use client";

import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "./ThemeProvider";
import { store } from "@/redux/store";
import { SidebarProvider } from "../ui/sidebar";
import Navbar from "../Navbar";
import AppSidebar from "../AppSidebar";
import { usePathname } from "next/navigation";

export default function Providers({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
   
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");


  return (
    <ReduxProvider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          {isDashboard && <AppSidebar />}
          <main className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
