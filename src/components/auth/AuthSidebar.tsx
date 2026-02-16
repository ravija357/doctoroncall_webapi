import React from "react";
import { Star } from "lucide-react";

interface AuthSidebarProps {
  title: string;
  badgeContent: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  bgClassName?: string;
}

export default function AuthSidebar({ 
  title, 
  badgeContent, 
  children, 
  footer, 
  bgClassName = "bg-blue-600" 
}: AuthSidebarProps) {
  return (
    <div className={`absolute inset-0 h-full w-full ${bgClassName}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-indigo-900/80 mix-blend-multiply" />
      <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-bold border border-white/30 shadow-sm mb-6">
            {badgeContent}
          </div>
          <h2 className="text-5xl font-black leading-tight italic">
            "{title}"
          </h2>
        </div>
        
        <div className="space-y-6">
          {children}
        </div>

        <div className="mt-20 pt-12 border-t border-white/20">
          {footer}
        </div>
      </div>
    </div>
  );
}
