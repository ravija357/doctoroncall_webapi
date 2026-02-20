"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type AuthGuardProps = {
  children: React.ReactNode;
  role?: "admin" | "user" | "doctor";
};

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (role && user?.role !== role) {
        // Strict role check: if role is specified and doesn't match, redirect.
        // Redirect to their appropriate dashboard or login to switch accounts.
        router.push("/login"); 
      }
    }
  }, [user, isLoading, isAuthenticated, role, router]);

  if (isLoading) {
      // Optional: Render a loading spinner here
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If role requirement is not met, don't render children (to avoid flash)
  if (!isAuthenticated || (role && user?.role !== role)) {
      return null;
  }

  return <>{children}</>;
}
