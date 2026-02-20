"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doctorService } from "@/services/doctor.service";
import { Doctor } from "@/types";
import { Star, ChevronLeft, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DoctorReviewsPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'doctor') {
                router.push('/login');
                return;
            }
            fetchData();
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchData = async () => {
        try {
            const profile = await doctorService.getProfile();
            setDoctorProfile(profile);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    const reviews = doctorProfile?.reviews || [];
    const rating = doctorProfile?.averageRating || 0;
    const totalReviews = doctorProfile?.totalReviews || 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/doctor/dashboard" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 font-serif">Patient Reviews</h1>
                        <p className="text-slate-500 mt-1">See what your patients are saying about you</p>
                    </div>
                </div>

                {/* Rating Overview */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex items-center justify-center flex-col text-center">
                        <div className="text-5xl font-black text-slate-800 font-serif mb-2">{rating.toFixed(1)}</div>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`w-6 h-6 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Average Rating</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex items-center justify-center flex-col text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-800 font-serif mb-1">{totalReviews}</div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Reviews</p>
                    </div>
                </div>


                {/* Reviews Grid */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review: any, index: number) => (
                            <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{review.patientName || 'Anonymous Patient'}</h4>
                                            <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-full">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold">No reviews yet</p>
                        <p className="text-slate-400 text-sm mt-1">Patient reviews will appear here once you complete appointments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
