"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type Order = {
  _id: string;
  user: string;
  shippingAddress: {
    fullName: string;
    city: string;
    street: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  orderItems: {
    name: string;
    qty: number;
    price: number;
    image?: string;
  }[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isDelivered: boolean;
  isPaid: boolean;
  createdAt: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "shippingAddress.fullName",
    header: "Customer Name",
    cell: ({ row }) => row.original.shippingAddress?.fullName || "-",
  },
  {
    accessorKey: "shippingAddress.city",
    header: "City",
    cell: ({ row }) => row.original.shippingAddress?.city || "-",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.orderItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={30}
                height={30}
                className="rounded"
              />
            )}
            <span>{item.name}</span>
            <span className="text-xs text-gray-500">
              ({item.qty} × ৳{item.price})
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total (৳)",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.original.isPaid
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.original.isPaid ? "Paid" : "Unpaid"}
      </span>
    ),
  },
  {
    accessorKey: "isDelivered",
    header: "Delivered",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.original.isDelivered
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {row.original.isDelivered ? "Delivered" : "Pending"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-GB"),
  },
];
