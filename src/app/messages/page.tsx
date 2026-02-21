"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useSearchParams } from 'next/navigation';
import { ContactList } from '@/components/chat/ContactList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { JitsiCallModal } from '@/components/chat/JitsiCallModal';
import { IncomingCallModal } from '@/components/chat/IncomingCallModal';
import { Send } from 'lucide-react';

function MessagesContent() {
    // 1. Core Hooks
    const { user } = useAuth();
    const { 
        contacts, 
        activeContact, 
        setActiveContact, 
        messages, 
        sendMessage, 
        deleteMessage, 
        clearChat,
        isLoadingMessages 
    } = useChat();

    // 2. Call Logic (from SocketContext)
    const { 
        call, 
        callAccepted, 
        callEnded, 
        callUser, 
        answerCall, 
        leaveCall, 
        jitsiRoom
    } = useSocket();

    // 3. Page Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    
    // Auto-selection via URL
    const searchParams = useSearchParams();
    const autoUserId = searchParams.get('userId');
    const autoCall = searchParams.get('autoCall');

    useEffect(() => {
        if (autoUserId && contacts.length > 0 && !activeContact) {
            const targetContact = contacts.find(c => c.id === autoUserId);
            if (targetContact) {
                setActiveContact(targetContact);
                if (autoCall === 'true') {
                    setTimeout(() => {
                        console.log("Auto-starting call with:", targetContact.name);
                        setIsCalling(true);
                        callUser(targetContact.id, 'video');
                    }, 1000);
                }
            }
        }
    }, [autoUserId, contacts, autoCall, activeContact, callUser, setActiveContact]);

    // Cleanup when call ends
    useEffect(() => {
        if (callEnded) {
            setIsCalling(false);
        }
    }, [callEnded]);

    // Handlers
    const handleStartCall = (video: boolean) => {
        if (!activeContact) return;
        const callType = video ? 'video' : 'audio';
        setIsCalling(true);
        callUser(activeContact.id, callType);
    };

    const handleLeaveCall = () => {
        setIsCalling(false);
        leaveCall();
    };

    if (!user) return null;

    return (
        <>
            {/* 1. Incoming Call Modal */}
            {call && !callAccepted && (
                <IncomingCallModal
                    call={{ ...call, isCalling: false, callAccepted: false, callEnded: false }}
                    onAnswer={() => { answerCall(); setIsCalling(true); }}
                    onReject={() => { handleLeaveCall(); }}
                />
            )}

            {/* 2. Jitsi Call Modal */}
            {jitsiRoom && (
                <JitsiCallModal
                    roomName={jitsiRoom}
                    displayName={`${user.firstName} ${user.lastName}`}
                    onClose={handleLeaveCall}
                />
            )}

            <div className="fixed inset-0 top-20 bg-[#F8FAFD] z-40">
                <div className="container mx-auto max-w-7xl h-full pt-6 pb-6 relative px-4">

            {/* 3. Main Chat Interface */}
            <div className="h-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex relative">
                {/* Sidebar */}
                <ContactList
                    contacts={contacts}
                    activeContact={activeContact}
                    onSelectContact={setActiveContact}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isOpen={!activeContact}
                />

                {/* Chat Area */}
                {activeContact ? (
                    <ChatWindow
                        contact={activeContact}
                        onClose={() => setActiveContact(null)}
                        onCallStart={(type) => handleStartCall(type === 'video')}
                        messages={messages}
                        sendMessage={sendMessage}
                        deleteMessage={deleteMessage}
                        clearChat={clearChat}
                        isLoadingMessages={isLoadingMessages}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-[#F8FAFD]">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                            <Send className="w-9 h-9 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-2">Your Conversations</h2>
                        <p className="text-slate-400 text-sm max-w-xs">
                            Select a {user.role === 'doctor' ? 'patient' : 'doctor'} from the list on the left to start chatting.
                        </p>
                    </div>
                )}
            </div>
                </div>
            </div>
        </>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
