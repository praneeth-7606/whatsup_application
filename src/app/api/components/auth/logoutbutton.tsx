// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '../../../lib/supabase/client';
// import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';

// interface LogoutButtonProps {
//   showText?: boolean;
//   className?: string;
// }

// export default function LogoutButton({ showText = true, className = '' }: LogoutButtonProps) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const supabase = createClient();

//   const handleLogout = async () => {
//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
      
//       router.refresh();
//       router.push('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       disabled={isLoading}
//       className={`flex items-center ${className}`}
//     >
//       {isLoading ? (
//         <FaSpinner className="w-4 h-4 animate-spin" />
//       ) : (
//         <FaSignOutAlt className="w-4 h-4" />
//       )}
//       {showText && (
//         <span className="ml-2">Logout</span>
//       )}
//     </button>
//   );
// }

// app/components/LogoutButton.tsx - Updated logout component
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';

interface LogoutButtonProps {
  showText?: boolean;
  className?: string;
}

export default function LogoutButton({ showText = true, className = '' }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage
      localStorage.removeItem('chatAppUser');
      
      router.refresh();
      router.push('/api/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center justify-center ${className}`}
      title="Logout"
    >
      {isLoading ? (
        <FaSpinner className="w-4 h-4 animate-spin" />
      ) : (
        <FaSignOutAlt className="w-4 h-4" />
      )}
      {showText && (
        <span className="ml-2">Logout</span>
      )}
    </button>
  );
}