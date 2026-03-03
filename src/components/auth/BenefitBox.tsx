import React from "react";

interface BenefitBoxProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function BenefitBox({ icon, title, desc }: BenefitBoxProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl group hover:bg-white/10 transition-colors">
      <div className="mb-2 bg-white/10 w-fit p-2.5 rounded-xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h4 className="font-black text-lg mb-1 tracking-tight">{title}</h4>
      <p className="text-white/60 text-[10px] font-bold leading-relaxed uppercase tracking-wider">{desc}</p>
    </div>
  );
}
