"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function PhoneVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone) router.push("/register");
  }, [phone, router]);

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Please enter OTP");
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/verify", { phone, otp });
      toast.success(res.data.message || "Phone verified!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-background p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-xl border border-slate-200 dark:border-background rounded-2xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Verify Your Phone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="otp">Enter OTP sent to {phone}</Label>
          <Input id="otp" type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={handleVerifyOTP} disabled={loading} className="w-full text-base font-medium">
            {loading ? "Verifying..." : "Verify Phone"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
