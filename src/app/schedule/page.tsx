"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doctorService } from '@/services/doctor.service';
import { Schedule, Doctor } from '@/types';
import { Calendar, Clock, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Local state for schedule editing
    const [schedules, setSchedules] = useState<Partial<Schedule>[]>([]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await doctorService.getProfile();
                setDoctor(data);
                
                // Initialize schedules with defaults if empty, or use existing
                if (data.schedules && data.schedules.length > 0) {
                    setSchedules(data.schedules);
                } else {
                    // Default to Monday-Friday 9-5
                    const defaults = DAYS.slice(0, 5).map(day => ({
                        day,
                        startTime: '09:00',
                        endTime: '17:00',
                        isOff: false
                    }));
                    setSchedules(defaults);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load schedule");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'doctor') {
            fetchProfile();
        }
    }, [isAuthenticated, authLoading, user]);

    const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setSchedules(newSchedules);
    };

    const handleAddDay = () => {
        setSchedules([...schedules, { day: 'Monday', startTime: '09:00', endTime: '17:00', isOff: false }]);
    };

    const handleRemoveDay = (index: number) => {
        const newSchedules = [...schedules];
        newSchedules.splice(index, 1);
        setSchedules(newSchedules);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await doctorService.updateSchedule(schedules);
            toast.success("Schedule updated successfully");
        } catch (error) {
            console.error("Failed to save schedule", error);
            toast.error("Failed to update schedule");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
             <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl pt-8 pb-16 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
                    <p className="text-gray-500 mt-2">Set your availability for appointments.</p>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
                >
                    {saving ? 'Saving...' : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-4">
                    {schedules.map((schedule, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border ${schedule.isOff ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-200'}`}>
                            
                            {/* Day Selector */}
                            <div className="w-full md:w-40">
                                <select 
                                    value={schedule.day}
                                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                                    className="w-full font-bold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                                >
                                    {DAYS.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Range */}
                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="time" 
                                        value={schedule.startTime} 
                                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                                        disabled={schedule.isOff}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium disabled:text-gray-400"
                                    />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="time" 
                                        value={schedule.endTime} 
                                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                                        disabled={schedule.isOff}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-medium disabled:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
                                    <input 
                                        type="checkbox" 
                                        checked={schedule.isOff}
                                        onChange={(e) => handleScheduleChange(index, 'isOff', e.target.checked)}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    Day Off
                                </label>
                                <button 
                                    onClick={() => handleRemoveDay(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <button 
                        onClick={handleAddDay}
                        className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Day
                    </button>
                </div>
            </div>
        </div>
    );
}
