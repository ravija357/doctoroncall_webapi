"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doctorService } from "@/services/doctor.service";
import { Doctor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft, Phone, Share2, Star, Clock, DollarSign, MapPin } from "lucide-react";
import api from "@/services/api";
import Link from "next/link";

export default function DoctorDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string; isBooked: boolean }[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
    const [reason, setReason] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    // Fetch Doctor Details
    useEffect(() => {
        if (id) {
            doctorService.getDoctorById(id as string)
                .then(data => setDoctor(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Fetch Availability when date changes
    useEffect(() => {
        if (id && bookingDate) {
           api.get(`/availability?doctorId=${id}&date=${bookingDate}`)
              .then(res => {
                  if(res.data.success && res.data.data) {
                      setAvailableSlots(res.data.data.slots || []);
                  } else {
                      setAvailableSlots([]);
                  }
              })
              .catch(err => {
                  console.error(err);
                  setAvailableSlots([]);
              });
        }
    }, [bookingDate, id]);

    const handleBook = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!selectedSlot || !bookingDate) return;

        setBookingLoading(true);
        // Redirect to Checkout Page
        const params = new URLSearchParams({
            doctorId: id as string,
            date: bookingDate,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            reason: reason
        });
        
        router.push(`/checkout?${params.toString()}`);
        setBookingLoading(false);
    };

    const handleCall = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (doctor?.user?._id) {
            router.push(`/messages?userId=${doctor.user._id}&autoCall=true`);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#6EB0D9]"><Loader2 className="animate-spin text-white w-10 h-10" /></div>;
    if (!doctor) return <div className="p-8 text-center text-white bg-[#6EB0D9] h-screen">Doctor not found</div>;

    return (
        <div className="min-h-screen bg-[#6EB0D9] relative font-sans">
            {/* Blue Header Section */}
            <div className="pt-8 px-6 pb-32">
                <div className="flex justify-between items-center text-white mb-6">
                    <button onClick={() => router.back()} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="text-lg font-medium opacity-90">Doctor Details</div>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* White Content Card */}
            <div className="bg-white rounded-t-[2.5rem] min-h-[calc(100vh-100px)] px-6 pt-16 pb-28 relative shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                
                {/* Floating Doctor Image */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                        <img 
                            src={doctor.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor._id}`} 
                            alt={`Dr. ${doctor.user.firstName}`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Doctor Info */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">
                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                    </h1>
                    <p className="text-gray-500 font-medium mb-1">
                        {doctor.specialization} • {doctor.hospital || "City General Hospital"}
                    </p>
                    
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-slate-700">{doctor.averageRating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">({doctor.totalReviews} reviews)</span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">{doctor.experience} yrs</p>
                        <p className="text-xs text-slate-400">Experience</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">${doctor.fees}</p>
                        <p className="text-xs text-slate-400">Consultation</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">800m</p>
                        <p className="text-xs text-slate-400">Distance</p>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">About Doctor</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        {doctor.bio}
                        Dr. {doctor.user.firstName} is one of the best doctors in the Hospital. She has saved more than 1000 patients in the past 3 years. She has also received many awards from domestic and abroad as the best doctor.
                    </p>
                </div>

                {/* Booking Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Book Appointment</h3>
                    
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-bold text-slate-700">Select Date</label>
                        <Input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingDate}
                            onChange={(e) => {
                                setBookingDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {bookingDate && (
                        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <label className="mb-3 block text-sm font-bold text-slate-700">Available Slots</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {availableSlots.length > 0 ? availableSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        disabled={slot.isBooked}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                                            selectedSlot?.startTime === slot.startTime 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                                : slot.isBooked 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                        }`}
                                    >
                                        {slot.startTime}
                                    </button>
                                )) : (
                                    <p className="col-span-full text-sm text-gray-500 italic">No slots available for this date.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedSlot && (
                        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                             <label className="mb-3 block text-sm font-bold text-slate-700">Reason for Visit</label>
                             <Textarea 
                                placeholder="Briefly describe your problem..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="min-h-[100px] bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
                <div className="max-w-6xl mx-auto flex gap-4 items-center">
                    <button 
                        onClick={handleCall}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 text-[#6EB0D9] hover:bg-slate-50 transition-colors"
                    >
                        <Phone className="w-6 h-6" />
                    </button>
                    <Button 
                        onClick={handleBook}
                        disabled={!selectedSlot || !bookingDate || bookingLoading}
                        className="flex-1 h-14 rounded-2xl bg-[#6EB0D9] hover:bg-[#5da0c9] text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {bookingLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Make an Appointment"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
