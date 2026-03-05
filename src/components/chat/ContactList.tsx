import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { ChatContact } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactListProps {
    contacts: ChatContact[];
    activeContact: ChatContact | null;
    onSelectContact: (contact: ChatContact) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isOpen: boolean;
}

export function ContactList({ 
    contacts, 
    activeContact, 
    onSelectContact, 
    searchQuery, 
    onSearchChange,
    isOpen 
}: ContactListProps) {
    // Filter then sort: contacts with recent messages float to top
    const filteredContacts = contacts
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (!a.lastMessageTime && !b.lastMessageTime) return 0;
            if (!a.lastMessageTime) return 1;  // No message → bottom
            if (!b.lastMessageTime) return -1; // No message → bottom
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

    const formatTime = (iso?: string) => {
        if (!iso) return '';
        const date = new Date(iso);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`
            absolute inset-0 md:static md:w-80 lg:w-96 border-r border-slate-100 flex flex-col h-full bg-white transition-transform duration-300 z-10
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${activeContact ? 'hidden md:flex' : 'flex'}
        `}>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Messages</h1>
                        <p className="text-xs text-slate-400 mt-0.5">{contacts.length} conversation{contacts.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
                    <Search className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-300 font-medium w-full"
                    />
                </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-3 space-y-1">
                    <AnimatePresence>
                        {filteredContacts.map((contact, i) => {
                            const isActive = activeContact?.id === contact.id;
                            // Only show unread badge when count is a positive number
                            const hasUnread = typeof contact.unread === 'number' && contact.unread > 0;
                            return (
                                <motion.div
                                    key={contact.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03, duration: 0.3 }}
                                    onClick={() => onSelectContact(contact)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'hover:bg-slate-50'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-2xl overflow-hidden ring-2 transition-all ${
                                            isActive ? 'ring-white/30' : 'ring-slate-100 group-hover:ring-primary/20'
                                        }`}>
                                            {contact.image ? (
                                                <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center font-black text-base ${
                                                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                                                }`}>
                                                    {contact.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        {contact.isOnline && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <h3 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                                {contact.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {/* Timestamp — only show if there's a message */}
                                                {contact.lastMessageTime && (
                                                    <span className={`text-[10px] font-medium ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                                                        {formatTime(contact.lastMessageTime)}
                                                    </span>
                                                )}
                                                {/* Unread badge — ONLY when count > 0, never show 0 */}
                                                {hasUnread && (
                                                    <span className={`flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-black rounded-full ${
                                                        isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                                                    }`}>
                                                        {(contact.unread ?? 0) > 9 ? '9+' : contact.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/70' : contact.lastMessage ? 'text-slate-500' : 'text-slate-300'}`}>
                                            {contact.isOnline && !isActive
                                                ? <span className="text-emerald-500 font-medium">● Active now</span>
                                                : contact.lastMessage || 'No messages yet'}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredContacts.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <Search className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                            <p className="text-sm font-medium">No conversations found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
