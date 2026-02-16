"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import CategoryCard from "@/components/dashboard/CategoryCard";
import DoctorListingCard from "@/components/dashboard/DoctorListingCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import { 
  Search,
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchDoctors = useCallback(async (query = "", category = "") => {
    setLoading(true);
    try {
      let url = "/doctors";
      const params = new URLSearchParams();
      if (query) params.append("name", query);
      if (category) params.append("specialization", category);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await api.get(url);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchDoctors(val, selectedCategory || "");
  };

  const handleCategoryClick = (category: string) => {
    const newVal = selectedCategory === category ? null : category;
    setSelectedCategory(newVal);
    fetchDoctors(searchQuery, newVal || "");
  };

  const categories = [
    { label: "WheelChair", icon: "♿", color: "#3FB8AF", value: "General" },
    { label: "Nutrisi", icon: "🍎", color: "#6EB0D9", value: "Nutritionist" },
    { label: "Heart", icon: "💙", color: "#EC644B", value: "Cardiologist" },
    { label: "Brain", icon: "🧠", color: "#9B59B6", value: "Neurologist" },
    { label: "Eyes", icon: "👁️", color: "#F1C40F", value: "Ophthalmologist" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Majestic Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-12 gap-8">
          <div className="space-y-1">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 font-serif">
              Find Your Doctor
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              Book an appointment for consultation
            </p>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full lg:w-80' : 'w-12 overflow-hidden'}`}>
              <Input
                type="text"
                placeholder="Search doctors..."
                className="h-12 pl-12 rounded-2xl border-slate-100 shadow-lg focus:ring-blue-500 pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-0 w-12 h-12 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
              {isSearchOpen && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                    fetchDoctors("", selectedCategory || "");
                  }}
                  className="absolute right-3 text-slate-300 hover:text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white shrink-0">
              <img 
                src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mt-8 space-y-8">
            <AppointmentList />
            
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight italic">
            Browse by Category
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat, idx) => (
              <div key={idx} onClick={() => handleCategoryClick(cat.value)}>
                <CategoryCard 
                  icon={cat.icon} 
                  label={cat.label} 
                  color={selectedCategory === cat.value ? "#2563EB" : cat.color} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Doctor Discovery Section */}
        <section className="mt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight italic">
              {selectedCategory ? `${selectedCategory} Specialists` : 'Available Specialists'}
            </h2>
            <button onClick={() => {
              setSelectedCategory(null);
              setSearchQuery("");
              fetchDoctors();
            }} className="text-blue-600 font-bold hover:underline">Clear Filters</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-slate-50 rounded-[2rem] border border-slate-100 animate-pulse" />
              ))
            ) : doctors.length > 0 ? (
              doctors.map((doc, idx) => (
                <DoctorListingCard
                  key={idx}
                  id={doc._id}
                  name={`Dr. ${doc.user?.firstName || "Professional"} ${doc.user?.lastName || "Specialist"}`}
                  specialization={doc.specialization}
                  qualifications={doc.qualifications?.length > 0 ? doc.qualifications.join(", ") : "Expert Practitioner"}
                  timings={doc.schedules?.find((s:any) => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })) ? 
                    `${doc.schedules.find((s:any) => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).startTime} - ${doc.schedules.find((s:any) => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).endTime}` 
                    : "Check Availability"}
                  image={doc.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc._id}`}
                  onClick={() => router.push(`/doctors/${doc._id}`)}
                />
              ))
            ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <p className="text-xl font-bold text-slate-400">No doctors found matching your criteria</p>
                </div>
            )}
          </div>
        </section>

      </div>
      
      {/* Aesthetic Mobile-inspired Bottom Nav (Hidden on Desktop) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-2xl px-8 py-4 rounded-[2.5rem] shadow-2xl border border-white/20 flex items-center gap-12 lg:hidden">
        <HomeIcon className="w-6 h-6 text-blue-600" />
        <Bell className="w-6 h-6 text-slate-400" />
        <Settings className="w-6 h-6 text-slate-400" />
        <Menu className="w-6 h-6 text-slate-400" />
      </div>
    </div>
  );
}

function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
    );
}
