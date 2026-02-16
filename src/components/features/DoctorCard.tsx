import { Doctor } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-90" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 -mt-12 flex justify-between">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gray-200">
                {doctor.user.image ? (
                     <img src={doctor.user.image} alt="Doctor" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                        {doctor.user.firstName?.[0] || 'D'}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                {doctor.averageRating || "New"} ({doctor.totalReviews})
            </div>
        </div>
        
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">
                Dr. {doctor.user.firstName} {doctor.user.lastName}
            </h3>
            <p className="text-sm font-medium text-blue-600">{doctor.specialization}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">${doctor.fees}</span>
                <span>/ consultation</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{doctor.experience} years exp.</span>
            </div>
             <div className="flex items-center gap-2">
                <span className="truncate">{doctor.qualifications.join(", ")}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Link href={`/doctors/${doctor._id}`} className="w-full">
            <Button className="w-full">Book Appointment</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
