// import { useState } from 'react';
// import { Chat, Label } from './chatlayout';
// import { FaSearch, FaPlus, FaFilter, FaTimes, FaTag, FaUsers, FaUser } from 'react-icons/fa';

// interface ChatListProps {
//   chats: Chat[];
//   activeChat: string | null;
//   onChatClick: (chatId: string) => void;
//   filterValue: string;
//   onFilterChange: (value: string) => void;
//   currentUserId?: string;
//   onChatCreated?: () => void;
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
//   availableLabels = [],
//   selectedLabel,
//   onSelectLabel,
//   isLoading,
//   onNewChatClick
// }: ChatListProps) => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [showLabels, setShowLabels] = useState(false);
//   const [sortBy, setSortBy] = useState<'time' | 'name' | 'unread'>('time');

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

//   // Close dropdowns when clicking outside
//   const closeDropdowns = () => {
//     setShowFilters(false);
//     setShowLabels(false);
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

//   // Clear all filters
//   const clearAllFilters = () => {
//     onFilterChange('');
//     onSelectLabel(null);
//     onSearchChange('');
//   };

//   // Sort chats based on selected criteria
//   const sortedChats = [...chats].sort((a, b) => {
//     switch (sortBy) {
//       case 'name':
//         return a.name.localeCompare(b.name);
//       case 'unread':
//         return b.unread - a.unread;
//       case 'time':
//       default:
//         return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
//     }
//   });

//   // Get filter counts for display
//   const filterCounts = {
//     all: chats.length,
//     direct: chats.filter(chat => chat.type === 'Direct').length,
//     group: chats.filter(chat => chat.type === 'Group').length,
//     unread: chats.filter(chat => chat.unread > 0).length
//   };

//   if (isLoading) {
//     return (
//       <div className="w-72 border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold mb-2">Chats</h2>
//         </div>
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center text-gray-500">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//             <div>Loading chats...</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-72 border-r border-gray-200 flex flex-col" onClick={closeDropdowns}>
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-xl font-semibold">Chats ({chats.length})</h2>
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               onNewChatClick();
//             }}
//             className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
//             title="Start new chat"
//           >
//             <FaPlus size={14} />
//           </button>
//         </div>
        
//         {/* Search Box */}
//         <div className="relative mb-3">
//           <input
//             type="text"
//             placeholder="Search conversations..."
//             className="w-full p-2 pl-8 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             value={searchQuery}
//             onChange={(e) => {
//               e.stopPropagation();
//               onSearchChange(e.target.value);
//             }}
//             onClick={(e) => e.stopPropagation()}
//           />
//           <FaSearch className="absolute left-2.5 top-3.5 text-gray-400" size={12} />
//           {searchQuery && (
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onSearchChange('');
//               }}
//               className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600"
//             >
//               <FaTimes size={12} />
//             </button>
//           )}
//         </div>
        
//         {/* Filter Controls */}
//         <div className="flex space-x-2 mb-2">
//           {/* Filter by Type */}
//           <div className="relative">
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleFilters();
//               }}
//               className={`p-2 rounded-md flex items-center text-xs transition-colors ${
//                 filterValue ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               <FaFilter className="mr-1" size={10} />
//               {filterValue || 'Type'}
//               {filterCounts[filterValue.toLowerCase() as keyof typeof filterCounts] && (
//                 <span className="ml-1 bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-xs">
//                   {filterCounts[filterValue.toLowerCase() as keyof typeof filterCounts]}
//                 </span>
//               )}
//             </button>
            
