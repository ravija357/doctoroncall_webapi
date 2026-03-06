"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function DeleteUserModal({ isOpen, onClose, onConfirm, userName }: DeleteUserModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-8 overflow-hidden"
          >
            {/* Warning Background Icon */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Authorize Termination?
              </h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                You are about to permanently revoke clearance for <span className="text-slate-900 font-black">"{userName}"</span>. 
                This will remove all associated data from the central node.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Terminate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
