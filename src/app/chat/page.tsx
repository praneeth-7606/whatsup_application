

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../api/lib/supabase/client';
import ChatLayout from '../api/components/chat/chatlayout';
import { FaSpinner } from 'react-icons/fa';

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Store last successful session to prevent infinite loading
    const storedSession = sessionStorage.getItem('chatUserSession');
    let initialUser = null;
    if (storedSession) {
      try {
        initialUser = JSON.parse(storedSession);
        // Use stored user data initially to prevent loading state
        if (initialUser && initialUser.id) {
          setUser(initialUser);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error parsing stored session:', e);
      }
    }

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.error('Error getting authenticated user:', error);
          router.push('/login');
          return;
        }

        console.log('Authenticated user:', data.user);

        // Get user profile from the database
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          
          // If user exists in auth but not in profile table, create profile
          if (profileError.code === 'PGRST116') {
            console.log('Creating user profile for new user');
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                }
              ]);
              
            if (insertError) {
              console.error('Error creating user profile:', insertError);
            } else {
              // Retry fetching profile
              const { data: newProfileData } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();
                
              if (newProfileData) {
                console.log('Created and fetched new user profile:', newProfileData);
                const userData = {
                  ...data.user,
                  profile: newProfileData
                };
                setUser(userData);
                // Store session to prevent loading issues
                sessionStorage.setItem('chatUserSession', JSON.stringify(userData));
                setLoading(false);
                return;
              }
            }
          }
          
          if (!initialUser) { // Only redirect if we don't have a valid cached user
            router.push('/api/auth/login');
          }
          return;
        }

        console.log('User profile data:', profileData);
        const userData = {
          ...data.user,
          profile: profileData
        };
        setUser(userData);
        // Store session to prevent loading issues
        sessionStorage.setItem('chatUserSession', JSON.stringify(userData));
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        if (!initialUser) { // Only redirect if we don't have a valid cached user
          router.push('/api/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    // Always check for the latest user data
    checkUser();

    // Set up session expiration check
    const sessionCheckInterval = setInterval(() => {
      // Check if session is still valid every minute
      supabase.auth.getSession().then(({ data, error }) => {
        if (error || !data.session) {
          console.log('Session expired or error, redirecting to login');
          clearInterval(sessionCheckInterval);
          sessionStorage.removeItem('chatUserSession');
          router.push('/api/auth/login');
        }
      });
    }, 60000); // Check every minute

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('chatUserSession');
        router.push('/api/auth/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Refresh user data without full page reload
        checkUser();
      }
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [router, supabase]);

  // While loading, show a spinner
  if (loading && !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading...</h3>
          <p className="mt-1 text-sm text-gray-500">Please wait while we load your chats.</p>
        </div>
      </div>
    );
  }

  // If user exists, render chat layout
  if (user) {
    return (
      <div className="h-screen">
        <ChatLayout 
          currentUserId={user.id} 
          currentUserName={user.profile?.full_name || user.email} 
          currentUserEmail={user.email}
         
        />
      </div>
    );
  }

  // If no user and not loading, redirect to login
  router.push('/api/auth/login');
  return null;
}