//             {showFilters && (
//               <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
//                 <div 
//                   className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${!filterValue ? 'bg-blue-50 text-blue-700' : ''}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleFilterSelect('');
//                   }}
//                 >
//                   <span>All Chats</span>
//                   <span className="text-xs text-gray-500">({filterCounts.all})</span>
//                 </div>
//                 <div 
//                   className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${filterValue === 'Direct' ? 'bg-blue-50 text-blue-700' : ''}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleFilterSelect('Direct');
//                   }}
//                 >
//                   <span className="flex items-center">
//                     <FaUser className="mr-2" size={10} />
//                     Direct Messages
//                   </span>
//                   <span className="text-xs text-gray-500">({filterCounts.direct})</span>
//                 </div>
//                 <div 
//                   className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${filterValue === 'Group' ? 'bg-blue-50 text-blue-700' : ''}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleFilterSelect('Group');
//                   }}
//                 >
//                   <span className="flex items-center">
//                     <FaUsers className="mr-2" size={10} />
//                     Group Chats
//                   </span>
//                   <span className="text-xs text-gray-500">({filterCounts.group})</span>
//                 </div>
//                 {filterCounts.unread > 0 && (
//                   <div 
//                     className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Filter by unread chats (you may need to implement this in parent)
//                     }}
//                   >
//                     <span>Unread Only</span>
//                     <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
//                       {filterCounts.unread}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Filter by Label */}
//           <div className="relative">
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleLabels();
//               }}
//               className={`p-2 rounded-md flex items-center text-xs transition-colors ${
//                 selectedLabel ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               <FaTag className="mr-1" size={10} />
//               {selectedLabel || 'Labels'}
//             </button>
            
//             {showLabels && (
//               <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
//                 <div 
//                   className={`p-2 hover:bg-gray-100 cursor-pointer ${!selectedLabel ? 'bg-blue-50 text-blue-700' : ''}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleLabelSelect(null);
//                   }}
//                 >
//                   All Labels
//                 </div>
//                 {availableLabels.map(label => {
//                   const labelCount = chats.filter(chat => 
//                     chat.label === label.name || chat.secondaryLabel === label.name
//                   ).length;
                  
//                   return (
//                     <div 
//                       key={label.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedLabel === label.name ? 'bg-blue-50 text-blue-700' : ''}`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleLabelSelect(label.name);
//                       }}
//                     >
//                       <div className="flex items-center">
//                         <div 
//                           className="w-3 h-3 rounded-full mr-2"
//                           style={{ backgroundColor: getLabelColorValue(label.color) }}
//                         ></div>
//                         {label.name}
//                       </div>
//                       <span className="text-xs text-gray-500">({labelCount})</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Sort Options */}
//         <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setSortBy('time')}
//               className={`px-2 py-1 rounded ${sortBy === 'time' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
//             >
//               Recent
//             </button>
//             <button
//               onClick={() => setSortBy('name')}
//               className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
//             >
//               Name
//             </button>
//             <button
//               onClick={() => setSortBy('unread')}
//               className={`px-2 py-1 rounded ${sortBy === 'unread' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
//             >
//               Unread
//             </button>
//           </div>
          
//           {/* Clear Filters */}
//           {(filterValue || selectedLabel || searchQuery) && (
//             <button
//               onClick={clearAllFilters}
//               className="text-blue-600 hover:text-blue-800 text-xs underline"
//             >
//               Clear all
//             </button>
//           )}
//         </div>

