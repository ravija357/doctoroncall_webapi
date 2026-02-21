import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested/default
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DoctorOnCall - Book Your Appointment",
  description: "Advanced Doctor Booking System",
};

import { Toaster } from "sonner";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { DarkModeProvider } from "@/context/DarkModeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <RoleProvider>
                <SocketProvider>
                    <NotificationProvider>
                        <DarkModeProvider>
                            <Navbar />
                            <main className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                            {children}
                            </main>
                            <Footer />
                            <Toaster richColors position="top-right" />
                        </DarkModeProvider>
                    </NotificationProvider>
                </SocketProvider>
            </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
