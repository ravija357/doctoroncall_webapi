import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { RoleProvider } from "@/context/RoleContext";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RealTimeSync from "@/components/RealTimeSync";
import ThemeToaster from "@/components/ThemeToaster";
import { Toaster } from "sonner"; // For backward compatibility if needed, but ThemeToaster handles it
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DoctorOnCall - Book Your Appointment",
  description: "Advanced Doctor Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <RoleProvider>
            <AuthProvider>
                <SocketProvider>
                    <NotificationProvider>
                        <DarkModeProvider>
                            <RealTimeSync />
                            <Navbar />
                            <main className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                            {children}
                            </main>
                            <Footer />
                            <ThemeToaster />
                        </DarkModeProvider>
                    </NotificationProvider>
                </SocketProvider>
            </AuthProvider>
          </RoleProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
