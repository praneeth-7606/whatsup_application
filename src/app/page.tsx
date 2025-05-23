
import { createServerClient } from './api/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import './globals.css';
import { FaComment, FaUser, FaSignInAlt, FaUserPlus, FaRocket, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

export default async function HomePage() {
  const supabase = createServerClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // If logged in, redirect to chat
  if (session) {
    redirect('/chat');
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">ChatApp</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/api/auth/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                    <div className="sm:text-center lg:text-left lg:col-span-6">
                      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                        <span className="block xl:inline">Modern messaging for</span>{' '}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 xl:inline">everyone</span>
                      </h1>
                      <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                        Stay connected with friends, family, and colleagues. Our chat platform provides 
                        a simple and intuitive way to communicate in real-time.
                      </p>
                      <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                        <div className="rounded-md shadow">
                          <Link 
                            href="/api/auth/login" 
                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            <FaSignInAlt className="mr-2" />
                            Login
                          </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <Link 
                            href="/api/auth/signup" 
                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 md:py-4 md:text-lg md:px-10 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            <FaUserPlus className="mr-2" />
                            Sign up
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                      <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                        <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                          <svg className="absolute inset-0 h-full w-full text-gray-200 dark:text-gray-700" preserveAspectRatio="xMidYMid slice" fill="currentColor">
                            <path d="M40,10c0,0,0,0.2,0.1,0.6c0,0.2,0.1,0.5,0.1,0.9c0.1,0.3,0.1,0.7,0.2,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.1,0.4,0.2,0.9,0.3,1.3
                              c0.1,0.5,0.2,0.9,0.3,1.4c0.1,0.5,0.2,1,0.4,1.5c0.1,0.5,0.3,1,0.4,1.6c0.2,0.5,0.3,1.1,0.5,1.6c0.2,0.6,0.3,1.1,0.5,1.7
                              c0.2,0.6,0.4,1.2,0.6,1.8c0.2,0.6,0.4,1.2,0.6,1.9c0.2,0.6,0.4,1.3,0.7,1.9c0.3,0.6,0.5,1.3,0.7,1.9c0.2,0.7,0.5,1.3,0.8,2
                              c0.1,0.3,0.3,0.7,0.4,1c0.1,0.3,0.3,0.7,0.4,1c0.3,0.7,0.6,1.3,0.9,2c0.3,0.7,0.6,1.3,0.9,2c0.3,0.7,0.7,1.3,1,2
                              c0.7,1.3,1.4,2.6,2.1,3.9c0.7,1.3,1.5,2.5,2.3,3.7c0.8,1.2,1.6,2.3,2.4,3.4c0.8,1.1,1.7,2.2,2.6,3.2c0.9,1,1.8,2,2.8,3
                              c0.5,0.5,0.9,0.9,1.4,1.3c0.5,0.4,0.9,0.9,1.4,1.3c0.5,0.4,1,0.8,1.5,1.2c0.5,0.4,1,0.8,1.5,1.1c1,0.7,2,1.5,3.1,2.1
                              c1,0.7,2.1,1.3,3.2,1.9c0.5,0.3,1.1,0.6,1.7,0.9c0.6,0.3,1.1,0.6,1.7,0.8c0.6,0.3,1.1,0.5,1.7,0.8c0.6,0.2,1.2,0.5,1.7,0.7
                              c1.2,0.5,2.3,0.9,3.5,1.3c1.2,0.4,2.4,0.7,3.6,1.1c1.2,0.3,2.4,0.6,3.6,0.8c1.2,0.3,2.4,0.5,3.6,0.7c1.2,0.2,2.4,0.4,3.6,0.5
                              c1.2,0.2,2.4,0.3,3.6,0.4c1.2,0.1,2.4,0.2,3.6,0.3c1.2,0.1,2.4,0.1,3.6,0.2c1.2,0,2.4,0.1,3.6,0c0.6,0,1.2,0,1.8,0c0.6,0,1.2-0.1,1.8-0.1
                              c1.2-0.1,2.4-0.1,3.6-0.2c1.2-0.1,2.4-0.2,3.6-0.3c1.2-0.1,2.4-0.3,3.5-0.4c1.2-0.2,2.3-0.3,3.5-0.5c1.2-0.2,2.3-0.4,3.5-0.6
                              c1.1-0.2,2.3-0.4,3.4-0.7c1.1-0.2,2.3-0.5,3.4-0.8c1.1-0.3,2.2-0.6,3.2-0.9c1.1-0.3,2.1-0.6,3.2-1c2.1-0.7,4.1-1.4,6-2.2
                              c1.9-0.8,3.8-1.7,5.6-2.6c1.8-0.9,3.4-1.9,5-2.9c0.8-0.5,1.6-1,2.4-1.5c0.8-0.5,1.5-1,2.2-1.6c0.7-0.5,1.4-1.1,2.1-1.6
                              c0.7-0.5,1.4-1.1,2-1.6c0.6-0.6,1.3-1.1,1.9-1.7c0.6-0.6,1.2-1.1,1.8-1.7c0.6-0.6,1.1-1.2,1.7-1.7c0.5-0.6,1.1-1.2,1.6-1.8
                              c0.5-0.6,1-1.2,1.5-1.8c0.5-0.6,1-1.2,1.4-1.8c0.5-0.6,0.9-1.2,1.3-1.9c0.4-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9
                              c0.4-0.6,0.8-1.3,1.1-1.9c0.4-0.6,0.7-1.3,1-1.9c0.3-0.7,0.7-1.3,1-1.9c0.3-0.7,0.6-1.3,0.9-2c0.3-0.7,0.6-1.3,0.8-2
                              c0.3-0.7,0.5-1.3,0.8-2c0.2-0.7,0.5-1.3,0.7-2c0.2-0.7,0.4-1.3,0.6-2c0.2-0.6,0.4-1.3,0.5-1.9c0.2-0.6,0.3-1.3,0.5-1.9
                              c0.1-0.6,0.3-1.2,0.4-1.8c0.1-0.6,0.2-1.2,0.3-1.8c0.1-0.6,0.2-1.1,0.2-1.7c0.1-0.5,0.1-1.1,0.2-1.6c0-0.5,0.1-1,0.1-1.5
                              c0-0.5,0.1-0.9,0.1-1.3c0-0.4,0-0.8,0-1.2c0-0.4,0-0.7,0-1c0-0.3,0-0.5,0-0.7c0-0.2,0-0.3,0-0.4C169.9,10.1,170,10,170,10
                              s0,0.1-0.1,0.3c0,0.2-0.1,0.4-0.1,0.7c-0.1,0.3-0.1,0.6-0.2,1c-0.1,0.4-0.2,0.8-0.3,1.2c-0.1,0.4-0.2,0.9-0.3,1.3
                              c-0.1,0.5-0.3,0.9-0.4,1.4c-0.1,0.5-0.3,1-0.5,1.5c-0.2,0.5-0.4,1-0.6,1.5c-0.2,0.5-0.4,1-0.6,1.6c-0.2,0.5-0.5,1.1-0.7,1.6
                              c-0.2,0.5-0.5,1.1-0.8,1.6c-0.3,0.6-0.6,1.1-0.9,1.7c-0.3,0.6-0.6,1.1-0.9,1.7c-0.3,0.6-0.7,1.1-1,1.7c-0.3,0.6-0.7,1.1-1.1,1.7
                              c-0.4,0.6-0.7,1.1-1.1,1.7c-0.4,0.6-0.8,1.1-1.2,1.7c-0.4,0.6-0.8,1.1-1.2,1.7c-0.4,0.5-0.9,1.1-1.3,1.6c-0.4,0.5-0.9,1.1-1.4,1.6
                              c-0.5,0.5-0.9,1.1-1.4,1.6c-0.5,0.5-1,1-1.5,1.5c-0.5,0.5-1,1-1.5,1.5c-0.5,0.5-1.1,1-1.6,1.4c-0.5,0.5-1.1,0.9-1.7,1.4
                              c-0.6,0.4-1.1,0.9-1.7,1.3c-0.6,0.4-1.2,0.8-1.8,1.2c-0.6,0.4-1.2,0.8-1.8,1.2c-0.6,0.4-1.2,0.7-1.9,1.1c-0.6,0.3-1.3,0.7-1.9,1
                              c-0.6,0.3-1.3,0.6-1.9,0.9c-0.7,0.3-1.3,0.6-2,0.9c-0.7,0.3-1.3,0.5-2,0.7c-0.7,0.2-1.4,0.5-2,0.7c-0.7,0.2-1.4,0.4-2.1,0.6
                              c-0.7,0.2-1.4,0.4-2.1,0.5c-0.7,0.2-1.4,0.3-2.1,0.4c-0.7,0.1-1.4,0.3-2.1,0.4c-0.7,0.1-1.4,0.2-2.1,0.3c-0.7,0.1-1.4,0.2-2.1,0.2
                              c-0.7,0.1-1.4,0.1-2.1,0.1c-0.7,0-1.4,0.1-2.1,0.1c-0.7,0-1.4,0-2.1,0c-0.7,0-1.4-0.1-2.1-0.1c-0.7,0-1.4-0.1-2-0.1
                              c-0.7-0.1-1.3-0.1-2-0.2c-0.7-0.1-1.3-0.1-2-0.2c-0.7-0.1-1.3-0.2-2-0.3c-0.6-0.1-1.3-0.2-1.9-0.3c-0.6-0.1-1.3-0.3-1.9-0.4
                              c-0.6-0.1-1.2-0.3-1.9-0.4c-0.6-0.2-1.2-0.3-1.8-0.5c-0.6-0.2-1.2-0.4-1.8-0.5c-0.6-0.2-1.2-0.4-1.7-0.6c-0.6-0.2-1.1-0.4-1.7-0.6
                              c-1.1-0.4-2.2-0.9-3.2-1.4c-1-0.5-2-1-3-1.6c-1-0.5-1.9-1.1-2.8-1.7c-0.9-0.6-1.8-1.2-2.6-1.8c-0.8-0.6-1.6-1.3-2.4-1.9
                              c-0.8-0.7-1.5-1.3-2.2-2c-0.7-0.7-1.3-1.4-2-2.1c-0.6-0.7-1.2-1.4-1.8-2.1c-0.5-0.7-1.1-1.5-1.6-2.2c-0.5-0.7-1-1.5-1.4-2.2
                              c-0.4-0.8-0.9-1.5-1.3-2.3c-0.4-0.8-0.8-1.5-1.1-2.3c-0.3-0.8-0.7-1.5-1-2.3c-0.3-0.8-0.6-1.6-0.8-2.3c-0.2-0.8-0.5-1.6-0.7-2.3
                              c-0.2-0.8-0.4-1.5-0.6-2.3c-0.2-0.8-0.3-1.5-0.5-2.3c-0.1-0.7-0.2-1.5-0.3-2.2c-0.1-0.7-0.2-1.4-0.3-2.2c-0.1-0.7-0.1-1.4-0.2-2.1
                              c0-0.3,0-0.7-0.1-1c0-0.3,0-0.7-0.1-1c0-0.7-0.1-1.3-0.1-1.9c0-0.6,0-1.2,0-1.7c0-0.6,0-1.1,0-1.5c0-0.5,0-0.9,0-1.3
                              c0-0.4,0-0.7,0-1c0-0.3,0-0.5,0-0.7C40,10.1,40,10,40,10z"></path>
                          </svg>
                          <div className="relative p-8 sm:p-10 lg:p-12 flex flex-col items-center justify-center">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-6">
                              <FaComment className="h-8 w-8 sm:h-10 sm:w-10" />
                            </div>
                            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-center text-gray-900 dark:text-white">
                              Connect, Chat, Collaborate
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                              Your messages are securely delivered and encrypted end-to-end
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base font-semibold tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                A better way to communicate
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
                Our platform offers all the tools you need for effective communication.
              </p>
            </div>

            <div className="mt-16">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <FaComment className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Real-time messaging</p>
                  </dt>
                  <dd className="mt-4 ml-16 text-base text-gray-600 dark:text-gray-300">
                    Send and receive messages instantly with our real-time messaging system. Never miss an important conversation.
                  </dd>
                </div>

                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <FaUser className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Group chats</p>
                  </dt>
                  <dd className="mt-4 ml-16 text-base text-gray-600 dark:text-gray-300">
                    Create group chats for team discussions, family conversations, or any gathering. Collaborate with everyone in one place.
                  </dd>
                </div>

                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <FaShieldAlt className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">End-to-end encryption</p>
                  </dt>
                  <dd className="mt-4 ml-16 text-base text-gray-600 dark:text-gray-300">
                    Your privacy matters. All messages are secured with end-to-end encryption to keep your conversations private.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to start chatting?</span>
              <span className="block text-indigo-200">Join our community today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/api/auth/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Social links could go here */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
// import React from 'react';

// const ArchitectureDiagram = () => {
//   return (
//     <div className="w-full flex flex-col items-center p-4">
//       <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-6">Cross-Modal Attention Network (CMAN) with Parameter-Efficient Fine-Tuning</h2>

//         {/* Input Processing Section */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-blue-100 p-2 rounded-md w-max">Input Processing</h3>
//             <div className="flex flex-row justify-around">
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="h-20 w-20 bg-blue-200 rounded-full flex items-center justify-center mb-2">
//                   <span className="text-sm font-medium">Text</span>
//                 </div>
//                 <div className="text-xs text-center">RoBERTa Tokenizer</div>
//                 <div className="text-xs text-center text-gray-500">max_length=77</div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center mb-2">
//                   <span className="text-sm font-medium">Audio</span>
//                 </div>
//                 <div className="text-xs text-center">AST Processor</div>
//                 <div className="text-xs text-center text-gray-500">16kHz, length=10s</div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="h-20 w-20 bg-red-200 rounded-full flex items-center justify-center mb-2">
//                   <span className="text-sm font-medium">Image</span>
//                 </div>
//                 <div className="text-xs text-center">ViT Processor</div>
//                 <div className="text-xs text-center text-gray-500">224×224 pixels</div>
//               </div>
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Encoder Section with LoRA */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-purple-100 p-2 rounded-md w-max">Parameter-Efficient Encoders with LoRA</h3>
//             <div className="flex flex-row justify-around">
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-blue-100 border border-blue-300 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">RoBERTa-base</div>
//                   <div className="text-xs mb-2 bg-white p-1 rounded">Frozen Base Model (~125M params)</div>
//                   <div className="text-xs text-center mb-2">LoRA Adaptation</div>
//                   <div className="flex flex-col space-y-1">
//                     <div className="h-6 bg-blue-500 rounded text-xs text-white flex items-center justify-center">Query Projection</div>
//                     <div className="h-6 bg-blue-500 rounded text-xs text-white flex items-center justify-center">Key Projection</div>
//                     <div className="h-6 bg-blue-500 rounded text-xs text-white flex items-center justify-center">Value Projection</div>
//                     <div className="h-6 bg-blue-500 rounded text-xs text-white flex items-center justify-center">Dense Layer</div>
//                   </div>
//                   <div className="text-xs text-center mt-2">Rank=8, α=16</div>
//                   <div className="text-xs text-center mt-1">Output: 768-dim</div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-green-100 border border-green-300 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">AST</div>
//                   <div className="text-xs mb-2 bg-white p-1 rounded">MIT/ast-finetuned-audioset</div>
//                   <div className="text-xs text-center mb-2">LoRA Adaptation</div>
//                   <div className="flex flex-col space-y-1">
//                     <div className="h-6 bg-green-500 rounded text-xs text-white flex items-center justify-center">Query Projection</div>
//                     <div className="h-6 bg-green-500 rounded text-xs text-white flex items-center justify-center">Key Projection</div>
//                     <div className="h-6 bg-green-500 rounded text-xs text-white flex items-center justify-center">Value Projection</div>
//                     <div className="h-6 bg-green-500 rounded text-xs text-white flex items-center justify-center">Dense Layer</div>
//                   </div>
//                   <div className="text-xs text-center mt-2">Rank=8, α=16</div>
//                   <div className="text-xs text-center mt-1">Output: 768-dim</div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-red-100 border border-red-300 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">ViT-base-patch16</div>
//                   <div className="text-xs mb-2 bg-white p-1 rounded">google/vit-base-patch16-224</div>
//                   <div className="text-xs text-center mb-2">LoRA Adaptation</div>
//                   <div className="flex flex-col space-y-1">
//                     <div className="h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center">Query Projection</div>
//                     <div className="h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center">Key Projection</div>
//                     <div className="h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center">Value Projection</div>
//                     <div className="h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center">Dense Layer</div>
//                   </div>
//                   <div className="text-xs text-center mt-2">Rank=8, α=16</div>
//                   <div className="text-xs text-center mt-1">Output: 768-dim</div>
//                 </div>
//               </div>
//             </div>
//             <div className="text-xs text-center mt-2 bg-yellow-100 p-1 rounded">
//               Total Trainable Parameters: ~2.5M (0.57% of 435M total parameters)
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Projection Section */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-yellow-100 p-2 rounded-md w-max">Modality Projection to Unified Space</h3>
//             <div className="flex flex-row justify-around">
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Text Projection</div>
//                   <div className="flex flex-col space-y-2">
//                     <div className="h-8 bg-blue-400 rounded text-xs text-white flex items-center justify-center">Linear (768 → 512)</div>
//                     <div className="h-6 bg-blue-500 rounded text-xs text-white flex items-center justify-center">L2 Normalization</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Audio Projection</div>
//                   <div className="flex flex-col space-y-2">
//                     <div className="h-8 bg-green-400 rounded text-xs text-white flex items-center justify-center">Linear (768 → 512)</div>
//                     <div className="h-6 bg-green-500 rounded text-xs text-white flex items-center justify-center">L2 Normalization</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Image Projection</div>
//                   <div className="flex flex-col space-y-2">
//                     <div className="h-8 bg-red-400 rounded text-xs text-white flex items-center justify-center">Linear (768 → 512)</div>
//                     <div className="h-6 bg-red-500 rounded text-xs text-white flex items-center justify-center">L2 Normalization</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Unified Fusion Section */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-indigo-100 p-2 rounded-md w-max">Unified Fusion Transformer</h3>
            
//             <div className="flex flex-col items-center">
//               <div className="w-4/5 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
//                 <div className="text-center font-medium mb-3">Multi-Layer Cross-Modal Attention</div>
                
//                 {/* Stack representation */}
//                 <div className="flex justify-center mb-4">
//                   <div className="flex flex-col items-center">
//                     <div className="text-xs mb-2">Stacked Modality Embeddings</div>
//                     <div className="flex space-x-2">
//                       <div className="w-16 h-8 bg-blue-300 rounded flex items-center justify-center text-xs">Text</div>
//                       <div className="w-16 h-8 bg-green-300 rounded flex items-center justify-center text-xs">Audio</div>
//                       <div className="w-16 h-8 bg-red-300 rounded flex items-center justify-center text-xs">Image</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transformer layers */}
//                 <div className="flex flex-col space-y-3">
//                   {[1, 2, 3].map((layer) => (
//                     <div key={layer} className="bg-white border border-indigo-300 rounded-lg p-3">
//                       <div className="text-center text-sm font-medium mb-2">Layer {layer}</div>
//                       <div className="flex justify-around">
//                         <div className="text-center">
//                           <div className="h-12 w-20 bg-indigo-200 rounded-lg flex items-center justify-center mb-1">
//                             <div className="text-xs">Multi-Head<br/>Attention<br/>(8 heads)</div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="text-xs">→</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="h-12 w-20 bg-indigo-300 rounded-lg flex items-center justify-center mb-1">
//                             <div className="text-xs">Feed Forward<br/>Network<br/>(2048 dim)</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="text-xs text-center mt-3 bg-indigo-100 p-2 rounded">
//                   Dynamic handling: Single-modal, Bi-modal, Tri-modal inputs
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Output Projections */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-teal-100 p-2 rounded-md w-max">Output Projections</h3>
//             <div className="flex flex-row justify-around">
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Text Output</div>
//                   <div className="h-8 bg-blue-500 rounded text-xs text-white flex items-center justify-center">Linear (512 → 512)</div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Audio Output</div>
//                   <div className="h-8 bg-green-500 rounded text-xs text-white flex items-center justify-center">Linear (512 → 512)</div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center w-1/3 p-2">
//                 <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
//                   <div className="text-center font-medium mb-2">Image Output</div>
//                   <div className="h-8 bg-red-500 rounded text-xs text-white flex items-center justify-center">Linear (512 → 512)</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Loss Function Section */}
//         <div className="mb-8 relative">
//           <div className="border-b-2 border-gray-300 pb-4">
//             <h3 className="text-lg font-semibold mb-4 bg-orange-100 p-2 rounded-md w-max">Bidirectional Max-Margin Ranking Loss</h3>
//             <div className="flex flex-col items-center">
//               <div className="w-4/5 bg-orange-50 border border-orange-200 rounded-lg p-3">
//                 <div className="text-center font-medium mb-2">Hard Negative Mining with Margin = 0.2</div>
//                 <div className="flex flex-col space-y-3">
//                   <div className="flex justify-center">
//                     <div className="w-fit bg-orange-200 rounded-lg p-2 text-xs text-center">
//                       L = max(0, margin - s_pos + s_hard_neg)
//                     </div>
//                   </div>
//                   <div className="flex justify-around">
//                     <div className="text-center">
//                       <div className="text-xs font-medium">Text ↔ Audio</div>
//                       <div className="h-16 w-20 bg-orange-100 border border-orange-300 rounded mt-1 flex items-center justify-center">
//                         <div className="text-xs">L<sub>t,a</sub></div>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xs font-medium">Text ↔ Image</div>
//                       <div className="h-16 w-20 bg-orange-100 border border-orange-300 rounded mt-1 flex items-center justify-center">
//                         <div className="text-xs">L<sub>t,i</sub></div>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-xs font-medium">Audio ↔ Image</div>
//                       <div className="h-16 w-20 bg-orange-100 border border-orange-300 rounded mt-1 flex items-center justify-center">
//                         <div className="text-xs">L<sub>a,i</sub></div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="w-full text-center mt-1">
//                     <div className="inline-block bg-orange-300 rounded-lg p-2 text-xs">
//                       L<sub>total</sub> = (L<sub>t,a</sub> + L<sub>t,i</sub> + L<sub>a,i</sub>) / 3
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
//             <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Output Section */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4 bg-teal-100 p-2 rounded-md w-max">Unified Embedding Space & Cross-Modal Retrieval</h3>
//           <div className="flex flex-col items-center">
//             <div className="w-4/5 bg-teal-50 border border-teal-200 rounded-lg p-3">
//               <div className="text-center font-medium mb-2">512-dimensional Shared Representation</div>
//               <div className="flex justify-around mb-4">
//                 <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-xs font-medium">Text</div>
//                     <div className="text-xs">Embedding</div>
//                   </div>
//                 </div>
//                 <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-xs font-medium">Audio</div>
//                     <div className="text-xs">Embedding</div>
//                   </div>
//                 </div>
//                 <div className="w-24 h-24 bg-red-100 rounded-lg flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-xs font-medium">Image</div>
//                     <div className="text-xs">Embedding</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="text-xs font-medium mb-2">Cross-Modal Retrieval Directions</div>
//                 <div className="w-full flex flex-wrap justify-center gap-2 mb-3">
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Text→Audio</div>
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Text→Image</div>
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Audio→Text</div>
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Audio→Image</div>
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Image→Text</div>
//                   <div className="bg-teal-100 text-xs rounded-full px-3 py-1">Image→Audio</div>
//                 </div>
//                 <div className="w-full flex justify-center gap-4">
//                   <div className="bg-teal-200 text-xs rounded px-3 py-1">Recall@K (K=1,5,10)</div>
//                   <div className="bg-teal-200 text-xs rounded px-3 py-1">mAP</div>
//                   <div className="bg-teal-200 text-xs rounded px-3 py-1">Flickr8k Audio Dataset</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ArchitectureDiagram;