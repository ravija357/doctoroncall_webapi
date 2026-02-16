import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested/default
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DoctorOnCall - Book Your Appointment",
  description: "Advanced Doctor Booking System",
};

import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <SocketProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50">
                {children}
                </main>
                <Footer />
            </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
