export interface Message {
    _id?: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
    type: 'text' | 'image' | 'call_log' | 'file';
}

export interface ChatContact {
    id: string;
    doctorId?: string; // For navigation to doctor profile
    name: string;
    image?: string;
    lastMessage?: string;
    unread?: number;
    isOnline?: boolean;
    role?: string;
}

export interface CallState {
    isCalling: boolean;
    isReceivingCall: boolean;
    callerName?: string;
    callerId?: string;
    callType: 'audio' | 'video';
    signal?: any;
    callAccepted: boolean;
    callEnded: boolean;
    startTime?: number; // For timer
}
