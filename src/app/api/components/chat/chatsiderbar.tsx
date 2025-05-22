

// import React from 'react';
// import { 
//   FaCommentDots, 
//   FaHome, 
//   FaComments, 
//   FaHashtag, 
//   FaChartLine, 
//   FaUsers, 
//   FaTag, 
//   FaImages, 
//   FaCog,
//   FaUserFriends,
//   FaBook,
//   FaSignOutAlt
// } from 'react-icons/fa';
// // import { User } from './ChatLayout';
// import { User } from './chatlayout';
// // import LogoutButton from '../../auth/logout';
// // import LogoutButton from '../../auth/logout';
// import LogoutButton from '../auth/logoutbutton';
// // import LogoutButton from './LogoutButton';

// interface ChatSidebarProps {
//   currentUser: User | null;
//   onLogout?: () => void;
//   isDemo?: boolean;
// }

// const ChatSidebar = ({ currentUser, onLogout, isDemo = false }: ChatSidebarProps) => {
//   const menuItems = [
//     { id: 'dashboard', icon: FaHome, label: 'Dashboard', active: false },
//     { id: 'chats', icon: FaCommentDots, label: 'Chats', active: true },
//     { id: 'conversations', icon: FaComments, label: 'Conversations', active: false },
//     { id: 'hashtags', icon: FaHashtag, label: 'Hashtags', active: false },
//     { id: 'analytics', icon: FaChartLine, label: 'Analytics', active: false },
//     { id: 'contacts', icon: FaUsers, label: 'Contacts', active: false },
//     { id: 'tags', icon: FaTag, label: 'Tags', active: false },
//     { id: 'media', icon: FaImages, label: 'Media', active: false },
//     { id: 'team', icon: FaUserFriends, label: 'Team', active: false },
//     { id: 'knowledge', icon: FaBook, label: 'Knowledge', active: false },
//     { id: 'settings', icon: FaCog, label: 'Settings', active: false }
//   ];

//   return (
//     <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
//       {/* Logo */}
//       <div className="mb-8">
//         <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
//           <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
//             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Items */}
//       <div className="flex flex-col space-y-2 flex-1">
//         {menuItems.map((item) => {
//           const IconComponent = item.icon;
//           return (
//             <div key={item.id} className="relative group">
//               <button
//                 className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
//                   item.active 
//                     ? 'bg-white shadow-sm text-gray-700 border border-gray-200' 
//                     : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
//                 }`}
//                 title={item.label}
//               >
//                 <IconComponent size={18} />
//               </button>
              
//               {/* Tooltip */}
//               <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
//                 {item.label}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* User Profile and Logout */}
//       <div className="mt-auto space-y-2">
//         {/* User Profile */}
//         {currentUser && (
//           <div className="relative group">
//             <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
//               {currentUser.full_name?.charAt(0) || 'P'}
//             </div>
            
//             {/* User tooltip */}
//             <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
//               <div className="font-medium">{currentUser.full_name}</div>
//               <div className="text-gray-300">{currentUser.email}</div>
//               {isDemo && <div className="text-green-300">Demo Mode</div>}
//             </div>
//           </div>
//         )}

//         {/* Logout Button */}
//         <div className="relative group">
//           {isDemo ? (
//             <button
//               onClick={onLogout}
//               className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//               title="Exit Demo"
//             >
//               <FaSignOutAlt size={18} />
//             </button>
//           ) : (
//             <LogoutButton
//               showText={false}
//               className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//             />
//           )}
          
//           {/* Logout tooltip */}
//           <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
//             {isDemo ? 'Exit Demo' : 'Logout'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;


// ChatSidebar.tsx - Fixed with scrollable navigation to prevent window overflow
import React from 'react';
import { 
  FaCommentDots, 
  FaHome, 
  FaComments, 
  FaHashtag, 
  FaChartLine, 
  FaUsers, 
  FaTag, 
  FaImages, 
  FaCog,
  FaUserFriends,
  FaBook,
  FaSignOutAlt
} from 'react-icons/fa';
import { User } from './chatlayout';
import LogoutButton from '../auth/logoutbutton';

interface ChatSidebarProps {
  currentUser: User | null;
  onLogout?: () => void;
  isDemo?: boolean;
}

const ChatSidebar = ({ currentUser, onLogout, isDemo = false }: ChatSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: FaHome, label: 'Dashboard', active: false },
    { id: 'chats', icon: FaCommentDots, label: 'Chats', active: true },
    { id: 'conversations', icon: FaComments, label: 'Conversations', active: false },
    { id: 'hashtags', icon: FaHashtag, label: 'Hashtags', active: false },
    { id: 'analytics', icon: FaChartLine, label: 'Analytics', active: false },
    { id: 'contacts', icon: FaUsers, label: 'Contacts', active: false },
    { id: 'tags', icon: FaTag, label: 'Tags', active: false },
    { id: 'media', icon: FaImages, label: 'Media', active: false },
    { id: 'team', icon: FaUserFriends, label: 'Team', active: false },
    { id: 'knowledge', icon: FaBook, label: 'Knowledge', active: false },
    { id: 'settings', icon: FaCog, label: 'Settings', active: false }
  ];

  return (
    <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center h-screen">
      {/* Logo - Fixed at top */}
      <div className="flex-shrink-0 py-4">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 w-full custom-scrollbar">
        <div className="flex flex-col space-y-2 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative group">
                <button
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    item.active 
                      ? 'bg-white shadow-sm text-gray-700 border border-gray-200' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  <IconComponent size={18} />
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile and Logout - Fixed at bottom */}
      <div className="flex-shrink-0 pb-4 space-y-2">
        {/* User Profile */}
        {currentUser && (
          <div className="relative group">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {currentUser.full_name?.charAt(0) || 'P'}
            </div>
            
            {/* User tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
              <div className="font-medium">{currentUser.full_name}</div>
              <div className="text-gray-300">{currentUser.email}</div>
              {isDemo && <div className="text-green-300">Demo Mode</div>}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="relative group">
          {isDemo ? (
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Exit Demo"
            >
              <FaSignOutAlt size={18} />
            </button>
          ) : (
            <LogoutButton
              showText={false}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            />
          )}
          
          {/* Logout tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
            {isDemo ? 'Exit Demo' : 'Logout'}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* Hide scrollbar on smaller screens or when not needed */
        @media (max-height: 600px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatSidebar;