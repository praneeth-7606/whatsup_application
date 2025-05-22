

// // Fixed ChatLayout with Real-time Messaging
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import ChatSidebar from './chatsiderbar';
// import ChatList from './chatlist';
// import ChatWindow from './chatwindow';
// import LabelManagementModal from './labelmanagementmodel';
// import NewChatModal from './newchatmodel';
// import {supabase, 
//   formatDate, 
//   getAvatarInitial,
//   sendMessage,
//   subscribeToMessages,
//   testDatabaseConnection,
//   isUserMemberOfChat} from '../../lib/supabase/client';
// // import { 
// //   supabase, 
// //   formatDate, 
// //   getAvatarInitial,
// //   sendMessage,
// //   subscribeToMessages,
// //   testDatabaseConnection,
// //   isUserMemberOfChat
// // } from './supabaseclient';

// export interface Chat {
//   id: string;
//   name: string;
//   lastMessage: string;
//   lastMessageTime: string;
//   avatar: string | null;
//   type: string;
//   label?: string;
//   secondaryLabel?: string;
//   unread: number;
//   isActive?: boolean;
//   messages: Message[];
//   memberCount?: number;
//   lastReadMessageId?: string;
// }

// export interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   time: string;
//   senderName?: string;
//   phone?: string;
//   email?: string;
//   isRead?: boolean;
// }

// export interface User {
//   id: string;
//   full_name: string;
//   email: string;
//   avatar_url: string | null;
// }

// export interface Label {
//   id: string;
//   name: string;
//   color: string;
// }

// const isSupabaseConfigured = () => {
//   try {
//     return !!supabase.from;
//   } catch (error) {
//     console.error('Supabase configuration error:', error);
//     return false;
//   }
// };

// interface ChatLayoutProps {
//   currentUserId?: string;
//   currentUserName?: string;
//   currentUserEmail?: string;
//   onLogout?: () => void;
// }

// const ChatLayout = ({ 
//   currentUserId, 
//   currentUserName = 'Demo User',
//   currentUserEmail = 'demo@example.com',
//   onLogout 
// }: ChatLayoutProps) => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [activeChat, setActiveChat] = useState<string | null>(null);
//   const [filterValue, setFilterValue] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [useRealDatabase, setUseRealDatabase] = useState<boolean>(false);
//   const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
//   const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
//   const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   // FIXED: Real-time message handler
//   const handleRealTimeMessage = useCallback(async (payload: any) => {
//     if (!payload.new || !currentUser) return;

//     const newMsg = payload.new;
//     console.log('📨 Processing real-time message:', newMsg);

//     // Skip our own messages (they're already added locally)
//     if (newMsg.sender_id === currentUser.id) {
//       console.log('Skipping own message');
//       return;
//     }

//     // Check if this message is for a chat we're part of
//     const isMember = await isUserMemberOfChat(currentUser.id, newMsg.chat_id);
//     if (!isMember) {
//       console.log('Message not for our chat');
//       return;
//     }

//     // Get sender info
//     const { data: senderData } = await supabase
//       .from('users')
//       .select('full_name, email')
//       .eq('id', newMsg.sender_id)
//       .single();

//     const formattedMessage: Message = {
//       id: newMsg.id,
//       text: newMsg.content,
//       sender: 'them',
//       time: formatDate(newMsg.created_at),
//       senderName: senderData?.full_name || 'Unknown',
//       email: senderData?.email,
//       isRead: false
//     };

//     console.log('✅ Adding real-time message to chat:', newMsg.chat_id);

//     // Update the chat with the new message
//     setChats(prevChats => {
//       return prevChats.map(chat => {
//         if (chat.id === newMsg.chat_id) {
//           // Check if message already exists to prevent duplicates
//           const messageExists = chat.messages.some(m => m.id === newMsg.id);
//           if (messageExists) {
//             console.log('Message already exists, skipping');
//             return chat;
//           }

//           const isCurrentlyActive = chat.id === activeChat;
//           const newUnreadCount = isCurrentlyActive ? 0 : chat.unread + 1;

//           // Show notification for new message
//           if (!isCurrentlyActive && Notification.permission === 'granted') {
//             new Notification(`New message from ${formattedMessage.senderName}`, {
//               body: formattedMessage.text,
//               icon: '/favicon.ico'
//             });
//           }

//           return {
//             ...chat,
//             messages: [...chat.messages, formattedMessage],
//             lastMessage: formattedMessage.text,
//             lastMessageTime: formattedMessage.time,
//             unread: newUnreadCount
//           };
//         }
//         return chat;
//       });
//     });
//   }, [currentUser, activeChat]);

//   // FIXED: Setup real-time subscriptions
//   useEffect(() => {
//     if (!useRealDatabase || !currentUser) return;

//     console.log('🔔 Setting up real-time subscriptions...');

//     // Request notification permission
//     if (Notification.permission === 'default') {
//       Notification.requestPermission().then(permission => {
//         console.log('Notification permission:', permission);
//       });
//     }

//     // Subscribe to real-time messages
//     const cleanup = subscribeToMessages(
//       handleRealTimeMessage,
//       (error) => {
//         console.error('Real-time subscription error:', error);
//         setIsConnected(false);
//       }
//     );

//     setIsConnected(true);

//     return () => {
//       console.log('🔌 Cleaning up real-time subscriptions');
//       cleanup();
//       setIsConnected(false);
//     };
//   }, [useRealDatabase, currentUser, handleRealTimeMessage]);

//   // Initialize data
//   useEffect(() => {
//     let isMounted = true;

//     const initializeData = async () => {
//       setIsLoading(true);

//       if (!isSupabaseConfigured()) {
//         console.log('Supabase not configured, using demo mode');
//         if (isMounted) createDummyData();
//         return;
//       }

//       // Test database connection
//       const dbConnected = await testDatabaseConnection();
//       if (!dbConnected) {
//         console.log('Database connection failed, using demo mode');
//         if (isMounted) createDummyData();
//         return;
//       }

//       try {
//         const userId = currentUserId || '00000000-0000-0000-0000-000000000001';
        
//         // Get or create user
//         let userData = null;
//         if (!currentUserName || !currentUserEmail) {
//           const { data: userResult, error: userError } = await supabase
//             .from('users')
//             .select('id, full_name, email, avatar_url')
//             .eq('id', userId)
//             .single();
            
//           if (userError || !userResult) {
//             console.log('User not found, using demo mode');
//             if (isMounted) createDummyData();
//             return;
//           }
          
//           userData = userResult;
//         } else {
//           userData = {
//             id: userId,
//             full_name: currentUserName,
//             email: currentUserEmail,
//             avatar_url: null
//           };
//         }

//         if (!isMounted) return;

//         setCurrentUser(userData);
//         setUseRealDatabase(true);

//         // Load user's chats
//         await loadUserChats(userId);

//       } catch (error) {
//         console.error('Error initializing:', error);
//         if (isMounted) createDummyData();
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     initializeData();

