

// // ChatWindow.tsx - Enhanced implementation with all features from screenshot
// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   FaPhoneAlt, 
//   FaVideo, 
//   FaUserPlus, 
//   FaEllipsisV, 
//   FaSearch,
//   FaPaperclip,
//   FaSmile,
//   FaMicrophone,
//   FaArrowDown,
//   FaWhatsapp,
//   FaStickyNote,
//   FaGlobe,
//   FaPaperPlane,
//   FaCog,
//   FaArchive,
//   FaTrash,
//   FaFlag,
//   FaVolumeUp,
//   FaVolumeMute,
//   FaStar,
//   FaImage,
//   FaFile,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaUsers
// } from 'react-icons/fa';
// // import { Chat, Message, User } from './ChatLayout';
// import { Chat ,Message, User} from './chatlayout';

// interface ChatWindowProps {
//   chat: Chat;
//   onSendMessage: (message: string) => void;
//   currentUser: User | null;
//   isConnected?: boolean;
// }

// const ChatWindow = ({ chat, onSendMessage, currentUser, isConnected }: ChatWindowProps) => {
//   const [messageText, setMessageText] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showAttachMenu, setShowAttachMenu] = useState(false);
//   const [showChatMenu, setShowChatMenu] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showChatInfo, setShowChatInfo] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chat.messages]);

//   // Handle send message
//   const handleSendMessage = () => {
//     if (messageText.trim()) {
//       onSendMessage(messageText);
//       setMessageText('');
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Format time for messages
//   const formatMessageTime = (time: string) => {
//     try {
//       const date = new Date(time);
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return time;
//     }
//   };

//   // Get chat participants info
//   const getChatParticipants = () => {
//     if (chat.type === 'Group') {
//       const participantsList = [
//         'Roshnag Airtel', 'Roshnag Jio', 'Bharat Kumar Ramesh', 'Periskope'
//       ].slice(0, chat.memberCount || 4);
//       return participantsList.join(', ');
//     }
//     return chat.phone || 'Direct Message';
//   };

//   // Get participant count display
//   const getParticipantCount = () => {
//     if (chat.type === 'Group') {
//       return `${chat.memberCount || 4} members`;
//     }
//     return null;
//   };

//   // Emoji picker data
//   const commonEmojis = ['😀', '😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉'];

//   // Attachment menu items
//   const attachmentItems = [
//     { icon: FaImage, label: 'Photo', color: 'text-blue-500' },
//     { icon: FaFile, label: 'Document', color: 'text-green-500' },
//     { icon: FaCalendarAlt, label: 'Schedule', color: 'text-purple-500' },
//     { icon: FaMapMarkerAlt, label: 'Location', color: 'text-red-500' },
//   ];

//   return (
//     <div className="flex-1 flex flex-col bg-white">
//       {/* Chat Header */}
//       <div className="px-6 py-4 border-b border-gray-200 bg-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             {/* Chat Avatar */}
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
//               chat.type === 'Group' ? 'bg-blue-500' : 'bg-green-500'
//             }`}>
//               {chat.avatar || chat.name.substring(0, 2).toUpperCase()}
//             </div>

//             {/* Chat Info */}
//             <div className="flex-1">
//               <div className="flex items-center space-x-2">
//                 <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
//                 {chat.type === 'Group' && (
//                   <FaUsers className="text-gray-400" size={14} />
//                 )}
//                 {chat.memberCount && chat.memberCount > 2 && (
//                   <span className="text-sm text-gray-500">+{chat.memberCount - 2}</span>
//                 )}
//               </div>
//               <div className="flex items-center space-x-4 mt-1">
//                 <span className="text-sm text-gray-500">
//                   {chat.type === 'Group' ? getChatParticipants() : chat.phone}
//                 </span>
//                 {isConnected && (
//                   <div className="flex items-center space-x-1">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-xs text-gray-500">Online</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
//               <FaPhoneAlt size={16} />
//             </button>
//             <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
//               <FaVideo size={16} />
//             </button>
//             <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
//               <FaUserPlus size={16} />
//             </button>
//             <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
//               <FaSearch size={16} />
//             </button>
//             <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
//               <FaCog size={16} />
//             </button>
//             <div className="relative">
//               <button 
//                 onClick={() => setShowChatMenu(!showChatMenu)}
//                 className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <FaEllipsisV size={16} />
//               </button>
              
