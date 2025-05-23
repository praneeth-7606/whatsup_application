import React, { useState, useRef, useEffect } from 'react';
import { useMemo } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaSync, 
  FaQuestionCircle, 
  FaPhoneAlt,
  FaBell,
  FaList,
  FaEllipsisV,
  FaCheckDouble,
  FaCommentDots,
  FaTimes,
  FaCheck,
  FaUsers,
  FaUser,
  FaExclamationCircle,
  FaTag,
  FaCog,
  FaArchive,
  FaTrash,
  FaFlag,
  FaVolumeUp,
  FaVolumeMute,
  FaEdit,
  FaUserPlus,
  FaUserMinus,
  FaTags
} from 'react-icons/fa';

// Import the NewChatButton component
import NewChatButton from './newchatbutton';
// import NewChatButton from './NewChatButton'; // Adjust the path according to your file structure

// Types
interface ChatMember {
  id: string;
  name: string;
  role?: 'admin' | 'member';
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar: string | null;
  type: 'Direct' | 'Group';
  unread: number;
  status?: 'Demo' | 'Content' | 'Signup' | 'Internal';
  phone?: string;
  memberCount?: number;
  members?: ChatMember[];
  label?: string;
  secondaryLabel?: string;
}



interface Label {
  id: string;
  name: string;
  color: string;
}

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onChatClick: (chatId: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  currentUserId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableLabels: Label[];
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
  isLoading: boolean;
  onAssignLabel?: (chatId: string, labelName: string) => void;
  onAddMember?: (chatId: string, userId: string) => void;
  onRemoveMember?: (chatId: string, userId: string) => void;
  onCreateLabel?: (name: string, color: string) => void;
  onRefreshChats?: () => void;
  onNewChatClick?: () => void;
  onManageLabelsClick?: () => void;
  onQuickLabelAssign?: (chatId: string, labelName: string) => void; // Add this missing prop
}
const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  activeChat, 
  onChatClick, 
  filterValue, 
  onFilterChange,
  currentUserId = 'current_user',
  searchQuery,
  onSearchChange,
  availableLabels,
  selectedLabel,
  onSelectLabel,
  isLoading,
  onAssignLabel,
  onAddMember,
  onRemoveMember,
  onCreateLabel,
  onRefreshChats,
  onNewChatClick,
  onManageLabelsClick,
  onQuickLabelAssign // Add this parameter
}) => {
  // State management
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState<string | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState<string | null>(null);
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sample users for member assignment
  const availableUsers = [
    { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
    { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW' },
    { id: 'user5', name: 'David Brown', email: 'david@example.com', avatar: 'DB' },
  ];

  // Predefined label colors
  const labelColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  // Get status badge color and style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Demo': 
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Content': 
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Signup': 
        return 'bg-red-100 text-red-600 border-red-200';
      case 'Internal': 
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default: 
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Get chat avatar with proper sizing and colors
  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar && chat.avatar.length <= 3) {
      return chat.avatar;
    }
    // Handle phone numbers
    if (chat.name.startsWith('+')) {
      return chat.name.substring(0, 2);
    }
    return chat.name.substring(0, 2).toUpperCase();
  };

  // Get avatar background color based on chat name
  const getAvatarColor = (chatName: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = chatName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Handle label assignment
  const handleLabelAssign = (chatId: string, labelName: string) => {
    if (onAssignLabel) {
      onAssignLabel(chatId, labelName);
    }
    setShowLabelDropdown(null);
  };

  // Handle member addition
  const handleMemberAdd = (chatId: string, userId: string) => {
    if (onAddMember) {
      onAddMember(chatId, userId);
    }
    setShowMemberDropdown(null);
  };

  // Handle member removal
  const handleMemberRemove = (chatId: string, userId: string) => {
    if (onRemoveMember) {
      onRemoveMember(chatId, userId);
    }
    setShowMemberDropdown(null);
  };

  // Handle chat creation callback
  const handleChatCreated = () => {
    if (onRefreshChats) {
      onRefreshChats();
    }
  };

  // Advanced filtering logic
  const filteredChats = useMemo((): Chat[] => {
  return chats.filter(chat => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.phone && chat.phone.includes(searchQuery));
      
    // Type filter
    const matchesFilter = filterValue === '' || 
      chat.type.toLowerCase() === filterValue.toLowerCase() ||
      (filterValue === 'Unread' && chat.unread > 0);
      
    // Label filter
    const matchesLabel = selectedLabel === null || 
      chat.status === selectedLabel ||
      chat.label === selectedLabel ||
      chat.secondaryLabel === selectedLabel;
      
    return matchesSearch && matchesFilter && matchesLabel;
  });
}, [chats, searchQuery, filterValue, selectedLabel]);

  // Calculate filter count
  const filterCount = filteredChats.length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowLabelDropdown(null);
        setShowMemberDropdown(null);
        setShowChatMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white h-screen">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <FaCommentDots className="text-gray-600" size={16} />
            <span className="text-lg font-medium text-gray-800">chats</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <div className="text-gray-500 text-sm">Loading chats...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white h-screen">
      {/* Fixed Header with All Icons */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <FaCommentDots className="text-gray-600" size={16} />
            <span className="text-lg font-medium text-gray-800">chats</span>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <FaSync size={12} />
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Refresh"
            >
              <FaSync size={14} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Help"
            >
              <FaQuestionCircle size={14} />
            </button>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <FaPhoneAlt size={12} />
              <span>5/6</span>
            </div>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Notifications"
            >
              <FaBell size={14} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Settings"
            >
              <FaCog size={14} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Menu"
            >
              <FaList size={14} />
            </button>
          </div>
        </div>

        {/* ADD NEW CHAT BUTTON HERE - Right after the header section */}
        <div className="mb-3">
          <NewChatButton 
            currentUserId={currentUserId} 
            onChatCreated={handleChatCreated}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowCustomFilter(!showCustomFilter)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm border transition-colors ${
                showCustomFilter 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaFilter size={12} />
              <span>Filter</span>
            </button>
            
            {/* Advanced Filter Dropdown */}
            {showCustomFilter && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Filter Chats</div>
                  
                  {/* Type Filter */}
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Chat Type</label>
                    <div className="space-y-1">
                      {['All', 'Direct', 'Group', 'Unread'].map(type => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="chatType"
                            value={type === 'All' ? '' : type}
                            checked={filterValue === (type === 'All' ? '' : type)}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Label Filter */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">Labels</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="chatLabel"
                          value=""
                          checked={selectedLabel === null}
                          onChange={() => onSelectLabel(null)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm">All Labels</span>
                      </label>
                      {availableLabels.map(label => (
                        <label key={label.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="chatLabel"
                            value={label.name}
                            checked={selectedLabel === label.name}
                            onChange={() => onSelectLabel(label.name)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: label.color }}
                            ></div>
                            <span className="text-sm">{label.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50">
            Save
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Filter Tags */}
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200"
            onClick={() => setShowCustomFilter(!showCustomFilter)}
          >
            <span>Filtered</span>
            <span className="bg-green-200 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
              {filterCount}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Chat List */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="space-y-0">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`relative flex items-start p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group ${
                chat.id === activeChat ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => onChatClick(chat.id)}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0 mr-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(chat.name)}`}>
                  {getChatAvatar(chat)}
                </div>
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {chat.unread > 9 ? '9+' : chat.unread}
                  </div>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 className={`text-sm font-medium text-gray-900 truncate ${
                      chat.unread > 0 ? 'font-semibold' : ''
                    }`}>
                      {chat.name}
                    </h3>
                    
                    {/* Status Badge */}
                    {chat.status && (
                      <span className={`px-2 py-0.5 text-xs rounded border font-medium ${getStatusStyle(chat.status)}`}>
                        {chat.status}
                      </span>
                    )}

                    {/* Read Status */}
                    {chat.unread === 0 && (
                      <FaCheckDouble className="text-blue-500 flex-shrink-0" size={10} />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                </div>

                {/* Message Preview */}
                <p className={`text-sm text-gray-600 truncate mb-2 ${
                  chat.unread > 0 ? 'font-medium text-gray-800' : ''
                }`}>
                  {chat.lastMessage}
                </p>

                {/* Footer Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Phone Number */}
                    {chat.phone && (
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <FaPhoneAlt size={10} />
                        <span>{chat.phone}</span>
                      </span>
                    )}
                    
                    {/* Member Count for Groups */}
                    {chat.type === 'Group' && chat.memberCount && chat.memberCount > 2 && (
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <FaUsers size={10} />
                        <span>+{chat.memberCount - 1}</span>
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Add Label Button */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLabelDropdown(showLabelDropdown === chat.id ? null : chat.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Add Label"
                      >
                        <FaTag size={10} />
                      </button>
                      
                      {/* Label Dropdown */}
                      {showLabelDropdown === chat.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-medium text-gray-700">Labels</div>
                            </div>
                            <div className="max-h-32 overflow-y-auto">
                              {availableLabels.map(label => (
                                <button
                                  key={label.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLabelAssign(chat.id, label.name);
                                  }}
                                  className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center space-x-2"
                                >
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                  ></div>
                                  <span>{label.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Menu Button */}
                    <div className="relative dropdown-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChatMenu(showChatMenu === chat.id ? null : chat.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="More options"
                      >
                        <FaEllipsisV size={10} />
                      </button>
                      
                      {/* Chat Menu Dropdown */}
                      {showChatMenu === chat.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                          <div className="py-1">
                            <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center space-x-2">
                              <FaFlag size={10} />
                              <span>Pin Chat</span>
                            </button>
                            <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center space-x-2">
                              <FaVolumeMute size={10} />
                              <span>Mute</span>
                            </button>
                            <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center space-x-2">
                              <FaArchive size={10} />
                              <span>Archive</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center space-x-2">
                              <FaTrash size={10} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 p-4">
            <div className="text-center">
              <FaExclamationCircle className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm font-medium">No chats found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'No conversations available'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default ChatList;
