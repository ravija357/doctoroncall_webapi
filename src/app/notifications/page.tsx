"use client";

import { useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
    const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <Check className="w-5 h-5 text-emerald-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                        <p className="text-slate-500 text-sm">Manage your activity and alerts</p>
                    </div>
                </div>
                {notifications.length > 0 && (
                    <button 
                        onClick={() => markAllAsRead()}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-bold text-lg">No notifications yet</h3>
                        <p className="text-slate-500">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification._id} 
                            className={`group relative p-4 rounded-xl border transition-all duration-200 ${notification.isRead ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                            <div className="flex gap-4">
                                <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.isRead ? 'bg-slate-50' : 'bg-white shadow-sm'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    
                                    {notification.link && (
                                        <Link 
                                            href={notification.link}
                                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                                        >
                                            View Details
                                            <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                </div>
                                {!notification.isRead && (
                                    <div className="self-center">
                                        <span className="h-2 w-2 rounded-full bg-blue-500 block" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
