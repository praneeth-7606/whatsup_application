export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            full_name: string | null;
            avatar_url: string | null;
            created_at: string;
            updated_at: string | null;
          };
          Insert: {
            id: string;
            email: string;
            full_name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
            updated_at?: string | null;
          };
          Update: {
            id?: string;
            email?: string;
            full_name?: string | null;
            avatar_url?: string | null;
            created_at?: string;
            updated_at?: string | null;
          };
        };
        chats: {
          Row: {
            id: string;
            name: string | null;
            is_group: boolean;
            created_at: string;
            updated_at: string | null;
          };
          Insert: {
            id?: string;
            name?: string | null;
            is_group: boolean;
            created_at?: string;
            updated_at?: string | null;
          };
          Update: {
            id?: string;
            name?: string | null;
            is_group?: boolean;
            created_at?: string;
            updated_at?: string | null;
          };
        };
        chat_members: {
          Row: {
            id: string;
            chat_id: string;
            user_id: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            chat_id: string;
            user_id: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            chat_id?: string;
            user_id?: string;
            created_at?: string;
          };
        };
        messages: {
          Row: {
            id: string;
            chat_id: string;
            sender_id: string;
            content: string;
            created_at: string;
            read_at: string | null;
          };
          Insert: {
            id?: string;
            chat_id: string;
            sender_id: string;
            content: string;
            created_at?: string;
            read_at?: string | null;
          };
          Update: {
            id?: string;
            chat_id?: string;
            sender_id?: string;
            content?: string;
            created_at?: string;
            read_at?: string | null;
          };
        };
      };
    };
  };