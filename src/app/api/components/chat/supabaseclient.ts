


// import { createClient } from '@supabase/supabase-js';

// // Replace with your actual Supabase URL and anon key
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Helper function to format date
// export const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const yesterday = new Date(now);
//   yesterday.setDate(yesterday.getDate() - 1);
  
//   // Format for today
//   if (date.toDateString() === now.toDateString()) {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }
  
//   // Format for yesterday
//   if (date.toDateString() === yesterday.toDateString()) {
//     return 'Yesterday';
//   }
  
//   // Format for this year
//   if (date.getFullYear() === now.getFullYear()) {
//     return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
//   }
  
//   // Format for other years
//   return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(2, 4)}`;
// };

// // Helper function to get avatar initial
// export const getAvatarInitial = (name) => {
//   if (!name) return null;
//   return name.charAt(0).toUpperCase();
// };

// // Subscribe to new messages
// export const subscribeToMessages = (chatId, callback) => {
//   const channel = supabase
//     .channel(`messages:${chatId}`)
//     .on('postgres_changes', { 
//       event: 'INSERT', 
//       schema: 'public', 
//       table: 'messages',
//       filter: `chat_id=eq.${chatId}`
//     }, payload => {
//       callback(payload.new);
//     })
//     .subscribe();
  
//   return () => {
//     supabase.removeChannel(channel);
//   };
// };

// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wnkyovexqrskjwgwxwwf.supabase.co';
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// // Format date for display
// export const formatDate = (dateString: string): string => {
//   try {
//     const date = new Date(dateString);
    
//     // Check if date is valid
//     if (isNaN(date.getTime())) {
//       return 'Invalid date';
//     }
    
//     const now = new Date();
//     const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
//     // Less than 24 hours ago: show time only
//     if (diffHours < 24) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // Less than 7 days ago: show day of week
//     if (diffHours < 24 * 7) {
//       return date.toLocaleDateString([], { weekday: 'short' });
//     }
    
//     // Otherwise: show date
//     return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
//   } catch (error) {
//     console.error('Error formatting date:', error);
//     return 'Date error';
//   }
// };

// // Generate avatar initials
// export const getAvatarInitial = (name: string): string => {
//   try {
//     if (!name || typeof name !== 'string') {
//       return '';
//     }
    
//     const nameParts = name.trim().split(' ');
    
//     if (nameParts.length === 0 || nameParts[0] === '') {
//       return '';
//     }
    
//     if (nameParts.length === 1) {
//       return nameParts[0].charAt(0).toUpperCase();
//     }
    
//     return (
//       nameParts[0].charAt(0).toUpperCase() + 
//       nameParts[nameParts.length - 1].charAt(0).toUpperCase()
//     );
//   } catch (error) {
//     console.error('Error generating avatar initial:', error);
//     return '';
//   }
// };

// // Subscribe to new messages for a chat
// export const subscribeToMessages = (chatId: string, onNewMessage: (message: any) => void) => {
//   try {
//     const subscription = supabase
//       .channel(`messages:${chatId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `chat_id=eq.${chatId}`
//         },
//         (payload) => {
//           onNewMessage(payload.new);
//         }
//       )
//       .subscribe();
    
//     // Return unsubscribe function
//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   } catch (error) {
//     console.error('Error subscribing to messages:', error);
//     return () => {}; // Return empty function if subscription fails
//   }
// };

// // Helper to check if a table exists
// export const checkTableExists = async (tableName: string): Promise<boolean> => {
//   try {
//     const { data, error } = await supabase
//       .rpc('check_table_exists', { table_name: tableName });
      
//     if (error) {
//       console.error(`Error checking if table ${tableName} exists:`, error);
//       return false;
//     }
    
//     return data || false;
//   } catch (error) {
//     console.error(`Error in checkTableExists for ${tableName}:`, error);
//     return false;
//   }
// };

// // Create fallback data for demo purposes
// export const createFallbackData = async () => {
//   try {
//     // Check if user exists
//     const { data: userData, error: userError } = await supabase
//       .from('users')
//       .select('id')
//       .eq('email', 'periskope@example.com')
//       .maybeSingle();
      
//     let userId = userData?.id;
    
