// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
// import { useAuth } from '../auth/authprovider';
import { useAuth } from '../api/components/auth/authprovider';

// Initialize Supabase client with the same pattern used in your component
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Get the existing supabase instance if available in the global scope
let supabase: ReturnType<typeof createClient>;
try {
  if (typeof window !== 'undefined' && (window as any).supabase) {
    supabase = (window as any).supabase;
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    if (typeof window !== 'undefined') {
      (window as any).supabase = supabase;
    }
  }
} catch (e) {
  console.error("Error creating Supabase client:", e);
  supabase = createClient(supabaseUrl, supabaseKey);
}

interface ChatParticipant {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const useChat = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch participants of a chat
  const fetchChatParticipants = useCallback(async (chatId: string): Promise<ChatParticipant[]> => {
    if (!chatId || !user) return [];

    try {
      setLoading(true);
      setError(null);

      // First, check if the user is a participant of this chat
      const { data: userParticipation, error: participationError } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('chat_id', chatId)
        .eq('user_id', user.id);

      if (participationError) {
        throw participationError;
      }

      if (!userParticipation || userParticipation.length === 0) {
        throw new Error('You are not a participant of this chat');
      }

      // Fetch all participants of this chat
      const { data: participants, error: fetchError } = await supabase
        .from('chat_participants')
        .select('user_id')
        .eq('chat_id', chatId);

      if (fetchError) {
        throw fetchError;
      }

      if (!participants || participants.length === 0) {
        return [];
      }

      // Get the user details for each participant
      const userIds = participants.map(p => p.user_id);
      const { data: userProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        throw profilesError;
      }

      return userProfiles || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching chat participants:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to send a message in a chat
  const sendMessage = useCallback(async (chatId: string, content: string): Promise<Message | null> => {
    if (!chatId || !user || !content.trim()) return null;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: user.id,
            content
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error sending message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to fetch messages for a chat
  const fetchMessages = useCallback(async (chatId: string): Promise<Message[]> => {
    if (!chatId || !user) return [];

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching messages:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to create a new chat
  const createChat = useCallback(async (participantIds: string[]): Promise<string | null> => {
    if (!user || participantIds.length === 0) return null;

    // Make sure the current user is included
    const allParticipantIds = [...new Set([user.id, ...participantIds])];

    try {
      setLoading(true);
      setError(null);

      // First create the chat
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .insert([{ created_by: user.id }])
        .select()
        .single();

      if (chatError) {
        throw chatError;
      }

      const chatId = chatData.id;

      // Then add all participants
      const participantsToInsert = allParticipantIds.map(userId => ({
        chat_id: chatId,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(participantsToInsert);

      if (participantsError) {
        throw participantsError;
      }

      return chatId;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating chat:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchChatParticipants,
    sendMessage,
    fetchMessages,
    createChat
  };
};