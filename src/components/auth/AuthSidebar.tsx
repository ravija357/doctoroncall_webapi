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
  bgClassName = "bg-primary" 
}: AuthSidebarProps) {
  return (
    <div className={`absolute inset-0 h-full w-full ${bgClassName} overflow-hidden`}>
      {/* Dynamic Brand Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-hover/40 to-slate-950/90 mix-blend-multiply" />
      
      <div className="absolute inset-0 flex flex-col justify-center px-12 text-white z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl px-5 py-2 text-xs font-black border border-white/20 shadow-2xl mb-8 tracking-widest uppercase">
            {badgeContent}
          </div>
          <h2 className="text-5xl font-black leading-[1.1] tracking-tighter">
            {title}
          </h2>
        </div>
        
        <div className="space-y-8">
          {children}
        </div>

        <div className="mt-20 pt-12 border-t border-white/10">
          {footer}
        </div>
      </div>
    </div>
  );
}
