"use client";

import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface JitsiCallModalProps {
    roomName: string;
    displayName: string;
    onClose: () => void;
}

export function JitsiCallModal({ roomName, displayName, onClose }: JitsiCallModalProps) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col">
                
                {/* Header / Controls overlay could go here if needed, but Jitsi has its own */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[60] bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 text-white">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <span className="ml-3 font-medium">Connecting to secure call...</span>
                    </div>
                )}

                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: false,
                        disableThirdPartyRequests: false,
                        prejoinPageEnabled: false,
                        disableDeepLinking: true,
                        showPromotionalClosePage: false,
                    }}
                    interfaceConfigOverwrite={{
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'sharedvideo', 
                            'settings', 'raisehand', 'videoquality', 'filmstrip', 'feedback', 
                            'stats', 'shortcuts', 'tileview', 'videobackgroundblur', 'download', 
                            'help', 'mute-everyone'
                        ],
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                    }}
                    userInfo={{
                        displayName: displayName,
                        email: ""
                    }}
                    onApiReady={(externalApi) => {
                        setLoading(false);
                        // internal api handling
                        // externalApi.on('videoConferenceLeft', () => {
                        //     onClose();
                        // });
                        
                        // Force iframe focus
                        externalApi.on('participantJoined', () => {
                            // handle participant joined
                        });
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>
        </div>
    );
}
