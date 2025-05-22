


// import { FiStar, FiBell, FiPhone, FiSearch } from 'react-icons/fi';
// import { BsThreeDotsVertical, BsChatLeftText } from 'react-icons/bs';
// import { SiWhatsapp } from 'react-icons/si';
// import { Chat,Message } from './chatlayout';
// // import { Chat, Message } from './ChatLayout';
// import MessageInput from './messageinput';
// // import MessageInput from './MessageInput';

// interface ChatWindowProps {
//   chat: Chat;
//   onSendMessage: (chatId: string, text: string) => void;
// }

// // Component for the avatar
// const Avatar = ({ letter, className }: { letter: string | null, className?: string }) => {
//   const avatarColors: { [key: string]: string } = {
//     R: 'bg-green-500'
//   };
  
//   if (!letter) {
//     return (
//       <div className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white ${className}`}>
//         <span className="text-sm">U</span>
//       </div>
//     );
//   }
  
//   return (
//     <div className={`w-8 h-8 rounded-full ${avatarColors[letter] || 'bg-blue-500'} flex items-center justify-center text-white ${className}`}>
//       <span className="text-sm">{letter}</span>
//     </div>
//   );
// };

// // Component for a message bubble
// const MessageBubble = ({ message }: { message: Message }) => {
//   const isPeriskope = message.sender === 'periskope';
//   const isWhatsApp = message.sender === 'whatsapp';
//   const isNote = message.sender === 'note';
  
//   if (isWhatsApp) {
//     return (
//       <div className="flex mb-4">
//         <div className="flex items-center">
//           <div className="bg-green-100 text-green-800 p-2 rounded-lg max-w-xs">
//             <div className="flex items-center">
//               <SiWhatsapp className="text-green-500 mr-2" />
//               <span>{message.text}</span>
//             </div>
//             <div className="text-xs text-right text-gray-500 mt-1">{message.time}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   if (isNote) {
//     return (
//       <div className="flex mb-4">
//         <div className="flex items-center">
//           <div className="bg-yellow-100 text-yellow-800 p-2 rounded-lg max-w-xs">
//             <div className="flex items-center">
//               <BsChatLeftText className="text-yellow-500 mr-2" />
//               <span>{message.text}</span>
//             </div>
//             <div className="text-xs text-right text-gray-500 mt-1">{message.time}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className={`flex mb-4 ${isPeriskope ? 'justify-end' : ''}`}>
//       {!isPeriskope && message.senderName && (
//         <Avatar letter={message.senderName[0]} className="mr-2 self-end mb-1" />
//       )}
      
//       <div className={`p-2 rounded-lg max-w-xs ${
//         isPeriskope ? 'bg-green-100 text-green-800' : 'bg-white border border-gray-200'
//       }`}>
//         {message.senderName && !isPeriskope && (
//           <div className="font-semibold text-xs mb-1">{message.senderName}</div>
//         )}
        
//         {isPeriskope && (
//           <div className="font-semibold text-xs mb-1">Periskope</div>
//         )}
        
//         <p className="text-sm">{message.text}</p>
        
//         <div className="flex justify-between items-center mt-1">
//           <div className="flex items-center">
//             {message.email && (
//               <span className="text-xs text-gray-500 mr-2">{message.email}</span>
//             )}
//           </div>
//           <span className="text-xs text-gray-500">{message.time}</span>
//         </div>
        
//         {isPeriskope && message.phone && (
//           <div className="text-xs text-gray-500 text-right">{message.phone}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// const ChatWindow = ({ chat, onSendMessage }: ChatWindowProps) => {
//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat header */}
//       <div className="flex items-center justify-between p-3 border-b">
//         <div className="flex items-center">
//           <div className="text-lg font-semibold">{chat.name}</div>
//           <div className="text-xs text-gray-500 ml-2">
//             {chat.type === 'Demo' && 
//               <span className="bg-gray-100 rounded px-1 py-0.5">Demo</span>
//             }
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <FiStar className="text-gray-400" />
//           <FiBell className="text-gray-400" />
//           <FiPhone className="text-gray-400" />
//           <FiSearch className="text-gray-400" />
//           <BsThreeDotsVertical className="text-gray-400" />
//         </div>
//       </div>
      
