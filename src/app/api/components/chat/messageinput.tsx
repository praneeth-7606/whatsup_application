// import { useState } from 'react';
// import { IoMdSend } from 'react-icons/io';
// import { BsEmojiSmile } from 'react-icons/bs';
// import { AiOutlinePaperClip, AiOutlineGift } from 'react-icons/ai';
// import { MdOutlineKeyboardVoice } from 'react-icons/md';

// interface MessageInputProps {
//   onSendMessage: (text: string) => void;
// }

// const MessageInput = ({ onSendMessage }: MessageInputProps) => {
//   const [newMessage, setNewMessage] = useState('');
  
//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       onSendMessage(newMessage);
//       setNewMessage('');
//     }
//   };
  
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };
  
//   return (
//     <div className="border-t p-3 bg-white">
//       <div className="flex items-center">
//         <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
//           <input
//             type="text"
//             placeholder="Message"
//             className="flex-1 bg-transparent outline-none text-sm"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <div className="flex items-center space-x-2 text-gray-500">
//             <BsEmojiSmile />
//             <AiOutlinePaperClip />
//             <AiOutlineGift />
//             <MdOutlineKeyboardVoice />
//           </div>
//         </div>
//         <button 
//           className="ml-2 bg-green-500 text-white p-2 rounded-full"
//           onClick={handleSendMessage}
//         >
//           <IoMdSend />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;

import { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiOutlinePaperClip, AiOutlineGift } from 'react-icons/ai';
import { MdOutlineKeyboardVoice } from 'react-icons/md';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t p-3 bg-white">
      <div className="flex items-center">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent outline-none text-sm"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center space-x-2 text-gray-500">
            <BsEmojiSmile className="cursor-pointer" />
            <AiOutlinePaperClip className="cursor-pointer" />
            <AiOutlineGift className="cursor-pointer" />
            <MdOutlineKeyboardVoice className="cursor-pointer" />
          </div>
        </div>
        <button
          className="ml-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
          onClick={handleSendMessage}
        >
          <IoMdSend />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;