// // app/(auth)/login/page.tsx
// "use client";

// import { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '@/app/lib/supabase/client';
// // import { createClient } from '@supabase/supabase-js';

// // Define schema for form validation
// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectTo = searchParams.get('redirectedFrom') || '/chat';
//   const supabase = createClient();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (data: LoginForm) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: data.email,
//         password: data.password,
//       });
      
//       if (error) {
//         setError(error.message);
//         return;
//       }
      
//       // Redirect on successful login
//       router.push(redirectTo);
//       router.refresh();
//     } catch (err) {
//       setError('An unexpected error occurred');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
//               create a new account
//             </Link>
//           </p>
//         </div>
        
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
//             {error}
//           </div>
//         )}
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div className="relative mb-4">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaEnvelope className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 {...register('email')}
//                 className={`appearance-none rounded-md relative block w-full px-10 py-3 border 
//                 ${errors.email ? 'border-red-300' : 'border-gray-300'} 
//                 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
//                 placeholder="Email address"
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
//             )}
            
//             <div className="relative mt-3">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaLock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 {...register('password')}
//                 className={`appearance-none rounded-md relative block w-full px-10 py-3 border 
//                 ${errors.password ? 'border-red-300' : 'border-gray-300'} 
//                 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
//                 placeholder="Password"
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <a href="#" className="font-medium text-primary hover:text-primary-dark">
//                 Forgot your password?
//               </a>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
//               ${isLoading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'}
//               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
//             >
//               {isLoading ? (
//                 <>
//                   <FaSpinner className="animate-spin mr-2 h-4 w-4" />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import type { Metadata } from 'next';
// import LoginForm from '@/app/components/auth/LoginForm';
import LoginForm from '../../components/auth/loginform';
import { createServerClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login | Chat App',
  description: 'Sign in to your chat application account',
};

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/chat');
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}