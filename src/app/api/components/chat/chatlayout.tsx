// import { useState, useEffect } from 'react';
// import ChatSidebar from './chatsiderbar';
// import ChatList from './chatlist';
// import ChatWindow from './chatwindow';
// import LabelManagementModal from './labelmanagementmodel';
// import NewChatModal from './newchatmodel';
// // import LabelManagementModal from './LabelManagementModal';
// import { 
//   supabase, 
//   formatDate, 
//   getAvatarInitial
// } from './supabaseclient';

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
// }

// export interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   time: string;
//   senderName?: string;
//   phone?: string;
//   email?: string;
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

// // Check if Supabase is properly configured
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
// //   const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [useRealDatabase, setUseRealDatabase] = useState<boolean>(false);
//   const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
//   const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
//   const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   // Create dummy data for demo mode
//   const createDummyData = () => {
//     // Create fallback data for demo purposes
//     const fallbackUser: User = {
//       id: currentUserId || 'fallback-user',
//       full_name: currentUserName || 'Demo User',
//       email: currentUserEmail || 'periskope@example.com',
//       avatar_url: null
//     };
    
//     setCurrentUser(fallbackUser);
    
//     // Create dummy labels
//     const dummyLabels: Label[] = [
//       { id: 'label-1', name: 'Important', color: 'red' },
//       { id: 'label-2', name: 'Work', color: 'blue' },
//       { id: 'label-3', name: 'Personal', color: 'green' },
//       { id: 'label-4', name: 'Support', color: 'purple' },
//       { id: 'label-5', name: 'Project', color: 'yellow' }
//     ];
    
//     setAvailableLabels(dummyLabels);
    
//     // Create dummy chats with different names
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
//             senderName: 'Sarah Johnson'
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
//         unread: 2,
//         isActive: false,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'dummy-msg-2',
//             text: 'Hello there!',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 7200000).toISOString()),
//             senderName: 'John Smith'
//           },
//           {
//             id: 'dummy-msg-3',
//             text: 'How can I help you today?',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 3600000).toISOString()),
//             senderName: 'John Smith'
//           }
//         ]
//       },
//       {
//         id: 'dummy-3',
//         name: 'Tech Team',
//         lastMessage: 'The new features are ready for testing',
//         lastMessageTime: formatDate(new Date(Date.now() - 86400000).toISOString()),
//         avatar: getAvatarInitial('Tech Team'),
//         type: 'Group',
//         label: 'Project',
//         secondaryLabel: 'Development',
//         unread: 0,
//         isActive: false,
//         memberCount: 8,
//         messages: [
//           {
//             id: 'dummy-msg-4',
//             text: 'Hey team, what\'s the status on the new UI?',
//             sender: 'periskope',
//             time: formatDate(new Date(Date.now() - 172800000).toISOString()),
//             senderName: currentUserName || 'Demo User',
//             phone: '+91 9978 41026',
//             email: currentUserEmail || 'periskope@example.com'
//           },
//           {
//             id: 'dummy-msg-5',
//             text: 'We\'re almost done! Just finalizing some styling issues.',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 129600000).toISOString()),
//             senderName: 'Dev Lead'
//           },
//           {
//             id: 'dummy-msg-6',
//             text: 'The new features are ready for testing',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 86400000).toISOString()),
//             senderName: 'Dev Lead'
//           }
//         ]
//       },
//       {
//         id: 'dummy-4',
//         name: 'Alice Johnson',
//         lastMessage: 'Can we meet tomorrow?',
//         lastMessageTime: formatDate(new Date(Date.now() - 43200000).toISOString()),
//         avatar: getAvatarInitial('Alice Johnson'),
//         type: 'Direct',
//         label: 'Personal',
//         unread: 1,
//         isActive: false,
//         memberCount: 2,
//         messages: [
//           {
//             id: 'dummy-msg-7',
//             text: 'Hey, are you free tomorrow?',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 86400000).toISOString()),
//             senderName: 'Alice Johnson'
//           },
//           {
//             id: 'dummy-msg-8',
//             text: 'Can we meet tomorrow?',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 43200000).toISOString()),
//             senderName: 'Alice Johnson'
//           }
//         ]
//       },
//       {
//         id: 'dummy-5',
//         name: 'Project Nexus',
//         lastMessage: 'Updated the roadmap for next quarter',
//         lastMessageTime: formatDate(new Date(Date.now() - 129600000).toISOString()),
//         avatar: getAvatarInitial('Project Nexus'),
//         type: 'Group',
//         label: 'Important',
//         secondaryLabel: 'Project',
//         unread: 0,
//         isActive: false,
//         memberCount: 12,
//         messages: [
//           {
//             id: 'dummy-msg-9',
//             text: 'I\'ve updated the roadmap for next quarter',
//             sender: 'them',
//             time: formatDate(new Date(Date.now() - 129600000).toISOString()),
//             senderName: 'Project Manager'
//           }
//         ]
//       }
//     ];
    
//     setChats(dummyChats);
//     setActiveChat(dummyChats[0].id);
//     setIsLoading(false);
//   };

//   // Fetch all available labels
//   const fetchLabels = async () => {
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
//   };

//   // Fetch data or use dummy data
//   useEffect(() => {
//     setIsLoading(true);
    
//     // Check if Supabase is properly configured
//     if (!isSupabaseConfigured()) {
//       console.log('Supabase not configured correctly, using demo mode');
//       createDummyData();
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // Use the passed user ID or fallback to the hardcoded one
//         const userId = currentUserId || '00000000-0000-0000-0000-000000000001';
        
//         // Fetch the user info if not provided in props
//         let userData = null;
//         if (!currentUserName || !currentUserEmail) {
//           const { data: userResult, error: userError } = await supabase
//             .from('users')
//             .select('id, full_name, email, avatar_url')
//             .eq('id', userId)
//             .single();
            
//           if (userError || !userResult) {
//             console.log('Error fetching user or no user found:', userError);
//             setUseRealDatabase(false);
//             createDummyData();
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
        
//         console.log('Found user:', userData);
        
//         // User found, set it and continue with real data
//         setCurrentUser(userData);
//         setUseRealDatabase(true);
        
//         // Fetch all available labels
//         await fetchLabels();
        
//         // Directly fetch all chats instead of trying to go through chat_members
//         console.log('Fetching all chats as a workaround for RLS issues');
//         let { data: allChatsData, error: allChatsError } = await supabase
//           .from('chats')
//           .select(`
//             id,
//             name,
//             is_group,
//             created_at,
//             updated_at
//           `)
//           .order('updated_at', { ascending: false })
//           .limit(10);
          
//         if (allChatsError || !allChatsData || allChatsData.length === 0) {
//           console.log('No chats found or error:', allChatsError);
          
//           // If no chats, create a demo chat between the current user and a sample user
//           console.log('Creating a sample chat for demonstration');
          
//           // First, check if we have other users to chat with
//           // First, check if we have other users to chat with
// // First, check if we have other users to chat with - FIXED VERSION
// let { data: otherUsers, error: otherUsersError } = await supabase
//   .from('users')
//   .select('id, full_name, email')
//   .neq('id', userId);

// if (otherUsersError) {
//   console.log('Error fetching other users:', otherUsersError);
//   createDummyData();
//   return;
// }

// console.log('Raw users from database:', otherUsers?.length || 0);

// // COMPREHENSIVE CLIENT-SIDE DEDUPLICATION
// if (otherUsers && otherUsers.length > 0) {
//   // Method 1: Use Map for deduplication by email
//   const uniqueUsersMap = new Map();
  
