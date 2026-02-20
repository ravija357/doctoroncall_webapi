"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { reviewService } from "@/services/review.service";
import { Appointment } from "@/types";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Stethoscope,
  ChevronLeft,
  Star,
  MessageSquare
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageHelper";

export default function AppointmentsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    const [actionAppointmentId, setActionAppointmentId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'cancel' | 'delete' | null>(null);

    // Rating State
    const [ratingAppointment, setRatingAppointment] = useState<Appointment | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAppointments();
        }
    }, [isAuthenticated]);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getMyAppointments();
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionAppointmentId(id);
        setActionType('delete');
    };

    const handleCancelClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActionAppointmentId(id);
        setActionType('cancel');
    };

    const confirmAction = async () => {
        if (!actionAppointmentId || !actionType) return;

        try {
            if (actionType === 'delete') {
                await appointmentService.deleteAppointment(actionAppointmentId);
                setAppointments(prev => prev.filter(a => a._id !== actionAppointmentId));
            } else if (actionType === 'cancel') {
                await appointmentService.cancelAppointment(actionAppointmentId);
                setAppointments(prev => prev.map(a => 
                    a._id === actionAppointmentId ? { ...a, status: 'cancelled' } : a
                ));
            }
        } catch (err) {
            console.error(`Failed to ${actionType} appointment`, err);
            alert(`Failed to ${actionType} appointment`);
        } finally {
            setActionAppointmentId(null);
            setActionType(null);
        }
    };

    const cancelAction = () => {
        setActionAppointmentId(null);
        setActionType(null);
    };

    const submitRating = async () => {
        if (!ratingAppointment || ratingValue === 0) return;
        setSubmittingReview(true);
        try {
            // Optimistic update: mark as reviewed by setting status to something or removing from list (if history)
            // Or just close the modal and let the socket/refetch handle it. The 'delay' is likely the modal sticking around.
            const tempApptId = ratingAppointment._id;
            
            // Just close the modal first so it feels instant
            closeRatingModal();
            
            await reviewService.createReview({
                doctorId: ratingAppointment.doctor._id,
                rating: ratingValue,
                comment: reviewComment
            });
            // We can optionally show a small toast here instead of blocking alert
            console.log("Review submitted successfully");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const closeRatingModal = () => {
        setRatingAppointment(null);
        setRatingValue(0);
        setHoverRating(0);
        setReviewComment("");
    };

    // Filter appointments based on tab
    const filteredAppointments = appointments.filter(apt => {
        const isPast = new Date(apt.date) < new Date() && apt.status === 'completed';
        const isCancelled = apt.status === 'cancelled';
        
        if (activeTab === 'history') {
            return isPast || isCancelled;
        } else {
            return !isPast && !isCancelled;
        }
    });

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-slate-800">My Appointments</h1>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-8 w-full max-w-md backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 ${
                            activeTab === 'current'
                                ? 'bg-[#6EB0D9] text-white shadow-lg shadow-blue-200'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Current
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 ${
                            activeTab === 'history'
                                ? 'bg-white text-slate-800 shadow-md'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        History
                    </button>
                </div>

                {/* Appointments List */}
                <div className="space-y-6">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt) => (
                                <AppointmentCard 
                                    key={apt._id} 
                                    appointment={apt} 
                                    onDelete={activeTab === 'history' ? (e) => handleDeleteClick(apt._id, e) : undefined}
                                    onCancel={(e) => handleCancelClick(apt._id, e)}
                                    onRate={() => {
                                        setRatingAppointment(apt);
                                    }}
                                />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">No appointments found</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                {activeTab === 'current' 
                                    ? "You don't have any upcoming appointments." 
                                    : "You haven't completed any appointments yet."}
                            </p>
                            {activeTab === 'current' && (
                                <Link href="/doctors" className="inline-block mt-6">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200">
                                        Book Now
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirmation Modal */}
                {actionAppointmentId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {actionType === 'delete' ? 'Delete History?' : 'Cancel Appointment?'}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                {actionType === 'delete' 
                                    ? "This will remove the appointment from your history. This action cannot be undone." 
                                    : "Are you sure you want to cancel? This will free up the slot for other patients."}
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button 
                                    onClick={cancelAction} 
                                    variant="ghost" 
                                    className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                                >
                                    No, Keep it
                                </Button>
                                <Button 
                                    onClick={confirmAction} 
                                    className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 rounded-xl"
                                >
                                    {actionType === 'delete' ? 'Delete' : 'Yes, Cancel'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rating Modal */}
                {ratingAppointment && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold font-serif text-slate-800 mb-2">Rate your experience</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                How was your appointment with <span className="font-bold">Dr. {ratingAppointment.doctor.user.lastName}</span>?
                            </p>
                            
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingValue(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${
                                                star <= (hoverRating || ratingValue)
                                                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" 
                                                    : "text-slate-200"
                                            } transition-colors duration-150`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-400" /> Optional Comment
                                </label>
                                <textarea 
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share details of your own experience at this doctor..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none h-24 text-slate-700 placeholder:text-slate-400"
                                    maxLength={500}
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button 
                                    onClick={closeRatingModal} 
                                    variant="ghost" 
                                    disabled={submittingReview}
                                    className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={submitRating} 
                                    disabled={ratingValue === 0 || submittingReview}
                                    className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 rounded-xl px-8"
                                >
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AppointmentCard({ appointment, onDelete, onCancel, onRate }: { appointment: Appointment, onDelete?: (e: React.MouseEvent) => void, onCancel?: (e: React.MouseEvent) => void, onRate?: () => void }) {
    const statusColors = {
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        pending: "bg-yellow-100 text-yellow-700",
        completed: "bg-slate-100 text-slate-700",
    };

    const statusIcon = {
        confirmed: CheckCircle2,
        cancelled: XCircle,
        pending: AlertCircle,
        completed: CheckCircle2,
    };

    const StatusIcon = statusIcon[appointment.status];

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Date Side */}
                <div className="flex md:flex-col items-center justify-center min-w-[100px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 gap-2">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
                   </span>
                   <span className="text-4xl font-serif font-bold text-slate-800">
                        {new Date(appointment.date).getDate()}
                   </span>
                   <span className="text-sm font-bold text-slate-400">
                        {new Date(appointment.date).getFullYear()}
                   </span>
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <Link href={`/doctors/${appointment.doctor._id}`} className="flex gap-4 group/doctor cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-offset-2 transition-all group-hover/doctor:ring-2 ring-blue-400">
                                <img 
                                    src={getImageUrl(appointment.doctor.user.image, appointment.doctor._id, appointment.doctor.user.updatedAt)} 
                                    alt="Doctor" 
                                    className="w-full h-full object-cover transition-transform group-hover/doctor:scale-110"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 group-hover/doctor:text-blue-600 transition-colors">
                                    Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                    <Stethoscope className="w-4 h-4 text-blue-400" />
                                    <span>{appointment.doctor.specialization}</span>
                                </div>
                            </div>
                        </Link>
                        
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${statusColors[appointment.status]}`}>
                            <StatusIcon className="w-4 h-4" />
                            {appointment.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.startTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Place</p>
                                <p className="text-sm font-bold text-slate-700">City Clinic</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 gap-2">
                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && onCancel && (
                            <Button 
                                variant="destructive" 
                                onClick={onCancel}
                                className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-red-100 hover:shadow-red-200 transition-all opacity-0 group-hover:opacity-100"
                            >
                                Cancel
                            </Button>
                        )}
                        
                        {(appointment.status === 'completed' || appointment.status === 'confirmed') && onRate && (
                            <Button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRate(); }}
                                className="rounded-xl h-10 px-6 font-bold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hover:scale-105 shadow-sm transition-all z-10"
                            >
                                <Star className="w-4 h-4 mr-2 fill-yellow-900" /> Rate Doctor
                            </Button>
                        )}
                        
                        {onDelete && (
                            <Button 
                                variant="ghost" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e); }}
                                className="rounded-xl h-10 px-6 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all z-10"
                            >
                                Delete History
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
