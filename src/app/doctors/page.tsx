"use client";

import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctor.service";
import { useSocket } from "@/context/SocketContext";
import DoctorCard from "@/components/features/DoctorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types";
import { Search, Loader2 } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { socket } = useSocket();

  // Categories requested by the user
  const categories = ["All", "Cardiologist", "Dentist", "Neurologist", "Pediatrician", "Surgeon"];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getAllDoctors({
          name: searchQuery,
          specialization: activeCategory === "All" ? "" : activeCategory
      });
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchDoctors();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (!socket) return;
    
    const handleRatingUpdate = (data: { doctorId: string, averageRating: number, totalReviews: number }) => {
        setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
                doc._id === data.doctorId 
                    ? { ...doc, averageRating: data.averageRating, totalReviews: data.totalReviews }
                    : doc
            )
        );
    };

    socket.on('doctor_rating_updated', handleRatingUpdate);
    socket.on('doctor_profile_updated', (data: { doctorId: string, fees: number }) => {
        setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
                doc._id === data.doctorId 
                    ? { ...doc, fees: data.fees }
                    : doc
            )
        );
    });

    return () => {
        socket.off('doctor_rating_updated', handleRatingUpdate);
        socket.off('doctor_profile_updated');
    };
  }, [socket]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchDoctors();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Standard Header Section */}
      <div className="bg-white border-b border-slate-100 pb-16 pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-1.5 bg-[#70c0fa] rounded-full mb-6 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 font-serif mb-4 tracking-tight">
                Find the Best <span className="text-[#70c0fa]">Medical Help</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium mb-10 max-w-2xl mx-auto">
                Connect with world-class specialists and book your appointment easily.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
                <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 p-2 pl-4 focus-within:bg-white focus-within:border-[#70c0fa] focus-within:ring-4 focus-within:ring-[#70c0fa]/5 transition-all">
                    <Search className="h-5 w-5 text-slate-400 ml-2" />
                    <Input 
                        placeholder="Search by specialty, doctor name..." 
                        className="border-none focus-visible:ring-0 text-lg bg-transparent placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                        onClick={() => fetchDoctors()}
                        className="bg-[#70c0fa] hover:bg-[#68A6CB] text-white rounded-xl px-8 h-12 font-bold shadow-md"
                    >
                         Search
                    </Button>
                </div>
            </div>

            {/* Categorical Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {categories.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveCategory(tag)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                            activeCategory === tag
                                ? "bg-[#70c0fa] border-[#70c0fa] text-white shadow-lg shadow-blue-100 scale-105"
                                : "bg-white border-slate-200 text-slate-500 hover:border-[#70c0fa] hover:text-[#70c0fa] hover:bg-blue-50/50"
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 font-serif">Available Specialists</h2>
                <p className="text-slate-400 font-medium mt-1">Found {doctors.length} results matching your search</p>
            </div>
            {/* Sorting or Filter Toggle can go here */}
        </div>

        {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[400px] bg-white rounded-[2rem] animate-pulse border border-slate-50" />
                ))}
            </div>
        ) : (
            <>
                {doctors.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-[#70c0fa]" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 font-serif mb-2">No doctors found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">We couldn't find any specialists matching "{searchQuery}". Try adjusting your filters or search keywords.</p>
                        <Button 
                            variant="ghost" 
                            onClick={() => setSearchQuery("")}
                            className="mt-8 text-[#70c0fa] font-bold hover:bg-blue-50 rounded-xl"
                        >
                            Reset Search
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <DoctorCard doctor={doctor} />
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