//   otherUsers.forEach(user => {
//     const emailKey = user.email.toLowerCase().trim();
//     // Only add if we haven't seen this email before
//     if (!uniqueUsersMap.has(emailKey)) {
//       uniqueUsersMap.set(emailKey, user);
//     } else {
//       console.log(`Duplicate user filtered: ${user.full_name} (${user.email})`);
//     }
//   });
  
//   // Convert back to array
//   const uniqueUsers = Array.from(uniqueUsersMap.values());
  
//   console.log(`Deduplication: ${otherUsers.length} → ${uniqueUsers.length} users`);
  
//   // Limit to 5 users and update the variable
//   otherUsers = uniqueUsers.slice(0, 5);
  
//   console.log('Final users for chat creation:', otherUsers.map(u => ({ name: u.full_name, email: u.email })));
// }

// if (!otherUsers || otherUsers.length === 0) {
//   console.log('No unique users found, using demo data');
//   createDummyData();
//   return;
// }
          
//           // Create a new chat with each user
//           const newChats = [];
          
//           for (const otherUser of otherUsers) {
//             // Create a chat name (User1 & User2)
//             const chatName = `${userData.full_name} & ${otherUser.full_name}`;
            
//             // Insert the new chat
//             const { data: newChat, error: newChatError } = await supabase
//               .from('chats')
//               .insert([
//                 {
//                   name: chatName,
//                   is_group: false,
//                   created_at: new Date().toISOString(),
//                   updated_at: new Date().toISOString()
//                 }
//               ])
//               .select();
              
//             if (newChatError || !newChat || newChat.length === 0) {
//               console.error('Error creating new chat:', newChatError);
//               continue;
//             }
            
//             const chatId = newChat[0].id;
            
//             // Add both users as members
//             await supabase
//               .from('chat_members')
//               .insert([
//                 {
//                   chat_id: chatId,
//                   user_id: userId,
//                   role: 'admin',
//                   joined_at: new Date().toISOString()
//                 },
//                 {
//                   chat_id: chatId,
//                   user_id: otherUser.id,
//                   role: 'member',
//                   joined_at: new Date().toISOString()
//                 }
//               ]);
              
//             // Add a welcome message
//             await supabase
//               .from('messages')
//               .insert([
//                 {
//                   chat_id: chatId,
//                   sender_id: userId,
//                   content: `Hello ${otherUser.full_name}! This is a new chat.`,
//                   created_at: new Date().toISOString(),
//                   updated_at: new Date().toISOString()
//                 }
//               ]);
              
//             newChats.push({
//               ...newChat[0],
//               otherUser
//             });
//           }
          
//           if (newChats.length === 0) {
//             createDummyData();
//             return;
//           }
          
//           // Refetch the chats now that we've created some
//           const { data: refreshedChats } = await supabase
//             .from('chats')
//             .select(`
//               id,
//               name,
//               is_group,
//               created_at,
//               updated_at
//             `)
//             .order('updated_at', { ascending: false })
//             .limit(10);
            
//           if (!refreshedChats || refreshedChats.length === 0) {
//             createDummyData();
//             return;
//           }
          
//           allChatsData = refreshedChats;
//         }
        
//         console.log('Found chats:', allChatsData.length);
        
//         // Get messages and other data for each chat
//         const enrichedChats = await Promise.all(allChatsData.map(async (chat) => {
//           // Get messages for this chat
//           const { data: messagesData, error: messagesError } = await supabase
//             .from('messages')
//             .select(`
//               id,
//               content,
//               sender_id,
//               created_at,
//               updated_at
//             `)
//             .eq('chat_id', chat.id)
//             .order('created_at', { ascending: true });
            
//           if (messagesError) {
//             console.error('Error fetching messages for chat', chat.id, messagesError);
//           }
          
//           const messages = messagesData || [];
//           console.log(`Found ${messages.length} messages for chat ${chat.id}`);
          
//           // For each message, get the sender details
//           const formattedMessages = await Promise.all(messages.map(async (msg) => {
//             // Get sender info
//             const { data: senderData } = await supabase
//               .from('users')
//               .select('full_name, email')
//               .eq('id', msg.sender_id)
//               .single();
              
//             const senderName = senderData?.full_name || 'Unknown';
            
//             return {
//               id: msg.id,
//               text: msg.content,
//               sender: msg.sender_id === userId ? 'periskope' : 'them',
//               time: formatDate(msg.created_at),
//               senderName: senderName,
//               email: senderData?.email
//             };
//           }));
          
//           // Get chat members to determine who else is in this chat
//           const { data: chatMembers } = await supabase
//             .from('chat_members')
//             .select(`
//               user_id,
//               users:user_id (
//                 id,
//                 full_name,
//                 email
//               )
//             `)
//             .eq('chat_id', chat.id);
            
//           // Find the other user in this chat (for direct messages)
//           const otherUser = chatMembers && chatMembers.length > 0 ? 
//             chatMembers.find(member => member.user_id !== userId)?.users : null;
          
//           // Get member count
//           const memberCount = chatMembers ? chatMembers.length : 0;
          
//           // Get last message details
//           const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
//           let lastMessageText = 'No messages';
//           let lastMessageTime = chat.updated_at;
          
//           if (lastMessage) {
//             // Get sender name
//             const { data: lastMessageSender } = await supabase
//               .from('users')
//               .select('full_name')
//               .eq('id', lastMessage.sender_id)
//               .single();
              
//             const senderName = lastMessageSender?.full_name || 'Unknown';
//             lastMessageText = lastMessage.sender_id === userId 
//               ? `You: ${lastMessage.content}` 
//               : `${senderName}: ${lastMessage.content}`;
//             lastMessageTime = lastMessage.created_at;
//           }
          
//           // Generate a chat name based on members if it's a direct message
//           let chatName = chat.name;
//           if (!chat.is_group && otherUser) {
//             chatName = otherUser.full_name;
//           }
          
//           // Get labels for the chat
//           const { data: chatLabels } = await supabase
//             .from('chat_labels')
//             .select(`
//               label_id,
//               labels:label_id (
//                 name,
//                 color
//               )
//             `)
//             .eq('chat_id', chat.id);
            
//           // Format labels
//           let primaryLabel = '';
//           let secondaryLabel = '';
          
//           if (chatLabels && chatLabels.length > 0) {
//             const validLabels = chatLabels.filter(label => label.labels);
//             if (validLabels.length > 0) {
//               primaryLabel = validLabels[0].labels.name || '';
//               if (validLabels.length > 1) {
//                 secondaryLabel = validLabels[1].labels.name || '';
//               }
//             }
//           } else {
//             // Generate random labels for demo if none exist
//             const possibleLabels = ['Chat', 'Personal', 'Work', 'Important', 'Demo'];
//             primaryLabel = possibleLabels[Math.floor(Math.random() * possibleLabels.length)];
//             if (Math.random() > 0.5) {
//               secondaryLabel = possibleLabels[Math.floor(Math.random() * possibleLabels.length)];
//               if (secondaryLabel === primaryLabel) {
//                 secondaryLabel = '';
//               }
//             }
//           }
          
//           return {
//             id: chat.id,
//             name: chatName,
//             lastMessage: lastMessageText,
//             lastMessageTime: formatDate(lastMessageTime),
//             avatar: otherUser?.avatar_url || getAvatarInitial(chatName),
//             type: chat.is_group ? 'Group' : 'Direct',
//             label: primaryLabel,
//             secondaryLabel: secondaryLabel,
//             unread: Math.floor(Math.random() * 3), // Random unread count for demo
//             memberCount: memberCount,
//             messages: formattedMessages
//           };
//         }));
        
//         console.log('Processed chats:', enrichedChats.length);
        
