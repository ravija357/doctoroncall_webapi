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
import { Send, Shield, Search, ArrowLeft, Phone, Video, Trash2, Loader2, User as UserIcon } from 'lucide-react';
import api from '@/services/api';
import { getImageUrl } from '@/utils/imageHelper';
import AuthGuard from '@/app/components/AuthGuard';
import PageBackground from '@/components/ui/PageBackground';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

function AdminMessagesContent() {
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

    const { 
        call, 
        callAccepted, 
        answerCall, 
        leaveCall, 
        jitsiRoom,
        callUser,
        callEnded
    } = useSocket();

    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const searchParams = useSearchParams();
    const autoUserId = searchParams.get('userId');

    useEffect(() => {
        if (!autoUserId || activeContact) return;
        if (contacts.length > 0) {
            const targetContact = contacts.find(c => c.id === autoUserId);
            if (targetContact) {
                setActiveContact(targetContact);
                return;
            }
        }
    }, [autoUserId, contacts, activeContact, setActiveContact]);

    useEffect(() => {
        if (callEnded) setIsCalling(false);
    }, [callEnded]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleLeaveCall = () => {
        setIsCalling(false);
        const contactId = call?.remoteUserId || activeContact?.id;
        leaveCall();
        if (contactId) sendMessage('Call Ended 📞', 'text', contactId);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && activeContact) {
            sendMessage(newMessage, 'text', activeContact.id);
            setNewMessage('');
        }
    };

    if (!user) return null;

    return (
    <AuthGuard role="admin">
      <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
        {/* Subtle Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5" />
        <PageBackground />
        
        <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto h-[100vh] flex flex-col pt-20">
          {/* Header - High Contrast */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <Link href="/admin">
                <motion.button 
                  whileHover={{ x: -5, scale: 1.1 }}
                  className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Messaging Hub.</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Encrypted Admin Channel</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Network Secure</span>
            </div>
          </motion.div>

          {/* Main Interface - SOLID WHITE GLASS */}
          <div className="flex-grow flex gap-6 overflow-hidden mb-4">
            {/* Contacts Sidebar - Solid White */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 bg-white rounded-[3rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((contact) => (
                  <motion.div
                    key={contact.id}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-3xl cursor-pointer transition-all duration-300 border ${
                      activeContact?.id === contact.id 
                        ? "bg-slate-50 border-slate-200 shadow-sm" 
                        : "bg-transparent border-transparent hover:bg-slate-50/50"
                    }`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          {contact.image ? (
                            <img src={contact.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-900 font-black">{contact.name[0]}</span>
                          )}
                        </div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        )}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-black text-slate-900 text-sm truncate">{contact.name}</h4>
                          <span className="text-[9px] font-bold text-slate-400">
                            {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium truncate">{contact.lastMessage || 'No messages yet.'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chat Area - Solid White */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-grow bg-white rounded-[3rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden"
            >
              {activeContact ? (
                <>
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden text-primary font-black shadow-sm">
                        {activeContact.image ? (
                          <img src={activeContact.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{activeContact.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 tracking-tight"> {activeContact.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 ${activeContact.isOnline ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full`} />
                          <span className={`text-[10px] font-bold ${activeContact.isOnline ? 'text-emerald-600' : 'text-slate-400'} uppercase tracking-widest`}>
                            {activeContact.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setIsCalling(true); callUser(activeContact.id, 'audio'); }}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"
                      >
                         <Phone className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { setIsCalling(true); callUser(activeContact.id, 'video'); }}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"
                      >
                         <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-grow overflow-y-auto p-10 space-y-6 bg-slate-50/10">
                    {isLoadingMessages ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating History...</span>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                          <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, x: msg.sender === user._id ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] p-5 rounded-[2rem] font-bold shadow-sm ${
                              msg.sender === user._id 
                                ? 'bg-primary text-white ml-12 rounded-tr-none shadow-primary/20' 
                                : 'bg-white border border-slate-100 text-slate-900 mr-12 rounded-tl-none'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className="flex items-center justify-between gap-4 mt-2">
                                <span className={`text-[9px] ${msg.sender === user._id ? 'text-white/60' : 'text-slate-400'}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.sender === user._id && (
                                    <button 
                                        onClick={() => deleteMessage(msg._id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3 text-white/40 hover:text-white" />
                                    </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Zone - Clear Visibility */}
                  <div className="p-8 border-t border-slate-100 bg-white">
                    <form 
                      onSubmit={handleSendMessage}
                      className="relative flex items-center gap-4"
                    >
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your secure response..."
                        className="flex-grow bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 shadow-inner"
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="p-5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex items-center justify-center mb-8 shadow-sm group hover:scale-110 transition-all duration-500">
                    <Send className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Active Intelligence</h2>
                  <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                    Secure administrative bridge. Select an expert or patient to begin coordination.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Light Overlay */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Call Modals */}
        {call && !callAccepted && (
            <IncomingCallModal
                call={{ ...call, isCalling: false, callAccepted: false, callEnded: false }}
                onAnswer={() => { answerCall(); setIsCalling(true); }}
                onReject={() => handleLeaveCall()}
            />
        )}
        {jitsiRoom && (
            <JitsiCallModal
                roomName={jitsiRoom}
                displayName={`${user.firstName} (Admin)`}
                onClose={handleLeaveCall}
            />
        )}
      </div>
    </AuthGuard>
    );
}

export default function AdminMessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminMessagesContent />
        </Suspense>
    );
}