//     return () => {
//       isMounted = false;
//     };
//   }, [currentUserId, currentUserName, currentUserEmail]);

//   // Load user chats
//   const loadUserChats = async (userId: string) => {
//     try {
//       console.log('📂 Loading chats for user:', userId);

//       const { data: userChatMembers, error } = await supabase
//         .from('chat_members')
//         .select(`
//           chat_id,
//           chats:chat_id (
//             id,
//             name,
//             is_group,
//             created_at,
//             updated_at
//           )
//         `)
//         .eq('user_id', userId);

//       if (error || !userChatMembers || userChatMembers.length === 0) {
//         console.log('No chats found for user');
//         return;
//       }

//       const chatsList = userChatMembers
//         .filter(member => member.chats)
//         .map(member => member.chats)
//         .filter(chat => chat !== null);

//       if (chatsList.length === 0) {
//         console.log('No valid chats found');
//         return;
//       }

//       // Enrich chats with data
//       const enrichedChats = await Promise.all(
//         chatsList.map(async (chat) => await enrichChatWithData(chat, userId))
//       );

//       const validChats = enrichedChats.filter(chat => chat !== null);
//       const sortedChats = validChats.sort((a, b) => 
//         new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
//       );

//       setChats(sortedChats);
//       if (sortedChats.length > 0) {
//         setActiveChat(sortedChats[0].id);
//       }

//       console.log('✅ Loaded', sortedChats.length, 'chats');
//     } catch (error) {
//       console.error('Error loading chats:', error);
//     }
//   };

//   // Enrich chat with messages and member data
//   const enrichChatWithData = async (chat: any, userId: string) => {
//     try {
//       // Get chat members
//       const { data: chatMembers } = await supabase
//         .from('chat_members')
//         .select(`
//           user_id,
//           users:user_id (
//             id,
//             full_name,
//             email,
//             avatar_url
//           )
//         `)
//         .eq('chat_id', chat.id);

//       // Determine display name
//       let displayName = chat.name || 'Unknown Chat';
//       let avatar = null;

//       if (!chat.is_group && chatMembers && chatMembers.length >= 2) {
//         const otherUser = chatMembers.find(member => 
//           member.user_id !== userId && member.users
//         );
        
//         if (otherUser && otherUser.users) {
//           displayName = otherUser.users.full_name || 'Unknown User';
//           avatar = otherUser.users.avatar_url;
//         }
//       }

//       // Get last message
//       const { data: lastMessageData } = await supabase
//         .from('messages')
//         .select(`
//           content,
//           sender_id,
//           created_at,
//           users:sender_id (full_name)
//         `)
//         .eq('chat_id', chat.id)
//         .order('created_at', { ascending: false })
//         .limit(1);

//       let lastMessage = 'No messages';
//       let lastMessageTime = chat.updated_at || new Date().toISOString();

//       if (lastMessageData && lastMessageData.length > 0) {
//         const msg = lastMessageData[0];
//         const senderName = msg.users?.full_name || 'Unknown';
        
//         lastMessage = msg.sender_id === userId 
//           ? `You: ${msg.content}` 
//           : chat.is_group 
//             ? `${senderName}: ${msg.content}`
//             : msg.content;
//         lastMessageTime = msg.created_at;
//       }

//       // Calculate unread count (simplified)
//       const { data: unreadMessages } = await supabase
//         .from('messages')
//         .select('id')
//         .eq('chat_id', chat.id)
//         .neq('sender_id', userId)
//         .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

//       const unreadCount = unreadMessages ? Math.min(unreadMessages.length, 9) : 0;

//       return {
//         id: chat.id,
//         name: displayName,
//         lastMessage: lastMessage,
//         lastMessageTime: formatDate(lastMessageTime),
//         avatar: avatar || getAvatarInitial(displayName),
//         type: chat.is_group ? 'Group' : 'Direct',
//         label: chat.is_group ? 'Group' : 'Personal',
//         secondaryLabel: '',
//         unread: unreadCount,
//         memberCount: chatMembers ? chatMembers.length : 2,
//         messages: [] // Messages loaded when chat is opened
//       };
//     } catch (error) {
//       console.error('Error enriching chat:', error);
//       return null;
//     }
//   };

//   // Load messages for active chat
//   useEffect(() => {
//     if (!activeChat || !useRealDatabase) return;

//     const loadChatMessages = async () => {
//       try {
//         console.log('📄 Loading messages for chat:', activeChat);

//         const { data: messagesData, error } = await supabase
//           .from('messages')
//           .select(`
//             id,
//             content,
//             sender_id,
//             created_at,
//             users:sender_id (full_name, email)
//           `)
//           .eq('chat_id', activeChat)
//           .order('created_at', { ascending: true });

//         if (error) {
//           console.error('Error loading messages:', error);
//           return;
//         }

//         if (messagesData && messagesData.length > 0) {
//           const formattedMessages: Message[] = messagesData.map(msg => ({
//             id: msg.id,
//             text: msg.content,
//             sender: msg.sender_id === currentUser?.id ? 'periskope' : 'them',
//             time: formatDate(msg.created_at),
//             senderName: msg.users?.full_name || 'Unknown',
//             email: msg.users?.email,
//             isRead: msg.sender_id === currentUser?.id
//           }));

//           // Update chat with messages
//           setChats(prevChats =>
//             prevChats.map(chat => {
//               if (chat.id === activeChat) {
//                 return {
//                   ...chat,
//                   messages: formattedMessages,
//                   unread: 0 // Mark as read when viewing
//                 };
//               }
//               return chat;
//             })
//           );

//           console.log('✅ Loaded', formattedMessages.length, 'messages');
//         }
//       } catch (error) {
//         console.error('Error loading chat messages:', error);
//       }
//     };

//     loadChatMessages();
//   }, [activeChat, useRealDatabase, currentUser]);

//   // FIXED: Send message function
//   const handleSendMessage = useCallback(async (chatId: string, text: string) => {
//     if (!currentUser || !text.trim()) {
//       console.warn('Cannot send message: missing user or text');
//       return;
//     }

//     try {
//       console.log('📤 Sending message...', { chatId, text: text.trim() });

//       if (useRealDatabase) {
//         // Use the enhanced sendMessage function
//         const sentMessage = await sendMessage(chatId, currentUser.id, text.trim());
        
//         // Create formatted message for immediate UI update
//         const formattedMessage: Message = {
//           id: sentMessage.id,
//           text: sentMessage.content,
//           sender: 'periskope',
//           time: formatDate(sentMessage.created_at),
//           senderName: currentUser.full_name,
//           email: currentUser.email,
//           isRead: true
//         };

//         // Update local state immediately for better UX
//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               // Check for duplicates
//               const messageExists = chat.messages.some(m => m.id === sentMessage.id);
//               if (messageExists) return chat;

