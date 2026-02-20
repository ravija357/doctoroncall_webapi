import React from 'react';
import { Search, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatContact } from '@/types/chat';

interface ContactListProps {
    contacts: ChatContact[];
    activeContact: ChatContact | null;
    onSelectContact: (contact: ChatContact) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isOpen: boolean; // For mobile responsiveness
}

export function ContactList({ 
    contacts, 
    activeContact, 
    onSelectContact, 
    searchQuery, 
    onSearchChange,
    isOpen 
}: ContactListProps) {
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`
            absolute inset-0 md:static md:w-80 lg:w-96 border-r border-slate-100 flex flex-col h-full bg-slate-50/50 transition-transform duration-300 z-10
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${activeContact ? 'hidden md:flex' : 'flex'} 
        `}>
            {/* Header */}
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-3">
                    {filteredContacts.map(contact => (
                        <div 
                            key={contact.id}
                            onClick={() => onSelectContact(contact)}
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
                                    {/* Time could be passed in if available */}
                                    {/* <span className={`text-[11px] font-medium transition-colors ${
                                        activeContact?.id === contact.id ? 'text-blue-200' : 'text-slate-400'
                                    }`}>
                                        12:30 PM
                                    </span> */}
                                </div>
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className={`text-sm truncate transition-colors pr-2 flex-1 ${
                                            activeContact?.id === contact.id ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-600'
                                        }`}>
                                            {contact.lastMessage || ""}
                                        </p>
                                        {contact.unread && contact.unread > 0 && (
                                            <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                                {contact.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                        </div>
                    ))}
                    
                    {filteredContacts.length === 0 && (
                        <div className="text-center p-8 text-slate-400">
                             No contacts found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
