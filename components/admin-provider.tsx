"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, type ReactNode } from "react";

const CACHE_KEY = "site_content_cache";

interface AdminCtx {
  isAdmin: boolean;
  overrides: Record<string, string>;
  loaded: boolean;
  getContent: (key: string, fallback: string) => string;
  setContent: (key: string, value: string) => Promise<void>;
  deleteContent: (key: string) => Promise<void>;
}

const Ctx = createContext<AdminCtx>({
  isAdmin: false,
  overrides: {},
  loaded: false,
  getContent: (_, f) => f,
  setContent: async () => {},
  deleteContent: async () => {},
});

export const useAdmin = () => useContext(Ctx);

function readCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(data: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  // Synchronously read localStorage BEFORE browser paints — prevents flash
  useLayoutEffect(() => {
    const cached = readCache();
    if (Object.keys(cached).length > 0) {
      setOverrides(cached);
    }
    setLoaded(true);
  }, []);

  // Then fetch fresh data from the API
  useEffect(() => {
    setIsAdmin(document.cookie.includes("analytics_unlocked=true"));
    fetch("/api/content")
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setOverrides(data);
        writeCache(data);
      })
      .catch(() => {});
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
    setOverrides(p => {
      const next = { ...p, [key]: value };
      writeCache(next);
      return next;
    });
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
    } catch {}
  }, []);

  const deleteContentFn = useCallback(async (key: string) => {
    setOverrides(p => {
      const next = { ...p };
      delete next[key];
      writeCache(next);
      return next;
    });
    try {
      await fetch("/api/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
    } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ isAdmin, overrides, loaded, getContent, setContent: setContentFn, deleteContent: deleteContentFn }}>
      <div style={{ visibility: loaded ? "visible" : "hidden" }}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
