import React, { useRef, useEffect } from 'react';
import { X, Phone, Video, MoreVertical, Paperclip, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatContact, Message } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { DeleteMessageModal } from './DeleteMessageModal';
import { messageService } from '@/services/message.service';

interface ChatWindowProps {
    contact: ChatContact | null;
    onClose: () => void;
    onCallStart: (type: 'video' | 'audio') => void;
    // Props passed from parent useChat instance
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
    
    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [msgToDelete, setMsgToDelete] = React.useState<string | null>(null);
    const [deleteMode, setDeleteMode] = React.useState<'message' | 'chat'>('message');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!contact) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
                <div className="text-center">
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a contact to start chatting</p>
                </div>
            </div>
        );
    }
    
    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if(!newMessage.trim()) return;
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
            // Upload file
            const response = await messageService.uploadFile(file);
            console.log("File uploaded:", response);

            // Determine type
            const isImage = file.type.startsWith('image/');
            const type = isImage ? 'image' : 'file';

            // Send message with file URL
            sendMessage(response.fileUrl, type);
        } catch (error) {
            console.error("File upload failed:", error);
            // Optionally add toast notification here
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            <DeleteMessageModal 
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={confirmAction}
                title={deleteMode === 'message' ? "Delete Message?" : "Clear Chat?"}
                description={deleteMode === 'message' 
                    ? "Choose how you would like to delete this message." 
                    : "Choose how you would like to clear this chat history."}
            />

            {/* Header */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-3">
                     {/* Mobile back handle could go here */}
                    <div className="relative">
                        <img 
                            src={contact.image || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} 
                            alt={contact.name} 
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-50"
                        />
                        {contact.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{contact.name}</h3>
                        <p className="text-xs text-green-600 font-medium">
                            {contact.isOnline ? 'Active now' : 'Offline'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => onCallStart('audio')}>
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => onCallStart('video')}>
                        <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-full" onClick={() => setShowMenu(!showMenu)}>
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                     {/* Menu Dropdown */}
                    {showMenu && (
                        <div className="absolute top-10 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                                onClick={() => {
                                    setShowMenu(false);
                                    handleClearChatClick();
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear Chat
                            </button>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="lg:hidden text-gray-400" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {isLoadingMessages ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id; 
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                    <div className="flex items-end gap-2">
                                        {/* Delete Button (Only for me) */}
                                        {isMe && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (msg._id) handleDeleteClick(msg._id);
                                                }}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50 mb-1 opacity-0 group-hover:opacity-100"
                                                title="Delete message"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        
                                        <div 
                                            className={`
                                                group relative px-4 py-3 rounded-2xl shadow-sm border
                                                ${isMe 
                                                    ? 'bg-blue-600 text-white border-blue-600 rounded-tr-none' 
                                                    : 'bg-white text-gray-700 border-gray-100 rounded-tl-none'
                                                }
                                            `}
                                        >
                                            {msg.type === 'image' ? (
                                                <div className="relative">
                                                    <img 
                                                        src={msg.content} 
                                                        alt="Image" 
                                                        className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => window.open(msg.content, '_blank')}
                                                    />
                                                </div>
                                            ) : msg.type === 'file' ? (
                                                <a 
                                                    href={msg.content} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 underline ${isMe ? 'text-white' : 'text-blue-600'}`}
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                    Attachment
                                                </a>
                                            ) : (
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 px-6">
                <form 
                    onSubmit={handleSend}
                    className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        // accept="image/*" // Allow all files for now
                        onChange={handleFileUpload}
                     />
                    <Button type="button" onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 px-2"
                    />
                    <Button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className={`
                            rounded-xl h-10 w-10 p-0 transition-all duration-300
                            ${newMessage.trim() 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rotate-0 scale-100' 
                                : 'bg-gray-200 text-gray-400 rotate-90 scale-90'
                            }
                        `}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
