"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply saved theme early on the client to avoid flashes
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      root.classList.add("dark");
    } else if (saved === "light") {
      root.classList.remove("dark");
    } else {
      // fall back to system
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}