//               {/* Chat Menu Dropdown */}
//               {showChatMenu && (
//                 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                   <div className="py-2">
//                     <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
//                       <FaFlag size={12} />
//                       <span>Mark Important</span>
//                     </button>
//                     <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
//                       <FaVolumeUp size={12} />
//                       <span>Notifications</span>
//                     </button>
//                     <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
//                       <FaArchive size={12} />
//                       <span>Archive Chat</span>
//                     </button>
//                     <div className="border-t border-gray-100 my-1"></div>
//                     <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2">
//                       <FaTrash size={12} />
//                       <span>Delete Chat</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//         {/* Date Separators and Messages */}
//         {chat.messages.map((message, index) => {
//           const isOwnMessage = message.sender === 'periskope';
//           const showAvatar = !isOwnMessage && (index === 0 || chat.messages[index - 1].sender !== message.sender);
          
//           // Show date separator if it's a new day
//           const showDateSeparator = index === 0 || (
//             new Date(message.time).toDateString() !== new Date(chat.messages[index - 1].time).toDateString()
//           );
          
//           return (
//             <React.Fragment key={message.id}>
//               {/* Date Separator */}
//               {showDateSeparator && (
//                 <div className="flex items-center justify-center my-4">
//                   <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
//                     {new Date(message.time).toLocaleDateString()}
//                   </div>
//                 </div>
//               )}

//               {/* Message */}
//               <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
//                 <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
//                   {/* Avatar */}
//                   {!isOwnMessage && showAvatar && (
//                     <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
//                       {message.senderName?.charAt(0) || 'U'}
//                     </div>
//                   )}
//                   {!isOwnMessage && !showAvatar && (
//                     <div className="w-8 h-8 flex-shrink-0"></div>
//                   )}

//                   {/* Message Bubble */}
//                   <div className={`px-4 py-2 rounded-lg ${
//                     isOwnMessage 
//                       ? 'bg-green-500 text-white' 
//                       : 'bg-white border border-gray-200 text-gray-800'
//                   }`}>
//                     {!isOwnMessage && showAvatar && chat.type === 'Group' && (
//                       <div className="text-xs text-gray-500 mb-1 font-medium">
//                         {message.senderName}
//                       </div>
//                     )}
//                     <div className="text-sm">{message.text}</div>
//                     <div className={`text-xs mt-1 ${
//                       isOwnMessage ? 'text-green-100' : 'text-gray-500'
//                     }`}>
//                       {formatMessageTime(message.time)}
//                       {isOwnMessage && (
//                         <span className="ml-2">✓✓</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}

//         {/* Scroll to bottom ref */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="border-t border-gray-200 bg-white">
//         {/* Platform Selector */}
//         <div className="px-4 py-2 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <FaWhatsapp className="text-green-500" size={16} />
//                 <span className="text-sm text-gray-600">WhatsApp</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <FaStickyNote className="text-yellow-500" size={14} />
//                 <span className="text-sm text-gray-600">Private Note</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">17975</span>
//               </div>
//             </div>
//             <button className="p-1 text-gray-400 hover:text-gray-600">
//               <FaArrowDown size={14} />
//             </button>
//           </div>
//         </div>

//         {/* Input Row */}
//         <div className="px-4 py-3">
//           <div className="flex items-center space-x-3">
//             {/* Attachment Button */}
//             <div className="relative">
//               <button 
//                 onClick={() => setShowAttachMenu(!showAttachMenu)}
//                 className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
//               >
//                 <FaPaperclip size={16} />
//               </button>
              
//               {/* Attachment Menu */}
//               {showAttachMenu && (
//                 <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                   <div className="py-2">
//                     {attachmentItems.map((item, index) => (
//                       <button
//                         key={index}
//                         className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-3"
//                         onClick={() => setShowAttachMenu(false)}
//                       >
//                         <item.icon className={item.color} size={16} />
//                         <span>{item.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Message Input */}
//             <div className="flex-1 relative">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Message..."
//                 className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>

//             {/* Emoji Button */}
//             <div className="relative">
//               <button 
//                 className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//               >
//                 <FaSmile size={16} />
//               </button>
              
