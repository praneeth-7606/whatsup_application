import { useState } from 'react';
import { Chat, Label } from './chatlayout';
import { FaSearch, FaPlus, FaFilter, FaTimes, FaTag, FaUsers, FaUser } from 'react-icons/fa';

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onChatClick: (chatId: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  currentUserId?: string;
  onChatCreated?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableLabels: Label[];
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
  isLoading: boolean;
  onNewChatClick: () => void;
}

const ChatList = ({ 
  chats, 
  activeChat, 
  onChatClick, 
  filterValue, 
  onFilterChange,
  currentUserId,
  onChatCreated,
  searchQuery,
  onSearchChange,
  availableLabels = [],
  selectedLabel,
  onSelectLabel,
  isLoading,
  onNewChatClick
}: ChatListProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'name' | 'unread'>('time');

  // Toggle filter dropdown
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setShowLabels(false);
  };

  // Toggle labels dropdown
  const toggleLabels = () => {
    setShowLabels(!showLabels);
    setShowFilters(false);
  };

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowFilters(false);
    setShowLabels(false);
  };

  // Handle filter selection
  const handleFilterSelect = (value: string) => {
    onFilterChange(value);
    setShowFilters(false);
  };

  // Handle label selection
  const handleLabelSelect = (label: string | null) => {
    onSelectLabel(label);
    setShowLabels(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange('');
    onSelectLabel(null);
    onSearchChange('');
  };

  // Sort chats based on selected criteria
  const sortedChats = [...chats].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'unread':
        return b.unread - a.unread;
      case 'time':
      default:
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    }
  });

  // Get filter counts for display
  const filterCounts = {
    all: chats.length,
    direct: chats.filter(chat => chat.type === 'Direct').length,
    group: chats.filter(chat => chat.type === 'Group').length,
    unread: chats.filter(chat => chat.unread > 0).length
  };

  if (isLoading) {
    return (
      <div className="w-72 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Chats</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div>Loading chats...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-200 flex flex-col" onClick={closeDropdowns}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Chats ({chats.length})</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNewChatClick();
            }}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Start new chat"
          >
            <FaPlus size={14} />
          </button>
        </div>
        
        {/* Search Box */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-8 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => {
              e.stopPropagation();
              onSearchChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <FaSearch className="absolute left-2.5 top-3.5 text-gray-400" size={12} />
          {searchQuery && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSearchChange('');
              }}
              className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
        
        {/* Filter Controls */}
        <div className="flex space-x-2 mb-2">
          {/* Filter by Type */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFilters();
              }}
              className={`p-2 rounded-md flex items-center text-xs transition-colors ${
                filterValue ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="mr-1" size={10} />
              {filterValue || 'Type'}
              {filterCounts[filterValue.toLowerCase() as keyof typeof filterCounts] && (
                <span className="ml-1 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs">
                  {filterCounts[filterValue.toLowerCase() as keyof typeof filterCounts]}
                </span>
              )}
            </button>
            
            {showFilters && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div 
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${!filterValue ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterSelect('');
                  }}
                >
                  <span>All Chats</span>
                  <span className="text-xs text-gray-500">({filterCounts.all})</span>
                </div>
                <div 
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${filterValue === 'Direct' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterSelect('Direct');
                  }}
                >
                  <span className="flex items-center">
                    <FaUser className="mr-2" size={10} />
                    Direct Messages
                  </span>
                  <span className="text-xs text-gray-500">({filterCounts.direct})</span>
                </div>
                <div 
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${filterValue === 'Group' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterSelect('Group');
                  }}
                >
                  <span className="flex items-center">
                    <FaUsers className="mr-2" size={10} />
                    Group Chats
                  </span>
                  <span className="text-xs text-gray-500">({filterCounts.group})</span>
                </div>
                {filterCounts.unread > 0 && (
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Filter by unread chats (you may need to implement this in parent)
                    }}
                  >
                    <span>Unread Only</span>
                    <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                      {filterCounts.unread}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Filter by Label */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLabels();
              }}
              className={`p-2 rounded-md flex items-center text-xs transition-colors ${
                selectedLabel ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaTag className="mr-1" size={10} />
              {selectedLabel || 'Labels'}
            </button>
            
            {showLabels && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                <div 
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${!selectedLabel ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLabelSelect(null);
                  }}
                >
                  All Labels
                </div>
                {availableLabels.map(label => {
                  const labelCount = chats.filter(chat => 
                    chat.label === label.name || chat.secondaryLabel === label.name
                  ).length;
                  
                  return (
                    <div 
                      key={label.id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedLabel === label.name ? 'bg-blue-50 text-blue-700' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLabelSelect(label.name);
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getLabelColorValue(label.color) }}
                        ></div>
                        {label.name}
                      </div>
                      <span className="text-xs text-gray-500">({labelCount})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy('time')}
              className={`px-2 py-1 rounded ${sortBy === 'time' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('unread')}
              className={`px-2 py-1 rounded ${sortBy === 'unread' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              Unread
            </button>
          </div>
          
          {/* Clear Filters */}
          {(filterValue || selectedLabel || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-800 text-xs underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(filterValue || selectedLabel || searchQuery) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button 
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-blue-600"
                >
                  <FaTimes size={8} />
                </button>
              </span>
            )}
            {filterValue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Type: {filterValue}
                <button 
                  onClick={() => onFilterChange('')}
                  className="ml-1 hover:text-green-600"
                >
                  <FaTimes size={8} />
                </button>
              </span>
            )}
            {selectedLabel && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Label: {selectedLabel}
                <button 
                  onClick={() => onSelectLabel(null)}
                  className="ml-1 hover:text-purple-600"
                >
                  <FaTimes size={8} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            {chats.length === 0 ? (
              <div>
                <div className="text-4xl mb-2">💬</div>
                <h3 className="font-medium mb-1">No chats yet</h3>
                <p className="text-sm mb-3">Start a conversation with someone!</p>
                <button
                  onClick={onNewChatClick}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-medium mb-1">No matching chats</h3>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        ) : (
          sortedChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                chat.id === activeChat ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => onChatClick(chat.id)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3 text-sm">
                    {chat.avatar || chat.name.charAt(0).toUpperCase()}
                  </div>
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {chat.unread}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium text-gray-900 truncate ${chat.unread > 0 ? 'font-semibold' : ''}`}>
                      {chat.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {chat.type === 'Group' && <FaUsers className="text-gray-400" size={10} />}
                      <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                    </div>
                  </div>
                  
                  <p className={`text-sm text-gray-500 truncate ${chat.unread > 0 ? 'font-medium text-gray-700' : ''}`}>
                    {chat.lastMessage}
                  </p>
                  
                  {/* Chat info row */}
                  <div className="flex items-center mt-1.5 text-xs">
                    {/* Chat type badge */}
                    <span className={`px-1.5 py-0.5 rounded mr-1 ${
                      chat.type === 'Group' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {chat.type === 'Group' ? `${chat.memberCount} members` : 'Direct'}
                    </span>
                    
                    {/* Labels */}
                    {chat.label && (
                      <span 
                        className="px-1.5 py-0.5 rounded mr-1 text-white text-xs"
                        style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.label, availableLabels)) }}
                      >
                        {chat.label}
                      </span>
                    )}
                    {chat.secondaryLabel && (
                      <span 
                        className="px-1.5 py-0.5 rounded mr-1 text-white text-xs"
                        style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.secondaryLabel, availableLabels)) }}
                      >
                        {chat.secondaryLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer with stats */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{chats.length} total chats</span>
          {filterCounts.unread > 0 && (
            <span className="text-red-600 font-medium">{filterCounts.unread} unread</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get color for a label
const getLabelColor = (labelName: string, availableLabels: Label[] = []): string => {
  if (!availableLabels || !Array.isArray(availableLabels)) {
    return 'gray';
  }
  const label = availableLabels.find(l => l.name === labelName);
  return label?.color || 'gray';
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

export default ChatList;

// import { useState } from 'react';
// import { Chat, Label } from './chatlayout';
// import { FaSearch, FaPlus, FaFilter, FaTimes, FaTag } from 'react-icons/fa';

// interface ChatListProps {
//   chats: Chat[];
//   activeChat: string | null;
//   onChatClick: (chatId: string) => void;
//   filterValue: string;
//   onFilterChange: (value: string) => void;
//   currentUserId?: string;
//   onChatCreated?: () => void;
// //   onNewChatClick: () => void;
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   availableLabels: Label[];
//   selectedLabel: string | null;
//   onSelectLabel: (label: string | null) => void;
//   isLoading: boolean;
//   onNewChatClick: () => void;
// }

// const ChatList = ({ 
//   chats, 
//   activeChat, 
//   onChatClick, 
//   filterValue, 
//   onFilterChange,
//   currentUserId,
//   onChatCreated,
//   searchQuery,
//   onSearchChange,
//   availableLabels = [], // Default to empty array
//   selectedLabel,
//   onSelectLabel,
//   isLoading,
//   onNewChatClick
// }: ChatListProps) => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [showLabels, setShowLabels] = useState(false);

//   // Toggle filter dropdown
//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//     setShowLabels(false);
//   };

//   // Toggle labels dropdown
//   const toggleLabels = () => {
//     setShowLabels(!showLabels);
//     setShowFilters(false);
//   };

//   // Handle filter selection
//   const handleFilterSelect = (value: string) => {
//     onFilterChange(value);
//     setShowFilters(false);
//   };

//   // Handle label selection
//   const handleLabelSelect = (label: string | null) => {
//     onSelectLabel(label);
//     setShowLabels(false);
//   };

//   // Create new chat (now opens the modal)
//   const handleCreateChat = () => {
//     onNewChatClick();
//   };

//   if (isLoading) {
//     return (
//       <div className="w-72 border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold mb-2">Chats</h2>
//         </div>
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center text-gray-500">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-72 border-r border-gray-200 flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="text-xl font-semibold mb-2">Chats</h2>
        
//         {/* Search Box */}
//         <div className="relative mb-3">
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             className="w-full p-2 pl-8 border border-gray-300 rounded-md"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//           />
//           <FaSearch className="absolute left-2.5 top-3.5 text-gray-400" />
//           {searchQuery && (
//             <button 
//               onClick={() => onSearchChange('')}
//               className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes />
//             </button>
//           )}
//         </div>
        
//         {/* Filter Controls */}
//         <div className="flex space-x-2">
//           {/* Filter by Type */}
//           <div className="relative">
//             <button 
//               onClick={toggleFilters}
//               className={`p-2 rounded-md flex items-center text-xs ${
//                 filterValue ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               <FaFilter className="mr-1" />
//               {filterValue || 'Filter'}
//             </button>
            
//             {showFilters && (
//               <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
//                 <div 
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleFilterSelect('')}
//                 >
//                   All
//                 </div>
//                 <div 
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleFilterSelect('Direct')}
//                 >
//                   Direct Messages
//                 </div>
//                 <div 
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleFilterSelect('Group')}
//                 >
//                   Group Chats
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Filter by Label */}
//           <div className="relative">
//             <button 
//               onClick={toggleLabels}
//               className={`p-2 rounded-md flex items-center text-xs ${
//                 selectedLabel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               <FaTag className="mr-1" />
//               {selectedLabel || 'Labels'}
//             </button>
            
//             {showLabels && (
//               <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
//                 <div 
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleLabelSelect(null)}
//                 >
//                   All Labels
//                 </div>
//                 {availableLabels.map(label => (
//                   <div 
//                     key={label.id}
//                     className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
//                     onClick={() => handleLabelSelect(label.name)}
//                   >
//                     <div 
//                       className={`w-3 h-3 rounded-full mr-2`}
//                       style={{ backgroundColor: getLabelColorValue(label.color) }}
//                     ></div>
//                     {label.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* New Chat Button */}
//           <button 
//             onClick={handleCreateChat}
//             className="p-2 bg-blue-600 text-white rounded-md ml-auto flex items-center text-xs hover:bg-blue-700"
//           >
//             <FaPlus className="mr-1" /> New
//           </button>
//         </div>
//       </div>
      
//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto">
//         {chats.length === 0 ? (
//           <div className="text-center p-4 text-gray-500">
//             No chats found
//           </div>
//         ) : (
//           chats.map((chat) => (
//             <div
//               key={chat.id}
//               className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
//                 chat.id === activeChat ? 'bg-blue-50' : ''
//               }`}
//               onClick={() => onChatClick(chat.id)}
//             >
//               <div className="flex items-center">
//                 <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium mr-3">
//                   {chat.avatar || chat.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
//                     <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
//                   </div>
//                   <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  
//                   {/* Chat info row */}
//                   <div className="flex items-center mt-1 text-xs">
//                     {/* Chat type */}
//                     <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded mr-1">
//                       {chat.type}
//                     </span>
                    
//                     {/* Labels */}
//                     {chat.label && (
//                       <span 
//                         className="px-1.5 py-0.5 rounded mr-1 text-white"
//                         style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.label, availableLabels)) }}
//                       >
//                         {chat.label}
//                       </span>
//                     )}
//                     {chat.secondaryLabel && (
//                       <span 
//                         className="px-1.5 py-0.5 rounded mr-1 text-white"
//                         style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.secondaryLabel, availableLabels)) }}
//                       >
//                         {chat.secondaryLabel}
//                       </span>
//                     )}
                    
//                     {/* Member count for groups */}
//                     {chat.type === 'Group' && chat.memberCount && (
//                       <span className="ml-auto text-gray-400">
//                         {chat.memberCount} members
//                       </span>
//                     )}
                    
//                     {/* Unread count */}
//                     {chat.unread > 0 && (
//                       <div className="ml-auto bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
//                         {chat.unread}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Helper function to get color for a label - with null check
// const getLabelColor = (labelName: string, availableLabels: Label[] = []): string => {
//   if (!availableLabels || !Array.isArray(availableLabels)) {
//     return 'gray';
//   }
//   const label = availableLabels.find(l => l.name === labelName);
//   return label?.color || 'gray';
// };

// // Helper function to convert color names to actual color values
// const getLabelColorValue = (colorName: string): string => {
//   const colorMap: { [key: string]: string } = {
//     red: '#ef4444',
//     blue: '#3b82f6',
//     green: '#10b981',
//     purple: '#8b5cf6',
//     yellow: '#f59e0b',
//     orange: '#f97316',
//     pink: '#ec4899',
//     indigo: '#6366f1',
//     gray: '#6b7280',
//     teal: '#14b8a6',
//     cyan: '#06b6d4'
//   };
  
//   return colorMap[colorName] || colorMap.gray;
// };

// export default ChatList;