//         if (enrichedChats && enrichedChats.length > 0) {
//           setChats(enrichedChats);
//           setActiveChat(enrichedChats[0].id);
//           setIsLoading(false);
//         } else {
//           console.log('No chats found, falling back to demo data');
//           createDummyData();
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         console.log('Error occurred, falling back to demo mode');
//         setUseRealDatabase(false);
//         createDummyData();
//       }
//     };
    
//     fetchData();
//   }, [currentUserId, currentUserName, currentUserEmail]);

//   // Subscribe to new messages for the active chat
//   useEffect(() => {
//     if (!activeChat || !currentUser) return;
    
//     console.log('Setting up message subscription for chat:', activeChat);
    
//     if (useRealDatabase) {
//       // Set up a polling mechanism to check for new messages
//       // This is a workaround for real-time subscription issues
//       const intervalId = setInterval(async () => {
//         if (!activeChat) return;
        
//         try {
//           // Get the current messages in the state
//           const currentChat = chats.find(chat => chat.id === activeChat);
//           if (!currentChat) return;
          
//           const lastMessageId = currentChat.messages.length > 0 
//             ? currentChat.messages[currentChat.messages.length - 1].id 
//             : null;
            
//           // Fetch any new messages since the last one we have
//           const { data: newMessages } = await supabase
//             .from('messages')
//             .select(`
//               id,
//               content,
//               sender_id,
//               created_at,
//               updated_at
//             `)
//             .eq('chat_id', activeChat)
//             .order('created_at', { ascending: true });
            
//           if (!newMessages || newMessages.length === 0) return;
          
//           // Filter to only get messages we don't already have
//           const messagesToAdd = lastMessageId 
//             ? newMessages.filter(msg => {
//                 // Check if we already have this message in our state
//                 return !currentChat.messages.some(existingMsg => existingMsg.id === msg.id);
//               })
//             : newMessages;
            
//           if (messagesToAdd.length === 0) return;
          
//           console.log(`Found ${messagesToAdd.length} new messages to add`);
          
//           // Process the new messages and add them to the state
//           const formattedNewMessages = await Promise.all(messagesToAdd.map(async (msg) => {
//             // Get sender info
//             const { data: senderData } = await supabase
//               .from('users')
//               .select('full_name, email')
//               .eq('id', msg.sender_id)
//               .single();
              
//             return {
//               id: msg.id,
//               text: msg.content,
//               sender: msg.sender_id === currentUser.id ? 'periskope' : 'them',
//               time: formatDate(msg.created_at),
//               senderName: senderData?.full_name || 'Unknown',
//               email: senderData?.email
//             };
//           }));
          
//           if (formattedNewMessages.length > 0) {
//             // Update the chat with the new messages
//             setChats(prevChats => 
//               prevChats.map(chat => {
//                 if (chat.id === activeChat) {
//                   const lastNewMessage = formattedNewMessages[formattedNewMessages.length - 1];
//                   return {
//                     ...chat,
//                     messages: [...chat.messages, ...formattedNewMessages],
//                     lastMessage: lastNewMessage.sender === 'periskope' 
//                       ? `You: ${lastNewMessage.text}` 
//                       : `${lastNewMessage.senderName}: ${lastNewMessage.text}`,
//                     lastMessageTime: lastNewMessage.time
//                   };
//                 }
//                 return chat;
//               })
//             );
//           }
//         } catch (error) {
//           console.error('Error polling for new messages:', error);
//         }
//       }, 3000); // Check every 3 seconds
      
//       // Return cleanup function
//       return () => {
//         console.log('Cleaning up polling interval');
//         clearInterval(intervalId);
//       };
//     }
    
//     return () => {};
//   }, [activeChat, currentUser, useRealDatabase, chats]);

//   const handleChatClick = (chatId: string) => {
//     try {
//       setActiveChat(chatId);
      
//       // Update unread count to 0 for the selected chat
//       setChats(prevChats =>
//         prevChats.map(chat => 
//           chat.id === chatId ? { ...chat, unread: 0 } : chat
//         )
//       );
//     } catch (error) {
//       console.error('Error in handleChatClick:', error);
//     }
//   };

//   const handleSendMessage = async (chatId: string, text: string) => {
//     if (!currentUser || !text.trim()) return;
    
//     try {
//       if (useRealDatabase) {
//         console.log('Sending message to database:', { chatId, userId: currentUser.id, text });
        
//         // Direct database insert instead of using the helper function
//         const { data: newMessageData, error } = await supabase
//           .from('messages')
//           .insert([
//             { 
//               chat_id: chatId, 
//               sender_id: currentUser.id, 
//               content: text,
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString()
//             }
//           ])
//           .select();
        
//         if (error || !newMessageData || newMessageData.length === 0) {
//           throw new Error(`Failed to send message: ${error?.message || 'No data returned'}`);
//         }
        
//         console.log('Message sent successfully:', newMessageData[0]);
        
//         // Update chat timestamp
//         await supabase
//           .from('chats')
//           .update({ updated_at: new Date().toISOString() })
//           .eq('id', chatId);
        
//         // Update local state immediately for better UX
//         const newMessage: Message = {
//           id: newMessageData[0].id,
//           text: newMessageData[0].content,
//           sender: 'periskope',
//           time: formatDate(newMessageData[0].created_at),
//           senderName: currentUser.full_name,
//           email: currentUser.email
//         };
        
