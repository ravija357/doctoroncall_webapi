import React, { useRef, useEffect } from 'react';
import { X, Phone, Video, MoreVertical, Paperclip, Send, Trash2, ChevronLeft } from 'lucide-react';
import { ChatContact, Message } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { DeleteMessageModal } from './DeleteMessageModal';
import { messageService } from '@/services/message.service';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
    contact: ChatContact | null;
    onClose: () => void;
    onCallStart: (type: 'video' | 'audio') => void;
    messages: Message[];
    sendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
    deleteMessage: (msgId: string, type: 'me' | 'everyone') => void;
    clearChat: (type: 'me' | 'everyone') => void;
    isLoadingMessages: boolean;
}

export function ChatWindow({
    contact,
    onClose,
    onCallStart,
    messages,
    sendMessage,
    deleteMessage,
    clearChat,
    isLoadingMessages
}: ChatWindowProps) {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showMenu, setShowMenu] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [msgToDelete, setMsgToDelete] = React.useState<string | null>(null);
    const [deleteMode, setDeleteMode] = React.useState<'message' | 'chat'>('message');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!contact) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50/50 text-slate-300">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-slate-500 font-bold">Select a conversation</p>
                    <p className="text-slate-400 text-sm">Choose a contact to start chatting</p>
                </div>
            </div>
        );
    }

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(newMessage);
        setNewMessage('');
    };

    const handleDeleteClick = (msgId: string) => {
        setMsgToDelete(msgId);
        setDeleteMode('message');
        setDeleteModalOpen(true);
    };

    const handleClearChatClick = () => {
        setDeleteMode('chat');
        setDeleteModalOpen(true);
    };

    const confirmAction = (type: 'me' | 'everyone') => {
        if (deleteMode === 'message' && msgToDelete) {
            deleteMessage(msgToDelete, type);
            setMsgToDelete(null);
        } else if (deleteMode === 'chat') {
            clearChat(type);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const response = await messageService.uploadFile(file);
            const isImage = file.type.startsWith('image/');
            sendMessage(response.fileUrl, isImage ? 'image' : 'file');
        } catch (err) {
            console.error('File upload failed:', err);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative" onClick={() => showMenu && setShowMenu(false)}>
            <DeleteMessageModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={confirmAction}
                title={deleteMode === 'message' ? 'Delete Message?' : 'Clear Chat?'}
                description={deleteMode === 'message'
                    ? 'Choose how you would like to delete this message.'
                    : 'Choose how you would like to clear this chat history.'}
            />

            {/* ── Header ── */}
            <div className="h-[72px] border-b border-slate-100 flex items-center justify-between px-5 bg-white shrink-0">
                <div className="flex items-center gap-3">
                    {/* Mobile back */}
                    <button onClick={onClose} className="lg:hidden p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                        {contact.image ? (
                            <img src={contact.image} alt={contact.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-primary/20" />
                        ) : (
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                                {contact.name[0]}
                            </div>
                        )}
                        {contact.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                        )}
                    </div>

                    <div>
                        <h3 className="font-black text-slate-900 text-sm">{contact.name}</h3>
                        <p className={`text-xs font-medium ${contact.isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {contact.isOnline ? '● Active now' : 'Offline'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 relative">
                    <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => onCallStart('audio')}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                    >
                        <Phone className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => onCallStart('video')}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                    >
                        <Video className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </motion.button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-12 right-0 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                            >
                                <button
                                    onClick={() => { setShowMenu(false); handleClearChatClick(); }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-bold"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Chat
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-[#F8FAFD]">
                {isLoadingMessages ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <Send className="w-6 h-6 text-primary" />
                        </div>
                        <p className="font-bold text-slate-500">No messages yet</p>
                        <p className="text-slate-400 text-sm">Say hello to {contact.name}!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                            >
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[68%]`}>
                                    <div className="flex items-end gap-2">
                                        {/* Delete button — only for sender, visible on hover */}
                                        {isMe && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (msg._id) handleDeleteClick(msg._id); }}
                                                className="p-1.5 text-slate-300 hover:text-red-400 transition-all rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 mb-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                            isMe
                                                ? 'bg-primary text-white rounded-br-sm'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
                                        }`}>
                                            {msg.type === 'image' ? (
                                                <img
                                                    src={msg.content}
                                                    alt="Image"
                                                    className="max-w-[200px] rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => window.open(msg.content, '_blank')}
                                                />
                                            ) : msg.type === 'file' ? (
                                                <a
                                                    href={msg.content}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 underline ${isMe ? 'text-white' : 'text-primary'}`}
                                                >
                                                    <Paperclip className="w-4 h-4 flex-shrink-0" />
                                                    Attachment
                                                </a>
                                            ) : (
                                                <p>{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ── */}
            <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0">
                <form
                    onSubmit={handleSend}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 focus-within:bg-white transition-all"
                >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                    <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-slate-300 hover:text-primary transition-colors flex-shrink-0"
                    >
                        <Paperclip className="w-5 h-5" />
                    </motion.button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-300 text-sm font-medium"
                    />

                    <motion.button
                        type="submit"
                        disabled={!newMessage.trim()}
                        whileHover={newMessage.trim() ? { scale: 1.08 } : {}}
                        whileTap={newMessage.trim() ? { scale: 0.92 } : {}}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            newMessage.trim()
                                ? 'bg-primary text-white shadow-md shadow-primary/30'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