//         {/* Active Filters Display */}
//         {(filterValue || selectedLabel || searchQuery) && (
//           <div className="flex flex-wrap gap-1 mb-2">
//             {searchQuery && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
//                 Search: "{searchQuery}"
//                 <button 
//                   onClick={() => onSearchChange('')}
//                   className="ml-1 hover:text-blue-600"
//                 >
//                   <FaTimes size={8} />
//                 </button>
//               </span>
//             )}
//             {filterValue && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//                 Type: {filterValue}
//                 <button 
//                   onClick={() => onFilterChange('')}
//                   className="ml-1 hover:text-green-600"
//                 >
//                   <FaTimes size={8} />
//                 </button>
//               </span>
//             )}
//             {selectedLabel && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
//                 Label: {selectedLabel}
//                 <button 
//                   onClick={() => onSelectLabel(null)}
//                   className="ml-1 hover:text-purple-600"
//                 >
//                   <FaTimes size={8} />
//                 </button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto">
//         {sortedChats.length === 0 ? (
//           <div className="text-center p-6 text-gray-500">
//             {chats.length === 0 ? (
//               <div>
//                 <div className="text-4xl mb-2">💬</div>
//                 <h3 className="font-medium mb-1">No chats yet</h3>
//                 <p className="text-sm mb-3">Start a conversation with someone!</p>
//                 <button
//                   onClick={onNewChatClick}
//                   className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
//                 >
//                   Start New Chat
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <div className="text-4xl mb-2">🔍</div>
//                 <h3 className="font-medium mb-1">No matching chats</h3>
//                 <p className="text-sm">Try adjusting your filters or search terms</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           sortedChats.map((chat) => (
//             <div
//               key={chat.id}
//               className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
//                 chat.id === activeChat ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
//               }`}
//               onClick={() => onChatClick(chat.id)}
//             >
//               <div className="flex items-center">
//                 <div className="relative">
//                   <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3 text-sm">
//                     {chat.avatar || chat.name.charAt(0).toUpperCase()}
//                   </div>
//                   {chat.unread > 0 && (
//                     <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
//                       {chat.unread}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className={`font-medium text-gray-900 truncate ${chat.unread > 0 ? 'font-semibold' : ''}`}>
//                       {chat.name}
//                     </h3>
//                     <div className="flex items-center space-x-1">
//                       {chat.type === 'Group' && <FaUsers className="text-gray-400" size={10} />}
//                       <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
//                     </div>
//                   </div>
                  
//                   <p className={`text-sm text-gray-500 truncate ${chat.unread > 0 ? 'font-medium text-gray-700' : ''}`}>
//                     {chat.lastMessage}
//                   </p>
                  
//                   {/* Chat info row */}
//                   <div className="flex items-center mt-1.5 text-xs">
//                     {/* Chat type badge */}
//                     <span className={`px-1.5 py-0.5 rounded mr-1 ${
//                       chat.type === 'Group' 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-gray-100 text-gray-600'
//                     }`}>
//                       {chat.type === 'Group' ? `${chat.memberCount} members` : 'Direct'}
//                     </span>
                    
//                     {/* Labels */}
//                     {chat.label && (
//                       <span 
//                         className="px-1.5 py-0.5 rounded mr-1 text-white text-xs"
//                         style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.label, availableLabels)) }}
//                       >
//                         {chat.label}
//                       </span>
//                     )}
//                     {chat.secondaryLabel && (
//                       <span 
//                         className="px-1.5 py-0.5 rounded mr-1 text-white text-xs"
//                         style={{ backgroundColor: getLabelColorValue(getLabelColor(chat.secondaryLabel, availableLabels)) }}
//                       >
//                         {chat.secondaryLabel}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
      
//       {/* Footer with stats */}
//       <div className="p-3 border-t border-gray-200 bg-gray-50">
//         <div className="flex justify-between text-xs text-gray-600">
//           <span>{chats.length} total chats</span>
//           {filterCounts.unread > 0 && (
//             <span className="text-red-600 font-medium">{filterCounts.unread} unread</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to get color for a label
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


// ChatList.tsx - Complete scrollable implementation with all required features
import { useState, useRef, useEffect } from 'react';
import { Chat, Label, ChatMember } from './chatlayout';
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
  FaPlus,
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
  FaUserMinus
} from 'react-icons/fa';

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
  onNewChatClick: () => void;
  onAssignLabel?: (chatId: string, labelName: string) => void;
  onAddMember?: (chatId: string, userId: string) => void;
  onRemoveMember?: (chatId: string, userId: string) => void;
  onCreateLabel?: (name: string, color: string) => void;
}

