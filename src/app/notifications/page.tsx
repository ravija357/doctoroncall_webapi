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
            default: return <Info className="w-5 h-5 text-primary" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-slate-400 font-bold tracking-tight animate-pulse">Refining your updates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Header Section */}
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={fadeUp}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
                >
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="p-5 bg-white rounded-[2rem] shadow-2xl border border-primary/10 flex items-center justify-center group overflow-hidden">
                                <Bell className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {notifications.some(n => !n.isRead) && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Notifications</h1>
                            <p className="text-primary font-bold text-[10px] mt-3 tracking-[0.2em] uppercase">Private Activity Feed</p>
                        </div>
                    </div>

                    {notifications.length > 0 && (
                        <motion.button 
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => markAllAsRead()}
                            className="text-[10px] font-black text-white px-8 py-4 bg-primary hover:bg-primary-hover rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:shadow-inner tracking-[0.1em]"
                        >
                            <CheckCheck className="w-4 h-4" />
                            MARK ALL AS READ
                        </motion.button>
                    )}
                </motion.div>

                {/* Main Content Area */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative"
                >
                    {/* Vertical line for the timeline feel */}
                    <div className="absolute left-10 top-0 bottom-0 w-px bg-primary/10 hidden md:block" />

                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-24 bg-white rounded-[3rem] border border-primary/10 shadow-2xl shadow-primary/5 flex flex-col items-center"
                            >
                                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/[0.02]">
                                    <Bell className="w-10 h-10 text-primary/20" />
                                </div>
                                <h3 className="text-slate-900 font-black text-2xl mb-3">All caught up!</h3>
                                <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                                    Your notification center is clear. We'll alert you here when something important happens.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {notifications.map((notification) => (
                                    <motion.div 
                                        key={notification._id} 
                                        variants={fadeUp}
                                        layout
                                        className={`group relative flex gap-6 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${
                                            notification.isRead 
                                            ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/[0.03]' 
                                            : 'bg-white border-primary/20 shadow-2xl shadow-primary/[0.08] ring-1 ring-primary/5 hover:border-primary/40'
                                        }`}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    >
                                        {/* Icon Container */}
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                            notification.isRead 
                                            ? 'bg-slate-50 text-slate-400' 
                                            : 'bg-primary/10 text-primary ring-2 ring-primary/20'
                                        }`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    {!notification.isRead && (
                                                        <span className="px-2.5 py-0.5 bg-primary text-[10px] font-black text-white rounded-full tracking-wider uppercase">New Update</span>
                                                    )}
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-base leading-relaxed tracking-tight ${
                                                notification.isRead 
                                                ? 'text-slate-500 font-medium' 
                                                : 'text-slate-900 font-bold'
                                            }`}>
                                                {notification.message}
                                            </p>
                                            
                                            {notification.link && (
                                                <Link 
                                                    href={notification.link}
                                                    className="inline-flex items-center gap-2 mt-4 text-xs font-black text-primary hover:text-primary-hover transition-colors group/link"
                                                >
                                                    EXPLORE ACTION
                                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                                </Link>
                                            )}
                                        </div>

                                        {/* Read Status Shadow */}
                                        {!notification.isRead && (
                                            <div className="absolute top-1/2 -translate-y-1/2 right-8 hidden md:block">
                                                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(112,192,250,0.8)] animate-pulse" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
