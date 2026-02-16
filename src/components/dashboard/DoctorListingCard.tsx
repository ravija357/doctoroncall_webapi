import React from "react";
import { Button } from "@/components/ui/button";

interface DoctorListingCardProps {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  timings: string;
  image: string;
  onClick?: () => void;
}

export default function DoctorListingCard({ id, name, specialization, qualifications, timings, image, onClick }: DoctorListingCardProps) {
  return (
    <div 
        onClick={onClick}
        className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="relative group-hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{qualifications}</p>
          <div className="flex items-center gap-2 mt-4 text-slate-400">
            <span className="text-xs font-medium bg-slate-50 px-3 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {timings}
            </span>
          </div>
        </div>
      </div>

      <Button className="bg-[#6EB0D9] hover:bg-blue-600 px-8 h-12 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200/50 text-white transition-all hover:scale-105 active:scale-95 hover:shadow-blue-500/30">
        Book
      </Button>
    </div>
  );
}
