

// lib/supabase/client.ts - COMPLETE FIXED VERSION FOR REAL-TIME MESSAGING
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton instance to avoid multiple client warnings
let supabaseInstance: any = null;

// FIXED: Direct supabase-js client with optimized real-time configuration
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      realtime: {
        params: {
          eventsPerSecond: 50, // Increased for real-time messaging
        }
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      }
    });
  }
  return supabaseInstance;
})();

// Auth-helpers client for Next.js app router
export const createClient = () => {
  return createClientComponentClient();
};

// Enhanced date formatting function
// Add this to your supabase/client.js file

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Format time consistently
  const timeFormat = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  // Check if the date is today
  if (date >= today) {
    return `Today, ${timeFormat(date)}`;
  }
  
  // Check if the date is yesterday
  if (date >= yesterday && date < today) {
    return `Yesterday, ${timeFormat(date)}`;
  }
  
  // Otherwise, return a formatted date
  return `${date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit' 
  })}`;
};
// Enhanced avatar initial generator
export const getAvatarInitial = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return '?';
  
  const trimmed = name.trim();
  if (!trimmed) return '?';
  
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  if (words.length > 1) {
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
  
  return trimmed.charAt(0).toUpperCase();
};

// FIXED: Real-time message subscription with better error handling
export const subscribeToMessages = (
  callback: (payload: any) => void,
  onError?: (error: Error) => void
) => {
  console.log('Setting up global message subscription for real-time updates');

  const channel = supabase
    .channel('global-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      (payload) => {
        try {
          console.log('Real-time message received:', payload);
          callback(payload);
        } catch (error) {
          console.error('Error in message callback:', error);
          onError?.(error instanceof Error ? error : new Error('Unknown callback error'));
        }
      }
    )
    .subscribe((status) => {
      console.log('Global message subscription status:', status);
      if (status === 'SUBSCRIPTION_ERROR') {
        const error = new Error('Failed to subscribe to messages');
        console.error('Real-time subscription error');
        onError?.(error);
      } else if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time messaging is now active!');
      }
    });

  return () => {
    try {
      console.log('Cleaning up global message subscription');
      supabase.removeChannel(channel);
    } catch (error) {
      console.error('Error removing channel:', error);
    }
  };
};

// FIXED: Subscribe to chat updates
export const subscribeToChatUpdates = (
  callback: (payload: any) => void,
  onError?: (error: Error) => void
) => {
  console.log('Setting up chat updates subscription');

  const channel = supabase
    .channel('chat-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
      },
      (payload) => {
        try {
          console.log('Chat update received:', payload);
          callback(payload);
        } catch (error) {
          console.error('Error in chat update callback:', error);
          onError?.(error instanceof Error ? error : new Error('Unknown callback error'));
        }
      }
    )
    .subscribe((status) => {
      console.log('Chat updates subscription status:', status);
      if (status === 'SUBSCRIPTION_ERROR') {
        const error = new Error('Failed to subscribe to chat updates');
        console.error('Chat subscription error');
        onError?.(error);
      }
    });

  return () => {
    try {
      console.log('Cleaning up chat updates subscription');
      supabase.removeChannel(channel);
    } catch (error) {
      console.error('Error removing chat channel:', error);
    }
  };
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Authentication check error:', error);
      return false;
    }
    return !!user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// FIXED: Enhanced send message function with proper error handling and real-time updates
export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  try {
    console.log('📤 Sending message:', { chatId, senderId, content: content.substring(0, 50) + '...' });
    
    if (!chatId || !senderId || !content.trim()) {
      throw new Error('Missing required parameters: chatId, senderId, or content');
    }

    // First verify that the chat exists and user is a member
    const { data: chatMember, error: memberError } = await supabase
      .from('chat_members')
      .select('chat_id')
      .eq('chat_id', chatId)
      .eq('user_id', senderId)
      .single();

    if (memberError || !chatMember) {
      throw new Error('User is not a member of this chat or chat does not exist');
    }

    // Insert the message
    const messageData = {
      chat_id: chatId,
      sender_id: senderId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        id,
        content,
        sender_id,
        chat_id,
        created_at,
        updated_at,
        users:sender_id (
          id,
          full_name,
          email
        )
      `);
      
    if (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('No message data returned from database');
    }
    
    console.log('✅ Message sent successfully:', data[0]);

    // Update chat's last activity timestamp
    const { error: chatUpdateError } = await supabase
      .from('chats')
      .update({ 
        updated_at: new Date().toISOString() 
      })
      .eq('id', chatId);
      
    if (chatUpdateError) {
      console.warn('Warning: Could not update chat timestamp:', chatUpdateError);
    }
    
    return data[0];
  } catch (error) {
    console.error('❌ Error in sendMessage:', error);
    throw error;
  }
};

// Database connection test
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing database connection...');
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('❌ Database test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test error:', error);
    return false;
  }
};

// Get chat members for a specific chat
export const getChatMembers = async (chatId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_members')
      .select(`
        user_id,
        role,
        joined_at,
        users:user_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('chat_id', chatId);

    if (error) {
      console.error('Error fetching chat members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatMembers:', error);
    return [];
  }
};

// Check if user is member of chat
export const isUserMemberOfChat = async (userId: string, chatId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('chat_members')
      .select('user_id')
      .eq('chat_id', chatId)
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error checking chat membership:', error);
    return false;
  }
};

// Type definitions for better TypeScript support
export interface MessageSubscriptionPayload {
  new: any;
  old?: any;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

export interface ChatSubscriptionPayload {
  new: any;
  old?: any;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

// Export user type
export type { User } from '@supabase/supabase-js';

// Default export
export default supabase;