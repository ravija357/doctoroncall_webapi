import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CallState } from '@/types/chat';

interface IncomingCallModalProps {
    call: CallState;
    onAnswer: () => void;
    onReject: () => void;
}

export function IncomingCallModal({ call, onAnswer, onReject }: IncomingCallModalProps) {
    if (!call.isReceivingCall || call.callAccepted) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 max-w-sm w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="mb-6 relative">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl overflow-hidden shadow-inner">
                        {call.callerName?.[0] || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                        <Phone className="w-4 h-4" />
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{call.callerName || 'Unknown Caller'}</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">Incoming {call.callType === 'audio' ? 'Audio' : 'Video'} Call...</p>
                
                <div className="flex gap-6 w-full justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Button 
                            onClick={onReject} 
                            variant="outline" 
                            className="w-14 h-14 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all shadow-lg shadow-red-100"
                        >
                            <Phone className="w-6 h-6 rotate-[135deg]" />
                        </Button>
                        <span className="text-xs font-semibold text-slate-400">Decline</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <Button 
                            onClick={onAnswer} 
                            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white hover:scale-110 transition-all shadow-lg shadow-green-200 animate-pulse"
                        >
                            <Phone className="w-6 h-6" />
                        </Button>
                        <span className="text-xs font-semibold text-slate-400">Answer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
