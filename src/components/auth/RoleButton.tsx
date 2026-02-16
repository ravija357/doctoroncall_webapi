import React from "react";

interface RoleButtonProps {
  role: string;
  register: any;
  label: string;
  currentRole: string;
}

export default function RoleButton({ role, register, label, currentRole }: RoleButtonProps) {
  return (
    <label className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${currentRole === role ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
      <input
        type="radio"
        value={role}
        {...register("role")}
        className="sr-only"
      />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}
