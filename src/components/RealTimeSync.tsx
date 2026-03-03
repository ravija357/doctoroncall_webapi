"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useDarkMode } from "@/context/DarkModeContext";

export default function RealTimeSync() {
  const { socket } = useSocket();
  const { refreshUser } = useAuth();
  const { set: setDarkMode } = useDarkMode();

  useEffect(() => {
    if (!socket) return;

    const handleProfileSync = (data: any) => {
      console.log("[SYNC] Profile sync received globally", data);
      refreshUser();
      
      // Sync theme if preference is in the event data
      if (data?.preferences?.darkMode !== undefined) {
        setDarkMode(data.preferences.darkMode, false); // false to avoid loop
      }
    };

    socket.on("profile_sync", handleProfileSync);
    return () => {
      socket.off("profile_sync", handleProfileSync);
    };
  }, [socket, refreshUser, setDarkMode]);

  return null;
}
