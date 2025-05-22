import { useState } from 'react';
import { FaEllipsisV, FaUserPlus, FaTag, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { supabase } from './supabaseclient';
import type { Chat } from './chatlayout';

interface ChatHeaderProps {
  chat: Chat;
  currentUserName: string;
  currentUserEmail: string;
  onLogout?: () => void;
  onAddMember?: (chatId: string) => void;
  onAddLabel?: (chatId: string) => void;
}

const ChatHeader = ({ 
  chat, 
  currentUserName, 
  currentUserEmail,
  onLogout, 
  onAddMember, 
  onAddLabel 
}: ChatHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Chat info */}
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold mr-3">
          {typeof chat.avatar === 'string' && chat.avatar.length === 1 
            ? chat.avatar 
            : chat.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{chat.name}</h2>
          <div className="flex items-center text-xs text-gray-500">
            {chat.label && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-1">
                {chat.label}
              </span>
            )}
            {chat.secondaryLabel && (
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                {chat.secondaryLabel}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Current user info & menu */}
      <div className="flex items-center relative">
        {/* Current user info */}
        <div className="hidden md:flex items-center mr-4 text-sm text-gray-600">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
            {currentUserName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{currentUserName}</span>
            <span className="text-xs text-gray-500">{currentUserEmail}</span>
          </div>
        </div>
        
        {/* Menu button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative"
        >
          <FaEllipsisV />
          
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                <li>
                  <button 
                    onClick={() => {
                      if (onAddMember) onAddMember(chat.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaUserPlus className="mr-2 text-gray-500" />
                    Add Members
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (onAddLabel) onAddLabel(chat.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaTag className="mr-2 text-gray-500" />
                    Manage Labels
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;