//               {/* Emoji Picker */}
//               {showEmojiPicker && (
//                 <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                   <div className="p-4">
//                     <div className="text-sm font-medium text-gray-700 mb-3">Quick Emojis</div>
//                     <div className="grid grid-cols-5 gap-2">
//                       {commonEmojis.map((emoji, index) => (
//                         <button
//                           key={index}
//                           className="p-2 text-lg hover:bg-gray-100 rounded"
//                           onClick={() => {
//                             setMessageText(messageText + emoji);
//                             setShowEmojiPicker(false);
//                           }}
//                         >
//                           {emoji}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Send/Voice Button */}
//             {messageText.trim() ? (
//               <button 
//                 onClick={handleSendMessage}
//                 className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition-colors"
//               >
//                 <FaPaperPlane size={16} />
//               </button>
//             ) : (
//               <button 
//                 onMouseDown={() => setIsRecording(true)}
//                 onMouseUp={() => setIsRecording(false)}
//                 className={`p-2 rounded-full transition-colors ${
//                   isRecording 
//                     ? 'bg-red-500 text-white' 
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <FaMicrophone size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* User Profile Section */}
//         <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
//                 {currentUser?.full_name?.charAt(0) || 'P'}
//               </div>
//               <span className="text-gray-700 font-medium">{currentUser?.full_name || 'Periskope'}</span>
//               <span className="text-gray-500">{currentUser?.email || ''}</span>
//             </div>
//             <button className="text-gray-400 hover:text-gray-600">
//               <FaGlobe size={14} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
// // import { useState, useRef, useEffect } from 'react';
// // import { Chat, User, Label } from './chatlayout';
// // import { FaTag, FaUserPlus, FaEllipsisV } from 'react-icons/fa';

// // // FIXED: Updated interface to match your ChatLayout props
// // interface ChatWindowProps {
// //   chat: Chat;
// //   onSendMessage: (text: string) => void;
// //   availableLabels: Label[];
// //   onAssignLabel: (labelId: string) => void;
// //   onQuickLabelAssign: (labelName: string) => void;
// //   onManageMembers: (action: 'add' | 'remove', userId: string, role?: 'admin' | 'member') => void;
// //   currentUser: User | null;
// // }

// // const ChatWindow = ({ 
// //   chat, 
// //   onSendMessage,
// //   availableLabels,
// //   onAssignLabel,
// //   onQuickLabelAssign,
// //   onManageMembers,
// //   currentUser
// // }: ChatWindowProps) => {
// //   const [message, setMessage] = useState('');
// //   const [showOptions, setShowOptions] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const optionsRef = useRef<HTMLDivElement>(null);
  
// //   // Scroll to bottom when messages change
// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [chat.messages]);
  
// //   // Close options menu when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
// //         setShowOptions(false);
// //       }
// //     };
    
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);
  
// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };
  
// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (message.trim()) {
// //       onSendMessage(message.trim());
// //       setMessage('');
// //     }
// //   };
  
// //   // Toggle options menu
// //   const toggleOptions = () => {
// //     setShowOptions(!showOptions);
// //   };

// //   // FIXED: Remove duplicate messages and ensure unique keys
// //   const uniqueMessages = chat.messages.filter((message, index, self) => 
// //     self.findIndex(m => m.id === message.id) === index
// //   );

// //   // Sort messages by time to ensure proper order
// //   const sortedMessages = uniqueMessages.sort((a, b) => {
// //     // Handle invalid time values
// //     const timeA = new Date(a.time);
// //     const timeB = new Date(b.time);
    
// //     // Check if dates are valid
// //     if (isNaN(timeA.getTime()) || isNaN(timeB.getTime())) {
// //       return 0; // Keep original order if dates are invalid
// //     }
    
// //     return timeA.getTime() - timeB.getTime();
// //   });

// //   return (
// //     <div className="flex flex-col h-full">
// //       {/* Chat Header */}
// //       <div className="border-b border-gray-200 p-3 flex items-center justify-between">
// //         <div className="flex items-center">
// //           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
// //             {chat.avatar || chat.name.charAt(0).toUpperCase()}
// //           </div>
// //           <div>
// //             <h2 className="font-semibold text-gray-800">{chat.name}</h2>
// //             <div className="text-xs text-gray-500 flex items-center">
// //               {chat.type === 'Group' && (
// //                 <span>{chat.memberCount || 0} members</span>
// //               )}
// //               {chat.type === 'Direct' && (
// //                 <span>Direct Message</span>
// //               )}
// //               {/* Show labels */}
// //               {chat.label && (
// //                 <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
// //                   {chat.label}
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="relative">
// //           <button 
// //             onClick={toggleOptions}
// //             className="p-2 rounded-full hover:bg-gray-100 transition-colors"
// //           >
// //             <FaEllipsisV className="text-gray-600" />
// //           </button>
          
