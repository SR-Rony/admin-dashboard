"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { loginUser, clearError } from "@/redux/slices/userSlice";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  // ✅ login handle
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error("Please enter phone and password");
      return;
    }

    const result = await dispatch(loginUser({ phone, password }));

    // ✅ যদি লগইন সফল হয়
    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload;

      // 🔒 শুধুমাত্র admin allowed
      if (loggedUser.role === "admin") {
        toast.success("Welcome Admin!");
        router.push("/dashboard");
      } else {
        toast.error("Access denied! Only admins can log in to dashboard.");
        return; // Stop further redirect
      }
    } 
    // ❌ লগইন ব্যর্থ হলে
    else if (loginUser.rejected.match(result)) {
      toast.error(result.payload || "Login failed!");
    }
  };

  // show errors from slice
  useEffect(() => {
    if (error) toast.error(error);
    dispatch(clearError());
  }, [error, dispatch]);

  // already logged in → redirect (only if admin)
  useEffect(() => {
    if (user) {
      if (user.role === "admin") router.push("/dashboard");
      else toast.error("Only admins can access the dashboard!");
    }
  }, [user, router]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-background p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg border border-slate-200 dark:border-background rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Only administrators can access this dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="+8801XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full text-base font-medium">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