//     if (userError || !userId) {
//       // Create user
//       const { data: newUser, error: createError } = await supabase
//         .from('users')
//         .insert({
//           email: 'periskope@example.com',
//           full_name: 'Demo User',
//           created_at: new Date().toISOString()
//         })
//         .select('id')
//         .single();
        
//       if (createError) {
//         console.error('Error creating fallback user:', createError);
//         return false;
//       }
      
//       userId = newUser.id;
//     }
    
//     // Create a demo chat
//     const { data: chatData, error: chatError } = await supabase
//       .from('chats')
//       .insert({
//         name: 'Demo Chat',
//         created_at: new Date().toISOString(),
//         created_by: userId
//       })
//       .select('id')
//       .single();
      
//     if (chatError) {
//       console.error('Error creating fallback chat:', chatError);
//       return false;
//     }
    
//     // Add user as chat member
//     const { error: memberError } = await supabase
//       .from('chat_members')
//       .insert({
//         chat_id: chatData.id,
//         user_id: userId,
//         joined_at: new Date().toISOString()
//       });
      
//     if (memberError) {
//       console.error('Error adding fallback chat member:', memberError);
//     }
    
//     // Add a welcome message
//     const { error: messageError } = await supabase
//       .from('messages')
//       .insert({
//         chat_id: chatData.id,
//         sender_id: userId,
//         content: 'Welcome to the chat app!',
//         created_at: new Date().toISOString()
//       });
      
//     if (messageError) {
//       console.error('Error creating fallback message:', messageError);
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Error in createFallbackData:', error);
//     return false;
//   }
// };

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your own URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

// Get avatar initial for users without avatar
export const getAvatarInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

// Function to create a new chat
export const createChat = async (
  currentUserId: string, 
  otherUserIds: string[], 
  name: string = '', 
  isGroup: boolean = false
) => {
  try {
    // Create the chat
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert([
        {
          name: name || (isGroup ? 'New Group' : ''),
          is_group: isGroup,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (chatError || !chatData || chatData.length === 0) {
      throw new Error(`Failed to create chat: ${chatError?.message || 'Unknown error'}`);
    }

    const chatId = chatData[0].id;

    // Add current user as admin
    await supabase.from('chat_members').insert([
      {
        chat_id: chatId,
        user_id: currentUserId,
        role: 'admin',
        joined_at: new Date().toISOString()
      }
    ]);

    // Add other users as members
    for (const userId of otherUserIds) {
      await supabase.from('chat_members').insert([
        {
          chat_id: chatId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        }
      ]);
    }

    // Add initial welcome message
    await supabase.from('messages').insert([
      {
        chat_id: chatId,
        sender_id: currentUserId,
        content: isGroup ? 'Welcome to the group!' : 'Hello!',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);

    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Function to send a message
export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          sender_id: senderId,
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    // Update the chat's updated_at timestamp
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

    return data?.[0] || null;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to fetch user details
export const fetchUserDetails = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// Function to fetch all users
export const fetchUsers = async (currentUserId: string, searchTerm: string = '') => {
  try {
    let query = supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .neq('id', currentUserId);
    
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    const { data, error } = await query.limit(10);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Function to check if a chat exists between two users
export const checkExistingChat = async (userId1: string, userId2: string) => {
  try {
    // Get all chats for userId1
    const { data: chats1 } = await supabase
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', userId1);
      
    if (!chats1 || chats1.length === 0) return null;
    
    // Get all chats for userId2
    const { data: chats2 } = await supabase
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', userId2);
      
    if (!chats2 || chats2.length === 0) return null;
    
    // Find common chats
    const chatIds1 = chats1.map(c => c.chat_id);
    const chatIds2 = chats2.map(c => c.chat_id);
    const commonChatIds = chatIds1.filter(id => chatIds2.includes(id));
    
    if (commonChatIds.length === 0) return null;
    
    // Check if any of the common chats are direct messages (not groups)
    const { data: directChats } = await supabase
      .from('chats')
      .select('id')
      .in('id', commonChatIds)
      .eq('is_group', false)
      .limit(1);
      
    return directChats && directChats.length > 0 ? directChats[0].id : null;
  } catch (error) {
    console.error('Error checking existing chat:', error);
    return null;
  }
};

export default {
  supabase,
  formatDate,
  getAvatarInitial,
  createChat,
  sendMessage,
  fetchUserDetails,
  fetchUsers,
  checkExistingChat
};