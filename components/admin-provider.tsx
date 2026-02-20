"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AdminCtx {
  isAdmin: boolean;
  overrides: Record<string, string>;
  getContent: (key: string, fallback: string) => string;
  setContent: (key: string, value: string) => Promise<void>;
}

const Ctx = createContext<AdminCtx>({
  isAdmin: false,
  overrides: {},
  getContent: (_, f) => f,
  setContent: async () => {},
});

export const useAdmin = () => useContext(Ctx);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsAdmin(document.cookie.includes("analytics_unlocked=true"));
    fetch("/api/content").then(r => r.json()).then(setOverrides).catch(() => {});
  }, []);

  useEffect(() => {
    const check = () => setIsAdmin(document.cookie.includes("analytics_unlocked=true"));
    const id = setInterval(check, 1500);
    return () => clearInterval(id);
  }, []);

  const getContent = useCallback(
    (key: string, fallback: string) => overrides[key] ?? fallback,
    [overrides]
  );

  const setContentFn = useCallback(async (key: string, value: string) => {
    setOverrides(p => ({ ...p, [key]: value }));
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
    } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ isAdmin, overrides, getContent, setContent: setContentFn }}>
      {children}
    </Ctx.Provider>
  );
}
