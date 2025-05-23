
"use client";


import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from './chatsiderbar';
import ChatList from './chatlist';
import ChatWindow from './chatwindow';
import LabelManagementModal from './labelmanagementmodel';
import NewChatModal from './newchatmodel';
import LogoutButton from '../auth/logoutbutton';
// import { Chat } from '../../lib/types';
import {
  supabase, 
  formatDate, 
  getAvatarInitial,
  sendMessage,
  subscribeToMessages,
  subscribeToChatUpdates,
  testDatabaseConnection,
  isUserMemberOfChat
} from '../../lib/supabase/client';

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar: string | null;
  type: string;
  label?: string;
  secondaryLabel?: string;
  unread: number;
  isActive?: boolean;
  messages: Message[];
  memberCount?: number;
  lastReadMessageId?: string;
  phone?: string;
  status?: 'Demo' | 'Content' | 'Signup' | 'Internal';
  tags?: string[];
}
// Add these interface definitions after your existing ones
interface ChatMemberResponse {
  user_id: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
}

interface MessageResponse {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  users: {
    full_name: string;
    email: string;
  } | null;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  senderName?: string;
  phone?: string;
  email?: string;
  isRead?: boolean;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

interface ChatLayoutProps {
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  isDemo?: boolean;
}

const ChatLayout = ({ 
  currentUserId, 
  currentUserName,
  currentUserEmail,
  isDemo = false
}: ChatLayoutProps) => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [useRealDatabase, setUseRealDatabase] = useState<boolean>(!isDemo);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (isDemo) {
      router.push('/');
    } else {
      // The LogoutButton component will handle the actual logout
      router.push('/api/auth/login');
    }
  }, [isDemo, router]);

  // Real-time message handler
  const handleRealTimeMessage = useCallback(async (payload: any) => {
    if (!payload.new || !currentUser) return;

    const newMsg = payload.new;
    console.log('📨 Processing real-time message:', newMsg);

    if (newMsg.sender_id === currentUser.id) {
      console.log('Skipping own message');
      return;
    }

    if (useRealDatabase) {
      const isMember = await isUserMemberOfChat(currentUser.id, newMsg.chat_id);
      if (!isMember) {
        console.log('Message not for our chat');
        return;
      }
    }

    const { data: senderData } = useRealDatabase ? await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', newMsg.sender_id)
      .single() : { data: null };

    const formattedMessage: Message = {
      id: newMsg.id,
      text: newMsg.content,
      sender: 'them',
      time: formatDate(newMsg.created_at),
      senderName: senderData?.full_name || 'Unknown',
      email: senderData?.email,
      isRead: false
    };

    console.log('✅ Adding real-time message to chat:', newMsg.chat_id);

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === newMsg.chat_id) {
          const messageExists = chat.messages.some(m => m.id === newMsg.id);
          if (messageExists) {
            console.log('Message already exists, skipping');
            return chat;
          }

          const isCurrentlyActive = chat.id === activeChat;
          const newUnreadCount = isCurrentlyActive ? 0 : chat.unread + 1;

          if (!isCurrentlyActive && Notification.permission === 'granted') {
            new Notification(`New message from ${formattedMessage.senderName}`, {
              body: formattedMessage.text,
              icon: '/favicon.ico'
            });
          }

          return {
            ...chat,
            messages: [...chat.messages, formattedMessage],
            lastMessage: formattedMessage.text,
            lastMessageTime: formattedMessage.time,
            unread: newUnreadCount
          };
        }
        return chat;
      });
    });
  }, [currentUser, activeChat, useRealDatabase]);

  // Handle chat updates
  const handleChatUpdate = useCallback((payload: any) => {
    if (!payload.new || !currentUser) return;
    
    const updatedChat = payload.new;
    console.log('🔄 Processing chat update:', updatedChat);
    
    // Update the chat in our state if it exists
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === updatedChat.id) {
          return {
            ...chat,
            name: updatedChat.name || chat.name,
            lastMessageTime: formatDate(updatedChat.updated_at) || chat.lastMessageTime
          };
        }
        return chat;
      });
    });
  }, [currentUser]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!useRealDatabase || !currentUser) return;

    console.log('🔔 Setting up real-time subscriptions...');

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    const messageCleanup = subscribeToMessages(
      handleRealTimeMessage,
      (error) => {
        console.error('Real-time message subscription error:', error);
        setIsConnected(false);
      }
    );
    
    const chatCleanup = subscribeToChatUpdates(
      handleChatUpdate,
      (error) => {
        console.error('Real-time chat subscription error:', error);
      }
    );

    setIsConnected(true);

    return () => {
      console.log('🔌 Cleaning up real-time subscriptions');
      messageCleanup();
      chatCleanup();
      setIsConnected(false);
    };
  }, [useRealDatabase, currentUser, handleRealTimeMessage, handleChatUpdate]);

  // Create dummy data that matches the screenshot
  const createDummyData = useCallback(() => {
    const fallbackUser: User = {
      id: currentUserId,
      full_name: currentUserName,
      email: currentUserEmail,
      avatar_url: null
    };
    
    setCurrentUser(fallbackUser);
    
    const dummyLabels: Label[] = [
      { id: 'label-1', name: 'Demo', color: '#FFA500' },
      { id: 'label-2', name: 'Content', color: '#32CD32' },
      { id: 'label-3', name: 'Signup', color: '#FF6347' },
      { id: 'label-4', name: 'Internal', color: '#4169E1' }
    ];
    
    setAvailableLabels(dummyLabels);
    
    // Create dummy chats that match the screenshot exactly
    const dummyChats: Chat[] = [
      {
        id: 'test-skope-final-5',
        name: 'Test Skope Final 5',
        lastMessage: "Support2: This doesn't go on Tuesday...",
        lastMessageTime: 'Yesterday, 04:30 PM',
        avatar: 'TS',
        type: 'Group',
        status: 'Demo',
        phone: '+91 99748 44008',
        unread: 0,
        memberCount: 3,
        messages: [
          {
            id: 'msg-1',
            text: "Support2: This doesn't go on Tuesday...",
            sender: 'them',
            time: 'Yesterday, 04:30 PM',
            senderName: 'Support2'
          }
        ]
      },
      {
        id: 'periskope-team-chat',
        name: 'Periskope Team Chat',
        lastMessage: 'Periskope: Test message',
        lastMessageTime: '28-Feb-25, 10:15 AM',
        avatar: 'PT',
        type: 'Group',
        status: 'Internal',
        phone: '+91 99748 44008',
        unread: 1,
        memberCount: 4,
        messages: [
          {
            id: 'msg-2',
            text: 'Test message',
            sender: 'periskope',
            time: '28-Feb-25, 10:15 AM',
            senderName: 'Periskope'
          },
          {
            id: 'msg-welcome',
            text: 'hello',
            sender: 'periskope',
            time: '28-Feb-25, 12:07 PM',
            senderName: 'Periskope'
          }
        ]
      },
      {
        id: 'phone-99999-99999',
        name: '+91 99999 99999',
        lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
        lastMessageTime: '25-Feb-25, 09:30 AM',
        avatar: '+9',
        type: 'Direct',
        status: 'Signup',
        phone: '+91 92896 65969',
        unread: 0,
        memberCount: 2,
        messages: [
          {
            id: 'msg-3',
            text: "Hi there, I'm Swapnika, Co-Founder of ...",
            sender: 'them',
            time: '25-Feb-25, 09:30 AM',
            senderName: 'Swapnika'
          }
        ]
      },
      {
        id: 'test-demo17',
        name: 'Test Demo17',
        lastMessage: 'Rohosen: 123',
        lastMessageTime: '25-Feb-25, 02:45 PM',
        avatar: 'TD',
        type: 'Direct',
        status: 'Content',
        phone: '+91 99748 44008',
        unread: 0,
        memberCount: 2,
        messages: [
          {
            id: 'msg-4',
            text: '123',
            sender: 'them',
            time: '25-Feb-25, 02:45 PM',
            senderName: 'Rohosen'
          }
        ]
      },
      {
        id: 'test-el-centro',
        name: 'Test El Centro',
        lastMessage: 'Roshnag: Hello, Ahmadport!',
        lastMessageTime: '04-Feb-25, 11:20 AM',
        avatar: 'TC',
        type: 'Direct',
        status: 'Demo',
        phone: '+91 99748 44008',
        unread: 0,
        memberCount: 2,
        messages: [
          {
            id: 'msg-5-1',
            text: 'Hello, Livonia!',
            sender: 'them',
            time: '04-Feb-25, 08:01 AM',
            senderName: 'Test El Centro'
          },
          {
            id: 'msg-5-2',
            text: 'CDERT',
            sender: 'them',
            time: '04-Feb-25, 09:49 AM',
            senderName: 'Roshnag Airtel'
          }
        ]
      },
      {
        id: 'testing-group',
        name: 'Testing group',
        lastMessage: 'Testing 12345',
        lastMessageTime: '27-Jan-25, 03:15 PM',
        avatar: 'TG',
        type: 'Group',
        status: 'Demo',
        phone: '+91 92896 65969',
        unread: 0,
        memberCount: 5,
        messages: [
          {
            id: 'msg-6-1',
            text: 'test el centro',
            sender: 'periskope',
            time: '27-Jan-25, 09:49 AM',
            senderName: 'Periskope'
          },
          {
            id: 'msg-6-2',
            text: 'testing',
            sender: 'periskope',
            time: '27-Jan-25, 03:15 PM',
            senderName: 'Periskope'
          }
        ]
      }
    ];
    
    setChats(dummyChats);
    setActiveChat(dummyChats[1].id); // Set Periskope Team Chat as active
    setIsLoading(false);
  }, [currentUserId, currentUserName, currentUserEmail]);

  // Initialize data
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      setIsLoading(true);

      // Set current user
      const user: User = {
        id: currentUserId,
        full_name: currentUserName,
        email: currentUserEmail,
        avatar_url: null
      };
      
      setCurrentUser(user);

      if (isDemo || !useRealDatabase) {
        console.log('Using demo mode');
        if (isMounted) createDummyData();
        return;
      }

      const dbConnected = await testDatabaseConnection();
      if (!dbConnected) {
        console.log('Database connection failed, using demo mode');
        if (isMounted) createDummyData();
        return;
      }

      try {
        // Load labels first
        await loadLabels();
        // Then load chats
        await loadUserChats(currentUserId);
      } catch (error) {
        console.error('Error initializing:', error);
        if (isMounted) createDummyData();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, currentUserName, currentUserEmail, isDemo, useRealDatabase, createDummyData]);

  // Load available labels
  const loadLabels = async () => {
    if (!useRealDatabase) return;
    
    try {
      const { data, error } = await supabase
        .from('labels')
        .select('id, name, color')
        .order('name');
        
      if (error) {
        console.error('Error loading labels:', error);
        // Fallback to dummy labels
        const dummyLabels: Label[] = [
          { id: 'label-1', name: 'Demo', color: '#FFA500' },
          { id: 'label-2', name: 'Content', color: '#32CD32' },
          { id: 'label-3', name: 'Signup', color: '#FF6347' },
          { id: 'label-4', name: 'Internal', color: '#4169E1' }
        ];
        setAvailableLabels(dummyLabels);
        return;
      }
      
      if (data && data.length > 0) {
        setAvailableLabels(data);
      } else {
        // No labels found, create default ones
        const defaultLabels: Label[] = [
          { id: 'label-1', name: 'Demo', color: '#FFA500' },
          { id: 'label-2', name: 'Content', color: '#32CD32' },
          { id: 'label-3', name: 'Signup', color: '#FF6347' },
          { id: 'label-4', name: 'Internal', color: '#4169E1' }
        ];
        
        // Insert default labels
        for (const label of defaultLabels) {
          await supabase.from('labels').insert([label]);
        }
        
        setAvailableLabels(defaultLabels);
      }
    } catch (error) {
      console.error('Error in loadLabels:', error);
      // Fallback to dummy labels
      const dummyLabels: Label[] = [
        { id: 'label-1', name: 'Demo', color: '#FFA500' },
        { id: 'label-2', name: 'Content', color: '#32CD32' },
        { id: 'label-3', name: 'Signup', color: '#FF6347' },
        { id: 'label-4', name: 'Internal', color: '#4169E1' }
      ];
      setAvailableLabels(dummyLabels);
    }
  };

  // Load user chats
  const loadUserChats = async (userId: string) => {
    try {
      console.log('📂 Loading chats for user:', userId);

      const { data: userChatMembers, error } = await supabase
        .from('chat_members')
        .select(`
          chat_id,
          chats:chat_id (
            id,
            name,
            is_group,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (error || !userChatMembers || userChatMembers.length === 0) {
        console.log('No chats found for user, using demo data');
        createDummyData();
        return;
      }

       const chatsList = userChatMembers
      .filter((member: any) => member.chats && member.chats !== null)
      .map((member: any) => member.chats)
      .filter((chat: any) => chat !== null);

      if (chatsList.length === 0) {
        console.log('No valid chats found, using demo data');
        createDummyData();
        return;
      }

      const enrichedChats = await Promise.all(
      chatsList.map(async (chat: any) => await enrichChatWithData(chat, userId))
    );


      const validChats = enrichedChats.filter(chat => chat !== null) as Chat[];
      const sortedChats = validChats.sort((a, b) => {
        // Parse the dates for comparison
        const dateA = parseDate(a.lastMessageTime);
        const dateB = parseDate(b.lastMessageTime);
        return dateB.getTime() - dateA.getTime();
      });

      setChats(sortedChats);
      if (sortedChats.length > 0) {
        setActiveChat(sortedChats[0].id);
      }

      console.log('✅ Loaded', sortedChats.length, 'chats');
    } catch (error) {
      console.error('Error loading chats:', error);
      createDummyData();
    }
  };

  // Helper to parse date strings for comparison
  const parseDate = (dateString: string): Date => {
    try {
      // Try parsing common formats
      if (dateString.includes('Today') || dateString.includes('Yesterday')) {
        return new Date(); // Use current date as a fallback for relative dates
      }
      
      // Try parsing "DD-MMM-YY, HH:MM AM/PM" format
      const match = dateString.match(/(\d{2})-([A-Za-z]{3})-(\d{2}),?\s+(.+)/);
      if (match) {
        const [_, day, month, year, time] = match;
        const monthMap: {[key: string]: number} = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        
        const monthNum = monthMap[month];
        if (monthNum !== undefined) {
          const fullYear = 2000 + parseInt(year);
          const timeParts = time.match(/(\d{1,2}):(\d{2})(?:\s*([AP]M))?/);
          if (timeParts) {
            let [__, hours, minutes, ampm] = timeParts;
            let hour = parseInt(hours);
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            
            return new Date(fullYear, monthNum, parseInt(day), hour, parseInt(minutes));
          }
        }
      }
      
      // Default fallback to Date parsing
      return new Date(dateString);
    } catch {
      // If all parsing fails, return current date
      return new Date();
    }
  };

  // Enrich chat with messages and member data
  const enrichChatWithData = async (chat: any, userId: string): Promise<Chat | null> => {
    try {
      const { data: chatMembers } = await supabase
        .from('chat_members')
        .select(`
          user_id,
          users:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('chat_id', chat.id);

      let displayName = chat.name || 'Unknown Chat';
      let avatar = null;

      if (!chat.is_group && chatMembers && chatMembers.length >= 2) {
        const otherUser = (chatMembers as ChatMemberResponse[]).find(member => 
  member.user_id !== userId && member.users !== null
);
        
        if (otherUser && otherUser.users) {
          displayName = otherUser.users.full_name || 'Unknown User';
          avatar = otherUser.users.avatar_url;
        }
      }

      const { data: lastMessageData } = await supabase
        .from('messages')
        .select(`
          content,
          sender_id,
          created_at,
          users:sender_id (full_name)
        `)
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: false })
        .limit(1);

      let lastMessage = 'No messages';
      let lastMessageTime = chat.updated_at || new Date().toISOString();

      if (lastMessageData && lastMessageData.length > 0) {
        const msg = lastMessageData[0];
        const senderName = msg.users?.full_name || 'Unknown';
        
        lastMessage = msg.sender_id === userId 
          ? `You: ${msg.content}` 
          : chat.is_group 
            ? `${senderName}: ${msg.content}`
            : msg.content;
        lastMessageTime = msg.created_at;
      }

      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chat.id)
        .neq('sender_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const unreadCount = unreadMessages ? Math.min(unreadMessages.length, 9) : 0;

      // Get chat label/status
      const { data: chatLabel } = await supabase
        .from('chat_labels')
        .select(`
          labels:label_id (
            id,
            name,
            color
          )
        `)
        .eq('chat_id', chat.id)
        .single();

      let status: 'Demo' | 'Content' | 'Signup' | 'Internal' | undefined = undefined;
      
      if (chatLabel && chatLabel.labels && chatLabel.labels.name) {
        // Check if the label name matches one of our status types
        const labelName = chatLabel.labels.name;
        if (labelName === 'Demo' || labelName === 'Content' || 
            labelName === 'Signup' || labelName === 'Internal') {
          status = labelName;
        }
      }
      
      // Default status based on chat type if none found
      if (!status) {
        status = chat.is_group ? 'Demo' : 'Content';
      }

      return {
        id: chat.id,
        name: displayName,
        lastMessage: lastMessage,
        lastMessageTime: formatDate(lastMessageTime),
        avatar: avatar || getAvatarInitial(displayName),
        type: chat.is_group ? 'Group' : 'Direct',
        status: status,
        unread: unreadCount,
        memberCount: chatMembers ? chatMembers.length : 2,
        messages: []
      };
    } catch (error) {
      console.error('Error enriching chat:', error);
      return null;
    }
  };

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const loadChatMessages = async () => {
      try {
        console.log('📄 Loading messages for chat:', activeChat);

        if (useRealDatabase) {
          const { data: messagesData, error } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              sender_id,
              created_at,
              users:sender_id (full_name, email)
            `)
            .eq('chat_id', activeChat)
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Error loading messages:', error);
            return;
          }

          if (messagesData && messagesData.length > 0) {
            const formattedMessages: Message[] = (messagesData as MessageResponse[]).map(msg => ({
              id: msg.id,
              text: msg.content,
              sender: msg.sender_id === currentUser?.id ? 'periskope' : 'them',
              time: formatDate(msg.created_at),
              senderName: msg.users?.full_name || 'Unknown',
              email: msg.users?.email,
              isRead: msg.sender_id === currentUser?.id
            }));

            setChats(prevChats =>
              prevChats.map(chat => {
                if (chat.id === activeChat) {
                  return {
                    ...chat,
                    messages: formattedMessages,
                    unread: 0
                  };
                }
                return chat;
              })
            );

            console.log('✅ Loaded', formattedMessages.length, 'messages');
          }
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    };

    loadChatMessages();
  }, [activeChat, useRealDatabase, currentUser]);

  // Send message function
  const handleSendMessage = useCallback(async (chatId: string, text: string) => {
    if (!currentUser || !text.trim()) {
      console.warn('Cannot send message: missing user or text');
      return;
    }

    try {
      console.log('📤 Sending message...', { chatId, text: text.trim() });

      if (useRealDatabase) {
        const sentMessage = await sendMessage(chatId, currentUser.id, text.trim());
        
        const formattedMessage: Message = {
          id: sentMessage.id,
          text: sentMessage.content,
          sender: 'periskope',
          time: formatDate(sentMessage.created_at),
          senderName: currentUser.full_name,
          email: currentUser.email,
          isRead: true
        };

        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === chatId) {
              const messageExists = chat.messages.some(m => m.id === sentMessage.id);
              if (messageExists) return chat;

              return {
                ...chat,
                messages: [...chat.messages, formattedMessage],
                lastMessage: `You: ${text.trim()}`,
                lastMessageTime: formatDate(new Date().toISOString())
              };
            }
            return chat;
          })
        );

        console.log('✅ Message sent successfully');
      } else {
        const demoMessage: Message = {
          id: `demo-${Date.now()}-${Math.random()}`,
          text: text.trim(),
          sender: 'periskope',
          time: formatDate(new Date().toISOString()),
          senderName: currentUser.full_name,
          email: currentUser.email,
          isRead: true
        };

        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, demoMessage],
                lastMessage: `You: ${text.trim()}`,
                lastMessageTime: formatDate(new Date().toISOString())
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [currentUser, useRealDatabase]);

  // Handle chat click
  const handleChatClick = useCallback((chatId: string) => {
    console.log('💬 Opening chat:', chatId);
    setActiveChat(chatId);
    
    setChats(prevChats =>
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }, []);

  // IMPLEMENTED: Create new chat function
  const handleCreateChat = useCallback(async (newChatData: any) => {
    try {
      console.log('Creating new chat with data:', newChatData);
      
      if (!currentUser) {
        throw new Error('No user available to create chat');
      }
      
      // Generate a unique ID for the chat
      const chatId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      if (useRealDatabase) {
        // Create the chat in the database
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({
            id: chatId,
            name: newChatData.name,
            is_group: newChatData.type === 'Group',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Add current user as member
        const { error: memberError } = await supabase
          .from('chat_members')
          .insert({
            chat_id: chatId,
            user_id: currentUser.id,
            role: 'admin',
            joined_at: new Date().toISOString()
          });
          
        if (memberError) throw memberError;
        
        // Add other members if selected
        if (newChatData.members && newChatData.members.length > 0) {
          const memberInserts = newChatData.members.map((memberId: string) => ({
            chat_id: chatId,
            user_id: memberId,
            role: 'member',
            joined_at: new Date().toISOString()
          }));
          
          const { error: bulkMemberError } = await supabase
            .from('chat_members')
            .insert(memberInserts);
            
          if (bulkMemberError) throw bulkMemberError;
        }
        
        // Add label if provided
        if (newChatData.label) {
          // Find label ID from name
          const labelObj = availableLabels.find(l => l.name === newChatData.label);
          if (labelObj) {
            const { error: labelError } = await supabase
              .from('chat_labels')
              .insert({
                chat_id: chatId,
                label_id: labelObj.id
              });
              
            if (labelError) console.warn('Failed to add label:', labelError);
          }
        }
        
        // Send a welcome message
        const welcomeMessage = newChatData.type === 'Group' 
          ? `Welcome to the ${newChatData.name} group!`
          : `Hello! Let's start chatting.`;
        
        await sendMessage(chatId, currentUser.id, welcomeMessage);
        
        // Reload chats after creating
        await loadUserChats(currentUser.id);
      } else {
        // Demo mode - create a chat in the local state
        const status = newChatData.label || 'Demo';
        const welcomeMessage = newChatData.type === 'Group' 
          ? `Welcome to the ${newChatData.name} group!`
          : `Hello! Let's start chatting.`;
        
        const newChat: Chat = {
          id: chatId,
          name: newChatData.name,
          lastMessage: `You: ${welcomeMessage}`,
          lastMessageTime: formatDate(new Date().toISOString()),
          avatar: getAvatarInitial(newChatData.name),
          type: newChatData.type,
          status: status as any,
          unread: 0,
          memberCount: newChatData.members ? newChatData.members.length + 1 : 2,
          messages: [{
            id: `demo-${Date.now()}`,
            text: welcomeMessage,
            sender: 'periskope',
            time: formatDate(new Date().toISOString()),
            senderName: currentUser.full_name,
            email: currentUser.email,
            isRead: true
          }]
        };
        
        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChat(chatId);
      }
      
      setShowNewChatModal(false);
      console.log('✅ Chat created successfully');
      
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      alert(`Failed to create chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [currentUser, useRealDatabase, availableLabels, loadUserChats, sendMessage]);

  // Create a new label
  const handleCreateLabel = useCallback(async (labelData: { name: string, color: string }) => {
    try {
      console.log('Creating new label:', labelData);
      
      if (useRealDatabase) {
        // Generate a unique ID for the label
        const labelId = `label-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const { data, error } = await supabase
          .from('labels')
          .insert({
            id: labelId,
            name: labelData.name,
            color: labelData.color
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Add the new label to the available labels
        setAvailableLabels(prev => [...prev, {
          id: data.id,
          name: data.name,
          color: data.color
        }]);
      } else {
        // Demo mode - just add to local state
        const newLabel = {
          id: `label-${Date.now()}`,
          name: labelData.name,
          color: labelData.color
        };
        
        setAvailableLabels(prev => [...prev, newLabel]);
      }
      
      setShowLabelModal(false);
      
    } catch (error) {
      console.error('Error creating label:', error);
      alert(`Failed to create label: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [useRealDatabase]);

  // Assign a label to a chat
  const handleAssignLabel = useCallback(async (chatId: string, labelName: string) => {
    try {
      const labelObj = availableLabels.find(l => l.name === labelName);
      if (!labelObj) {
        throw new Error('Label not found');
      }
      
      if (useRealDatabase) {
        // Remove any existing labels first
        await supabase
          .from('chat_labels')
          .delete()
          .eq('chat_id', chatId);
          
        // Add the new label
        const { error } = await supabase
          .from('chat_labels')
          .insert({
            chat_id: chatId,
            label_id: labelObj.id
          });
          
        if (error) throw error;
      }
      
      // Update in local state
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              status: labelName as any
            };
          }
          return chat;
        })
      );
      
    } catch (error) {
      console.error('Error assigning label:', error);
    }
  }, [availableLabels, useRealDatabase]);

  // Filter chats
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = searchQuery === '' || 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesFilter = filterValue === '' || 
        chat.type.toLowerCase() === filterValue.toLowerCase();
        
      const matchesLabel = selectedLabel === null || 
        chat.status === selectedLabel;
        
      return matchesSearch && matchesFilter && matchesLabel;
    });
  }, [chats, searchQuery, filterValue, selectedLabel]);

  const activeChatData = useMemo(() => 
    chats.find(chat => chat.id === activeChat), 
    [chats, activeChat]
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Connection Status */}
      {useRealDatabase && (
        <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs z-50 ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Real-time Active' : '🔴 Disconnected'}
        </div>
      )}

      {/* Left Sidebar */}
      <ChatSidebar
        currentUser={currentUser}
        onLogout={handleLogout}
        isDemo={isDemo}
      />
      
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200">
        <ChatList
  chats={filteredChats as any[]}
  activeChat={activeChat}
  onChatClick={handleChatClick}
  filterValue={filterValue}
  onFilterChange={setFilterValue}
  currentUserId={currentUser?.id || ''} // Provide fallback for undefined
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  availableLabels={availableLabels}
  selectedLabel={selectedLabel}
  onSelectLabel={setSelectedLabel}
  isLoading={isLoading}
   onNewChatClick={() => setShowNewChatModal(true)}

  onManageLabelsClick={() => setShowLabelModal(true)}

/>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1">
       {activeChatData && currentUser ? (
    <ChatWindow
  chat={activeChatData}
  onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
  currentUser={currentUser}
  isConnected={isConnected}
  onLogout={handleLogout}
/>
  ) :  (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">
                {isLoading ? 'Loading...' : 'Select a chat to start messaging'}
              </h3>
              {isDemo && (
                <p className="text-sm text-green-600">
                  You're in demo mode - try the real-time messaging!
                </p>
              )}
              {!isLoading && chats.length === 0 && (
                <div className="mt-4">
                  <button 
                    onClick={() => setShowNewChatModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewChatModal && currentUser && (
        <NewChatModal
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={handleCreateChat}
          currentUser={currentUser}
          useRealDatabase={useRealDatabase}
          availableLabels={availableLabels} 
        />
      )}
      
      {showLabelModal && (
        <LabelManagementModal
          labels={availableLabels}
          onClose={() => setShowLabelModal(false)}
          onCreateLabel={handleCreateLabel}
        />
      )}
    </div>
  );
};

export default ChatLayout;
