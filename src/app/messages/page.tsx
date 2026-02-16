"use client";

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, X, Mic, MicOff, Video as VideoIcon, VideoOff, Trash2 } from 'lucide-react';
import { doctorService } from '@/services/doctor.service';
import { messageService } from '@/services/message.service';
import { uploadService } from '@/services/upload.service';
import { useRouter, useSearchParams } from 'next/navigation';

interface Message {
    _id?: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
    type: 'text' | 'image' | 'call_log';
}

interface ChatContact {
    id: string;
    doctorId?: string; // Added for navigation
    name: string;
    image?: string;
    lastMessage?: string;
    unread?: number;
    isOnline?: boolean;
    role?: string;
}
// ... existing interfaces ...

export default function MessagesPage() {
    const { socket, onlineUsers, call, callAccepted, callEnded, myVideo, userVideo, stream, name, setName, me, callUser, answerCall, leaveCall, toggleAudio, toggleVideo } = useSocket();
    const { user } = useAuth();
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Call UI State
    const [isCalling, setIsCalling] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const handleToggleAudio = () => {
        const newValue = !isAudioEnabled;
        setIsAudioEnabled(newValue);
        toggleAudio(newValue);
    };

    const handleToggleVideo = () => {
        const newValue = !isVideoEnabled;
        setIsVideoEnabled(newValue);
        toggleVideo(newValue);
    };

    // Fetch messages when activeContact changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (activeContact) {
                try {
                    const history = await messageService.getMessages(activeContact.id);
                    setMessages(history);
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
        };
        fetchMessages();
    }, [activeContact]);

    // Fetch contacts (Recent Chats)
    useEffect(() => {
        if (user) {
            const fetchContacts = async () => {
                try {
                    // 1. Get recent chat contacts
                    const data = await messageService.getContacts();
                    const chatContacts = data.data || []; // Handle { success: true, data: [] } response format
                    
                    const mappedChatContacts: ChatContact[] = chatContacts.map((c: any) => ({
                        id: c.id,
                        doctorId: c.role === 'doctor' ? c.id : undefined, // If they are a doctor, keep ID. If patient, undefined.
                        name: c.role === 'doctor' ? `Dr. ${c.name}` : c.name,
                        image: c.image,
                        role: c.role,
                        isOnline: onlineUsers.includes(c.id)
                    }));

                    // 2. If User is Patient, also fetch all doctors to allow starting new chats
                    if (user.role !== 'doctor') {
                        const allDoctors = await doctorService.getAllDoctors();
                        const doctorContacts = allDoctors
                            .filter(doc => doc.user && typeof doc.user !== 'string' && doc.user.firstName)
                            .map(doc => ({
                                id: doc.user._id,
                                doctorId: doc._id || doc.user._id,
                                name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
                                image: doc.user.image,
                                role: 'Doctor',
                                isOnline: onlineUsers.includes(doc.user._id)
                            }));

                        // Merge: Valid Doctors + Recent Chats (Deduped)
                        // Create a map by ID
                        const contactMap = new Map<string, ChatContact>();
                        
                        // Add doctors first
                        doctorContacts.forEach(c => contactMap.set(c.id, c));
                        
                        // Add recent chats (overwriting if needed, or ensuring they exist)
                        mappedChatContacts.forEach(c => contactMap.set(c.id, {
                             ...c,
                             // Preserve doctorId if it existed in doctorContacts
                             doctorId: contactMap.get(c.id)?.doctorId || c.doctorId 
                        }));
                        
                        setContacts(Array.from(contactMap.values()));
                    } else {
                        // If Doctor, only show people they have chatted with (Patients)
                        setContacts(mappedChatContacts);
                    }

                } catch (error) {
                    console.error("Failed to fetch contacts", error);
                }
            };
            fetchContacts();
        }
    }, [user]);

    useEffect(() => {
        setContacts(prev => prev.map(c => ({
            ...c,
            isOnline: onlineUsers.includes(c.id)
        })));
    }, [onlineUsers]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message: Message) => {
                // Modified to add unique ID if missing to prevent key warnings
                const msg = { ...message, _id: message._id || Math.random().toString() };
                if (activeContact && (msg.sender === activeContact.id || msg.receiver === activeContact.id)) {
                     // Check if message already exists to avoid dupes
                     setMessages(prev => {
                        if (prev.some(m => m.createdAt === msg.createdAt && m.content === msg.content)) return prev;
                        return [...prev, msg];
                     });
                }
            });

            socket.on('message_sent', (message: Message) => {
                 setMessages(prev => [...prev, message]);
            });

            socket.on('message_deleted', (messageId: string) => {
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
            });

            socket.on('chat_cleared', () => {
                setMessages([]);
            });

            return () => {
                socket.off('receive_message');
                socket.off('message_sent');
                socket.off('message_deleted');
                socket.off('chat_cleared');
            };
        }
    }, [socket, activeContact]);

    useEffect(() => {
        if (callEnded) {
            setIsCalling(false);
            // Optionally set activeContact to null if you want to exit chat, 
            // but user presumably wants to return to chat.
        }
    }, [callEnded]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages]);

    // Ensure video streams are attached when call UI opens
    useEffect(() => {
        if ((isCalling || callAccepted) && !callEnded) {
            // Attach local stream
            if (myVideo.current && stream) {
                console.log("[UI] Attaching local stream to video element");
                myVideo.current.srcObject = stream;
            }
            // Attach remote stream (if available via track event or if we stored it)
            // Note: remote stream is attached via 'ontrack' in SocketContext, 
            // but if the video element wasn't mounted then, it might have missed it.
            // Ideally SocketContext should expose 'remoteStream' state. 
            // For now, we rely on the ref being stable or the peer connection events firing.
        }
    }, [isCalling, callAccepted, callEnded, myVideo, stream]);

    // Handle URL query params for auto-selection and auto-call
    const searchParams = useSearchParams();
    const autoUserId = searchParams.get('userId');
    const autoCall = searchParams.get('autoCall');

    useEffect(() => {
        if (autoUserId && contacts.length > 0 && !activeContact) {
            const targetContact = contacts.find(c => c.id === autoUserId);
            if (targetContact) {
                setActiveContact(targetContact);
                // If autoCall is requested, wait a bit for socket/connection then start
                if (autoCall === 'true') {
                    // Small timeout to ensure state is ready
                    setTimeout(() => {
                        console.log("Auto-starting call with:", targetContact.name);
                        setIsCalling(true);
                        callUser(targetContact.id, 'video');
                    }, 1000);
                }
            }
        }
    }, [autoUserId, contacts, autoCall, activeContact, callUser]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        // if (!newMessage.trim() || !activeContact || !socket) return;
        if (!newMessage.trim() || !activeContact) return;

        const messageData = {
            receiverId: activeContact.id,
            content: newMessage,
            type: 'text' as const
        };
        
        console.log("Sending message:", messageData);
        if (socket) socket.emit('send_message', messageData);
        // Optimistically update UI
        // setMessages(prev => [...prev, {
        //     sender: user?._id || 'me',
        //     receiver: activeContact.id,
        //     content: newMessage,
        //     createdAt: new Date().toISOString(),
        //     type: 'text'
        // }]);
        setNewMessage('');
    };

    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeContact || !socket) return;

        try {
            // Optimistic UI update could be added here
            const fileUrl = await uploadService.uploadFile(file);
            
            const messageData = {
                receiverId: activeContact.id,
                content: fileUrl,
                type: 'image' as const
            };

            socket.emit('send_message', messageData);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload file");
        }
    };

    const handleViewProfile = () => {
       if (activeContact?.doctorId) {
            router.push(`/doctors/${activeContact.doctorId}`);
       }
    };

    const startCall = (video: boolean) => {
        if (!activeContact) return;
        const callType = video ? 'video' : 'audio';
        console.log(`[UI] Starting ${callType} call to: ${activeContact.name} (ID: ${activeContact.id})`);
        setIsCalling(true);
        callUser(activeContact.id, callType);
    };

    const handleBackToContacts = () => {
        setActiveContact(null);
    };

    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
    const [isClearingChat, setIsClearingChat] = useState(false);

    const handleDeleteMessage = (messageId: string) => {
        setDeletingMessageId(messageId);
    };

    const confirmDelete = () => {
        if (!activeContact || !socket || !deletingMessageId) return;

        socket.emit('delete_message', { messageId: deletingMessageId, receiverId: activeContact.id });
        
        // Optimistic update
        setMessages(prev => prev.filter(msg => msg._id !== deletingMessageId));
        setDeletingMessageId(null);
    };

    const cancelDelete = () => {
        setDeletingMessageId(null);
    };

    const handleClearChat = () => {
        setShowMenu(false);
        setIsClearingChat(true);
    };

    const confirmClearChat = () => {
        if (!activeContact || !socket) return;
        socket.emit('clear_chat', { receiverId: activeContact.id });
        setMessages([]);
        setIsClearingChat(false);
    };

    const cancelClearChat = () => {
        setIsClearingChat(false);
    };

    return (
        <div className="container mx-auto max-w-7xl h-[85vh] pt-6 pb-6 relative">
            
            {/* Call Modal / Overlay - Active Incoming Call */}
            {(call?.isReceivingCall && !callAccepted) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 max-w-sm w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="mb-6 relative">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl overflow-hidden shadow-inner">
                                {call.name[0]}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                                <Phone className="w-4 h-4" />
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{call.name}</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">Incoming {call.callType === 'audio' ? 'Audio' : 'Video'} Call...</p>
                        
                        <div className="flex gap-6 w-full justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Button 
                                    onClick={() => {/* reject logic - needs implementation in context or local */}} 
                                    variant="outline" 
                                    className="w-14 h-14 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all shadow-lg shadow-red-100"
                                >
                                    <Phone className="w-6 h-6 rotate-[135deg]" />
                                </Button>
                                <span className="text-xs font-semibold text-slate-400">Decline</span>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <Button 
                                    onClick={() => {
                                        answerCall();
                                        setIsCalling(true);
                                    }} 
                                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white hover:scale-110 transition-all shadow-lg shadow-green-200 animate-pulse"
                                >
                                    <Phone className="w-6 h-6" />
                                </Button>
                                <span className="text-xs font-semibold text-slate-400">Answer</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) }

            {/* Delete Confirmation Modal */}
            {deletingMessageId && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Message?</h3>
                        <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button 
                                onClick={cancelDelete} 
                                variant="ghost" 
                                className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={confirmDelete} 
                                className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 rounded-xl"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear Chat Confirmation Modal */}
            {isClearingChat && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Clear Chat History?</h3>
                        <p className="text-slate-500 text-sm mb-6">This will delete all messages in this conversation for both users. This cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button 
                                onClick={cancelClearChat} 
                                variant="ghost" 
                                className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={confirmClearChat} 
                                className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 rounded-xl"
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Call Interface - ZenChat Style */}
            {(callAccepted && !callEnded) || isCalling ? (
                <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col animate-in fade-in duration-300">
                    <div className="relative flex-1 bg-slate-800 flex items-center justify-center overflow-hidden group">
                        
                        {/* Remote Video or Audio Avatar */}
                        {call?.callType === 'audio' ? (
                            <div className="flex flex-col items-center justify-center gap-6 animate-in zoom-in-95 duration-500">
                                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-2xl shadow-blue-500/30">
                                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white/20">
                                        {activeContact?.image ? (
                                            <img src={activeContact.image} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-6xl md:text-8xl font-bold text-white/90">
                                                {(activeContact?.name || call?.name || "U")[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeContact?.name || call?.name}</h2>
                                    <p className="text-blue-300 text-lg animate-pulse">Audio Call in Progress...</p>
                                </div>
                            </div>
                        ) : (
                            <video 
                                playsInline 
                                ref={userVideo} 
                                autoPlay 
                                className="w-full h-full object-cover" 
                            />
                        )}
                        
                        {/* Local Video (Floating PiP) - Only show if video call */}
                        {call?.callType === 'video' && (
                            <div className="absolute top-4 right-4 w-32 h-44 md:w-48 md:h-64 bg-slate-700 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
                                <video 
                                    playsInline 
                                    muted 
                                    ref={myVideo} 
                                    autoPlay 
                                    className="w-full h-full object-cover mirrored" 
                                />
                            </div>
                        )}

                        {/* Call Info Overlay (If Video) */}
                        {call?.callType === 'video' && (
                            <div className="absolute top-8 left-8 text-white drop-shadow-md">
                                <h2 className="text-2xl font-bold font-serif">{activeContact?.name || call?.name || "Unknown"}</h2>
                                <p className="text-blue-200 text-sm font-medium animate-pulse">
                                    {callAccepted ? "00:00" : "Calling..."}
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
                                onClick={handleToggleAudio}
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
                                onClick={handleToggleVideo}
                            >
                                {isVideoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                            </Button>

                            <Button 
                                onClick={() => { setIsCalling(false); leaveCall(); }} 
                                variant="destructive" 
                                size="icon" 
                                className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40 transform hover:scale-110 transition-all"
                            >
                                <Phone className="w-6 h-6 rotate-[135deg]" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="h-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex relative">
                
                {/* Sidebar - Hidden on mobile if chat is active */}
                <div className={`
                    absolute inset-0 md:static md:w-80 lg:w-96 border-r border-slate-100 flex flex-col h-full bg-slate-50/50 transition-transform duration-300 z-10
                    ${activeContact ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                `}>
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold font-serif text-slate-800">Messages</h1>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Search conversations..." 
                                className="pl-10 bg-white border-slate-200 rounded-xl" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-4 space-y-3">
                            {filteredContacts.map(contact => (
                                <div 
                                    key={contact.id}
                                    onClick={() => {
                                        console.log("Selected contact:", contact);
                                        setActiveContact(contact);
                                    }}
                                    className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                                        activeContact?.id === contact.id 
                                            ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' 
                                            : 'bg-white border-transparent hover:border-slate-100 hover:bg-white hover:shadow-md'
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-colors ${
                                            activeContact?.id === contact.id ? 'border-white/30' : 'border-slate-100 group-hover:border-blue-100'
                                        }`}>
                                            {contact.image ? (
                                                <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center font-bold text-xl ${
                                                    activeContact?.id === contact.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {contact.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        {contact.isOnline && (
                                            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold text-base truncate transition-colors ${
                                                activeContact?.id === contact.id ? 'text-white' : 'text-slate-800'
                                            }`}>
                                                {contact.name}
                                            </h3>
                                            <span className={`text-[11px] font-medium transition-colors ${
                                                activeContact?.id === contact.id ? 'text-blue-200' : 'text-slate-400'
                                            }`}>
                                                12:30 PM
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate transition-colors ${
                                            activeContact?.id === contact.id ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-600'
                                        }`}>
                                            {contact.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area - Slide in on mobile */}
                <div className={`
                    absolute inset-0 md:static flex-1 flex flex-col h-full bg-white transition-transform duration-300 md:translate-x-0
                    ${activeContact ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    {activeContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10 shrink-0 relative">
                                <div className="flex items-center gap-4">
                                     {/* Mobile Back Button */}
                                     <Button onClick={handleBackToContacts} variant="ghost" size="icon" className="md:hidden -ml-2 rounded-full text-slate-500">
                                        <X className="w-5 h-5" />
                                     </Button>

                                     <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
                                        {activeContact.image ? (
                                            <img src={activeContact.image} alt={activeContact.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                {activeContact.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">{activeContact.name}</h2>
                                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                            {activeContact.isOnline ? (
                                                <><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</>
                                            ) : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 relative">
                                    <Button onClick={() => startCall(false)} variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                    <Button onClick={() => startCall(true)} variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                        <Video className="w-5 h-5" />
                                    </Button>
                                    <Button onClick={() => setShowMenu(!showMenu)} variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>

                                    {/* Three-Dot Menu Dropdown */}
                                    {showMenu && (
                                        <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewProfile();
                                                }} 
                                                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                            >
                                                View Profile
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClearChat();
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                Clear Chat
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto min-h-0 bg-[#FDFDFD] p-6 relative" onClick={() => setShowMenu(false)}>
                                <div className="space-y-6 pb-4">
                                    {messages.length === 0 && (
                                        <div className="text-center text-slate-400 my-10 text-sm">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                    {messages.map((msg, index) => {
                                        const isMe = msg.sender === user?._id || msg.sender === 'me';
                                        return (
                                            <div key={index || msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                                <div className="flex items-end gap-2 max-w-[70%]">
                                                     {/* Delete Button (Only for me) */}
                                                     {isMe && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (msg._id) handleDeleteMessage(msg._id);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50 mb-1 opacity-50 hover:opacity-100"
                                                            title="Delete message"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                     )}
                                                    
                                                    <div className={`rounded-2xl px-5 py-3 shadow-sm relative ${
                                                        isMe 
                                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                                    }`}>
                                                        {msg.type === 'image' ? (
                                                            <img src={msg.content} alt="Shared image" className="rounded-lg max-w-full h-auto mb-1 border border-white/20" />
                                                        ) : (
                                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                                        )}
                                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-slate-100 bg-white shrink-0 sticky bottom-0 z-50">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input 
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..." 
                                        className="flex-1 bg-transparent border-none outline-none px-2 text-slate-700 placeholder:text-slate-400 text-sm h-10"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 flex items-center justify-center shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-200">
                                <Send className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Messages</h2>
                            <p className="text-slate-500 max-w-sm">
                                Select a doctor from the list to start a chat or consult about your health.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
