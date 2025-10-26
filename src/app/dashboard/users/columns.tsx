"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isAdmin?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  shippingAddress?: {
    country?: string;
  };
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "profileImage",
    header: "Avatar",
    cell: ({ row }) => {
      const avatar = row.original.profileImage || "/images/users/default.png";
      return (
        <Image
          src={avatar}
          alt={row.original.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => (row.original.isAdmin ? "Admin" : "User"),
  },
  {
    accessorKey: "isBanned",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          row.original.isBanned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
        }`}
      >
        {row.original.isBanned ? "Banned" : "Active"}
      </span>
    ),
  },
  {
    header: "Country",
    cell: ({ row }) => row.original.shippingAddress?.country || "Bangladesh",
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "—",
  },
];
