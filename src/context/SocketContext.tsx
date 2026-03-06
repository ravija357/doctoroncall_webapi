"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    isConnected: boolean;
    call: { isReceivingCall: boolean; from: string; name: string; signal: any; callType: 'video' | 'audio'; remoteUserId?: string } | null;
    callAccepted: boolean;
    callEnded: boolean;
    jitsiRoom: string | null;
    me: string;
    answerCall: () => void;
    callUser: (id: string, callType: 'video' | 'audio') => void;
    leaveCall: () => void;
    endCall: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: [],
    isConnected: false,
    call: null,
    callAccepted: false,
    callEnded: false,
    jitsiRoom: null,
    me: '',
    answerCall: () => {},
    callUser: () => {},
    leaveCall: () => {},
    endCall: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Call State
    const [me, setMe] = useState('');
    const [call, setCall] = useState<{ isReceivingCall: boolean; from: string; name: string; signal: any; callType: 'video' | 'audio'; remoteUserId?: string } | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [jitsiRoom, setJitsiRoom] = useState<string | null>(null);

    const { user, refreshUser } = useAuth();

    useEffect(() => {
        if (user) {
            // Re-detect the API URL to be safe, especially in dev when switching networks
            let socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                if (hostname !== 'localhost' && hostname !== '127.0.0.1' && socketUrl.includes('localhost')) {
                    socketUrl = `http://${hostname}:3001`;
                } else if ((hostname === 'localhost' || hostname === '127.0.0.1') && !socketUrl.includes('localhost')) {
                    socketUrl = 'http://localhost:3001';
                }
            }

            const newSocket = io(socketUrl, {
                auth: { userId: user._id },
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log('[SOCKET] Connected with ID:', newSocket.id);
                setIsConnected(true);
                setMe(newSocket.id as string);
            });

            newSocket.on('disconnect', (reason) => {
                console.warn('[SOCKET] Disconnected:', reason);
                setIsConnected(false);
            });

            newSocket.on('user_online', (data: { userId: string }) => {
                setOnlineUsers(prev => {
                    if (prev.includes(data.userId)) return prev;
                    return [...prev, data.userId];
                });
            });

            // Remove from online list when they disconnect / log out
            newSocket.on('user_offline', (data: { userId: string }) => {
                setOnlineUsers(prev => prev.filter(id => id !== data.userId));
            });

            // Receive full list of online users on initial connect
            newSocket.on('online_users_list', (userIds: string[]) => {
                setOnlineUsers(userIds);
            });

            newSocket.on('call_accepted', (signal) => {
                console.log('[CALL] Call Accepted', signal);
                setCallAccepted(true);
                // If it was a Jitsi call, make sure room is set (caller already has it)
            });

            newSocket.on('call_user', (data: { from: string; name: string; signal: any; callType: 'video' | 'audio' }) => {
                console.log('[CALL] Incoming call from:', data.name);
                setCall({ isReceivingCall: true, from: data.from, name: data.name, signal: data.signal, callType: data.callType || 'video', remoteUserId: data.from });
            });

            newSocket.on('profile_sync', (data: any) => {
                console.log('[SOCKET] Profile sync signal received', data);
                refreshUser();
            });

            // New Real-time Sync Listeners
            newSocket.on('appointment_sync', () => {
                console.log('[SOCKET] Appointment sync signal received');
                // Could trigger a global refresh or specific event
                window.dispatchEvent(new CustomEvent('appointment_sync'));
            });

            newSocket.on('notification_sync', () => {
                console.log('[SOCKET] Notification sync signal received');
                window.dispatchEvent(new CustomEvent('notification_sync'));
            });

            newSocket.on('record_sync', () => {
                console.log('[SOCKET] Medical record sync signal received');
                window.dispatchEvent(new CustomEvent('record_sync'));
            });

            newSocket.on('prescription_sync', () => {
                console.log('[SOCKET] Prescription sync signal received');
                window.dispatchEvent(new CustomEvent('prescription_sync'));
            });

            newSocket.on('admin_stats_sync', () => {
                console.log('[SOCKET] Admin stats sync signal received');
                window.dispatchEvent(new CustomEvent('admin_stats_sync'));
            });

            newSocket.on('admin_user_sync', () => {
                console.log('[SOCKET] Admin user sync signal received');
                window.dispatchEvent(new CustomEvent('admin_user_sync'));
            });

            newSocket.on('typing', (data: { from: string }) => {
                window.dispatchEvent(new CustomEvent('typing_start', { detail: { userId: data.from } }));
            });

            newSocket.on('stop_typing', (data: { from: string }) => {
                window.dispatchEvent(new CustomEvent('typing_stop', { detail: { userId: data.from } }));
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    const answerCall = () => {
        setCallAccepted(true);
        if (call && call.signal && call.signal.type === 'jitsi_invite') {
            setJitsiRoom(call.signal.roomName);
            // Notify caller we accepted
            socket?.emit('answer_call', { to: call.from, signal: { type: 'jitsi_accept' } });
        }
    };

    const callUser = (id: string, callType: 'video' | 'audio' = 'video') => {
        const roomName = `doc-call-${user?._id}-${Date.now()}`;
        setJitsiRoom(roomName);
        setCall({ isReceivingCall: false, from: me, name: 'Calling...', signal: { type: 'jitsi_invite', roomName }, callType, remoteUserId: id });
        
        socket?.emit('call_user', {
            userToCall: id,
            signalData: { type: 'jitsi_invite', roomName },
            from: user?._id || me,
            name: user?.firstName || 'User',
            callType
        });
    };

    const leaveCall = () => {
        setCallEnded(true);
        setCallAccepted(false);
        setCall(null);
        setJitsiRoom(null);
    };

    const endCall = () => {
        leaveCall();
        // Ideally emit end_call event to peer
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            onlineUsers, 
            isConnected,
            call,
            callAccepted,
            callEnded,
            jitsiRoom,
            me,
            answerCall,
            callUser,
            leaveCall,
            endCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

