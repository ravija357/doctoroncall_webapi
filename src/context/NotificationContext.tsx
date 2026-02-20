"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import axios from 'axios';
import { toast } from 'sonner';

export interface INotification {
  _id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  relatedId?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  unreadMessageCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markMessagesAsRead: (senderId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/notifications', { withCredentials: true });
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
      
      // Fetch unread messages
      const msgRes = await axios.get('http://localhost:3001/api/messages/unread-count', { withCredentials: true });
      if (msgRes.data.success) {
          setUnreadMessageCount(msgRes.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: INotification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(notification.message);
    };

    const handleNewMessage = () => {
        setUnreadMessageCount(prev => prev + 1);
    }

    socket.on('receive_notification', handleNewNotification);
    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_notification', handleNewNotification);
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket]);

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:3001/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:3001/api/notifications/read-all`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
       console.error("Failed to mark all as read", error);
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
      try {
          await axios.put(`http://localhost:3001/api/messages/read/${senderId}`, {}, { withCredentials: true });
          // Optimistically decrement? Or just re-fetch?
          // Re-fetching is safer to get exact count
           const msgRes = await axios.get('http://localhost:3001/api/messages/unread-count', { withCredentials: true });
           if (msgRes.data.success) {
               setUnreadMessageCount(msgRes.data.count);
           }
      } catch (error) {
          console.error("Failed to mark messages as read", error);
      }
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, unreadMessageCount, isLoading, markAsRead, markAllAsRead, fetchNotifications, markMessagesAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
