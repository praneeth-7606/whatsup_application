// app/components/auth/LogoutButton.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { createClient } from '../lib/supabase/client';
// import { createClient } from '@/app/lib/supabase/client';

interface LogoutButtonProps {
  className?: string;
  variant?: 'text' | 'icon' | 'full';
}

export default function LogoutButton({ 
  className = '',
  variant = 'full' 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Icon only variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        title="Logout"
      >
        {isLoading ? (
          <FaSpinner className="animate-spin h-5 w-5 text-gray-600" />
        ) : (
          <FaSignOutAlt className="h-5 w-5 text-gray-600" />
        )}
      </button>
    );
  }

  // Text only variant
  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`text-gray-600 hover:text-gray-900 focus:outline-none ${className}`}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    );
  }

  // Full button variant (default)
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin h-4 w-4" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <FaSignOutAlt className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}