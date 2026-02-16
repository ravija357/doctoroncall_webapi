import React from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

export default function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-white/10 p-1">
        {icon}
      </div>
      <span className="font-bold text-lg opacity-90">{text}</span>
    </div>
  );
}