//               return {
//                 ...chat,
//                 messages: [...chat.messages, formattedMessage],
//                 lastMessage: `You: ${text.trim()}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );

//         console.log('✅ Message sent successfully');
//       } else {
//         // Demo mode
//         const demoMessage: Message = {
//           id: `demo-${Date.now()}-${Math.random()}`,
//           text: text.trim(),
//           sender: 'periskope',
//           time: formatDate(new Date().toISOString()),
//           senderName: currentUser.full_name,
//           email: currentUser.email,
//           isRead: true
//         };

//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               return {
//                 ...chat,
//                 messages: [...chat.messages, demoMessage],
//                 lastMessage: `You: ${text.trim()}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('❌ Error sending message:', error);
//       alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   }, [currentUser, useRealDatabase]);

//   // Handle chat click
//   const handleChatClick = useCallback((chatId: string) => {
//     console.log('💬 Opening chat:', chatId);
//     setActiveChat(chatId);
    
//     // Mark chat as read
//     setChats(prevChats =>
//       prevChats.map(chat => 
//         chat.id === chatId ? { ...chat, unread: 0 } : chat
//       )
//     );
//   }, []);

//   // Create dummy data for demo mode
//   const createDummyData = useCallback(() => {
//     const fallbackUser: User = {
//       id: currentUserId || 'fallback-user',
//       full_name: currentUserName || 'Demo User',
//       email: currentUserEmail || 'demo@example.com',
//       avatar_url: null
//     };
    
//     setCurrentUser(fallbackUser);
    
//     const dummyLabels: Label[] = [
//       { id: 'label-1', name: 'Important', color: 'red' },
//       { id: 'label-2', name: 'Work', color: 'blue' },
//       { id: 'label-3', name: 'Personal', color: 'green' },
//       { id: 'label-4', name: 'Support', color: 'purple' },
//       { id: 'label-5', name: 'Project', color: 'yellow' }
//     ];
    
//     setAvailableLabels(dummyLabels);
    
//     const dummyChats: Chat[] = [
//       {
//         id: 'dummy-1',
//         name: 'Marketing Team',
//         lastMessage: 'We need to discuss the new campaign',
//         lastMessageTime: formatDate(new Date().toISOString()),
//         avatar: getAvatarInitial('Marketing Team'),
//         type: 'Group',
//         label: 'Work',
//         unread: 0,
//         isActive: false,
//         memberCount: 5,
//         messages: [
//           {
//             id: 'dummy-msg-1',
//             text: 'We need to discuss the new campaign',
//             sender: 'them',
//             time: formatDate(new Date().toISOString()),
//             senderName: 'Sarah Johnson',
//             isRead: true
//           }
//         ]
//       },
//       {
//         id: 'dummy-2',
//         name: 'John Smith',
//         lastMessage: 'How can I help you today?',
//         lastMessageTime: formatDate(new Date(Date.now() - 3600000).toISOString()),
//         avatar: getAvatarInitial('John Smith'),
//         type: 'Direct',
//         label: 'Support',
//         unread: 1,
//         isActive: false,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'dummy-msg-2',
//             text: 'Hello there!',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 7200000).toISOString()),
//             senderName: 'John Smith',
//             isRead: true
//           },
//           {
//             id: 'dummy-msg-3',
//             text: 'How can I help you today?',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 3600000).toISOString()),
//             senderName: 'John Smith',
//             isRead: false
//           }
//         ]
//       }
//     ];
    
//     setChats(dummyChats);
//     setActiveChat(dummyChats[0].id);
//     setIsLoading(false);
//     setUseRealDatabase(false);
//   }, [currentUserId, currentUserName, currentUserEmail]);

//   // Fetch labels
//   const fetchLabels = useCallback(async () => {
//     if (!useRealDatabase) return;
    
//     try {
//       const { data, error } = await supabase
//         .from('labels')
//         .select('*')
//         .order('name');
        
//       if (error) throw error;
      
//       setAvailableLabels(data || []);
//     } catch (error) {
//       console.error('Error fetching labels:', error);
//     }
//   }, [useRealDatabase]);

//   // Create chat function
//   const handleCreateChat = useCallback(async (
//     name: string, 
//     isGroup: boolean, 
//     memberIds: string[] = [], 
//     memberRoles?: { [userId: string]: 'admin' | 'member' },
//     labelIds: string[] = []
//   ) => {
//     if (!currentUser) return;
    
//     try {
//       if (useRealDatabase) {
//         console.log('🆕 Creating new chat:', { name, isGroup, memberIds });

//         const { data: newChat, error: chatError } = await supabase
//           .from('chats')
//           .insert([
//             {
//               name: name,
//               is_group: isGroup,
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString()
//             }
//           ])
//           .select()
//           .single();
          
//         if (chatError || !newChat) {
//           throw new Error(`Failed to create chat: ${chatError?.message}`);
//         }
        
//         const chatId = newChat.id;
//         console.log('✅ Chat created with ID:', chatId);
        
//         // Add current user as admin
//         await supabase
//           .from('chat_members')
//           .insert([
//             {
//               chat_id: chatId,
//               user_id: currentUser.id,
//               role: 'admin',
//               joined_at: new Date().toISOString()
//             }
//           ]);
          
//         // Add other members
//         if (memberIds.length > 0) {
//           const memberInserts = memberIds.map(memberId => ({
//             chat_id: chatId,
//             user_id: memberId,
//             role: memberRoles?.[memberId] || 'member',
//             joined_at: new Date().toISOString()
//           }));
          
//           await supabase
//             .from('chat_members')
//             .insert(memberInserts);
//         }
        
//         // Add labels if any
//         if (labelIds && labelIds.length > 0) {
//           const labelInserts = labelIds.map(labelId => ({
//             chat_id: chatId,
//             label_id: labelId,
//             created_by: currentUser.id,
//             created_at: new Date().toISOString()
//           }));
          
//           await supabase
//             .from('chat_labels')
//             .insert(labelInserts);
//         }
        
//         // Add welcome message
//         const welcomeMessage = isGroup 
//           ? `${currentUser.full_name} created this group chat` 
//           : `${currentUser.full_name} started this conversation`;
          
//         await sendMessage(chatId, currentUser.id, welcomeMessage);
          
//         // Reload chats and activate the new one
//         await loadUserChats(currentUser.id);
//         setActiveChat(chatId);
        
//         console.log('✅ Chat creation completed');
//       } else {
//         // Demo mode
//         const newChatId = `dummy-${Date.now()}`;
//         const welcomeMessage = isGroup ? 'Created this group chat' : 'Started a new conversation';
        
//         const selectedLabelNames = availableLabels
//           .filter(label => labelIds.includes(label.id))
//           .map(label => label.name);
        
