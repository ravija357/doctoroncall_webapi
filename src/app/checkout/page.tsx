"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { doctorService } from "@/services/doctor.service";
import { appointmentService } from "@/services/appointment.service";
import { Doctor } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/imageHelper";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const reason = searchParams.get('reason');

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [esewaId, setEsewaId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctorId) {
            doctorService.getDoctorById(doctorId as string).then(setDoctor);
        }
    }, [doctorId]);

    const handlePayment = async () => {
        if (!user || !doctor || !date || !startTime || !endTime) return;
        
        // Simulate eSewa Payment
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 2000)); // Fake delay
            
            await appointmentService.createAppointment({
                doctorId: doctorId!,
                date: date!,
                startTime: startTime!,
                endTime: endTime!,
                reason: reason || "Consultation"
            });
            
            alert('Payment Successful!');
            router.push('/dashboard');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Payment Failed');
        } finally {
            setLoading(false);
        }
    };

    if (!doctor || !date) return <div className="min-h-screen flex items-center justify-center">Loading checkout details...</div>;

    const fees = doctor.fees;
    const tax = 0;
    const delivery = 0;
    const total = fees + tax + delivery;

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden">

                {/* Doctor Card - Summary */}
                <div className="px-6 mb-8">
                     <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 flex items-center gap-4 border border-slate-50">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <img src={getImageUrl(doctor.user.image, doctor._id)} alt="Doctor" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-800 truncate">Dr. {doctor.user.firstName} {doctor.user.lastName}</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide truncate">{doctor.qualifications && doctor.qualifications.length > 0 ? doctor.qualifications[0] : "Specialist"}</p>
                        </div>
                    </div>
                    <p className="text-xs text-center text-slate-400 mt-4">Opening Timings: 9:00am - 5:00pm.</p>
                </div>

                {/* Bill Details */}
                <div className="px-8 space-y-4 mb-10">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                        <span>Product Amount:</span>
                        <span>NPR {fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                        <span>Tax Amount:</span>
                        <span>NPR {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                        <span>Delivery Charge:</span>
                        <span>NPR {delivery.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-800 mt-6 pt-2">
                        <span>Total Amount:</span>
                        <span>NPR {total.toFixed(2)}</span>
                    </div>
                </div>

                {/* eSewa Form */}
                <div className="px-8 pb-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-bold text-slate-900 mb-2">eSewa Id:</label>
                            <Input 
                                value={esewaId}
                                onChange={(e) => setEsewaId(e.target.value)}
                                className="h-14 rounded-2xl border-slate-200 bg-white focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-lg px-4"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-slate-900 mb-2">Password:</label>
                            <Input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 rounded-2xl border-slate-200 bg-white focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-lg px-4"
                            />
                        </div>

                        {/* eSewa Logo */}
                        <div className="flex justify-center py-6">
                            <div className="flex items-center justify-center">
                                <img src="/esewa-logo.png" alt="eSewa" className="h-16 object-contain" />
                            </div>
                        </div>

                        <Button 
                            onClick={handlePayment} 
                            disabled={loading || !esewaId || !password}
                            className="w-full h-14 text-xl font-bold bg-[#6EB0D9] hover:bg-[#5a9cbd] text-white rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">Processing...</span>
                            ) : "Pay Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
