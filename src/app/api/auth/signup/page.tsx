// app/(auth)/signup/page.tsx
// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { FaEnvelope, FaLock, FaSpinner, FaUser } from 'react-icons/fa';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '@/app/lib/supabase/client';

// // Define schema for form validation
// const signupSchema = z.object({
//   fullName: z.string().min(2, 'Full name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// type SignupForm = z.infer<typeof signupSchema>;

// export default function SignupPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const router = useRouter();
//   const supabase = createClient();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupForm>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       fullName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data: SignupForm) => {
//     setIsLoading(true);
//     setError(null);
//     setSuccessMessage(null);
    
//     try {
//       const { error } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//           data: {
//             full_name: data.fullName,
//           },
//           emailRedirectTo: `${window.location.origin}/api/auth/callback`,
//         },
//       });
      
//       if (error) {
//         setError(error.message);
//         return;
//       }
      
//       // Display success message or redirect
//       setSuccessMessage(
//         'Registration successful! Please check your email to confirm your account.'
//       );
      
//       // Optional: Redirect after a delay or let user manually go to login
//       setTimeout(() => {
//         router.push('/login');
//       }, 3000);
      
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
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
//               sign in to your account
//             </Link>
//           </p>
//         </div>
        
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
//             {error}
//           </div>
//         )}
        
//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm">
//             {successMessage}
//           </div>
//         )}
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div className="relative mb-4">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaUser className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="fullName"
//                 type="text"
//                 {...register('fullName')}
//                 className={`appearance-none rounded-md relative block w-full px-10 py-3 border 
//                 ${errors.fullName ? 'border-red-300' : 'border-gray-300'} 
//                 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
//                 placeholder="Full name"
//               />
//             </div>
//             {errors.fullName && (
//               <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>
//             )}
            
//             <div className="relative mt-3">
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
            
//             <div className="relative mt-3">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaLock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 {...register('confirmPassword')}
//                 className={`appearance-none rounded-md relative block w-full px-10 py-3 border 
//                 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} 
//                 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
//                 placeholder="Confirm password"
//               />
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
//             )}
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
//                   Creating account...
//                 </>
//               ) : (
//                 'Sign up'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import type { Metadata } from 'next';
import SignupForm from '../../components/auth/signupform';
// import SignupForm from '@/app/components/auth/SignupForm';
import { createServerClient } from '../../lib/supabase/server';
// import { createServerClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign Up | Chat App',
  description: 'Create a new account for the chat application',
};

export default async function SignupPage() {
  // Check if user is already logged in
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/chat');
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}