// //           {showOptions && (
// //             <div 
// //               ref={optionsRef}
// //               className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
// //             >
// //               <div className="py-1" role="menu">
// //                 {/* Quick Label Assignment */}
// //                 <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
// //                   Quick Labels
// //                 </div>
// //                 {availableLabels.slice(0, 3).map(label => (
// //                   <button
// //                     key={label.id}
// //                     onClick={() => {
// //                       onQuickLabelAssign(label.name);
// //                       setShowOptions(false);
// //                     }}
// //                     className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
// //                   >
// //                     <div 
// //                       className="w-3 h-3 rounded-full mr-2"
// //                       style={{ backgroundColor: getLabelColorValue(label.color) }}
// //                     ></div>
// //                     {label.name}
// //                   </button>
// //                 ))}
                
// //                 <div className="border-t border-gray-100 my-1"></div>
                
// //                 {chat.type === 'Group' && (
// //                   <button
// //                     onClick={() => {
// //                       // You can implement member management modal here
// //                       setShowOptions(false);
// //                     }}
// //                     className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
// //                   >
// //                     <FaUserPlus className="mr-2" />
// //                     Manage Members
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
      
// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
// //         {sortedMessages.length === 0 ? (
// //           <div className="flex items-center justify-center h-full text-gray-500">
// //             <div className="text-center">
// //               <div className="text-4xl mb-2">💬</div>
// //               <p>No messages yet</p>
// //               <p className="text-sm">Start the conversation!</p>
// //             </div>
// //           </div>
// //         ) : (
// //           sortedMessages.map((msg, index) => (
// //             <div 
// //               key={`${msg.id}-${index}`} // FIXED: Unique key using ID and index
// //               className={`flex ${msg.sender === 'periskope' ? 'justify-end' : 'justify-start'}`}
// //             >
// //               <div 
// //                 className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
// //                   msg.sender === 'periskope'
// //                     ? 'bg-blue-500 text-white rounded-br-none'
// //                     : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
// //                 }`}
// //               >
// //                 {/* Show sender name for messages from others in group chats */}
// //                 {msg.sender !== 'periskope' && chat.type === 'Group' && (
// //                   <div className="text-xs text-gray-500 mb-1 font-medium">
// //                     {msg.senderName || 'Unknown'}
// //                   </div>
// //                 )}
                
// //                 <p className="text-sm leading-relaxed">{msg.text}</p>
                
// //                 <div 
// //                   className={`text-xs mt-1 ${
// //                     msg.sender === 'periskope' ? 'text-blue-100' : 'text-gray-400'
// //                   }`}
// //                 >
// //                   {msg.time}
// //                   {msg.sender === 'periskope' && (
// //                     <span className="ml-1">✓</span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //         <div ref={messagesEndRef} />
// //       </div>
      
// //       {/* Message Input */}
// //       <div className="border-t border-gray-200 p-3 bg-white">
// //         <form onSubmit={handleSubmit} className="flex gap-2">
// //           <input
// //             type="text"
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             placeholder={`Message ${chat.name}...`}
// //             className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             maxLength={1000}
// //           />
// //           <button
// //             type="submit"
// //             disabled={!message.trim()}
// //             className={`px-6 py-3 rounded-lg font-medium transition-colors ${
// //               message.trim()
// //                 ? 'bg-blue-500 text-white hover:bg-blue-600'
// //                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //             }`}
// //           >
// //             Send
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // // Helper function to convert color names to actual color values
// // const getLabelColorValue = (colorName: string): string => {
// //   const colorMap: { [key: string]: string } = {
// //     red: '#ef4444',
// //     blue: '#3b82f6',
// //     green: '#10b981',
// //     purple: '#8b5cf6',
// //     yellow: '#f59e0b',
// //     orange: '#f97316',
// //     pink: '#ec4899',
// //     indigo: '#6366f1',
// //     gray: '#6b7280',
// //     teal: '#14b8a6',
// //     cyan: '#06b6d4'
// //   };
  
// //   return colorMap[colorName] || colorMap.gray;
// // };

// // export default ChatWindow;

// ChatWindow.tsx - Enhanced implementation with fixed layout
import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPhoneAlt, 
  FaVideo, 
  FaUserPlus, 
  FaEllipsisV, 
  FaSearch,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
  FaArrowDown,
  FaWhatsapp,
  FaStickyNote,
  FaGlobe,
  FaPaperPlane,
  FaCog,
  FaArchive,
  FaTrash,
  FaFlag,
  FaVolumeUp,
  FaVolumeMute,
  FaStar,
  FaImage,
  FaFile,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers
} from 'react-icons/fa';
import { Chat, Message, User } from './chatlayout';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (message: string) => void;
  currentUser: User | null;
  isConnected?: boolean;
}

