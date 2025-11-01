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

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters!" }).max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10).max(15),
  location: z.string().min(2),
  role: z.enum(["admin", "user"]),
});

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  phone?: string;
  location?: string;
}

const EditUser = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      location: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        role: user?.isAdmin ? "admin" : "user",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axiosInstance.put(`/user/update/${user._id}`, {
        name: values.username,
        phone: values.phone,
        // location: values.location,
        isAdmin: values.role,
      });
      console.log("Updated successfully:", res.data);
    } catch (err) {
      console.error("Update failed:", err);
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
                <FormDescription>This is your public username.</FormDescription>
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
                <FormControl><Input {...field} disabled /></FormControl>
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
                <FormDescription>Admin can see your phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          {/* <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormDescription>This is your public location.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Only verified users can be admin.</FormDescription>
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
