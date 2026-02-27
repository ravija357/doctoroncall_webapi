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
    const [call, setCall] = useState<{ isReceivingCall: boolean; from: string; name: string; signal: any; callType: 'video' | 'audio' } | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [jitsiRoom, setJitsiRoom] = useState<string | null>(null);

    const { user, refreshUser } = useAuth();

    useEffect(() => {
        if (user) {
            const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
                 setOnlineUsers(prev => [...prev, data.userId]);
            });

            newSocket.on('call_accepted', (signal) => {
                console.log('[CALL] Call Accepted', signal);
                setCallAccepted(true);
                // If it was a Jitsi call, make sure room is set (caller already has it)
            });

            newSocket.on('call_user', (data: { from: string; name: string; signal: any; callType: 'video' | 'audio' }) => {
                console.log('[CALL] Incoming call from:', data.name);
                setCall({ isReceivingCall: true, from: data.from, name: data.name, signal: data.signal, callType: data.callType || 'video' });
            });

            newSocket.on('profile_sync', (data: any) => {
                console.log('[SOCKET] Profile sync signal received', data);
                refreshUser();
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
        setCall({ isReceivingCall: false, from: me, name: 'Calling...', signal: { type: 'jitsi_invite', roomName }, callType });
        
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

