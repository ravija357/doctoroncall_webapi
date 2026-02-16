"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  reverse?: boolean;
}

export default function AuthLayout({ children, sidebar, reverse = false }: AuthLayoutProps) {
  return (
    <div className="py-12 md:py-20 bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-blue-900/5 min-h-[600px] border border-slate-100 ${reverse ? 'flex-row-reverse' : ''}`}>
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
