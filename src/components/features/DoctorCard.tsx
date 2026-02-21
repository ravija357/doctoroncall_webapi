import { Doctor } from "@/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import React from "react";
import { getImageUrl } from '@/utils/imageHelper';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="h-full">
      <Card className="relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group rounded-[2rem] bg-white h-full">
        <div className="relative p-6 z-10">
          {/* Profile Image & Rating */}
          <div className="flex justify-between items-start mb-6">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-[2rem] border-4 border-slate-50 bg-slate-100 shadow-inner">
                {doctor.user.image ? (
                  <img src={getImageUrl(doctor.user.image, doctor.user._id, doctor.user.updatedAt)} alt="Doctor" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-3xl font-bold text-slate-400">
                    {doctor.user.firstName?.[0] || 'D'}
                  </div>
                )}
              </div>
              {/* Status dot */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50/50 px-4 py-1.5 text-sm font-black text-[#70c0fa]">
                <Star className="h-4 w-4 fill-[#70c0fa] text-[#70c0fa]" />
                {doctor.averageRating?.toFixed(1) || "New"}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{doctor.totalReviews} REVIEWS</span>
            </div>
          </div>
          
          {/* Info */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 font-serif group-hover:text-[#70c0fa] transition-colors duration-300">
              Dr. {doctor.user.firstName} {doctor.user.lastName}
            </h3>
            <p className="text-sm font-black text-[#70c0fa] uppercase tracking-widest mt-1 opacity-80">{doctor.specialization}</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between py-4 border-y border-slate-50 px-4">
            <div className="text-center flex-1">
              <p className="text-sm font-black text-slate-800">Rs. {doctor.fees}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Consultation</p>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-4"></div>
            <div className="text-center flex-1">
              <p className="text-sm font-black text-slate-800">{doctor.experience}yr</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Experience</p>
            </div>
          </div>

          <div className="mt-6">
            <Link href={`/doctors/${doctor._id}`}>
              <Button className="w-full h-14 rounded-2xl bg-[#70c0fa] hover:bg-[#68A6CB] text-white font-bold text-lg shadow-lg shadow-blue-100 transition-all hover:shadow-xl hover:-translate-y-0.5 group-hover:bg-[#5da0c9]">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
