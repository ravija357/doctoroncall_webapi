import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface DeleteMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (type: 'me' | 'everyone') => void;
    title?: string;
    description?: string;
}

export function DeleteMessageModal({ isOpen, onClose, onDelete, title = "Delete Message?", description = "Choose how you would like to delete this message." }: DeleteMessageModalProps) {
    if (!isOpen) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-center">{title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-slate-500">
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                
                <div className="grid grid-cols-1 divide-y divide-slate-100 border-t border-slate-100">
                    <button 
                        onClick={() => { onDelete('me'); onClose(); }}
                        className="p-4 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                        Delete for me
                    </button>
                    <button 
                        onClick={() => { onDelete('everyone'); onClose(); }}
                        className="p-4 hover:bg-red-50 text-red-600 font-medium transition-colors cursor-pointer"
                    >
                        Delete for everyone
                    </button>
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50">
                     <button 
                        onClick={onClose} 
                        className="w-full py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-200/50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
