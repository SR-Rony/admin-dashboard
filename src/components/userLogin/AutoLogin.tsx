"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import axios from "axios";
import type { AppDispatch } from "@/redux/store";

export default function useAutoLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) dispatch(setUser(res.data.user));
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, [mounted, dispatch]);
}
