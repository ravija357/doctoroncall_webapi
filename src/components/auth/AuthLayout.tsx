"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  reverse?: boolean;
}

export default function AuthLayout({ children, sidebar, reverse = false }: AuthLayoutProps) {
  return (
    <div className="py-12 md:py-20 bg-[radial-gradient(circle_at_top_right,var(--color-primary-light)_0%,transparent_40%),radial-gradient(circle_at_bottom_left,var(--color-primary-light)_0%,transparent_40%)] bg-slate-50/50 min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className={`flex flex-col lg:flex-row overflow-hidden rounded-[3rem] bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_32px_64px_-16px_rgba(112,192,250,0.15)] min-h-[650px] ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              {children}
            </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
            {sidebar}
          </div>
        </div>
      </div>
    </div>
  );
}