//         const newChat: Chat = {
//           id: newChatId,
//           name: name,
//           lastMessage: `You: ${welcomeMessage}`,
//           lastMessageTime: formatDate(new Date().toISOString()),
//           avatar: getAvatarInitial(name),
//           type: isGroup ? 'Group' : 'Direct',
//           label: selectedLabelNames[0] || 'New',
//           secondaryLabel: selectedLabelNames[1] || '',
//           unread: 0,
//           memberCount: isGroup ? (memberIds.length + 1) : 2,
//           messages: [
//             {
//               id: `dummy-msg-${Date.now()}`,
//               text: welcomeMessage,
//               sender: 'periskope',
//               time: formatDate(new Date().toISOString()),
//               senderName: currentUser.full_name,
//               email: currentUser.email,
//               isRead: true
//             }
//           ]
//         };
        
//         setChats(prevChats => [newChat, ...prevChats]);
//         setActiveChat(newChatId);
//       }
//     } catch (error) {
//       console.error('❌ Error creating chat:', error);
//       throw error;
//     }
//   }, [currentUser, useRealDatabase, availableLabels]);

//   // Label management functions
//   const handleCreateLabel = useCallback(async (name: string, color: string) => {
//     if (!currentUser) return;
    
//     try {
//       if (useRealDatabase) {
//         const { data: newLabel, error } = await supabase
//           .from('labels')
//           .insert([
//             {
//               name: name,
//               color: color,
//               created_by: currentUser.id,
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString()
//             }
//           ])
//           .select();
          
//         if (error || !newLabel || newLabel.length === 0) {
//           throw new Error(`Failed to create label: ${error?.message}`);
//         }
        
//         await fetchLabels();
//       } else {
//         const newLabel: Label = {
//           id: `label-${Date.now()}`,
//           name: name,
//           color: color
//         };
        
//         setAvailableLabels(prevLabels => [...prevLabels, newLabel]);
//       }
//     } catch (error) {
//       console.error('Error creating label:', error);
//       alert('Failed to create label. Please try again.');
//     }
//   }, [currentUser, useRealDatabase, fetchLabels]);

//   const handleAssignLabel = useCallback(async (chatId: string, labelId: string) => {
//     if (!currentUser) return;
    
//     try {
//       if (useRealDatabase) {
//         const { data: existingLabel } = await supabase
//           .from('chat_labels')
//           .select('*')
//           .eq('chat_id', chatId)
//           .eq('label_id', labelId)
//           .maybeSingle();
          
//         if (existingLabel) return;
        
//         await supabase
//           .from('chat_labels')
//           .insert([
//             {
//               chat_id: chatId,
//               label_id: labelId,
//               created_by: currentUser.id,
//               created_at: new Date().toISOString()
//             }
//           ]);
          
//         await loadUserChats(currentUser.id);
//       } else {
//         const selectedLabel = availableLabels.find(label => label.id === labelId);
//         if (!selectedLabel) return;
        
//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               if (chat.label && !chat.secondaryLabel) {
//                 return { ...chat, secondaryLabel: selectedLabel.name };
//               } else if (!chat.label) {
//                 return { ...chat, label: selectedLabel.name };
//               } else {
//                 return { ...chat, secondaryLabel: selectedLabel.name };
//               }
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('Error assigning label:', error);
//     }
//   }, [currentUser, useRealDatabase, availableLabels]);

//   const handleQuickLabelAssign = useCallback(async (chatId: string, labelName: string) => {
//     const label = availableLabels.find(l => l.name === labelName);
//     if (!label) return;
    
//     await handleAssignLabel(chatId, label.id);
//   }, [availableLabels, handleAssignLabel]);

//   // Member management
//   const handleManageChatMembers = useCallback(async (
//     chatId: string, 
//     action: 'add' | 'remove', 
//     userId: string, 
//     role: 'admin' | 'member' = 'member'
//   ) => {
//     if (!currentUser) return;
    
//     try {
//       if (useRealDatabase) {
//         if (action === 'add') {
//           const { error } = await supabase
//             .from('chat_members')
//             .insert([
//               {
//                 chat_id: chatId,
//                 user_id: userId,
//                 role: role,
//                 joined_at: new Date().toISOString()
//               }
//             ]);
            
//           if (error) throw error;
          
//           const { data: userData } = await supabase
//             .from('users')
//             .select('full_name')
//             .eq('id', userId)
//             .single();
            
//           await sendMessage(
//             chatId, 
//             currentUser.id, 
//             `${userData?.full_name || 'User'} was added to the chat`
//           );
//         } else {
//           const { error } = await supabase
//             .from('chat_members')
//             .delete()
//             .eq('chat_id', chatId)
//             .eq('user_id', userId);
            
//           if (error) throw error;
          
//           const { data: userData } = await supabase
//             .from('users')
//             .select('full_name')
//             .eq('id', userId)
//             .single();
            
//           await sendMessage(
//             chatId, 
//             currentUser.id, 
//             `${userData?.full_name || 'User'} was removed from the chat`
//           );
//         }
        
//         await loadUserChats(currentUser.id);
//       } else {
//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               const newMemberCount = action === 'add' 
//                 ? (chat.memberCount || 0) + 1 
//                 : Math.max((chat.memberCount || 0) - 1, 1);
//               return { ...chat, memberCount: newMemberCount };
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('Error managing chat members:', error);
//     }
//   }, [currentUser, useRealDatabase]);

//   // Filter chats
//   const filteredChats = useMemo(() => {
//     return chats.filter(chat => {
//       const matchesSearch = searchQuery === '' || 
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
        
//       const matchesFilter = filterValue === '' || 
//         chat.type.toLowerCase() === filterValue.toLowerCase();
        
//       const matchesLabel = selectedLabel === null || 
//         chat.label === selectedLabel || 
//         chat.secondaryLabel === selectedLabel;
        
//       return matchesSearch && matchesFilter && matchesLabel;
//     });
//   }, [chats, searchQuery, filterValue, selectedLabel]);

//   const activeChatData = useMemo(() => 
//     chats.find(chat => chat.id === activeChat), 
//     [chats, activeChat]
//   );

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Connection Status */}
//       {useRealDatabase && (
//         <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs z-50 ${
//           isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {isConnected ? '🟢 Real-time Active' : '🔴 Disconnected'}
//         </div>
//       )}

//       {currentUser && (
//         <ChatSidebar
//           user={currentUser}
//           availableLabels={availableLabels}
//           selectedLabel={selectedLabel}
//           onSelectLabel={setSelectedLabel}
//           onCreateChat={handleCreateChat}
//           onShowLabelModal={() => setShowLabelModal(true)}
//           onLogout={onLogout}
//           isSupabaseConfigured={useRealDatabase}
//         />
//       )}
      
//       <div className="flex-1 flex">
//         <ChatList
//           chats={filteredChats}
//           activeChat={activeChat}
//           onChatClick={handleChatClick}
//           filterValue={filterValue}
//           onFilterChange={setFilterValue}
//           currentUserId={currentUser?.id}
//           onChatCreated={() => loadUserChats(currentUser?.id || '')}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           availableLabels={availableLabels}
//           selectedLabel={selectedLabel}
//           onSelectLabel={setSelectedLabel}
//           isLoading={isLoading}
//           onNewChatClick={() => setShowNewChatModal(true)}
//         />
        
