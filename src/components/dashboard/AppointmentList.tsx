"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointment.service";
import { Appointment } from "@/types";
import { Calendar, Clock, MapPin, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        appointmentService.getMyAppointments()
            .then(data => setAppointments(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-24 animate-pulse rounded-2xl bg-slate-100"></div>;

    if (appointments.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <p className="text-slate-500">No upcoming appointments.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Upcoming Appointments</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((apt) => (
                    <Card key={apt._id} className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-800">Dr. {apt.doctor.user.firstName} {apt.doctor.user.lastName}</h3>
                                    <p className="text-sm text-blue-600">{apt.doctor.specialization}</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                </span>
                            </div>
                            
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{apt.startTime} - {apt.endTime}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
