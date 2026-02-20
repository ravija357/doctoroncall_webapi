import React, { useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CallState, ChatContact } from '@/types/chat';

interface CallOverlayProps {
    call: CallState;
    activeContact: ChatContact | null;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onLeaveCall: () => void;
    myVideoRef: React.RefObject<HTMLVideoElement | null>;
    userVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export function CallOverlay({
    call,
    activeContact,
    isAudioEnabled,
    isVideoEnabled,
    onToggleAudio,
    onToggleVideo,
    onLeaveCall,
    myVideoRef,
    userVideoRef
}: CallOverlayProps) {
    if (!call.isCalling && (!call.callAccepted || call.callEnded)) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col animate-in fade-in duration-300">
            <div className="relative flex-1 bg-slate-800 flex items-center justify-center overflow-hidden group">
                
                {/* Remote Video or Audio Avatar */}
                {call.callType === 'audio' ? (
                    <div className="flex flex-col items-center justify-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-2xl shadow-blue-500/30">
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white/20">
                                {activeContact?.image ? (
                                    <img src={activeContact.image} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-6xl md:text-8xl font-bold text-white/90">
                                        {(activeContact?.name || call.callerName || "U")[0]}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeContact?.name || call.callerName}</h2>
                            <p className="text-blue-300 text-lg animate-pulse">Audio Call in Progress...</p>
                        </div>
                    </div>
                ) : (
                    <video 
                        playsInline 
                        ref={userVideoRef} 
                        autoPlay 
                        className="w-full h-full object-cover" 
                    />
                )}
                
                {/* Local Video (Floating PiP) - Only show if video call */}
                {call.callType === 'video' && (
                    <div className="absolute top-4 right-4 w-32 h-44 md:w-48 md:h-64 bg-slate-700 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
                        <video 
                            playsInline 
                            muted 
                            ref={myVideoRef} 
                            autoPlay 
                            className="w-full h-full object-cover mirrored" 
                        />
                    </div>
                )}

                {/* Call Info Overlay (If Video) */}
                {call.callType === 'video' && (
                    <div className="absolute top-8 left-8 text-white drop-shadow-md">
                        <h2 className="text-2xl font-bold font-serif">{activeContact?.name || call.callerName || "Unknown"}</h2>
                        <p className="text-blue-200 text-sm font-medium animate-pulse">
                            {call.callAccepted ? "00:00" : "Calling..."}
                        </p>
                    </div>
                )}

                {/* Controls Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 px-8 bg-slate-900/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl transition-all translate-y-0 opacity-100 group-hover:translate-y-0">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`rounded-full w-12 h-12 transition-all border ${
                            isAudioEnabled 
                                ? 'bg-white/10 text-white hover:bg-white/20 border-white/5' 
                                : 'bg-red-500/80 text-white hover:bg-red-600 border-red-500'
                        }`}
                        onClick={onToggleAudio}
                    >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`rounded-full w-12 h-12 transition-all border ${
                            isVideoEnabled 
                                ? 'bg-white/10 text-white hover:bg-white/20 border-white/5' 
                                : 'bg-red-500/80 text-white hover:bg-red-600 border-red-500'
                        }`}
                        onClick={onToggleVideo}
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <Button 
                        onClick={onLeaveCall} 
                        variant="destructive" 
                        size="icon" 
                        className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40 transform hover:scale-110 transition-all"
                    >
                        <Phone className="w-6 h-6 rotate-[135deg]" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