//         <div className="flex-1">
//           {activeChatData ? (
//             <ChatWindow
//               chat={activeChatData}
//               onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
//               availableLabels={availableLabels}
//               onAssignLabel={(labelId) => handleAssignLabel(activeChatData.id, labelId)}
//               onQuickLabelAssign={(labelName) => handleQuickLabelAssign(activeChatData.id, labelName)}
//               onManageMembers={(action, userId, role) => handleManageChatMembers(activeChatData.id, action, userId, role)}
//               currentUser={currentUser}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center text-gray-500">
//                 <h3 className="text-lg font-medium mb-2">
//                   {isLoading ? 'Loading...' : 'No chat selected'}
//                 </h3>
//                 <p className="mb-4">
//                   {isLoading ? 'Please wait...' : 'Select a chat from the sidebar to start messaging'}
//                 </p>
//                 {!isLoading && (
//                   <button
//                     onClick={() => setShowNewChatModal(true)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                   >
//                     Start New Chat
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* New Chat Modal */}
//       {showNewChatModal && currentUser && (
//         <NewChatModal
//           isOpen={showNewChatModal}
//           onClose={() => setShowNewChatModal(false)}
//           onCreateChat={handleCreateChat}
//           currentUser={currentUser}
//           useRealDatabase={useRealDatabase}
//           availableLabels={availableLabels} 
//         />
//       )}
      
//       {/* Label Management Modal */}
//       {showLabelModal && (
//         <LabelManagementModal
//           labels={availableLabels}
//           onClose={() => setShowLabelModal(false)}
//           onCreateLabel={handleCreateLabel}
//         />
//       )}
//     </div>
//   );
// };

// export default ChatLayout;






// // Updated ChatLayout.tsx - Pixel Perfect UI matching the screenshot
// import { useState, useEffect, useCallback, useMemo } from 'react';
// // import ChatSidebar from './chatsidebar';
// import ChatSidebar from './chatsiderbar';
// import ChatList from './chatlist';
// import ChatWindow from './chatwindow';
// import LabelManagementModal from './labelmanagementmodel';
// import NewChatModal from './newchatmodel';
// import {supabase, 
//   formatDate, 
//   getAvatarInitial,
//   sendMessage,
//   subscribeToMessages,
//   testDatabaseConnection,
//   isUserMemberOfChat} from '../../lib/supabase/client';


// export interface Chat {
//   id: string;
//   name: string;
//   lastMessage: string;
//   lastMessageTime: string;
//   avatar: string | null;
//   type: string;
//   label?: string;
//   secondaryLabel?: string;
//   unread: number;
//   isActive?: boolean;
//   messages: Message[];
//   memberCount?: number;
//   lastReadMessageId?: string;
//   phone?: string;
//   status?: 'Demo' | 'Content' | 'Signup' | 'Internal';
//   tags?: string[];
// }

// export interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   time: string;
//   senderName?: string;
//   phone?: string;
//   email?: string;
//   isRead?: boolean;
// }

// export interface User {
//   id: string;
//   full_name: string;
//   email: string;
//   avatar_url: string | null;
// }

// export interface Label {
//   id: string;
//   name: string;
//   color: string;
// }

// const isSupabaseConfigured = () => {
//   try {
//     return !!supabase.from;
//   } catch (error) {
//     console.error('Supabase configuration error:', error);
//     return false;
//   }
// };

// interface ChatLayoutProps {
//   currentUserId?: string;
//   currentUserName?: string;
//   currentUserEmail?: string;
//   onLogout?: () => void;
// }

// const ChatLayout = ({ 
//   currentUserId, 
//   currentUserName = 'Periskope',
//   currentUserEmail = 'demo@example.com',
//   onLogout 
// }: ChatLayoutProps) => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [activeChat, setActiveChat] = useState<string | null>(null);
//   const [filterValue, setFilterValue] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [useRealDatabase, setUseRealDatabase] = useState<boolean>(false);
//   const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
//   const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
//   const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   // Real-time message handler
//   const handleRealTimeMessage = useCallback(async (payload: any) => {
//     if (!payload.new || !currentUser) return;

//     const newMsg = payload.new;
//     console.log('📨 Processing real-time message:', newMsg);

//     if (newMsg.sender_id === currentUser.id) {
//       console.log('Skipping own message');
//       return;
//     }

//     const isMember = await isUserMemberOfChat(currentUser.id, newMsg.chat_id);
//     if (!isMember) {
//       console.log('Message not for our chat');
//       return;
//     }

//     const { data: senderData } = await supabase
//       .from('users')
//       .select('full_name, email')
//       .eq('id', newMsg.sender_id)
//       .single();

//     const formattedMessage: Message = {
//       id: newMsg.id,
//       text: newMsg.content,
//       sender: 'them',
//       time: formatDate(newMsg.created_at),
//       senderName: senderData?.full_name || 'Unknown',
//       email: senderData?.email,
//       isRead: false
//     };

//     console.log('✅ Adding real-time message to chat:', newMsg.chat_id);

//     setChats(prevChats => {
//       return prevChats.map(chat => {
//         if (chat.id === newMsg.chat_id) {
//           const messageExists = chat.messages.some(m => m.id === newMsg.id);
//           if (messageExists) {
//             console.log('Message already exists, skipping');
//             return chat;
//           }

//           const isCurrentlyActive = chat.id === activeChat;
//           const newUnreadCount = isCurrentlyActive ? 0 : chat.unread + 1;

//           if (!isCurrentlyActive && Notification.permission === 'granted') {
//             new Notification(`New message from ${formattedMessage.senderName}`, {
//               body: formattedMessage.text,
//               icon: '/favicon.ico'
//             });
//           }

//           return {
//             ...chat,
//             messages: [...chat.messages, formattedMessage],
//             lastMessage: formattedMessage.text,
//             lastMessageTime: formattedMessage.time,
//             unread: newUnreadCount
//           };
//         }
//         return chat;
//       });
//     });
//   }, [currentUser, activeChat]);

//   // Setup real-time subscriptions
//   useEffect(() => {
//     if (!useRealDatabase || !currentUser) return;

//     console.log('🔔 Setting up real-time subscriptions...');

//     if (Notification.permission === 'default') {
//       Notification.requestPermission().then(permission => {
//         console.log('Notification permission:', permission);
//       });
//     }

//     const cleanup = subscribeToMessages(
//       handleRealTimeMessage,
//       (error) => {
//         console.error('Real-time subscription error:', error);
//         setIsConnected(false);
//       }
//     );

//     setIsConnected(true);

//     return () => {
//       console.log('🔌 Cleaning up real-time subscriptions');
//       cleanup();
//       setIsConnected(false);
//     };
//   }, [useRealDatabase, currentUser, handleRealTimeMessage]);

