"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { User, LogOut, ChevronDown, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/doctoroncall-log.png" 
            alt="DoctorOnCall Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
          <NavLink href="/doctors">Find Doctors</NavLink>
          <NavLink href="/appointments">Appointments</NavLink>
          <NavLink href="/messages">Messages</NavLink>
          <NavLink href="/about">How it Works</NavLink>
          <NavLink href="/contact">Support</NavLink>
          
          <div className="h-6 w-px bg-gray-200" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-blue-50 border flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">{user.firstName || 'User'}</span>
                  <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">{user.role}</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold text-blue-900">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="font-bold bg-blue-600 hover:bg-blue-700 rounded-full px-6 shadow-md shadow-blue-100">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Burger */}
        <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all">
      {children}
    </Link>
  );
}
