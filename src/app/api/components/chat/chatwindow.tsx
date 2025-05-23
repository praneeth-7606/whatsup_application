

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
  FaPaperPlane,
  FaSignOutAlt,
  FaSpinner,
  FaUser
} from 'react-icons/fa';
import { Chat, Message, User } from './chatlayout';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (message: string) => void;
  currentUser: User | null;
  isConnected?: boolean;
  onLogout: () => void;  // Add this line
}

const ChatWindow = ({ chat, onSendMessage, currentUser, isConnected, onLogout }: ChatWindowProps) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    if (!chat.messages || chat.messages.length === 0) {
      return groups;
    }
    
    chat.messages.forEach(message => {
      // Extract date part only for grouping
      let dateKey;
      
      if (message.time.includes(',')) {
        // Format: "28-Feb-25, 10:15 AM" or "Yesterday, 04:30 PM"
        dateKey = message.time.split(',')[0];
      } else if (message.time.includes('-')) {
        // Format: "22-01-2025"
        dateKey = message.time;
      } else {
        // Other formats
        dateKey = message.time;
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  // Emoji picker data
  const commonEmojis = ['😀', '😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉'];

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100">
      {/* Chat Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-[#f0f2f5] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Chat Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
              chat.type === 'Group' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {chat.avatar || chat.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Chat Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-gray-900">{chat.name}</h2>
              </div>
              <div className="flex items-center space-x-3 mt-0.5">
                <span className="text-xs text-gray-500">
                  {chat.phone || (chat.type === 'Group' ? `${chat.memberCount} members` : 'Direct Message')}
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
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
              <FaSearch size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
              <FaPhoneAlt size={16} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
              <FaVideo size={16} />
            </button>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? <FaSpinner className="animate-spin" size={16} /> : <FaSignOutAlt size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Takes remaining space */}
      <div 
        className="flex-1 overflow-y-auto py-4 bg-[#e5ded8] bg-opacity-30"
        style={{ 
          backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png')",
          backgroundRepeat: 'repeat',
          minHeight: 0 
        }}
      >
        {/* Date Separators and Messages */}
        {Object.entries(messageGroups).length > 0 ? (
          Object.entries(messageGroups).map(([dateKey, messages]) => (
            <div key={dateKey} className="mb-4">
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white bg-opacity-90 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                  {dateKey}
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-1 px-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.sender === 'periskope';
                  const showSender = !isOwnMessage && (
                    index === 0 || 
                    messages[index - 1].sender !== message.sender
                  );
                  
                  // Extract time part from message.time
                  let timeDisplay;
                  if (message.time.includes(',')) {
                    // Format: "28-Feb-25, 10:15 AM" or "Yesterday, 04:30 PM"
                    timeDisplay = message.time.split(',')[1].trim();
                  } else if (message.time.includes(':')) {
                    // Format: "10:15" or "10:15:00"
                    timeDisplay = message.time.split(':').slice(0, 2).join(':');
                  } else {
                    // Other formats
                    timeDisplay = message.time;
                  }
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      <div 
                        className={`max-w-xs lg:max-w-md rounded-lg px-3 py-2 ${
                          isOwnMessage 
                            ? 'bg-[#d9fdd3] text-gray-800' 
                            : 'bg-white text-gray-800'
                        }`}
                        style={{color: '#1f2937'}}
                      >
                        {showSender && chat.type === 'Group' && (
                          <div className="text-xs font-medium mb-1" style={{color: '#1e88e5'}}>
                            {message.senderName}
                          </div>
                        )}
                        
                        <div className="text-sm whitespace-pre-wrap">
                          {message.text}
                        </div>
                        
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs text-gray-500">{timeDisplay}</span>
                          {isOwnMessage && (
                            <span className="text-xs text-blue-500">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-gray-500 text-center bg-white bg-opacity-80 p-6 rounded-lg shadow-sm">
              <div className="text-5xl mb-4">💬</div>
              <div className="text-lg font-medium mb-2">Start a conversation</div>
              <div className="text-sm text-gray-400">Send a message to begin chatting</div>
            </div>
          </div>
        )}

        {/* Scroll to bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-[#f0f2f5] flex-shrink-0">
        {/* Input Row */}
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* Attachment Button */}
            <div className="relative">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
              >
                <FaPaperclip size={18} />
              </button>
            </div>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                style={{color: '#1f2937', backgroundColor: '#ffffff'}}
              />
            </div>

            {/* Emoji Button */}
            <div className="relative">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile size={18} />
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
                            inputRef.current?.focus();
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
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FaMicrophone size={18} />
              </button>
            )}
          </div>
        </div>

        {/* User Info and Logout Section */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Current User Display */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                {currentUser?.avatar_url ? (
                  <img 
                    src={currentUser.avatar_url} 
                    alt={currentUser.full_name} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-xs" />
                )}
                              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.full_name || 'Unknown User'}
                </span>
                {currentUser?.email && (
                  <span className="text-xs text-gray-500">{currentUser.email}</span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Logout"
            >
              {isLoggingOut ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaSignOutAlt className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;