//   // Create dummy data that matches the screenshot
//   const createDummyData = useCallback(() => {
//     const fallbackUser: User = {
//       id: currentUserId || 'periskope-user',
//       full_name: currentUserName || 'Periskope',
//       email: currentUserEmail || 'periskope@example.com',
//       avatar_url: null
//     };
    
//     setCurrentUser(fallbackUser);
    
//     const dummyLabels: Label[] = [
//       { id: 'label-1', name: 'Demo', color: '#FFA500' },
//       { id: 'label-2', name: 'Content', color: '#32CD32' },
//       { id: 'label-3', name: 'Signup', color: '#FF6347' },
//       { id: 'label-4', name: 'Internal', color: '#4169E1' }
//     ];
    
//     setAvailableLabels(dummyLabels);
    
//     // Create dummy chats that match the screenshot exactly
//     const dummyChats: Chat[] = [
//       {
//         id: 'test-skope-final-5',
//         name: 'Test Skope Final 5',
//         lastMessage: "Support2: This doesn't go on Tuesday...",
//         lastMessageTime: 'Yesterday',
//         avatar: 'TS',
//         type: 'Group',
//         status: 'Demo',
//         phone: '+91 99748 44008',
//         unread: 0,
//         memberCount: 3,
//         messages: [
//           {
//             id: 'msg-1',
//             text: "Support2: This doesn't go on Tuesday...",
//             sender: 'them',
//             time: 'Yesterday',
//             senderName: 'Support2'
//           }
//         ]
//       },
//       {
//         id: 'periskope-team-chat',
//         name: 'Periskope Team Chat',
//         lastMessage: 'Periskope: Test message',
//         lastMessageTime: '28-Feb-25',
//         avatar: 'PT',
//         type: 'Group',
//         status: 'Internal',
//         phone: '+91 99748 44008',
//         unread: 1,
//         memberCount: 4,
//         messages: [
//           {
//             id: 'msg-2',
//             text: 'Test message',
//             sender: 'periskope',
//             time: '28-Feb-25',
//             senderName: 'Periskope'
//           }
//         ]
//       },
//       {
//         id: 'phone-99999-99999',
//         name: '+91 99999 99999',
//         lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
//         lastMessageTime: '25-Feb-25',
//         avatar: '+9',
//         type: 'Direct',
//         status: 'Signup',
//         phone: '+91 92896 65969',
//         unread: 0,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'msg-3',
//             text: "Hi there, I'm Swapnika, Co-Founder of ...",
//             sender: 'them',
//             time: '25-Feb-25',
//             senderName: 'Swapnika'
//           }
//         ]
//       },
//       {
//         id: 'test-demo17',
//         name: 'Test Demo17',
//         lastMessage: 'Rohosen: 123',
//         lastMessageTime: '25-Feb-25',
//         avatar: 'TD',
//         type: 'Direct',
//         status: 'Content',
//         phone: '+91 99748 44008',
//         unread: 0,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'msg-4',
//             text: '123',
//             sender: 'them',
//             time: '25-Feb-25',
//             senderName: 'Rohosen'
//           }
//         ]
//       },
//       {
//         id: 'test-el-centro',
//         name: 'Test El Centro',
//         lastMessage: 'Roshnag: Hello, Ahmadport!',
//         lastMessageTime: '04-Feb-25',
//         avatar: 'TC',
//         type: 'Direct',
//         status: 'Demo',
//         phone: '+91 99748 44008',
//         unread: 0,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'msg-5',
//             text: 'Hello, Ahmadport!',
//             sender: 'them',
//             time: '04-Feb-25',
//             senderName: 'Roshnag'
//           }
//         ]
//       },
//       {
//         id: 'testing-group',
//         name: 'Testing group',
//         lastMessage: 'Testing 12345',
//         lastMessageTime: '27-Jan-25',
//         avatar: 'TG',
//         type: 'Group',
//         status: 'Demo',
//         phone: '+91 92896 65969',
//         unread: 0,
//         memberCount: 5,
//         messages: [
//           {
//             id: 'msg-6',
//             text: 'Testing 12345',
//             sender: 'them',
//             time: '27-Jan-25',
//             senderName: 'Tester'
//           }
//         ]
//       }
//     ];
    
//     setChats(dummyChats);
//     setActiveChat(dummyChats[1].id); // Set Periskope Team Chat as active
//     setIsLoading(false);
//     setUseRealDatabase(false);
//   }, [currentUserId, currentUserName, currentUserEmail]);

//   // Initialize data
//   useEffect(() => {
//     let isMounted = true;

//     const initializeData = async () => {
//       setIsLoading(true);

//       if (!isSupabaseConfigured()) {
//         console.log('Supabase not configured, using demo mode');
//         if (isMounted) createDummyData();
//         return;
//       }

//       const dbConnected = await testDatabaseConnection();
//       if (!dbConnected) {
//         console.log('Database connection failed, using demo mode');
//         if (isMounted) createDummyData();
//         return;
//       }

//       try {
//         const userId = currentUserId || '00000000-0000-0000-0000-000000000001';
        
//         let userData = null;
//         if (!currentUserName || !currentUserEmail) {
//           const { data: userResult, error: userError } = await supabase
//             .from('users')
//             .select('id, full_name, email, avatar_url')
//             .eq('id', userId)
//             .single();
            
//           if (userError || !userResult) {
//             console.log('User not found, using demo mode');
//             if (isMounted) createDummyData();
//             return;
//           }
          
//           userData = userResult;
//         } else {
//           userData = {
//             id: userId,
//             full_name: currentUserName,
//             email: currentUserEmail,
//             avatar_url: null
//           };
//         }

//         if (!isMounted) return;

//         setCurrentUser(userData);
//         setUseRealDatabase(true);
//         await loadUserChats(userId);

//       } catch (error) {
//         console.error('Error initializing:', error);
//         if (isMounted) createDummyData();
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     initializeData();

//     return () => {
//       isMounted = false;
//     };
//   }, [currentUserId, currentUserName, currentUserEmail, createDummyData]);

//   // Load user chats
//   const loadUserChats = async (userId: string) => {
//     try {
//       console.log('📂 Loading chats for user:', userId);

//       const { data: userChatMembers, error } = await supabase
//         .from('chat_members')
//         .select(`
//           chat_id,
//           chats:chat_id (
//             id,
//             name,
//             is_group,
//             created_at,
//             updated_at
//           )
//         `)
//         .eq('user_id', userId);

//       if (error || !userChatMembers || userChatMembers.length === 0) {
//         console.log('No chats found for user, using demo data');
//         createDummyData();
//         return;
//       }

//       const chatsList = userChatMembers
//         .filter(member => member.chats)
//         .map(member => member.chats)
//         .filter(chat => chat !== null);

//       if (chatsList.length === 0) {
//         console.log('No valid chats found, using demo data');
//         createDummyData();
//         return;
//       }

