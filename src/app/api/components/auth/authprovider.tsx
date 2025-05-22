// // app/components/auth/AuthProvider.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '@/app/lib/supabase/client';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isLoading: true,
//   signOut: async () => {},
// });

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const supabase = createClient();

//   useEffect(() => {
//     const getUser = async () => {
//       setIsLoading(true);
      
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
        
//         if (session?.user) {
//           setUser(session.user);
//         }
//       } catch (error) {
//         console.error('Error fetching auth session:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getUser();

//     // Set up auth state change listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
        
//         // Refresh the page on auth state change
//         router.refresh();
//       }
//     );

//     // Clean up subscription
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase, router]);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//   };

//   const value = {
//     user,
//     isLoading,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }


// app/components/auth/AuthProvider.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '@/app/lib/supabase/client';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isLoading: true,
//   signOut: async () => {},
// });

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const supabase = createClient();

//   useEffect(() => {
//     const getUser = async () => {
//       setIsLoading(true);
      
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
        
//         if (session?.user) {
//           setUser(session.user);
//         }
//       } catch (error) {
//         console.error('Error fetching auth session:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getUser();

//     // Set up auth state change listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
        
//         // Refresh the page on auth state change
//         router.refresh();
//       }
//     );

//     // Clean up subscription
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase, router]);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     // Update this path to match your route structure
//     router.push('/');
//   };

//   const value = {
//     user,
//     isLoading,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }



"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../../lib/supabase/client';
// import { createClient } from '@/app/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        
        // Refresh the page on auth state change
        router.refresh();
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Update this path to match your route structure
    router.push('/');
  };

  const value = {
    user,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}