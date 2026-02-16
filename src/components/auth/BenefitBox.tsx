import React from "react";

interface BenefitBoxProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function BenefitBox({ icon, title, desc }: BenefitBoxProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl group hover:bg-white/10 transition-colors">
      <div className="mb-2 bg-white/10 w-fit p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-0.5">{title}</h4>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