//       const enrichedChats = await Promise.all(
//         chatsList.map(async (chat) => await enrichChatWithData(chat, userId))
//       );

//       const validChats = enrichedChats.filter(chat => chat !== null);
//       const sortedChats = validChats.sort((a, b) => 
//         new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
//       );

//       setChats(sortedChats);
//       if (sortedChats.length > 0) {
//         setActiveChat(sortedChats[0].id);
//       }

//       console.log('✅ Loaded', sortedChats.length, 'chats');
//     } catch (error) {
//       console.error('Error loading chats:', error);
//       createDummyData();
//     }
//   };

//   // Enrich chat with messages and member data
//   const enrichChatWithData = async (chat: any, userId: string) => {
//     try {
//       const { data: chatMembers } = await supabase
//         .from('chat_members')
//         .select(`
//           user_id,
//           users:user_id (
//             id,
//             full_name,
//             email,
//             avatar_url
//           )
//         `)
//         .eq('chat_id', chat.id);

//       let displayName = chat.name || 'Unknown Chat';
//       let avatar = null;

//       if (!chat.is_group && chatMembers && chatMembers.length >= 2) {
//         const otherUser = chatMembers.find(member => 
//           member.user_id !== userId && member.users
//         );
        
//         if (otherUser && otherUser.users) {
//           displayName = otherUser.users.full_name || 'Unknown User';
//           avatar = otherUser.users.avatar_url;
//         }
//       }

//       const { data: lastMessageData } = await supabase
//         .from('messages')
//         .select(`
//           content,
//           sender_id,
//           created_at,
//           users:sender_id (full_name)
//         `)
//         .eq('chat_id', chat.id)
//         .order('created_at', { ascending: false })
//         .limit(1);

//       let lastMessage = 'No messages';
//       let lastMessageTime = chat.updated_at || new Date().toISOString();

//       if (lastMessageData && lastMessageData.length > 0) {
//         const msg = lastMessageData[0];
//         const senderName = msg.users?.full_name || 'Unknown';
        
//         lastMessage = msg.sender_id === userId 
//           ? `You: ${msg.content}` 
//           : chat.is_group 
//             ? `${senderName}: ${msg.content}`
//             : msg.content;
//         lastMessageTime = msg.created_at;
//       }

//       const { data: unreadMessages } = await supabase
//         .from('messages')
//         .select('id')
//         .eq('chat_id', chat.id)
//         .neq('sender_id', userId)
//         .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

//       const unreadCount = unreadMessages ? Math.min(unreadMessages.length, 9) : 0;

//       return {
//         id: chat.id,
//         name: displayName,
//         lastMessage: lastMessage,
//         lastMessageTime: formatDate(lastMessageTime),
//         avatar: avatar || getAvatarInitial(displayName),
//         type: chat.is_group ? 'Group' : 'Direct',
//         status: chat.is_group ? 'Demo' : 'Content',
//         unread: unreadCount,
//         memberCount: chatMembers ? chatMembers.length : 2,
//         messages: []
//       };
//     } catch (error) {
//       console.error('Error enriching chat:', error);
//       return null;
//     }
//   };

//   // Load messages for active chat
//   useEffect(() => {
//     if (!activeChat || !useRealDatabase) return;

//     const loadChatMessages = async () => {
//       try {
//         console.log('📄 Loading messages for chat:', activeChat);

//         const { data: messagesData, error } = await supabase
//           .from('messages')
//           .select(`
//             id,
//             content,
//             sender_id,
//             created_at,
//             users:sender_id (full_name, email)
//           `)
//           .eq('chat_id', activeChat)
//           .order('created_at', { ascending: true });

//         if (error) {
//           console.error('Error loading messages:', error);
//           return;
//         }

//         if (messagesData && messagesData.length > 0) {
//           const formattedMessages: Message[] = messagesData.map(msg => ({
//             id: msg.id,
//             text: msg.content,
//             sender: msg.sender_id === currentUser?.id ? 'periskope' : 'them',
//             time: formatDate(msg.created_at),
//             senderName: msg.users?.full_name || 'Unknown',
//             email: msg.users?.email,
//             isRead: msg.sender_id === currentUser?.id
//           }));

//           setChats(prevChats =>
//             prevChats.map(chat => {
//               if (chat.id === activeChat) {
//                 return {
//                   ...chat,
//                   messages: formattedMessages,
//                   unread: 0
//                 };
//               }
//               return chat;
//             })
//           );

//           console.log('✅ Loaded', formattedMessages.length, 'messages');
//         }
//       } catch (error) {
//         console.error('Error loading chat messages:', error);
//       }
//     };

//     loadChatMessages();
//   }, [activeChat, useRealDatabase, currentUser]);

//   // Send message function
//   const handleSendMessage = useCallback(async (chatId: string, text: string) => {
//     if (!currentUser || !text.trim()) {
//       console.warn('Cannot send message: missing user or text');
//       return;
//     }

//     try {
//       console.log('📤 Sending message...', { chatId, text: text.trim() });

//       if (useRealDatabase) {
//         const sentMessage = await sendMessage(chatId, currentUser.id, text.trim());
        
//         const formattedMessage: Message = {
//           id: sentMessage.id,
//           text: sentMessage.content,
//           sender: 'periskope',
//           time: formatDate(sentMessage.created_at),
//           senderName: currentUser.full_name,
//           email: currentUser.email,
//           isRead: true
//         };

//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               const messageExists = chat.messages.some(m => m.id === sentMessage.id);
//               if (messageExists) return chat;

//               return {
//                 ...chat,
//                 messages: [...chat.messages, formattedMessage],
//                 lastMessage: `You: ${text.trim()}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );

//         console.log('✅ Message sent successfully');
//       } else {
//         const demoMessage: Message = {
//           id: `demo-${Date.now()}-${Math.random()}`,
//           text: text.trim(),
//           sender: 'periskope',
//           time: formatDate(new Date().toISOString()),
//           senderName: currentUser.full_name,
//           email: currentUser.email,
//           isRead: true
//         };

//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               return {
//                 ...chat,
//                 messages: [...chat.messages, demoMessage],
//                 lastMessage: `You: ${text.trim()}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('❌ Error sending message:', error);
//       alert(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   }, [currentUser, useRealDatabase]);

//   // Handle chat click
//   const handleChatClick = useCallback((chatId: string) => {
//     console.log('💬 Opening chat:', chatId);
//     setActiveChat(chatId);
    
//     setChats(prevChats =>
//       prevChats.map(chat => 
//         chat.id === chatId ? { ...chat, unread: 0 } : chat
//       )
//     );
//   }, []);

//   // Filter chats
//   const filteredChats = useMemo(() => {
//     return chats.filter(chat => {
//       const matchesSearch = searchQuery === '' || 
//         chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
        
//       const matchesFilter = filterValue === '' || 
//         chat.type.toLowerCase() === filterValue.toLowerCase();
        