//       {/* Chat messages */}
//       <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//         {chat.messages.map((message) => (
//           <MessageBubble key={message.id} message={message} />
//         ))}
//       </div>
      
//       {/* Message input */}
//       <MessageInput onSendMessage={(text) => onSendMessage(chat.id, text)} />
//     </div>
//   );
// };

// export default ChatWindow;
// Updated ChatWindow Component with Label Management and Member Management
import { useState, useRef, useEffect } from 'react';
import { Chat, User, Label } from './chatlayout';
import { FaTag, FaUserPlus, FaEllipsisV } from 'react-icons/fa';

// FIXED: Updated interface to match your ChatLayout props
interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  availableLabels: Label[];
  onAssignLabel: (labelId: string) => void;
  onQuickLabelAssign: (labelName: string) => void;
  onManageMembers: (action: 'add' | 'remove', userId: string, role?: 'admin' | 'member') => void;
  currentUser: User | null;
}

const ChatWindow = ({ 
  chat, 
  onSendMessage,
  availableLabels,
  onAssignLabel,
  onQuickLabelAssign,
  onManageMembers,
  currentUser
}: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);
  
  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  // Toggle options menu
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // FIXED: Remove duplicate messages and ensure unique keys
  const uniqueMessages = chat.messages.filter((message, index, self) => 
    self.findIndex(m => m.id === message.id) === index
  );

  // Sort messages by time to ensure proper order
  const sortedMessages = uniqueMessages.sort((a, b) => {
    // Handle invalid time values
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    
    // Check if dates are valid
    if (isNaN(timeA.getTime()) || isNaN(timeB.getTime())) {
      return 0; // Keep original order if dates are invalid
    }
    
    return timeA.getTime() - timeB.getTime();
  });

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
            {chat.avatar || chat.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{chat.name}</h2>
            <div className="text-xs text-gray-500 flex items-center">
              {chat.type === 'Group' && (
                <span>{chat.memberCount || 0} members</span>
              )}
              {chat.type === 'Direct' && (
                <span>Direct Message</span>
              )}
              {/* Show labels */}
              {chat.label && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {chat.label}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleOptions}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaEllipsisV className="text-gray-600" />
          </button>
          
          {showOptions && (
            <div 
              ref={optionsRef}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div className="py-1" role="menu">
                {/* Quick Label Assignment */}
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  Quick Labels
                </div>
                {availableLabels.slice(0, 3).map(label => (
                  <button
                    key={label.id}
                    onClick={() => {
                      onQuickLabelAssign(label.name);
                      setShowOptions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getLabelColorValue(label.color) }}
                    ></div>
                    {label.name}
                  </button>
                ))}
                
                <div className="border-t border-gray-100 my-1"></div>
                
                {chat.type === 'Group' && (
                  <button
                    onClick={() => {
                      // You can implement member management modal here
                      setShowOptions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaUserPlus className="mr-2" />
                    Manage Members
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {sortedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          sortedMessages.map((msg, index) => (
            <div 
              key={`${msg.id}-${index}`} // FIXED: Unique key using ID and index
              className={`flex ${msg.sender === 'periskope' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  msg.sender === 'periskope'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Show sender name for messages from others in group chats */}
                {msg.sender !== 'periskope' && chat.type === 'Group' && (
                  <div className="text-xs text-gray-500 mb-1 font-medium">
                    {msg.senderName || 'Unknown'}
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{msg.text}</p>
                
                <div 
                  className={`text-xs mt-1 ${
                    msg.sender === 'periskope' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                  {msg.sender === 'periskope' && (
                    <span className="ml-1">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${chat.name}...`}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              message.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper function to convert color names to actual color values
const getLabelColorValue = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    yellow: '#f59e0b',
    orange: '#f97316',
    pink: '#ec4899',
    indigo: '#6366f1',
    gray: '#6b7280',
    teal: '#14b8a6',
    cyan: '#06b6d4'
  };
  
  return colorMap[colorName] || colorMap.gray;
};

export default ChatWindow;