const ChatList = ({ 
  chats, 
  activeChat, 
  onChatClick, 
  filterValue, 
  onFilterChange,
  currentUserId,
  searchQuery,
  onSearchChange,
  availableLabels,
  selectedLabel,
  onSelectLabel,
  isLoading,
  onNewChatClick,
  onAssignLabel,
  onAddMember,
  onRemoveMember,
  onCreateLabel
}: ChatListProps) => {
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [showLabelDropdown, setShowLabelDropdown] = useState<string | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState<string | null>(null);
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null);
  const [showNewLabelModal, setShowNewLabelModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3B82F6');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sample users for member assignment (in real app, fetch from database)
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

  // Handle new label creation
  const handleCreateNewLabel = () => {
    if (newLabelName.trim() && onCreateLabel) {
      onCreateLabel(newLabelName.trim(), newLabelColor);
      setNewLabelName('');
      setNewLabelColor('#3B82F6');
      setShowNewLabelModal(false);
    }
  };

  // Advanced filtering logic
  const filteredChats = chats.filter(chat => {
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
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <FaCommentDots className="text-gray-600" size={16} />
            <span className="text-lg font-medium text-gray-800">chats</span>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <FaSync size={12} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
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
              <span>5 / 6 phones</span>
            </div>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Notifications"
            >
              <FaBell size={14} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Menu"
            >
              <FaList size={14} />
            </button>
          </div>
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
              <span>Custom filter</span>
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
            placeholder="Search"
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
          {filteredChats.map((chat, index) => (
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowNewLabelModal(true);
                                  setShowLabelDropdown(null);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                <FaPlus size={10} />
                              </button>
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

                    {/* Add/Manage Members Button */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMemberDropdown(showMemberDropdown === chat.id ? null : chat.id);
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                        title={chat.type === 'Group' ? 'Manage Members' : 'Chat Info'}
                      >
                        <FaUsers size={10} />
                      </button>
                      
                      {/* Member Dropdown */}
                      {showMemberDropdown === chat.id && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                          <div className="p-2">
                            {chat.type === 'Group' ? (
                              <>
                                <div className="text-xs font-medium text-gray-700 mb-2">Manage Members</div>
                                
                                {/* Current Members */}
                                {chat.members && chat.members.length > 0 && (
                                  <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-1">Current Members</div>
                                    <div className="max-h-20 overflow-y-auto space-y-1">
                                      {chat.members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between text-xs">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                              {member.name.charAt(0)}
                                            </div>
                                            <span>{member.name}</span>
                                            {member.role === 'admin' && (
                                              <span className="text-blue-600 text-xs">(Admin)</span>
                                            )}
                                          </div>
                                          {member.id !== currentUserId && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleMemberRemove(chat.id, member.id);
                                              }}
                                              className="text-red-500 hover:text-red-700"
                                              title="Remove Member"
                                            >
                                              <FaUserMinus size={8} />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Add New Members */}
                                <div className="border-t pt-2">
                                  <div className="text-xs text-gray-500 mb-1">Add Members</div>
                                  <div className="max-h-24 overflow-y-auto space-y-1">
                                    {availableUsers.filter(user => 
                                      !chat.members?.some(member => member.id === user.id)
                                    ).map(user => (
                                      <button
                                        key={user.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMemberAdd(chat.id, user.id);
                                        }}
                                        className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded flex items-center space-x-2"
                                      >
                                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                          {user.avatar}
                                        </div>
                                        <div>
                                          <div className="font-medium">{user.name}</div>
                                          <div className="text-gray-500">{user.email}</div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-xs">
                                <div className="font-medium text-gray-700 mb-1">Direct Message</div>
                                <div className="text-gray-500">Private conversation</div>
                              </div>
                            )}
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
                {searchQuery ? 'Try adjusting your search' : 'Start a new conversation'}
              </p>
              <button
                onClick={onNewChatClick}
                className="mt-2 text-green-600 hover:text-green-700 text-sm underline"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Label Modal */}
      {showNewLabelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Label</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Name
                </label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter label name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {labelColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewLabelColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newLabelColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewLabelModal(false);
                  setNewLabelName('');
                  setNewLabelColor('#3B82F6');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewLabel}
                disabled={!newLabelName.trim()}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* Smooth scrolling */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatList;