"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface DarkModeContextType {
  isDark: boolean;
  toggle: (sync?: boolean) => void;
  set: (value: boolean, sync?: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggle: () => {},
  set: () => {},
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const initial = saved === "true";
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const set = async (value: boolean, sync: boolean = true) => {
    setIsDark(value);
    localStorage.setItem("darkMode", String(value));
    document.documentElement.classList.toggle("dark", value);

    if (sync) {
      // Try to sync with backend if possible
      try {
        const userStr = localStorage.getItem("user"); // We should start storing user in localStorage for quick access or use the cookie
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?._id) {
             const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
             // Using fetch to avoid circular dependency with api.ts if any
             await fetch(`${apiUrl}/api/auth/${user._id}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ preferences: { darkMode: value } }),
             });
          }
        }
      } catch (e) {
        console.warn("Theme sync failed", e);
      }
    }
  };

  const toggle = (sync: boolean = true) => set(!isDark, sync);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle, set }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
