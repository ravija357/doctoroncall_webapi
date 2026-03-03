import React from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

export default function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-4 group/item">
      <div className="rounded-[1rem] bg-white/10 p-2 border border-white/10 group-hover/item:bg-primary/20 transition-all duration-300">
        {icon}
      </div>
      <span className="font-bold text-lg tracking-tight group-hover/item:translate-x-1 transition-transform">{text}</span>
    </div>
  );
}
