import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { messageService } from '@/services/message.service';
import { doctorService } from '@/services/doctor.service';
import { ChatContact, Message } from '@/types/chat';

export function useChat() {
    const { socket, onlineUsers } = useSocket();
    const { user } = useAuth();
    const { markMessagesAsRead } = useNotifications();

    // State
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Fetch Contacts Logic
    useEffect(() => {
        if (!user) return;

        const fetchContacts = async () => {
            try {
                // 1. Get recent chats
                const data = await messageService.getContacts();
                const chatContacts = data.data || [];
                const { getImageUrl } = require('@/utils/imageHelper');

                let mappedContacts: ChatContact[] = chatContacts.map((c: any) => ({
                    id: c.id,
                    doctorId: c.role === 'doctor' ? c.id : undefined,
                    name: c.role === 'doctor' ? `Dr. ${c.name}` : c.name,
                    image: getImageUrl(c.image, c.id),
                    role: c.role,
                    isOnline: onlineUsers.includes(c.id),
                    lastMessage: c.lastMessage,
                    unread: c.unread || 0
                }));

                // 2. Integration: If user is patient, load all doctors to allow starting new chats
                if (user.role !== 'doctor') {
                    const allDoctors = await doctorService.getAllDoctors();
                    const doctorContacts = allDoctors
                        .filter(doc => doc.user && typeof doc.user !== 'string' && doc.user.firstName)
                        .map(doc => ({
                            id: doc.user._id,
                            doctorId: doc._id || doc.user._id,
                            name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
                            image: getImageUrl(doc.user.image, doc.user._id),
                            role: 'Doctor',
                            isOnline: onlineUsers.includes(doc.user._id)
                        }));

                    // Merge lists (Dedup)
                    const contactMap = new Map<string, ChatContact>();
                    doctorContacts.forEach(c => contactMap.set(c.id, c));
                    mappedContacts.forEach(c => contactMap.set(c.id, {
                        ...c,
                        doctorId: contactMap.get(c.id)?.doctorId || c.doctorId,
                        lastMessage: contactMap.get(c.id)?.lastMessage || c.lastMessage,
                        unread: contactMap.get(c.id)?.unread || c.unread
                    }));

                    mappedContacts = Array.from(contactMap.values());
                }

                setContacts(mappedContacts);
            } catch (error) {
                console.error("Failed to fetch contacts", error);
            }
        };

        fetchContacts();
    }, [user, onlineUsers]); // Re-run if online status changes too? Maybe optimizing this later.

    // Update online status in real-time
    useEffect(() => {
        setContacts(prev => prev.map(c => ({
            ...c,
            isOnline: onlineUsers.includes(c.id)
        })));
    }, [onlineUsers]);

    // Fetch Messages when active contact changes
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeContact) return;
            setIsLoadingMessages(true);
            try {
                const history = await messageService.getMessages(activeContact.id);
                setMessages(history);
                setMessages(history);
                markMessagesAsRead(activeContact.id);
                // Clear unread in contact list locally
                setContacts(prev => prev.map(c =>
                    c.id === activeContact.id ? { ...c, unread: 0 } : c
                ));
            } catch (error) {
                console.error("Failed to load messages", error);
            } finally {
                setIsLoadingMessages(false);
            }
        };
        loadMessages();
    }, [activeContact]);

    // Socket Event Listeners for Messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: Message) => {
            console.log('[useChat] Received message event:', message);

            // Add ID if missing
            const msg = { ...message, _id: message._id || Math.random().toString() };

            // 1. If relevant to active contact, append to messages
            if (activeContact && (msg.sender === activeContact.id || msg.receiver === activeContact.id)) {
                console.log('[useChat] Message relevant to active contact. Appending.');
                setMessages(prev => {
                    // Dedup
                    if (prev.some(m => m.createdAt === msg.createdAt && m.content === msg.content)) {
                        console.log('[useChat] Duplicate message detected. Skipping.');
                        return prev;
                    }
                    return [...prev, msg];
                });
                markMessagesAsRead(msg.sender);
            } else {
                console.log('[useChat] Message NOT for active contact (Active:', activeContact?.id, 'Sender:', msg.sender, ')');
            }

            // 2. Update Contact List (Last Message, Unread Count, Dynamic Addition)
            setContacts(prev => {
                const senderId = msg.sender;
                const isKnownContact = prev.some(c => c.id === senderId);

                if (isKnownContact) {
                    let updatedContacts = prev.map(c => {
                        if (c.id === senderId) {
                            const isActive = activeContact && activeContact.id === senderId;
                            return {
                                ...c,
                                lastMessage: msg.content,
                                unread: isActive ? 0 : (c.unread || 0) + 1
                            };
                        }
                        return c;
                    });

                    // Move to top
                    updatedContacts.sort((a, b) => {
                        if (a.id === senderId) return -1;
                        if (b.id === senderId) return 1;
                        return 0;
                    });
                    return updatedContacts;
                }

                // If Unknown sender, trigger refetch to get details
                if (!isKnownContact && senderId !== user?._id) {
                    console.log('[useChat] Unknown sender. Refetching contacts.');
                    messageService.getContacts().then(APIres => {
                        if (APIres.data) {
                            const chatContacts = APIres.data || [];
                            const mapped = chatContacts.map((c: any) => ({
                                id: c.id,
                                doctorId: c.role === 'doctor' ? c.id : undefined,
                                name: c.role === 'doctor' ? `Dr. ${c.name}` : c.name,
                                image: c.image,
                                role: c.role,
                                isOnline: onlineUsers.includes(c.id),
                                lastMessage: c.lastMessage,
                                unread: c.unread
                            }));
                            setContacts(current => mapped); // Simplify: Just replace with fresh State
                        }
                    });
                }

                return prev;
            });
        };

        const handleMessageSent = (message: Message) => {
            // Update last message for receiver and move to top
            setContacts(prev => {
                let updated = prev.map(c => {
                    if (c.id === message.receiver) {
                        return { ...c, lastMessage: message.content };
                    }
                    return c;
                });

                // Sort
                updated.sort((a, b) => {
                    if (a.id === message.receiver) return -1;
                    if (b.id === message.receiver) return 1;
                    return 0;
                });

                return updated;
            });

            setMessages(prev => {
                // Attempt to find the optimistic message to replace
                // Heuristic: Same content, same sender, and ID looks like a temp ID (contains dot from Math.random)
                const optimisticIndex = prev.findIndex(m =>
                    m.content === message.content &&
                    m.sender === user?._id &&
                    (m._id.includes('.') || m._id.length > 30) // Backup in case random string is long, MongoID is 24 chars
                );

                if (optimisticIndex !== -1) {
                    const newMsgs = [...prev];
                    newMsgs[optimisticIndex] = message;
                    return newMsgs;
                }
                return [...prev, message];
            });
        };

        const handleMessageDeleted = (messageId: string) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        };

        const handleChatCleared = (data: { receiverId?: string; senderId?: string }) => {
            // Determine the contact ID involved in the clear action
            const contactId = data.receiverId || data.senderId;

            // 1. Clear messages if this is the active chat
            if (activeContact && (activeContact.id === contactId)) {
                setMessages([]);
            }

            // 2. Update contact list to remove last message
            if (contactId) {
                setContacts(prev => prev.map(c => {
                    if (c.id === contactId) {
                        return { ...c, lastMessage: '' };
                    }
                    return c;
                }));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_sent', handleMessageSent);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('chat_cleared', handleChatCleared);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_sent', handleMessageSent);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('chat_cleared', handleChatCleared);
        };
    }, [socket, activeContact]);


    // Notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: Message) => {
            console.log('[useChat] Notification Handler triggered:', msg);
            if (activeContact && (msg.sender === activeContact.id || msg.receiver === activeContact.id)) {
                // Already handled in state update of the active chat
                console.log('[useChat] Notification suppressed: Chat is active');
            } else {
                // Show toast for other conversations
                // Try to find the sender name from contacts
                const sender = contacts.find(c => c.id === msg.sender);
                const senderName = sender ? sender.name : 'Someone';

                console.log('[useChat] Showing toast from:', senderName);

                toast.message(`New message from ${senderName}`, {
                    description: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
                });
            }
        };

        socket.on('receive_message', handleNewMessage);
        return () => {
            socket.off('receive_message', handleNewMessage);
        };
    }, [socket, activeContact, contacts]);

    const sendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
        if (!socket || !activeContact) {
            console.error("Cannot send message: Socket or ActiveContact missing", {
                socket: !!socket,
                socketId: socket?.id,
                activeContact: activeContact
            });
            return;
        }

        // 1. Prepare data for Socket (needs receiverId)
        const socketPayload = {
            sender: user?._id,
            receiverId: activeContact.id,
            content,
            type,
            createdAt: new Date().toISOString()
        };

        socket.emit('send_message', socketPayload);

        // 2. Prepare data for UI (needs receiver)
        const optimisticMsg: Message = {
            _id: Math.random().toString(), // Temp ID
            sender: user?._id || '', // Ensure string
            receiver: activeContact.id,
            content,
            type,
            createdAt: socketPayload.createdAt
        };

        setMessages(prev => [...prev, optimisticMsg]);
    };

    const deleteMessage = (messageId: string, deleteType: 'me' | 'everyone' = 'everyone') => {
        if (!socket || !activeContact) return;


        // Emit socket event with type
        socket.emit('delete_message', { messageId, receiverId: activeContact.id, type: deleteType });

        // Always remove locally for now (optimistic)
        // In a real app, 'delete for me' might need a backend call to mark as deleted for this user only
        setMessages(prev => prev.filter(m => m._id !== messageId));
    };

    const clearChat = (deleteType: 'me' | 'everyone' = 'everyone') => {
        if (!socket || !activeContact) return;
        socket.emit('clear_chat', { receiverId: activeContact.id, type: deleteType });
        setMessages([]);
    };

    return {
        contacts,
        activeContact,
        setActiveContact,
        messages,
        sendMessage,
        deleteMessage,
        clearChat,
        isLoadingMessages
    };
}
