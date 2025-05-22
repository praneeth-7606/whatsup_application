import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaSync, 
  FaPlus,
  FaSignOutAlt,
  FaCommentDots
} from 'react-icons/fa';

interface ChatHeaderProps {
  onNewChat: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
  filterCount?: number;
}

const ChatHeader = ({ 
  onNewChat, 
  onRefresh, 
  onLogout,
  isRefreshing = false,
  filterCount = 0
}: ChatHeaderProps) => {
  return (
    <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <FaCommentDots className="text-gray-600" size={16} />
          <span className="text-lg font-medium text-gray-800">chats</span>
          <button 
            className={`p-1 text-gray-400 hover:text-gray-600 rounded ${isRefreshing ? 'animate-spin text-green-500' : ''}`}
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh chats"
          >
            <FaSync size={12} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onNewChat}
            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full"
            title="New chat"
          >
            <FaPlus size={14} />
          </button>
          <button 
            onClick={onLogout}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
            title="Logout"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>
      </div>

      {/* Search Bar with Refresh */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          style={{color: '#374151', backgroundColor: '#ffffff'}}
        />
        <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
        <button 
          onClick={onRefresh}
          className={`absolute right-3 top-2.5 ${isRefreshing ? 'animate-spin text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          disabled={isRefreshing}
        >
          <FaSync size={14} />
        </button>
      </div>

      {/* Filter Tags + New Chat Button */}
      <div className="flex items-center space-x-2">
        {filterCount > 0 && (
          <button className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
            <span>Filtered</span>
            <span className="bg-green-200 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
              {filterCount}
            </span>
          </button>
        )}
        
        <button 
          onClick={onNewChat}
          className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
        >
          <FaPlus size={10} />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;