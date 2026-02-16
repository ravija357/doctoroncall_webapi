import React from "react";

interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

export default function CategoryCard({ icon, label, color }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={`w-24 h-24 rounded-3xl flex items-center justify-center border-2 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95`}
        style={{ 
          borderColor: color,
          backgroundColor: `${color}10`, // 10% opacity
        }}
      >
        <div className="text-4xl" style={{ color: color }}>
          {icon}
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-500 uppercase tracking-tighter">{label}</span>
    </div>
  );
}