const ChatWindow = ({ chat, onSendMessage, currentUser, isConnected }: ChatWindowProps) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format time for messages
  const formatMessageTime = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
  };

  // Get chat participants info
  const getChatParticipants = () => {
    if (chat.type === 'Group') {
      const participantsList = [
        'Roshnag Airtel', 'Roshnag Jio', 'Bharat Kumar Ramesh', 'Periskope'
      ].slice(0, chat.memberCount || 4);
      return participantsList.join(', ');
    }
    return chat.phone || 'Direct Message';
  };

  // Emoji picker data
  const commonEmojis = ['😀', '😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉'];

  // Attachment menu items
  const attachmentItems = [
    { icon: FaImage, label: 'Photo', color: 'text-blue-500' },
    { icon: FaFile, label: 'Document', color: 'text-green-500' },
    { icon: FaCalendarAlt, label: 'Schedule', color: 'text-purple-500' },
    { icon: FaMapMarkerAlt, label: 'Location', color: 'text-red-500' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Chat Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
              chat.type === 'Group' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {chat.avatar || chat.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Chat Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
                {chat.type === 'Group' && (
                  <FaUsers className="text-gray-400" size={14} />
                )}
                {chat.memberCount && chat.memberCount > 2 && (
                  <span className="text-sm text-gray-500">+{chat.memberCount - 2}</span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">
                  {chat.type === 'Group' ? getChatParticipants() : chat.phone}
                </span>
                {isConnected && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FaPhoneAlt size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FaVideo size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FaUserPlus size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FaSearch size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <FaCog size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowChatMenu(!showChatMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaEllipsisV size={16} />
              </button>
              
              {/* Chat Menu Dropdown */}
              {showChatMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <FaFlag size={12} />
                      <span>Mark Important</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <FaVolumeUp size={12} />
                      <span>Notifications</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <FaArchive size={12} />
                      <span>Archive Chat</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2">
                      <FaTrash size={12} />
                      <span>Delete Chat</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages - Takes remaining space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ minHeight: 0 }}>
        {/* Date Separators and Messages */}
        {chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((message, index) => {
            const isOwnMessage = message.sender === 'periskope';
            const showAvatar = !isOwnMessage && (index === 0 || chat.messages[index - 1].sender !== message.sender);
            
            // Show date separator if it's a new day
            const showDateSeparator = index === 0 || (
              new Date(message.time).toDateString() !== new Date(chat.messages[index - 1].time).toDateString()
            );
            
            return (
              <React.Fragment key={message.id}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {new Date(message.time).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    {!isOwnMessage && showAvatar && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {message.senderName?.charAt(0) || 'U'}
                      </div>
                    )}
                    {!isOwnMessage && !showAvatar && (
                      <div className="w-8 h-8 flex-shrink-0"></div>
                    )}

                    {/* Message Bubble */}
                    <div className={`px-4 py-2 rounded-lg ${
                      isOwnMessage 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      {!isOwnMessage && showAvatar && chat.type === 'Group' && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">
                          {message.senderName}
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.time)}
                        {isOwnMessage && (
                          <span className="ml-2">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-center">
              <div className="text-2xl mb-2">💬</div>
              <div>Start a conversation</div>
            </div>
          </div>
        )}

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white flex-shrink-0">
        {/* Platform Selector */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaWhatsapp className="text-green-500" size={16} />
                <span className="text-sm text-gray-600">WhatsApp</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStickyNote className="text-yellow-500" size={14} />
                <span className="text-sm text-gray-600">Private Note</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">17975</span>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaArrowDown size={14} />
            </button>
          </div>
        </div>

        {/* Input Row */}
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* Attachment Button */}
            <div className="relative">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <FaPaperclip size={16} />
              </button>
              
              {/* Attachment Menu */}
              {showAttachMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {attachmentItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-3"
                        onClick={() => setShowAttachMenu(false)}
                      >
                        <item.icon className={item.color} size={16} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Emoji Button */}
            <div className="relative">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile size={16} />
              </button>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">Quick Emojis</div>
                    <div className="grid grid-cols-5 gap-2">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="p-2 text-lg hover:bg-gray-100 rounded"
                          onClick={() => {
                            setMessageText(messageText + emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Send/Voice Button */}
            {messageText.trim() ? (
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition-colors"
              >
                <FaPaperPlane size={16} />
              </button>
            ) : (
              <button 
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaMicrophone size={16} />
              </button>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {currentUser?.full_name?.charAt(0) || 'P'}
              </div>
              <span className="text-gray-700 font-medium">{currentUser?.full_name || 'Periskope'}</span>
              <span className="text-gray-500">{currentUser?.email || ''}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FaGlobe size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;