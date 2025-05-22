// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { createClient } from '../../lib/supabase/client';
// import { FaSpinner, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

// const loginSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email address' }),
//   password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const supabase = createClient();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setErrorMessage(null);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: data.email,
//         password: data.password,
//       });

//       if (error) {
//         throw error;
//       }

//       router.refresh();
//       router.push('/chat');
//     } catch (error: any) {
//       setErrorMessage(error.message || 'Failed to sign in');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
//             Welcome Back
//           </h1>
//           <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
//             Sign in to continue to your account
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transform transition-all hover:shadow-2xl">
//           <div className="px-8 py-6">
//             {errorMessage && (
//               <div className="p-4 mb-6 text-sm rounded-lg flex items-center bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-200 border-l-4 border-red-500 dark:border-red-400">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {errorMessage}
//               </div>
//             )}

//             <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Email address
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaEnvelope className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     {...register('email')}
//                     className={`block w-full pl-10 pr-3 py-3 border ${
//                       errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
//                     placeholder="you@example.com"
//                   />
//                 </div>
//                 {errors.email && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>}
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Password
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaLock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     type="password"
//                     autoComplete="current-password"
//                     {...register('password')}
//                     className={`block w-full pl-10 pr-3 py-3 border ${
//                       errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//                     } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
//                     placeholder="••••••••"
//                   />
//                 </div>
//                 {errors.password && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>}
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
//                     Forgot your password?
//                   </a>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
//                 >
//                   <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                     <FaSignInAlt className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
//                   </span>
//                   {isLoading ? (
//                     <>
//                       <FaSpinner className="w-5 h-5 mr-2 animate-spin" /> Signing in...
//                     </>
//                   ) : (
//                     'Sign in'
//                   )}
//                 </button>
//               </div>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
//                 >
//                   Google
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
//                 >
//                   GitHub
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
//             <div className="text-sm">
//               Don't have an account?{' '}
//               <Link href="/api/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
//                 Sign up <FaUserPlus className="inline ml-1 text-xs" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/api/auth/login/page.tsx - Updated to match screenshot design
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { createClient } from '../../../lib/supabase/client';
import { createClient } from '../../lib/supabase/client';
import { FaSpinner, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaGoogle, FaMicrosoft, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      router.refresh();
      router.push('/chat');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    setTimeout(() => {
      router.push('/chat?demo=true');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-green-600 p-12 items-center justify-center">
        <div className="max-w-md text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Periskope Chat</h1>
            <p className="text-green-100 mt-2">Connect, collaborate, and communicate seamlessly</p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold">Real-time Messaging</h3>
                <p className="text-green-100 text-sm">Instant communication with your team</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold">Smart Organization</h3>
                <p className="text-green-100 text-sm">Organize conversations with labels and filters</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-green-100 text-sm">Work together efficiently in groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Periskope Chat</h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 mb-6 text-sm rounded-lg flex items-center bg-red-50 text-red-500 border-l-4 border-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Demo Login Button */}
          <div className="mb-6">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading || isDemoMode}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDemoMode ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading Demo...
                </div>
              ) : (
                'Try Demo Version'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={`w-full pl-10 pr-10 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </div>
              ) : (
                <>
                  <FaSignInAlt className="inline mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-3">
              <button className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                <FaGoogle className="mx-auto text-red-500" size={20} />
              </button>
              <button className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                <FaMicrosoft className="mx-auto text-blue-500" size={20} />
              </button>
              <button className="w-full py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                <FaGithub className="mx-auto text-gray-900" size={20} />
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/api/auth/signup"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// // app/components/auth/LoginForm.tsx
// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { createClient } from '../../lib/supabase/client';
// // import { createClient } from '@/app/lib/supabase/client';
// import { FaSpinner } from 'react-icons/fa';

// const loginSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email address' }),
//   password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const supabase = createClient();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setErrorMessage(null);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: data.email,
//         password: data.password,
//       });

//       if (error) {
//         throw error;
//       }

//       router.refresh();
//       router.push('/chat');
//     } catch (error: any) {
//       setErrorMessage(error.message || 'Failed to sign in');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
//         <p className="mt-2 text-sm text-gray-600">
//           Or{' '}
//           <Link href="/api/auth/signup" className="font-medium text-primary-color hover:text-primary-light">
//             create a new account
//           </Link>
//         </p>
//       </div>

//       {errorMessage && (
//         <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md">
//           {errorMessage}
//         </div>
//       )}

//       <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email address
//           </label>
//           <input
//             id="email"
//             type="email"
//             autoComplete="email"
//             {...register('email')}
//             className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
//           />
//           {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             autoComplete="current-password"
//             {...register('password')}
//             className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
//           />
//           {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-color border border-transparent rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Signing in...
//               </>
//             ) : (
//               'Sign in'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }