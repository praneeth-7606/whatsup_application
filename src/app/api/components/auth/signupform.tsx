"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '../../lib/supabase/client';
import { FaSpinner, FaEnvelope, FaLock, FaUserAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If signup is successful, insert user profile data
      const { data: authData } = await supabase.auth.getUser();
      
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              full_name: data.fullName,
            },
          ]);

        if (profileError) {
          throw profileError;
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/api/auth/login?signup=success');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transform transition-all p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
              <FaCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">Account created!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your account has been successfully created. You'll be redirected to the login page shortly.
            </p>
            <div className="mt-6">
              <Link 
                href="/api/auth/login" 
                className="inline-flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Go to login page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Create Your Account
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Join our community today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="px-8 py-6">
            {errorMessage && (
              <div className="p-4 mb-6 text-sm rounded-lg flex items-center bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-200 border-l-4 border-red-500 dark:border-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    {...register('fullName')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.fullName ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.confirmPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-200`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="w-5 h-5 mr-2 animate-spin" /> Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  GitHub
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div className="text-sm">
              Already have an account?{' '}
              <Link href="/api/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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

// const signupSchema = z.object({
//   fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
//   email: z.string().email({ message: 'Please enter a valid email address' }),
//   password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// export default function SignupForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const supabase = createClient();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       fullName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data: SignupFormValues) => {
//     setIsLoading(true);
//     setErrorMessage(null);

//     try {
//       const { error: signUpError } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//           data: {
//             full_name: data.fullName,
//           },
//         },
//       });

//       if (signUpError) {
//         throw signUpError;
//       }

//       // If signup is successful, insert user profile data
//       const { data: authData } = await supabase.auth.getUser();
      
//       if (authData?.user) {
//         const { error: profileError } = await supabase
//           .from('users')
//           .insert([
//             {
//               id: authData.user.id,
//               email: data.email,
//               full_name: data.fullName,
//             },
//           ]);

//         if (profileError) {
//           throw profileError;
//         }
//       }

//       router.push('/api/auth/login?signup=success');
//     } catch (error: any) {
//       setErrorMessage(error.message || 'Failed to sign up');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Create a new account</h1>
//         <p className="mt-2 text-sm text-gray-600">
//           Or{' '}
//           <Link href="/login" className="font-medium text-primary-color hover:text-primary-light">
//             sign in to your account
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
//           <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <input
//             id="fullName"
//             type="text"
//             autoComplete="name"
//             {...register('fullName')}
//             className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
//           />
//           {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
//         </div>

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
//             autoComplete="new-password"
//             {...register('password')}
//             className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
//           />
//           {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//             Confirm Password
//           </label>
//           <input
//             id="confirmPassword"
//             type="password"
//             autoComplete="new-password"
//             {...register('confirmPassword')}
//             className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color"
//           />
//           {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-color border border-transparent rounded-md shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <FaSpinner className="w-4 h-4 mr-2 animate-spin" /> Creating account...
//               </>
//             ) : (
//               'Sign up'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }