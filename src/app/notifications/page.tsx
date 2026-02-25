"use client";

import { useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

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
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            {/* Header */}
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeUp}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
            >
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-2xl ring-1 ring-primary/20">
                        <Bell className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Stay updated with your latest activity</p>
                    </div>
                </div>
                {notifications.length > 0 && (
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => markAllAsRead()}
                        className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-2 px-5 py-2.5 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all border border-primary/10"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </motion.button>
                )}
            </motion.div>

            {/* List */}
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-4"
            >
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-black text-xl mb-2 tracking-tight">All clear!</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">No new notifications at the moment. We'll alert you when something happens.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notification) => (
                            <motion.div 
                                key={notification._id} 
                                variants={fadeUp}
                                layout
                                className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                    notification.isRead 
                                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30' 
                                    : 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/20 shadow-sm'
                                }`}
                                onClick={() => !notification.isRead && markAsRead(notification._id)}
                            >
                                {/* Animated active indicator */}
                                {!notification.isRead && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                )}

                                <div className="flex gap-5">
                                    <div className={`mt-0.5 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300 ${
                                        notification.isRead 
                                        ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400' 
                                        : 'bg-white dark:bg-slate-800 shadow-sm text-primary ring-1 ring-primary/10'
                                    }`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                                            <p className={`text-sm leading-relaxed ${
                                                notification.isRead 
                                                ? 'text-slate-600 dark:text-slate-400' 
                                                : 'text-slate-900 dark:text-white font-bold'
                                            }`}>
                                                {notification.message}
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap pt-1">
                                                {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                        
                                        {notification.link && (
                                            <Link 
                                                href={notification.link}
                                                className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-primary hover:text-primary-hover group/link transition-colors"
                                            >
                                                View Details
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                                            </Link>
                                        )}
                                    </div>
                                    {!notification.isRead && (
                                        <div className="self-center flex-shrink-0">
                                            <motion.span 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="h-2.5 w-2.5 rounded-full bg-primary block" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
