"use client";

import { useNotifications } from '@/context/NotificationContext';
import { format } from 'date-fns';
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageBackground from '@/components/ui/PageBackground';

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-slate-400 font-bold tracking-tight animate-pulse uppercase text-[10px] tracking-[0.2em]">Synchronizing Stream...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Subtle Light Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5" />
            <PageBackground />

            <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl pt-24">
                {/* Header Section */}
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={fadeUp}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                >
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-200 flex items-center justify-center group overflow-hidden">
                                <Bell className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {notifications.some(n => !n.isRead) && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-primary border-2 border-white shadow-sm"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Activity Hub.</h1>
                            <p className="text-slate-400 font-bold text-[10px] mt-3 tracking-[0.2em] uppercase">Private Real-time Feed</p>
                        </div>
                    </div>

                    {notifications.length > 0 && (
                        <motion.button 
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => markAllAsRead()}
                            className="text-[10px] font-black text-white px-10 py-5 bg-primary hover:bg-primary-hover rounded-2xl transition-all shadow-xl shadow-primary/30 flex items-center gap-3 tracking-[0.1em]"
                        >
                            <CheckCheck className="w-4 h-4" />
                            AUTHORIZE READ ALL
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
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-32 bg-white rounded-[4rem] border border-slate-200 shadow-2xl flex flex-col items-center"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mb-8 shadow-sm group hover:scale-110 transition-all duration-500">
                                    <Bell className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform" />
                                </div>
                                <h3 className="text-slate-900 font-black text-3xl mb-4 tracking-tight">Stream Clear.</h3>
                                <p className="text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
                                    No pending alerts. Your administrative channel is currently silent.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {notifications.map((notification) => (
                                    <motion.div 
                                        key={notification._id} 
                                        variants={fadeUp}
                                        layout
                                        className={`group relative flex gap-8 p-8 rounded-[3rem] border transition-all duration-500 cursor-pointer ${
                                            notification.isRead 
                                            ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-2xl' 
                                            : 'bg-white border-primary/20 shadow-xl shadow-primary/5 hover:border-primary/40'
                                        }`}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    >
                                        {/* Icon Container */}
                                        <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                                            notification.isRead 
                                            ? 'bg-slate-50 text-slate-300 border border-slate-50' 
                                            : 'bg-primary/5 text-primary border border-primary/10 ring-4 ring-primary/[0.02]'
                                        }`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4 mb-3">
                                                {!notification.isRead && (
                                                    <span className="px-3 py-1 bg-primary text-[9px] font-black text-white rounded-full tracking-widest uppercase shadow-lg shadow-primary/20">Active</span>
                                                )}
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                                </span>
                                            </div>
                                            
                                            <p className={`text-lg leading-relaxed tracking-tight ${
                                                notification.isRead 
                                                ? 'text-slate-400 font-medium' 
                                                : 'text-slate-900 font-black'
                                            }`}>
                                                {notification.message}
                                            </p>
                                            
                                            {notification.link && (
                                                <Link 
                                                    href={notification.link}
                                                    className="inline-flex items-center gap-3 mt-6 text-xs font-black text-primary hover:text-primary-hover transition-all group/link"
                                                >
                                                    <span className="uppercase tracking-widest">Execute Action</span>
                                                    <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                                </Link>
                                            )}
                                        </div>
                                        {/* Read Status Pulsar */}
                                        {!notification.isRead && (
                                            <div className="absolute top-1/2 -translate-y-1/2 right-10 hidden md:block">
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

            {/* Dynamic Light Overlay */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}
