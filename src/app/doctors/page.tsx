"use client";

import { useState, useEffect } from "react";
import { doctorService } from "@/services/doctor.service";
import DoctorCard from "@/components/features/DoctorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types";
import { Search, Loader2 } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getAllDoctors({
          name: searchTerm,
          specialization: specialization
      });
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchDoctors();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-600">Book appointments with top doctors in your area.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                    placeholder="Search by keyword..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Input 
                placeholder="Specialization (e.g. Cardiologist)" 
                className="md:w-64"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
            />
            <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
          <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
      ) : (
          <>
            {doctors.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center text-gray-500">
                    No doctors found matching your criteria.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            )}
          </>
      )}
    </div>
  );
}
