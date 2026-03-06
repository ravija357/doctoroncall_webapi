"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/app/components/AuthGuard";
import api from "@/services/api";
import { User } from "@/types";
import { Loader2, Trash2, Shield, User as UserIcon, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageBackground from '@/components/ui/PageBackground';
import { adminService } from "@/services/admin.service";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import { getImageUrl } from "@/utils/imageHelper";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: '', userName: '' });

  useEffect(() => {
    fetchUsers();

    const handleSync = () => {
      console.log('[USERS_PAGE] Sync signal received, refreshing...');
      fetchUsers();
    };

    window.addEventListener('admin_user_sync', handleSync);
    window.addEventListener('admin_stats_sync', handleSync);

    return () => {
      window.removeEventListener('admin_user_sync', handleSync);
      window.removeEventListener('admin_stats_sync', handleSync);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      // adminService returns res.data which is the array of users if backend followed standard, 
      // but my backend getDashboardStats returned { success, data }. 
      // Let's check backend getUsers in admin.controller.ts
      setUsers(res || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Could not synchronize user records");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user: User) => {
    setDeleteModal({
      isOpen: true,
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`
    });
  };

  const handleDelete = async () => {
    const { userId } = deleteModal;
    try {
      await adminService.deleteUser(userId);
      toast.success("User clearance revoked");
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteModal({ ...deleteModal, isOpen: false });
    } catch (err) {
      toast.error("Failed to revoke clearance");
    }
  };

  return (
    <AuthGuard role="admin">
      <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
        {/* Subtle Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5" />
        <PageBackground />

        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-screen flex flex-col pt-20">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="mb-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
               <Link href="/admin">
                <motion.button 
                  whileHover={{ x: -5, scale: 1.1 }}
                  className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
               </Link>
               <div>
                 <h1 className="text-5xl font-black text-slate-900 tracking-tight">System Intelligence.</h1>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Global User Control Terminal</p>
               </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Database Connection</span>
            </div>
          </motion.div>

          {/* Table Control Deck - Clean White */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Clearance</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-32 text-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                          <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Synchronizing Data...</span>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u, i) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all">
                              {u.image || u.email ? (
                                <img 
                                  src={getImageUrl(u.image, u._id)} 
                                  alt="" 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u._id}`;
                                  }}
                                />
                              ) : (
                                <UserIcon className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-black text-lg group-hover:text-primary transition-colors">
                                {u.firstName} {u.lastName}
                              </span>
                              <span className="text-slate-400 text-xs font-medium">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.role === 'admin' 
                            ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                            : u.role === 'doctor'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openDeleteModal(u)}
                            className="p-4 bg-slate-50 rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100 hover:border-red-200 transition-all shadow-sm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Dynamic Light Overlay */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <DeleteUserModal
          isOpen={deleteModal.isOpen}
          userName={deleteModal.userName}
          onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
          onConfirm={handleDelete}
        />
      </div>
    </AuthGuard>
  );
}
