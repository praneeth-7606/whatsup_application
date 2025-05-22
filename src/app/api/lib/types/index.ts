// export interface User {
//     id: string;
//     email: string;
//     fullName: string;
//     avatarUrl?: string;
//   }
    
//   export interface Message {
//     id: string;
//     chatId: string;
//     chat_id: string; // Database field name
//     senderId: string;
//     sender_id: string; // Database field name
//     content: string;
//     createdAt: string;
//     created_at: string; // Database field name
//     readAt?: string;
//     read_at?: string; // Database field name
//     sender?: {
//       id: string;
//       full_name: string;
//       avatar_url?: string;
//     };
//   }
    
//   export interface ChatMember {
//     id: string;
//     chatId: string;
//     chat_id: string; // Database field name
//     userId: string;
//     user_id: string; // Database field name
//     user?: User;
//   }
    
//   export interface Chat {
//     id: string;
//     name: string;
//     isGroup: boolean;
//     is_group: boolean; // Database field name
//     lastMessage?: Message;
//     members: ChatMember[];
//     unreadCount: number;
//   }

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    phone_number?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ChatLabel {
    id: string;
    name: string;
    color?: string;
    chat_id: string;
    created_at: string;
  }
  
  export interface Chat {
    id: string;
    name: string;
    type: 'direct' | 'group' | 'internal' | 'support';
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
    created_at: string;
    updated_at: string;
    avatar_url?: string;
    avatar_color?: string;
    status?: 'online' | 'offline' | 'away';
    business_name?: string;
    chat_labels?: ChatLabel[];
    participants?: { profile_id: string }[];
  }
  
  export interface Message {
    id?: string;
    chat_id: string;
    sender_id: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    created_at: string;
    updated_at?: string;
    is_read?: boolean;
    profiles?: {
      id: string;
      full_name?: string;
      avatar_url?: string;
    };
  }