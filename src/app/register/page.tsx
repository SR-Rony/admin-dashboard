"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const isPhone = (value: string) => /^[0-9+]{8,15}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, password } = formData;

    if (!name || !phone || !password) {
      return toast.error("Please fill all required fields");
    }

    if (!isPhone(phone)) return toast.error("Invalid phone number");

    try {
      setLoading(true);

      const payload = { name, phone, password };

      // Call backend register API
      const res = await axiosInstance.post("/user/register", payload);

      toast.success(res.data.message || "OTP sent successfully!");

      // Redirect to OTP verify page
      router.push(`/verify?phone=${phone}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-background p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-xl border border-slate-200 dark:border-background rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">Register using your phone number</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="+8801XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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

            <Button type="submit" className="w-full text-base font-medium" disabled={loading}>
              {loading ? "Sending OTP..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
