"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    isConnected: boolean;
    call: { isReceivingCall: boolean; from: string; name: string; signal: any; callType: 'video' | 'audio' } | null;
    callAccepted: boolean;
    callEnded: boolean;
    myVideo: React.RefObject<HTMLVideoElement | null>;
    userVideo: React.RefObject<HTMLVideoElement | null>;
    stream: MediaStream | null;
    name: string;
    setName: (name: string) => void;
    me: string;
    answerCall: () => void;
    callUser: (id: string, callType: 'video' | 'audio') => void;
    leaveCall: () => void;
    toggleAudio: (value: boolean) => void;
    toggleVideo: (value: boolean) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
    isConnected: false,
    call: null,
    callAccepted: false,
    callEnded: false,
    myVideo: { current: null },
    userVideo: { current: null },
    stream: null,
    name: '',
    setName: () => {},
    me: '',
    answerCall: () => {},
    callUser: () => {},
    leaveCall: () => {},
    toggleAudio: () => {},
    toggleVideo: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Call State
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState<{ isReceivingCall: boolean; from: string; name: string; signal: any; callType: 'video' | 'audio' } | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<RTCPeerConnection | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:3001', {
                auth: { userId: user._id },
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log('[SOCKET] Connected to server. Socket ID:', newSocket.id);
                setIsConnected(true);
                setMe(newSocket.id as string);
            });

            newSocket.on('disconnect', (reason) => {
                console.warn('[SOCKET] Disconnected:', reason);
                setIsConnected(false);
            });

            newSocket.on('connect_error', (err) => {
                console.error('[SOCKET] Connection Error:', err.message);
            });

            newSocket.on('user_online', (data: { userId: string }) => {
                 setOnlineUsers(prev => [...prev, data.userId]);
            });

            newSocket.on('call_accepted', async (signal) => {
                console.log('[CALL] Call Accepted event received');
                setCallAccepted(true);
                if (connectionRef.current) {
                    await connectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                    // Process queued candidates
                    while (iceCandidatesQueue.current.length > 0) {
                        const candidate = iceCandidatesQueue.current.shift();
                        if (candidate) {
                            console.log('[ICE] Adding queued candidate');
                            await connectionRef.current.addIceCandidate(candidate);
                        }
                    }
                }
            });

            newSocket.on('ice_candidate', async (candidate) => {
                console.log('[ICE] Received candidate');
                if (connectionRef.current) {
                    if (connectionRef.current.remoteDescription) {
                        await connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } else {
                        // Queue candidate if remote description not set
                        console.log('[ICE] Queuing candidate (Remote description pending)');
                        iceCandidatesQueue.current.push(new RTCIceCandidate(candidate));
                    }
                }
            });

            newSocket.on('call_user', (data: { from: string; name: string; signal: any; callType: 'video' | 'audio' }) => {
                console.log('[CALL] Incoming call from:', data.name, data.from, 'Type:', data.callType);
                setCall({ isReceivingCall: true, from: data.from, name: data.name, signal: data.signal, callType: data.callType || 'video' });
            });

            setSocket(newSocket);
            
            // Get user media
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = currentStream;
                    }
                })
                .catch(err => console.error("Failed to get media:", err));

            return () => {
                newSocket.disconnect();
                if (connectionRef.current) {
                    connectionRef.current.close();
                }
            };
        }
    }, [user]);

    const answerCall = async () => {
        setCallEnded(false);
        setCallAccepted(true);
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        connectionRef.current = peer;

        if (stream) {
            // Adjust local video track based on incoming call type
            if (call?.callType === 'audio') {
                 stream.getVideoTracks().forEach(track => track.enabled = false);
            } else {
                 stream.getVideoTracks().forEach(track => track.enabled = true);
            }
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        peer.ontrack = (event) => {
            if (userVideo.current) {
                userVideo.current.srcObject = event.streams[0];
            }
        };

        peer.onicecandidate = (event) => {
            if (event.candidate && call) {
                socket?.emit('ice_candidate', { to: call.from, candidate: event.candidate });
            }
        };

        if (call?.signal) {
             await peer.setRemoteDescription(new RTCSessionDescription(call.signal));
             const answer = await peer.createAnswer();
             await peer.setLocalDescription(answer);
             socket?.emit('answer_call', { to: call.from, signal: answer });

             // Process any queued candidates that arrived before we answered
             while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                if (candidate) {
                    await peer.addIceCandidate(candidate);
                }
            }
        }
    };

    const callUser = async (id: string, callType: 'video' | 'audio' = 'video') => {
        setCallEnded(false);
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        connectionRef.current = peer;

        if (stream) {
            // Enable/Disable video track based on call type
            stream.getVideoTracks().forEach(track => track.enabled = (callType === 'video'));
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        peer.ontrack = (event) => {
            if (userVideo.current) {
                userVideo.current.srcObject = event.streams[0];
            }
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('ice_candidate', { to: id, candidate: event.candidate });
            }
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        
        console.log(`[SOCKET] Calling user ${id} from ${user?._id} (${user?.firstName}) Type: ${callType}`);
        
        socket?.emit('call_user', {
            userToCall: id,
            signalData: offer,
            from: user?._id || me,
            name: user?.firstName || 'User',
            callType
        });
        
        // Temporarily set call state so UI knows we are the caller and what type
        setCall({ isReceivingCall: false, from: me, name: 'Calling...', signal: null, callType });
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.close();
            connectionRef.current = null;
        }
        setCall(null);
        setCallAccepted(false);
        // Do not reload to keep the chat active
        // window.location.reload(); 
    };

    const toggleAudio = (value: boolean) => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = value);
        }
    };

    const toggleVideo = (value: boolean) => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = value);
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            onlineUsers, 
            isConnected,
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            answerCall,
            callUser,
            leaveCall,
            toggleAudio, // Exported
            toggleVideo  // Exported
        }}>
            {children}
        </SocketContext.Provider>
    );
};
