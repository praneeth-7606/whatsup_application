

// import { BsChatLeftText, BsThreeDotsVertical } from 'react-icons/bs';
// import { FiPhone, FiSettings } from 'react-icons/fi';

// const ChatSidebar = () => {
//   return (
//     <div className="w-16 bg-gray-100 flex flex-col items-center py-4 border-r">
//       <div className="w-8 h-8 bg-green-500 rounded-full mb-6"></div>
//       <div className="flex flex-col space-y-6 items-center text-gray-500">
//         <div className="text-green-500">
//           <BsChatLeftText size={20} />
//         </div>
//         <FiPhone size={20} />
//         <BsThreeDotsVertical size={20} />
//       </div>
//       <div className="mt-auto">
//         <FiSettings size={20} className="text-gray-500" />
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;

// Updated ChatSidebar Component to display user details and logout button
import { FaSignOutAlt, FaUser, FaEnvelope } from 'react-icons/fa';

interface ChatSidebarProps {
  onLogout?: () => void;
  userName: string;
  userInitial: string;
  userEmail?: string;
}

const ChatSidebar = ({ onLogout, userName, userInitial, userEmail }: ChatSidebarProps) => {
  return (
    <div className="w-16 md:w-20 bg-gray-800 text-white flex flex-col items-center py-4">
      <div className="flex flex-col items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-2">
          {userInitial}
        </div>
        <div className="hidden md:block text-xs text-center">
          <div className="truncate w-16 text-center">{userName}</div>
        </div>
      </div>
      
      {/* User Info Tooltip */}
      <div className="group relative">
        <button className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center mb-4">
          <FaUser className="text-white" />
        </button>
        <div className="absolute left-full ml-2 w-48 p-2 bg-gray-900 rounded shadow-lg hidden group-hover:block text-xs z-10">
          <div className="flex items-center mb-2">
            <FaUser className="mr-2" />
            <span>{userName}</span>
          </div>
          {userEmail && (
            <div className="flex items-center">
              <FaEnvelope className="mr-2" />
              <span className="truncate">{userEmail}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Icons */}
      {/* Add more navigation icons here if needed */}
      <div className="flex-grow"></div>
      
      {/* Logout Button */}
      {onLogout && (
        <button 
          onClick={onLogout}
          className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center mt-auto"
          title="Logout"
        >
          <FaSignOutAlt className="text-white" />
        </button>
      )}
    </div>
  );
};

export default ChatSidebar;