//       const matchesLabel = selectedLabel === null || 
//         chat.status === selectedLabel;
        
//       return matchesSearch && matchesFilter && matchesLabel;
//     });
//   }, [chats, searchQuery, filterValue, selectedLabel]);

//   const activeChatData = useMemo(() => 
//     chats.find(chat => chat.id === activeChat), 
//     [chats, activeChat]
//   );

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Sidebar */}
//       <ChatSidebar
//         currentUser={currentUser}
//         onLogout={onLogout}
//       />
      
//       {/* Chat List */}
//       <div className="w-80 border-r border-gray-200">
//         <ChatList
//           chats={filteredChats}
//           activeChat={activeChat}
//           onChatClick={handleChatClick}
//           filterValue={filterValue}
//           onFilterChange={setFilterValue}
//           currentUserId={currentUser?.id}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           availableLabels={availableLabels}
//           selectedLabel={selectedLabel}
//           onSelectLabel={setSelectedLabel}
//           isLoading={isLoading}
//           onNewChatClick={() => setShowNewChatModal(true)}
//         />
//       </div>
      
//       {/* Chat Window */}
//       <div className="flex-1">
//         {activeChatData ? (
//           <ChatWindow
//             chat={activeChatData}
//             onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
//             currentUser={currentUser}
//             isConnected={isConnected}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-50">
//             <div className="text-center text-gray-500">
//               <h3 className="text-lg font-medium mb-2">
//                 {isLoading ? 'Loading...' : 'Select a chat to start messaging'}
//               </h3>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;




// app/components/ChatLayout.tsx - Updated with auth integration and pixel-perfect UI
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// import ChatSidebar from './ChatSidebar';
import ChatSidebar from './chatsiderbar';
// import ChatList from './ChatList';
import ChatList from './chatlist';
// import ChatWindow from './ChatWindow';
import ChatWindow from './chatwindow';
import LabelManagementModal from './labelmanagementmodel';
import NewChatModal from './newchatmodel';
import LogoutButton from '../auth/logoutbutton';
// import LabelManagementModal from './LabelManagementModal';
// import NewChatModal from './NewChatModal';
// import LogoutButton from './LogoutButton';
import {supabase, 
  formatDate, 
  getAvatarInitial,
  sendMessage,
  subscribeToMessages,
  testDatabaseConnection,
  isUserMemberOfChat} from '../../lib/supabase/client';
// import { 
  
// } from '../lib/supabase/client';

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

  // Setup real-time subscriptions
  useEffect(() => {
    if (!useRealDatabase || !currentUser) return;

    console.log('🔔 Setting up real-time subscriptions...');

    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    const cleanup = subscribeToMessages(
      handleRealTimeMessage,
      (error) => {
        console.error('Real-time subscription error:', error);
        setIsConnected(false);
      }
    );

    setIsConnected(true);

    return () => {
      console.log('🔌 Cleaning up real-time subscriptions');
      cleanup();
      setIsConnected(false);
    };
  }, [useRealDatabase, currentUser, handleRealTimeMessage]);

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
        lastMessageTime: 'Yesterday',
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
            time: 'Yesterday',
            senderName: 'Support2'
          }
        ]
      },
      {
        id: 'periskope-team-chat',
        name: 'Periskope Team Chat',
        lastMessage: 'Periskope: Test message',
        lastMessageTime: '28-Feb-25',
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
            time: '28-Feb-25',
            senderName: 'Periskope'
          },
          {
            id: 'msg-welcome',
            text: 'hello',
            sender: 'periskope',
            time: '12:07',
            senderName: 'Periskope'
          }
        ]
      },
      {
        id: 'phone-99999-99999',
        name: '+91 99999 99999',
        lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
        lastMessageTime: '25-Feb-25',
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
            time: '25-Feb-25',
            senderName: 'Swapnika'
          }
        ]
      },
      {
        id: 'test-demo17',
        name: 'Test Demo17',
        lastMessage: 'Rohosen: 123',
        lastMessageTime: '25-Feb-25',
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
            time: '25-Feb-25',
            senderName: 'Rohosen'
          }
        ]
      },
      {
        id: 'test-el-centro',
        name: 'Test El Centro',
        lastMessage: 'Roshnag: Hello, Ahmadport!',
        lastMessageTime: '04-Feb-25',
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
            time: '08:01',
            senderName: 'Test El Centro'
          },
          {
            id: 'msg-5-2',
            text: 'CDERT',
            sender: 'them',
            time: '09:49',
            senderName: 'Roshnag Airtel'
          }
        ]
      },
      {
        id: 'testing-group',
        name: 'Testing group',
        lastMessage: 'Testing 12345',
        lastMessageTime: '27-Jan-25',
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
            time: '09:49',
            senderName: 'Periskope'
          },
          {
            id: 'msg-6-2',
            text: 'testing',
            sender: 'periskope',
            time: '09:49',
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
        .filter(member => member.chats)
        .map(member => member.chats)
        .filter(chat => chat !== null);

      if (chatsList.length === 0) {
        console.log('No valid chats found, using demo data');
        createDummyData();
        return;
      }

      const enrichedChats = await Promise.all(
        chatsList.map(async (chat) => await enrichChatWithData(chat, userId))
      );

      const validChats = enrichedChats.filter(chat => chat !== null);
      const sortedChats = validChats.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

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

  // Enrich chat with messages and member data
  const enrichChatWithData = async (chat: any, userId: string) => {
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
        const otherUser = chatMembers.find(member => 
          member.user_id !== userId && member.users
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

      return {
        id: chat.id,
        name: displayName,
        lastMessage: lastMessage,
        lastMessageTime: formatDate(lastMessageTime),
        avatar: avatar || getAvatarInitial(displayName),
        type: chat.is_group ? 'Group' : 'Direct',
        status: chat.is_group ? 'Demo' : 'Content',
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
            const formattedMessages: Message[] = messagesData.map(msg => ({
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

  // Dummy functions for features not yet implemented
  const handleCreateChat = () => {
    console.log('Create chat feature not implemented');
  };

  const handleCreateLabel = () => {
    console.log('Create label feature not implemented');
  };

  const handleAssignLabel = () => {
    console.log('Assign label feature not implemented');
  };

  const handleQuickLabelAssign = () => {
    console.log('Quick label assign feature not implemented');
  };

  const handleManageChatMembers = () => {
    console.log('Manage chat members feature not implemented');
  };

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
          chats={filteredChats}
          activeChat={activeChat}
          onChatClick={handleChatClick}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          currentUserId={currentUser?.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availableLabels={availableLabels}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          isLoading={isLoading}
          onNewChatClick={() => setShowNewChatModal(true)}
        />
      </div>
      
      {/* Chat Window */}
      <div className="flex-1">
        {activeChatData ? (
          <ChatWindow
            chat={activeChatData}
            onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
            currentUser={currentUser}
            isConnected={isConnected}
          />
        ) : (
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