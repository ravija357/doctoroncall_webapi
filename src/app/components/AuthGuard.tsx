"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
  role?: "admin" | "user";
};

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url =
          role === "admin"
            ? "http://localhost:3001/api/admin/users"
            : "http://localhost:3001/api/auth/login";

        const res = await fetch(url, {
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
}
