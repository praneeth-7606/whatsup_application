
// hooks/useRealtimeMessages.ts
import { useEffect, useState } from 'react';
// import { createClient } from '../lib/supabase/client';
import { createClient } from '../api/lib/supabase/client';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  sender?: {
    id: string;
    name?: string;
    full_name?: string;
    username?: string;
    email?: string;
    avatar?: string;
    avatar_url?: string;
    raw_user_meta_data?: any;
  };
}

// Helper function to get display name from user data
export const getUserDisplayName = (sender: any): string => {
  if (!sender) return 'Unknown User';
  
  return sender.name || 
         sender.full_name || 
         sender.username || 
         sender.raw_user_meta_data?.name ||
         sender.raw_user_meta_data?.full_name ||
         sender.email?.split('@')[0] ||
         'Unknown User';
};

// Helper function to get user avatar
export const getUserAvatar = (sender: any): string | undefined => {
  if (!sender) return undefined;
  
  return sender.avatar || 
         sender.avatar_url || 
         sender.raw_user_meta_data?.avatar_url;
};

// Fix the chat labels query
export const fetchChatLabels = async (supabase: any, chatId: string) => {
  try {
    // Corrected query syntax - try different approaches
    const { data, error } = await supabase
      .from('chat_labels')
      .select(`
        id,
        chat_id,
        label_id,
        labels (
          id,
          name,
          color
        )
      `)
      .eq('chat_id', chatId);

    if (error) {
      console.error('Error fetching chat labels:', error);
      
      // Fallback: try simpler query
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('chat_labels')
        .select('*')
        .eq('chat_id', chatId);
      
      if (!fallbackError) {
        return fallbackData || [];
      }
      
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error:', err);
    return [];
  }
};

// Real-time message subscription hook
export const useRealtimeMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;

    // Initial fetch with fallback queries
    const fetchMessages = async () => {
      try {
        // Try different possible column combinations
        const queries = [
          // Option 1: Standard columns
          `*,
           sender:sender_id (
             id,
             name,
             email,
             avatar
           )`,
          
          // Option 2: Common alternative column names
          `*,
           sender:sender_id (
             id,
             full_name,
             email,
             avatar_url
           )`,
          
          // Option 3: Basic user columns
          `*,
           sender:sender_id (
             id,
             username,
             email
           )`,
          
          // Option 4: Auth users table (if using Supabase auth)
          `*,
           sender:sender_id (
             id,
             raw_user_meta_data,
             email
           )`,
          
          // Option 5: Just get basic message data without join
          `*`
        ];

        let data = null;
        let error = null;

        // Try each query until one works
        for (const selectQuery of queries) {
          const result = await supabase
            .from('messages')
            .select(selectQuery)
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
          
          if (!result.error) {
            data = result.data;
            console.log('Successful query:', selectQuery);
            break;
          } else {
            console.log('Query failed:', selectQuery, result.error);
            error = result.error;
          }
        }

        if (error && !data) {
          console.error('All queries failed. Last error:', error);
        } else if (data && isMounted) {
  const mappedMessages: Message[] = data.map((msg: any) => ({
    id: msg.id,
    chat_id: msg.chat_id,
    sender_id: msg.sender_id,
    content: msg.content,
    message_type: msg.message_type || 'text',
    created_at: msg.created_at,
    sender: msg.sender || undefined
  }));
  setMessages(mappedMessages);
}
        
      } catch (err) {
        console.error('Unexpected error fetching messages:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages:chat_id=eq.${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload: any) => {
          console.log('Real-time message update:', payload);
          
          if (!isMounted) return;

          if (payload.eventType === 'INSERT') {
            // For new messages, try to fetch with user info, but fallback to basic message
            const fetchNewMessage = async () => {
              const queries = [
                `*,
                 sender:sender_id (
                   id,
                   name,
                   email,
                   avatar
                 )`,
                `*,
                 sender:sender_id (
                   id,
                   full_name,
                   email,
                   avatar_url
                 )`,
                `*,
                 sender:sender_id (
                   id,
                   username,
                   email
                 )`,
                `*`
              ];

              for (const query of queries) {
                const { data: newMessage } = await supabase
                  .from('messages')
                  .select(query)
                  .eq('id', payload.new.id)
                  .single();

                if (newMessage) {
                  return newMessage;
                }
              }
              
              // Fallback to payload data
              return payload.new;
            };

            const newMessage = await fetchNewMessage();
if (newMessage) {
  setMessages(prev => [...prev, newMessage as Message]);
}
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev =>
              prev.filter(msg => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return { messages, loading };
};

// Send message function
export const sendMessage = async (
  chatId: string,
  senderId: string,
  messageText: string
) => {
  const supabase = createClient();
  
  try {
    // First insert the message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          sender_id: senderId,
          content: messageText,
          message_type: 'text',
          created_at: new Date().toISOString()
        }
      ])
      .select('*');

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }

    // Try to fetch with user info, but don't fail if it doesn't work
    if (data && data[0]) {
      const messageId = data[0].id;
      
      // Try different user table approaches
      const userQueries = [
        // Custom users table
        `*, sender:sender_id (id, name, email, avatar)`,
        `*, sender:sender_id (id, full_name, email, avatar_url)`,
        `*, sender:sender_id (id, username, email)`,
      ];

      for (const query of userQueries) {
        try {
          const { data: messageWithUser } = await supabase
            .from('messages')
            .select(query)
            .eq('id', messageId)
            .single();

          if (messageWithUser) {
            return { success: true, data: messageWithUser };
          }
        } catch {
          // Continue to next query
        }
      }

      // Fallback: return message without user info
      return { success: true, data: data[0] };
    }

    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('Unexpected error sending message:', err);
    return { success: false, error: err };
  }
};