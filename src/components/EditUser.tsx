"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

// ✅ form validation schema
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters!" }).max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 characters" }).max(15, { message: "Phone max 15 characters" }),
  isAdmin: z.boolean(),
});

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  phone?: string;
}

const EditUser = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      isAdmin: false,
    },
  });

  // ✅ set default user data
  useEffect(() => {
    if (user) {
      form.reset({
        username: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        isAdmin: user?.isAdmin ?? false,
      });
    }
  }, [user, form]);

  // ✅ submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axiosInstance.put(`/user/update/${user._id}`, {
        name: values.username,
        phone: values.phone,
        isAdmin: values.isAdmin, // ✅ সরাসরি boolean হিসেবে পাঠানো হচ্ছে
      });

      console.log("✅ Updated successfully:", res.data);
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Edit User</SheetTitle>
        <SheetDescription>Update user information below.</SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email (readonly) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input {...field} readOnly /></FormControl>
                <FormDescription>Email cannot be changed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isAdmin */}
          <FormField
            control={form.control}
            name="isAdmin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === "true")}
                  value={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Admin</SelectItem>
                    <SelectItem value="false">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose whether this user has admin access.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </Form>
    </SheetContent>
  );
};

export default EditUser;