//         // Update the chat with the new message
//         setChats(prevChats => 
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               return {
//                 ...chat,
//                 messages: [...chat.messages, newMessage],
//                 lastMessage: `You: ${text}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );
//       } else {
//         // Demo mode - update local state only
//         const newMessage: Message = {
//           id: `local-${Date.now()}`,
//           text: text,
//           sender: 'periskope',
//           time: formatDate(new Date().toISOString()),
//           senderName: currentUser.full_name,
//           email: currentUser.email
//         };
        
//         // Update the chat with the new message
//         setChats(prevChats => 
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               return {
//                 ...chat,
//                 messages: [...chat.messages, newMessage],
//                 lastMessage: `You: ${text}`,
//                 lastMessageTime: formatDate(new Date().toISOString())
//               };
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('Error in handleSendMessage:', error);
      
//       // Show an error message to the user  
//       alert('Failed to send message. Please try again.');
//     }
//   };

//   // Filter chats based on filter value, search query, and selected label
// //   const filteredChats = chats.filter(chat => {
// //     // First filter by search query (name or last message content)
// //     const matchesSearch = searchQuery === '' || 
// //       chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      
// //     // Then filter by the filter value (which could be a type filter)
// //     const matchesFilter = filterValue === '' || 
// //       chat.type.toLowerCase() === filterValue.toLowerCase();
      
// //     // Then filter by selected label if any
// //     const matchesLabel = selectedLabel === null || 
// //       chat.label === selectedLabel || 
// //       chat.secondaryLabel === selectedLabel;
      
// //     return matchesSearch && matchesFilter && matchesLabel;
// //   });
// // Enhanced filter chats based on multiple criteria
// // Function to quickly assign/remove labels
// const handleQuickLabelAssign = async (chatId: string, labelName: string) => {
//     const label = availableLabels.find(l => l.name === labelName);
//     if (!label) return;
    
//     try {
//       if (useRealDatabase) {
//         // Check if label is already assigned
//         const { data: existingLabel } = await supabase
//           .from('chat_labels')
//           .select('*')
//           .eq('chat_id', chatId)
//           .eq('label_id', label.id)
//           .maybeSingle();
          
//         if (existingLabel) {
//           // Remove label
//           await supabase
//             .from('chat_labels')
//             .delete()
//             .eq('chat_id', chatId)
//             .eq('label_id', label.id);
//         } else {
//           // Add label
//           await supabase
//             .from('chat_labels')
//             .insert([
//               {
//                 chat_id: chatId,
//                 label_id: label.id,
//                 created_by: currentUser.id,
//                 created_at: new Date().toISOString()
//               }
//             ]);
//         }
        
//         await refreshChats();
//       } else {
//         // Demo mode - toggle label
//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat.id === chatId) {
//               if (chat.label === labelName) {
//                 return { ...chat, label: chat.secondaryLabel || '', secondaryLabel: '' };
//               } else if (chat.secondaryLabel === labelName) {
//                 return { ...chat, secondaryLabel: '' };
//               } else if (!chat.label) {
//                 return { ...chat, label: labelName };
//               } else if (!chat.secondaryLabel) {
//                 return { ...chat, secondaryLabel: labelName };
//               } else {
//                 return { ...chat, secondaryLabel: labelName };
//               }
//             }
//             return chat;
//           })
//         );
//       }
//     } catch (error) {
//       console.error('Error toggling label:', error);
//     }
//   };
// const filteredChats = chats.filter(chat => {
//     // Filter by search query (name or last message content)
//     const matchesSearch = searchQuery === '' || 
//       chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
      
//     // Filter by chat type (Direct/Group)
//     const matchesFilter = filterValue === '' || 
//       chat.type.toLowerCase() === filterValue.toLowerCase();
      
//     // Filter by selected label
//     const matchesLabel = selectedLabel === null || 
//       chat.label === selectedLabel || 
//       chat.secondaryLabel === selectedLabel;
      
//     return matchesSearch && matchesFilter && matchesLabel;
//   });
//   const activeChatData = chats.find(chat => chat.id === activeChat);

//   // Function to reload chats
//   const refreshChats = async () => {
//     if (!useRealDatabase || !currentUser) return;
    
//     setIsLoading(true);
//     try {
//       // Fetch chats again
//       const { data: allChatsData, error: allChatsError } = await supabase
//         .from('chats')
//         .select(`
//           id,
//           name,
//           is_group,
//           created_at,
//           updated_at
//         `)
//         .order('updated_at', { ascending: false })
//         .limit(10);
        
//       if (allChatsError || !allChatsData || allChatsData.length === 0) {
//         console.log('No chats found or error on refresh:', allChatsError);
//         return;
//       }
      
//       console.log('Refreshed chats:', allChatsData.length);
      
//       // Process chats similar to the initial load
//       const userId = currentUser.id;
//       const enrichedChats = await Promise.all(allChatsData.map(async (chat) => {
//         // Get messages for this chat
//         const { data: messagesData } = await supabase
//           .from('messages')
//           .select(`
//             id, content, sender_id, created_at, updated_at
//           `)
//           .eq('chat_id', chat.id)
//           .order('created_at', { ascending: true });
          
//         const messages = messagesData || [];
        
//         // Format messages
//         const formattedMessages = await Promise.all(messages.map(async (msg) => {
//             // Get sender info
//           const { data: senderData } = await supabase
//           .from('users')
//           .select('full_name, email')
//           .eq('id', msg.sender_id)
//           .single();
          
//         const senderName = senderData?.full_name || 'Unknown';
        
//         return {
//           id: msg.id,
//           text: msg.content,
//           sender: msg.sender_id === userId ? 'periskope' : 'them',
//           time: formatDate(msg.created_at),
//           senderName: senderName,
//           email: senderData?.email
//         };
//       }));
      
//       // Get chat members
//       const { data: chatMembers } = await supabase
//         .from('chat_members')
//         .select(`
//           user_id,
//           users:user_id (id, full_name, email)
//         `)
//         .eq('chat_id', chat.id);
        
//       // Find other user in direct chats
//       const otherUser = chatMembers && chatMembers.length > 0 ? 
//         chatMembers.find(member => member.user_id !== userId)?.users : null;
      
//       // Get member count
//       const memberCount = chatMembers ? chatMembers.length : 0;
      
//       // Get last message details
//       const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
//       let lastMessageText = 'No messages';
//       let lastMessageTime = chat.updated_at;
      
//       if (lastMessage) {
//         // Get sender name
//         const { data: lastMessageSender } = await supabase
//           .from('users')
//           .select('full_name')
//           .eq('id', lastMessage.sender_id)
//           .single();
          
//         const senderName = lastMessageSender?.full_name || 'Unknown';
//         lastMessageText = lastMessage.sender_id === userId 
//           ? `You: ${lastMessage.content}` 
//           : `${senderName}: ${lastMessage.content}`;
//         lastMessageTime = lastMessage.created_at;
//       }
      
//       // Generate chat name for direct messages
//       let chatName = chat.name;
//       if (!chat.is_group && otherUser) {
//         chatName = otherUser.full_name;
//       }
      
//       // Get chat labels
//       const { data: chatLabels } = await supabase
//         .from('chat_labels')
//         .select(`
//           label_id,
//           labels:label_id (name, color)
//         `)
//         .eq('chat_id', chat.id);
        
//       // Format labels
//       let primaryLabel = '';
//       let secondaryLabel = '';
      
//       if (chatLabels && chatLabels.length > 0) {
//         const validLabels = chatLabels.filter(label => label.labels);
//         if (validLabels.length > 0) {
//           primaryLabel = validLabels[0].labels.name || '';
//           if (validLabels.length > 1) {
//             secondaryLabel = validLabels[1].labels.name || '';
//           }
//         }
//       }
      
//       return {
//         id: chat.id,
//         name: chatName,
//         lastMessage: lastMessageText,
//         lastMessageTime: formatDate(lastMessageTime),
//         avatar: otherUser?.avatar_url || getAvatarInitial(chatName),
//         type: chat.is_group ? 'Group' : 'Direct',
//         label: primaryLabel,
//         secondaryLabel: secondaryLabel,
//         unread: 0, // Reset unread count on refresh
//         memberCount: memberCount,
//         messages: formattedMessages
//       };
//     }));
    
//     if (enrichedChats && enrichedChats.length > 0) {
//       setChats(enrichedChats);
      
//       // Keep the same active chat if it still exists
//       const chatStillExists = enrichedChats.some(chat => chat.id === activeChat);
//       if (!chatStillExists && enrichedChats.length > 0) {
//         setActiveChat(enrichedChats[0].id);
//       }
//     }
//   } catch (error) {
//     console.error('Error refreshing chats:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

// // Function to create a new chat
// // // Function to create a new chat - REPLACE YOUR EXISTING handleCreateChat FUNCTION
// // const handleCreateChat = async (name: string, isGroup: boolean, memberIds: string[] = []) => {
// //     if (!currentUser) return;
    
// //     try {
// //       if (useRealDatabase) {
// //         console.log('Creating new chat:', { name, isGroup, memberIds });
        
// //         // Create a new chat in the database
// //         const { data: newChat, error: chatError } = await supabase
// //           .from('chats')
// //           .insert([
// //             {
// //               name: name,
// //               is_group: isGroup,
// //               created_at: new Date().toISOString(),
// //               updated_at: new Date().toISOString()
// //             }
// //           ])
// //           .select();
          
// //         if (chatError || !newChat || newChat.length === 0) {
// //           throw new Error(`Failed to create chat: ${chatError?.message || 'No data returned'}`);
// //         }
        
// //         const chatId = newChat[0].id;
// //         console.log('Created chat with ID:', chatId);
        
// //         // Add the current user as a member (admin)
// //         const { error: memberError } = await supabase
// //           .from('chat_members')
// //           .insert([
// //             {
// //               chat_id: chatId,
// //               user_id: currentUser.id,
// //               role: 'admin',
// //               joined_at: new Date().toISOString()
// //             }
// //           ]);
          
// //         if (memberError) {
// //           console.error('Error adding current user as member:', memberError);
// //         }
          
// //         // Add the other members
// //         if (memberIds.length > 0) {
// //           const memberInserts = memberIds.map(memberId => ({
// //             chat_id: chatId,
// //             user_id: memberId,
// //             role: 'member',
// //             joined_at: new Date().toISOString()
// //           }));
          
// //           const { error: otherMembersError } = await supabase
// //             .from('chat_members')
// //             .insert(memberInserts);
            
// //           if (otherMembersError) {
// //             console.error('Error adding other members:', otherMembersError);
// //           }
// //         }
        
// //         // Add a welcome message
// //         const welcomeMessage = isGroup 
// //           ? `${currentUser.full_name} created this group chat` 
// //           : `${currentUser.full_name} started this conversation`;
          
// //         const { error: messageError } = await supabase
// //           .from('messages')
// //           .insert([
// //             {
// //               chat_id: chatId,
// //               sender_id: currentUser.id,
// //               content: welcomeMessage,
// //               created_at: new Date().toISOString(),
// //               updated_at: new Date().toISOString()
// //             }
// //           ]);
          
// //         if (messageError) {
// //           console.error('Error adding welcome message:', messageError);
// //         }
          
// //         console.log('Chat created successfully, refreshing chats...');
        
// //         // Refresh the chats to include the new one
// //         await refreshChats();
        
// //         // Set the new chat as active
// //         setActiveChat(chatId);
        
// //         console.log('New chat creation completed');
// //       } else {
// //         // Demo mode - create a local chat
// //         const newChatId = `dummy-${Date.now()}`;
// //         const welcomeMessage = isGroup ? 'Created this group chat' : 'Started a new conversation';
        
// //         const newChat: Chat = {
// //           id: newChatId,
// //           name: name,
// //           lastMessage: `You: ${welcomeMessage}`,
// //           lastMessageTime: formatDate(new Date().toISOString()),
// //           avatar: getAvatarInitial(name),
// //           type: isGroup ? 'Group' : 'Direct',
// //           label: 'New',
// //           unread: 0,
// //           memberCount: isGroup ? (memberIds.length + 1) : 2,
// //           messages: [
// //             {
// //               id: `dummy-msg-${Date.now()}`,
// //               text: welcomeMessage,
// //               sender: 'periskope',
// //               time: formatDate(new Date().toISOString()),
// //               senderName: currentUser.full_name,
// //               email: currentUser.email
// //             }
// //           ]
// //         };
        
// //         // Add the new chat to the state
// //         setChats(prevChats => [newChat, ...prevChats]);
        
// //         // Set the new chat as active
// //         setActiveChat(newChatId);
        
// //         console.log('Demo chat created successfully');
// //       }
// //     } catch (error) {
// //       console.error('Error creating chat:', error);
// //       throw error; // Re-throw so the modal can handle it
// //     }
// //   };
// // Complete Enhanced handleCreateChat function - REPLACE YOUR EXISTING ONE
// // Complete Enhanced handleCreateChat function - REPLACE YOUR EXISTING ONE
// const handleCreateChat = async (
//   name: string, 
//   isGroup: boolean, 
//   memberIds: string[] = [], 
//   memberRoles?: { [userId: string]: 'admin' | 'member' },
//   labelIds: string[] = []
// ) => {
//   if (!currentUser) return;
  
//   console.log('Creating chat with:', { name, isGroup, memberIds, memberRoles, labelIds });
  
//   try {
//     if (useRealDatabase) {
//       // Create a new chat in the database
//       const { data: newChat, error: chatError } = await supabase
//         .from('chats')
//         .insert([
//           {
//             name: name,
//             is_group: isGroup,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ])
//         .select();
        
//       if (chatError || !newChat || newChat.length === 0) {
//         throw new Error(`Failed to create chat: ${chatError?.message || 'No data returned'}`);
//       }
      
//       const chatId = newChat[0].id;
      
//       // Add the current user as a member (admin)
//       await supabase
//         .from('chat_members')
//         .insert([
//           {
//             chat_id: chatId,
//             user_id: currentUser.id,
//             role: 'admin',
//             joined_at: new Date().toISOString()
//           }
//         ]);
        
//       // Add the other members with their roles
//       if (memberIds.length > 0) {
//         const memberInserts = memberIds.map(memberId => ({
//           chat_id: chatId,
//           user_id: memberId,
//           role: memberRoles?.[memberId] || 'member',
//           joined_at: new Date().toISOString()
//         }));
        
//         await supabase
//           .from('chat_members')
//           .insert(memberInserts);
//       }
      
//       // Add labels to the chat if any
//       if (labelIds && labelIds.length > 0) {
//         const labelInserts = labelIds.map(labelId => ({
//           chat_id: chatId,
//           label_id: labelId,
//           created_by: currentUser.id,
//           created_at: new Date().toISOString()
//         }));
        
//         await supabase
//           .from('chat_labels')
//           .insert(labelInserts);
//       }
      
//       // Add a welcome message
//       const welcomeMessage = isGroup 
//         ? `${currentUser.full_name} created this group chat` 
//         : `${currentUser.full_name} started this conversation`;
        
//       await supabase
//         .from('messages')
//         .insert([
//           {
//             chat_id: chatId,
//             sender_id: currentUser.id,
//             content: welcomeMessage,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ]);
        
//       await refreshChats();
//       setActiveChat(chatId);
//     } else {
//       // Demo mode - create a local chat
//       const newChatId = `dummy-${Date.now()}`;
//       const welcomeMessage = isGroup ? 'Created this group chat' : 'Started a new conversation';
      
//       // Apply labels in demo mode
//       const selectedLabelNames = availableLabels
//         .filter(label => labelIds.includes(label.id))
//         .map(label => label.name);
      
//       const newChat: Chat = {
//         id: newChatId,
//         name: name,
//         lastMessage: `You: ${welcomeMessage}`,
//         lastMessageTime: formatDate(new Date().toISOString()),
//         avatar: getAvatarInitial(name),
//         type: isGroup ? 'Group' : 'Direct',
//         label: selectedLabelNames[0] || 'New',
//         secondaryLabel: selectedLabelNames[1] || '',
//         unread: 0,
//         memberCount: isGroup ? (memberIds.length + 1) : 2,
//         messages: [
//           {
//             id: `dummy-msg-${Date.now()}`,
//             text: welcomeMessage,
//             sender: 'periskope',
//             time: formatDate(new Date().toISOString()),
//             senderName: currentUser.full_name,
//             email: currentUser.email
//           }
//         ]
//       };
      
//       setChats(prevChats => [newChat, ...prevChats]);
//       setActiveChat(newChatId);
//     }
//   } catch (error) {
//     console.error('Error creating chat:', error);
//     throw error;
//   }
// };
// // Function to create a new label
// const handleCreateLabel = async (name: string, color: string) => {
//   if (!currentUser) return;
  
//   try {
//     if (useRealDatabase) {
//       // Create a new label in the database
//       const { data: newLabel, error } = await supabase
//         .from('labels')
//         .insert([
//           {
//             name: name,
//             color: color,
//             created_by: currentUser.id,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           }
//         ])
//         .select();
        
//       if (error || !newLabel || newLabel.length === 0) {
//         throw new Error(`Failed to create label: ${error?.message || 'No data returned'}`);
//       }
      
//       // Refresh labels
//       await fetchLabels();
//     } else {
//       // Demo mode - create a local label
//       const newLabel: Label = {
//         id: `label-${Date.now()}`,
//         name: name,
//         color: color
//       };
      
//       // Add the new label to the state
//       setAvailableLabels(prevLabels => [...prevLabels, newLabel]);
//     }
//   } catch (error) {
//     console.error('Error creating label:', error);
//     alert('Failed to create label. Please try again.');
//   }
// };

// // Function to assign a label to a chat
// const handleAssignLabel = async (chatId: string, labelId: string) => {
//   if (!currentUser) return;
  
//   try {
//     if (useRealDatabase) {
//       // First check if this label is already assigned to this chat
//       const { data: existingLabel } = await supabase
//         .from('chat_labels')
//         .select('*')
//         .eq('chat_id', chatId)
//         .eq('label_id', labelId)
//         .maybeSingle();
        
//       if (existingLabel) {
//         // Label already assigned, no need to do anything
//         return;
//       }
      
//       // Assign the label to the chat
//       await supabase
//         .from('chat_labels')
//         .insert([
//           {
//             chat_id: chatId,
//             label_id: labelId,
//             created_by: currentUser.id,
//             created_at: new Date().toISOString()
//           }
//         ]);
        
//       // Refresh chats to reflect the new label
//       await refreshChats();
//     } else {
//       // Demo mode - update the local state
//       const selectedLabel = availableLabels.find(label => label.id === labelId);
//       if (!selectedLabel) return;
      
//       setChats(prevChats =>
//         prevChats.map(chat => {
//           if (chat.id === chatId) {
//             // If the chat already has a primary label, move it to secondary
//             if (chat.label && !chat.secondaryLabel) {
//               return {
//                 ...chat,
//                 secondaryLabel: selectedLabel.name
//               };
//             } 
//             // If no primary label, set it as primary
//             else if (!chat.label) {
//               return {
//                 ...chat,
//                 label: selectedLabel.name
//               };
//             }
//             // If both labels are set, replace secondary
//             else {
//               return {
//                 ...chat,
//                 secondaryLabel: selectedLabel.name
//               };
//             }
//           }
//           return chat;
//         })
//       );
//     }
//   } catch (error) {
//     console.error('Error assigning label:', error);
//     alert('Failed to assign label. Please try again.');
//   }
// };
// // Function to manage chat members
// const handleManageChatMembers = async (chatId: string, action: 'add' | 'remove', userId: string, role: 'admin' | 'member' = 'member') => {
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
          
//           // Add system message about member addition
//           const { data: userData } = await supabase
//             .from('users')
//             .select('full_name')
//             .eq('id', userId)
//             .single();
            
//           await supabase
//             .from('messages')
//             .insert([
//               {
//                 chat_id: chatId,
//                 sender_id: currentUser.id,
//                 content: `${userData?.full_name || 'User'} was added to the chat`,
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString()
//               }
//             ]);
//         } else {
//           // Remove member
//           const { error } = await supabase
//             .from('chat_members')
//             .delete()
//             .eq('chat_id', chatId)
//             .eq('user_id', userId);
            
//           if (error) throw error;
          
//           // Add system message about member removal
//           const { data: userData } = await supabase
//             .from('users')
//             .select('full_name')
//             .eq('id', userId)
//             .single();
            
//           await supabase
//             .from('messages')
//             .insert([
//               {
//                 chat_id: chatId,
//                 sender_id: currentUser.id,
//                 content: `${userData?.full_name || 'User'} was removed from the chat`,
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString()
//               }
//             ]);
//         }
        
//         await refreshChats();
//       } else {
//         // Demo mode - update local state
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
//       alert('Failed to manage chat members. Please try again.');
//     }
//   };

// return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
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
//           onChatCreated={refreshChats}
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           availableLabels={availableLabels}
//           selectedLabel={selectedLabel}
//           onSelectLabel={setSelectedLabel}
//           isLoading={isLoading}
//           onNewChatClick={() => setShowNewChatModal(true)}
//         />
        
//         <div className="flex-1">
//   {activeChatData ? (
//     <ChatWindow
//     chat={activeChatData}
//     onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
//     availableLabels={availableLabels}
//     onAssignLabel={(labelId) => handleAssignLabel(activeChatData.id, labelId)}
//     onQuickLabelAssign={(labelName) => handleQuickLabelAssign(activeChatData.id, labelName)}
//     onManageMembers={(action, userId, role) => handleManageChatMembers(activeChatData.id, action, userId, role)}
//     currentUser={currentUser}
//     />
//   ) : (
//     <div className="flex items-center justify-center h-full">
//       <div className="text-center text-gray-500">
//         <h3 className="text-lg font-medium mb-2">No chat selected</h3>
//         <p className="mb-4">Select a chat from the sidebar to start messaging</p>
//         <button
//           onClick={() => setShowNewChatModal(true)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Start New Chat
//         </button>
//       </div>
//     </div>
//   )}
// </div>
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

// Fixed ChatLayout with Real-time Messaging
import { useState, useEffect, useCallback, useMemo } from 'react';
import ChatSidebar from './chatsiderbar';
import ChatList from './chatlist';
import ChatWindow from './chatwindow';
import LabelManagementModal from './labelmanagementmodel';
import NewChatModal from './newchatmodel';
import {supabase, 
  formatDate, 
  getAvatarInitial,
  sendMessage,
  subscribeToMessages,
  testDatabaseConnection,
  isUserMemberOfChat} from '../../lib/supabase/client';
// import { 
//   supabase, 
//   formatDate, 
//   getAvatarInitial,
//   sendMessage,
//   subscribeToMessages,
//   testDatabaseConnection,
//   isUserMemberOfChat
// } from './supabaseclient';

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

const isSupabaseConfigured = () => {
  try {
    return !!supabase.from;
  } catch (error) {
    console.error('Supabase configuration error:', error);
    return false;
  }
};

interface ChatLayoutProps {
  currentUserId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
  onLogout?: () => void;
}

const ChatLayout = ({ 
  currentUserId, 
  currentUserName = 'Demo User',
  currentUserEmail = 'demo@example.com',
  onLogout 
}: ChatLayoutProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [useRealDatabase, setUseRealDatabase] = useState<boolean>(false);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // FIXED: Real-time message handler
  const handleRealTimeMessage = useCallback(async (payload: any) => {
    if (!payload.new || !currentUser) return;

    const newMsg = payload.new;
    console.log('📨 Processing real-time message:', newMsg);

    // Skip our own messages (they're already added locally)
    if (newMsg.sender_id === currentUser.id) {
      console.log('Skipping own message');
      return;
    }

    // Check if this message is for a chat we're part of
    const isMember = await isUserMemberOfChat(currentUser.id, newMsg.chat_id);
    if (!isMember) {
      console.log('Message not for our chat');
      return;
    }

    // Get sender info
    const { data: senderData } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', newMsg.sender_id)
      .single();

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

    // Update the chat with the new message
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === newMsg.chat_id) {
          // Check if message already exists to prevent duplicates
          const messageExists = chat.messages.some(m => m.id === newMsg.id);
          if (messageExists) {
            console.log('Message already exists, skipping');
            return chat;
          }

          const isCurrentlyActive = chat.id === activeChat;
          const newUnreadCount = isCurrentlyActive ? 0 : chat.unread + 1;

          // Show notification for new message
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
  }, [currentUser, activeChat]);

  // FIXED: Setup real-time subscriptions
  useEffect(() => {
    if (!useRealDatabase || !currentUser) return;

    console.log('🔔 Setting up real-time subscriptions...');

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    // Subscribe to real-time messages
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

  // Initialize data
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      setIsLoading(true);

      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using demo mode');
        if (isMounted) createDummyData();
        return;
      }

      // Test database connection
      const dbConnected = await testDatabaseConnection();
      if (!dbConnected) {
        console.log('Database connection failed, using demo mode');
        if (isMounted) createDummyData();
        return;
      }

      try {
        const userId = currentUserId || '00000000-0000-0000-0000-000000000001';
        
        // Get or create user
        let userData = null;
        if (!currentUserName || !currentUserEmail) {
          const { data: userResult, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email, avatar_url')
            .eq('id', userId)
            .single();
            
          if (userError || !userResult) {
            console.log('User not found, using demo mode');
            if (isMounted) createDummyData();
            return;
          }
          
          userData = userResult;
        } else {
          userData = {
            id: userId,
            full_name: currentUserName,
            email: currentUserEmail,
            avatar_url: null
          };
        }

        if (!isMounted) return;

        setCurrentUser(userData);
        setUseRealDatabase(true);

        // Load user's chats
        await loadUserChats(userId);

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
  }, [currentUserId, currentUserName, currentUserEmail]);

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
        console.log('No chats found for user');
        return;
      }

      const chatsList = userChatMembers
        .filter(member => member.chats)
        .map(member => member.chats)
        .filter(chat => chat !== null);

      if (chatsList.length === 0) {
        console.log('No valid chats found');
        return;
      }

      // Enrich chats with data
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
    }
  };

  // Enrich chat with messages and member data
  const enrichChatWithData = async (chat: any, userId: string) => {
    try {
      // Get chat members
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

      // Determine display name
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

      // Get last message
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

      // Calculate unread count (simplified)
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
        label: chat.is_group ? 'Group' : 'Personal',
        secondaryLabel: '',
        unread: unreadCount,
        memberCount: chatMembers ? chatMembers.length : 2,
        messages: [] // Messages loaded when chat is opened
      };
    } catch (error) {
      console.error('Error enriching chat:', error);
      return null;
    }
  };

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat || !useRealDatabase) return;

    const loadChatMessages = async () => {
      try {
        console.log('📄 Loading messages for chat:', activeChat);

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

          // Update chat with messages
          setChats(prevChats =>
            prevChats.map(chat => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  messages: formattedMessages,
                  unread: 0 // Mark as read when viewing
                };
              }
              return chat;
            })
          );

          console.log('✅ Loaded', formattedMessages.length, 'messages');
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    };

    loadChatMessages();
  }, [activeChat, useRealDatabase, currentUser]);

  // FIXED: Send message function
  const handleSendMessage = useCallback(async (chatId: string, text: string) => {
    if (!currentUser || !text.trim()) {
      console.warn('Cannot send message: missing user or text');
      return;
    }

    try {
      console.log('📤 Sending message...', { chatId, text: text.trim() });

      if (useRealDatabase) {
        // Use the enhanced sendMessage function
        const sentMessage = await sendMessage(chatId, currentUser.id, text.trim());
        
        // Create formatted message for immediate UI update
        const formattedMessage: Message = {
          id: sentMessage.id,
          text: sentMessage.content,
          sender: 'periskope',
          time: formatDate(sentMessage.created_at),
          senderName: currentUser.full_name,
          email: currentUser.email,
          isRead: true
        };

        // Update local state immediately for better UX
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === chatId) {
              // Check for duplicates
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
        // Demo mode
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
    
    // Mark chat as read
    setChats(prevChats =>
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }, []);

  // Create dummy data for demo mode
  const createDummyData = useCallback(() => {
    const fallbackUser: User = {
      id: currentUserId || 'fallback-user',
      full_name: currentUserName || 'Demo User',
      email: currentUserEmail || 'demo@example.com',
      avatar_url: null
    };
    
    setCurrentUser(fallbackUser);
    
    const dummyLabels: Label[] = [
      { id: 'label-1', name: 'Important', color: 'red' },
      { id: 'label-2', name: 'Work', color: 'blue' },
      { id: 'label-3', name: 'Personal', color: 'green' },
      { id: 'label-4', name: 'Support', color: 'purple' },
      { id: 'label-5', name: 'Project', color: 'yellow' }
    ];
    
    setAvailableLabels(dummyLabels);
    
    const dummyChats: Chat[] = [
      {
        id: 'dummy-1',
        name: 'Marketing Team',
        lastMessage: 'We need to discuss the new campaign',
        lastMessageTime: formatDate(new Date().toISOString()),
        avatar: getAvatarInitial('Marketing Team'),
        type: 'Group',
        label: 'Work',
        unread: 0,
        isActive: false,
        memberCount: 5,
        messages: [
          {
            id: 'dummy-msg-1',
            text: 'We need to discuss the new campaign',
            sender: 'them',
            time: formatDate(new Date().toISOString()),
            senderName: 'Sarah Johnson',
            isRead: true
          }
        ]
      },
      {
        id: 'dummy-2',
        name: 'John Smith',
        lastMessage: 'How can I help you today?',
        lastMessageTime: formatDate(new Date(Date.now() - 3600000).toISOString()),
        avatar: getAvatarInitial('John Smith'),
        type: 'Direct',
        label: 'Support',
        unread: 1,
        isActive: false,
        memberCount: 2,
        messages: [
          {
            id: 'dummy-msg-2',
            text: 'Hello there!',
            sender: 'them',
            time: formatDate(new Date(Date.now() - 7200000).toISOString()),
            senderName: 'John Smith',
            isRead: true
          },
          {
            id: 'dummy-msg-3',
            text: 'How can I help you today?',
            sender: 'them',
            time: formatDate(new Date(Date.now() - 3600000).toISOString()),
            senderName: 'John Smith',
            isRead: false
          }
        ]
      }
    ];
    
    setChats(dummyChats);
    setActiveChat(dummyChats[0].id);
    setIsLoading(false);
    setUseRealDatabase(false);
  }, [currentUserId, currentUserName, currentUserEmail]);

  // Fetch labels
  const fetchLabels = useCallback(async () => {
    if (!useRealDatabase) return;
    
    try {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setAvailableLabels(data || []);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  }, [useRealDatabase]);

  // Create chat function
  const handleCreateChat = useCallback(async (
    name: string, 
    isGroup: boolean, 
    memberIds: string[] = [], 
    memberRoles?: { [userId: string]: 'admin' | 'member' },
    labelIds: string[] = []
  ) => {
    if (!currentUser) return;
    
    try {
      if (useRealDatabase) {
        console.log('🆕 Creating new chat:', { name, isGroup, memberIds });

        const { data: newChat, error: chatError } = await supabase
          .from('chats')
          .insert([
            {
              name: name,
              is_group: isGroup,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
          
        if (chatError || !newChat) {
          throw new Error(`Failed to create chat: ${chatError?.message}`);
        }
        
        const chatId = newChat.id;
        console.log('✅ Chat created with ID:', chatId);
        
        // Add current user as admin
        await supabase
          .from('chat_members')
          .insert([
            {
              chat_id: chatId,
              user_id: currentUser.id,
              role: 'admin',
              joined_at: new Date().toISOString()
            }
          ]);
          
        // Add other members
        if (memberIds.length > 0) {
          const memberInserts = memberIds.map(memberId => ({
            chat_id: chatId,
            user_id: memberId,
            role: memberRoles?.[memberId] || 'member',
            joined_at: new Date().toISOString()
          }));
          
          await supabase
            .from('chat_members')
            .insert(memberInserts);
        }
        
        // Add labels if any
        if (labelIds && labelIds.length > 0) {
          const labelInserts = labelIds.map(labelId => ({
            chat_id: chatId,
            label_id: labelId,
            created_by: currentUser.id,
            created_at: new Date().toISOString()
          }));
          
          await supabase
            .from('chat_labels')
            .insert(labelInserts);
        }
        
        // Add welcome message
        const welcomeMessage = isGroup 
          ? `${currentUser.full_name} created this group chat` 
          : `${currentUser.full_name} started this conversation`;
          
        await sendMessage(chatId, currentUser.id, welcomeMessage);
          
        // Reload chats and activate the new one
        await loadUserChats(currentUser.id);
        setActiveChat(chatId);
        
        console.log('✅ Chat creation completed');
      } else {
        // Demo mode
        const newChatId = `dummy-${Date.now()}`;
        const welcomeMessage = isGroup ? 'Created this group chat' : 'Started a new conversation';
        
        const selectedLabelNames = availableLabels
          .filter(label => labelIds.includes(label.id))
          .map(label => label.name);
        
        const newChat: Chat = {
          id: newChatId,
          name: name,
          lastMessage: `You: ${welcomeMessage}`,
          lastMessageTime: formatDate(new Date().toISOString()),
          avatar: getAvatarInitial(name),
          type: isGroup ? 'Group' : 'Direct',
          label: selectedLabelNames[0] || 'New',
          secondaryLabel: selectedLabelNames[1] || '',
          unread: 0,
          memberCount: isGroup ? (memberIds.length + 1) : 2,
          messages: [
            {
              id: `dummy-msg-${Date.now()}`,
              text: welcomeMessage,
              sender: 'periskope',
              time: formatDate(new Date().toISOString()),
              senderName: currentUser.full_name,
              email: currentUser.email,
              isRead: true
            }
          ]
        };
        
        setChats(prevChats => [newChat, ...prevChats]);
        setActiveChat(newChatId);
      }
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      throw error;
    }
  }, [currentUser, useRealDatabase, availableLabels]);

  // Label management functions
  const handleCreateLabel = useCallback(async (name: string, color: string) => {
    if (!currentUser) return;
    
    try {
      if (useRealDatabase) {
        const { data: newLabel, error } = await supabase
          .from('labels')
          .insert([
            {
              name: name,
              color: color,
              created_by: currentUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select();
          
        if (error || !newLabel || newLabel.length === 0) {
          throw new Error(`Failed to create label: ${error?.message}`);
        }
        
        await fetchLabels();
      } else {
        const newLabel: Label = {
          id: `label-${Date.now()}`,
          name: name,
          color: color
        };
        
        setAvailableLabels(prevLabels => [...prevLabels, newLabel]);
      }
    } catch (error) {
      console.error('Error creating label:', error);
      alert('Failed to create label. Please try again.');
    }
  }, [currentUser, useRealDatabase, fetchLabels]);

  const handleAssignLabel = useCallback(async (chatId: string, labelId: string) => {
    if (!currentUser) return;
    
    try {
      if (useRealDatabase) {
        const { data: existingLabel } = await supabase
          .from('chat_labels')
          .select('*')
          .eq('chat_id', chatId)
          .eq('label_id', labelId)
          .maybeSingle();
          
        if (existingLabel) return;
        
        await supabase
          .from('chat_labels')
          .insert([
            {
              chat_id: chatId,
              label_id: labelId,
              created_by: currentUser.id,
              created_at: new Date().toISOString()
            }
          ]);
          
        await loadUserChats(currentUser.id);
      } else {
        const selectedLabel = availableLabels.find(label => label.id === labelId);
        if (!selectedLabel) return;
        
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === chatId) {
              if (chat.label && !chat.secondaryLabel) {
                return { ...chat, secondaryLabel: selectedLabel.name };
              } else if (!chat.label) {
                return { ...chat, label: selectedLabel.name };
              } else {
                return { ...chat, secondaryLabel: selectedLabel.name };
              }
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error('Error assigning label:', error);
    }
  }, [currentUser, useRealDatabase, availableLabels]);

  const handleQuickLabelAssign = useCallback(async (chatId: string, labelName: string) => {
    const label = availableLabels.find(l => l.name === labelName);
    if (!label) return;
    
    await handleAssignLabel(chatId, label.id);
  }, [availableLabels, handleAssignLabel]);

  // Member management
  const handleManageChatMembers = useCallback(async (
    chatId: string, 
    action: 'add' | 'remove', 
    userId: string, 
    role: 'admin' | 'member' = 'member'
  ) => {
    if (!currentUser) return;
    
    try {
      if (useRealDatabase) {
        if (action === 'add') {
          const { error } = await supabase
            .from('chat_members')
            .insert([
              {
                chat_id: chatId,
                user_id: userId,
                role: role,
                joined_at: new Date().toISOString()
              }
            ]);
            
          if (error) throw error;
          
          const { data: userData } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', userId)
            .single();
            
          await sendMessage(
            chatId, 
            currentUser.id, 
            `${userData?.full_name || 'User'} was added to the chat`
          );
        } else {
          const { error } = await supabase
            .from('chat_members')
            .delete()
            .eq('chat_id', chatId)
            .eq('user_id', userId);
            
          if (error) throw error;
          
          const { data: userData } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', userId)
            .single();
            
          await sendMessage(
            chatId, 
            currentUser.id, 
            `${userData?.full_name || 'User'} was removed from the chat`
          );
        }
        
        await loadUserChats(currentUser.id);
      } else {
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.id === chatId) {
              const newMemberCount = action === 'add' 
                ? (chat.memberCount || 0) + 1 
                : Math.max((chat.memberCount || 0) - 1, 1);
              return { ...chat, memberCount: newMemberCount };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error('Error managing chat members:', error);
    }
  }, [currentUser, useRealDatabase]);

  // Filter chats
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const matchesSearch = searchQuery === '' || 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesFilter = filterValue === '' || 
        chat.type.toLowerCase() === filterValue.toLowerCase();
        
      const matchesLabel = selectedLabel === null || 
        chat.label === selectedLabel || 
        chat.secondaryLabel === selectedLabel;
        
      return matchesSearch && matchesFilter && matchesLabel;
    });
  }, [chats, searchQuery, filterValue, selectedLabel]);

  const activeChatData = useMemo(() => 
    chats.find(chat => chat.id === activeChat), 
    [chats, activeChat]
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Connection Status */}
      {useRealDatabase && (
        <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs z-50 ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Real-time Active' : '🔴 Disconnected'}
        </div>
      )}

      {currentUser && (
        <ChatSidebar
          user={currentUser}
          availableLabels={availableLabels}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          onCreateChat={handleCreateChat}
          onShowLabelModal={() => setShowLabelModal(true)}
          onLogout={onLogout}
          isSupabaseConfigured={useRealDatabase}
        />
      )}
      
      <div className="flex-1 flex">
        <ChatList
          chats={filteredChats}
          activeChat={activeChat}
          onChatClick={handleChatClick}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          currentUserId={currentUser?.id}
          onChatCreated={() => loadUserChats(currentUser?.id || '')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availableLabels={availableLabels}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          isLoading={isLoading}
          onNewChatClick={() => setShowNewChatModal(true)}
        />
        
        <div className="flex-1">
          {activeChatData ? (
            <ChatWindow
              chat={activeChatData}
              onSendMessage={(text) => handleSendMessage(activeChatData.id, text)}
              availableLabels={availableLabels}
              onAssignLabel={(labelId) => handleAssignLabel(activeChatData.id, labelId)}
              onQuickLabelAssign={(labelName) => handleQuickLabelAssign(activeChatData.id, labelName)}
              onManageMembers={(action, userId, role) => handleManageChatMembers(activeChatData.id, action, userId, role)}
              currentUser={currentUser}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">
                  {isLoading ? 'Loading...' : 'No chat selected'}
                </h3>
                <p className="mb-4">
                  {isLoading ? 'Please wait...' : 'Select a chat from the sidebar to start messaging'}
                </p>
                {!isLoading && (
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Start New Chat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Modal */}
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
      
      {/* Label Management Modal */}
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