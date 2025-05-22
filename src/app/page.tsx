
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
// import { createServerClient } from './api/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import './globals.css';
// import { FaComment, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

// export default async function HomePage() {
//   const supabase = createServerClient();
  
//   // Check if user is authenticated
//   const { data: { session } } = await supabase.auth.getSession();
  
//   // If logged in, redirect to chat
//   if (session) {
//     redirect('/chat');
//   }
  
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Hero section */}
//       <main className="flex-grow">
//         <div className="relative bg-white overflow-hidden">
//           <div className="max-w-7xl mx-auto">
//             <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
//               <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
//                 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                   <div className="lg:grid lg:grid-cols-2 lg:gap-8">
//                     <div>
//                       <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//                         <span className="block xl:inline">Modern messaging for</span>
//                         <span className="block text-primary-color xl:inline"> everyone</span>
//                       </h1>
//                       <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
//                         Stay connected with friends, family, and colleagues. Our chat platform provides 
//                         a simple and intuitive way to communicate in real-time.
//                       </p>
//                       <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
//                         <div className="rounded-md shadow">
//                           <Link 
//                             href="/api/auth/login" 
//                             className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-color hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
//                           >
//                             <FaSignInAlt className="mr-2" />
//                             Login
//                           </Link>
//                         </div>
//                         <div className="mt-3 sm:mt-0 sm:ml-3">
//                           <Link 
//                             href="/api/auth/signup" 
//                             className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-color bg-primary-light hover:bg-primary-lighter md:py-4 md:text-lg md:px-10"
//                           >
//                             <FaUserPlus className="mr-2" />
//                             Sign up
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features section */}
//         <div className="py-12 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="lg:text-center">
//               <h2 className="text-base text-primary-color font-semibold tracking-wide uppercase">Features</h2>
//               <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//                 A better way to communicate
//               </p>
//               <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
//                 Our platform offers all the tools you need for effective communication.
//               </p>
//             </div>

//             <div className="mt-10">
//               <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
//                 <div className="relative">
//                   <dt>
//                     <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-color text-white">
//                       <FaComment className="h-6 w-6" />
//                     </div>
//                     <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time messaging</p>
//                   </dt>
//                   <dd className="mt-2 ml-16 text-base text-gray-500">
//                     Send and receive messages instantly with our real-time messaging system.
//                   </dd>
//                 </div>

//                 <div className="relative">
//                   <dt>
//                     <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-color text-white">
//                       <FaUser className="h-6 w-6" />
//                     </div>
//                     <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Group chats</p>
//                   </dt>
//                   <dd className="mt-2 ml-16 text-base text-gray-500">
//                     Create group chats for team discussions, family conversations, or any gathering.
//                   </dd>
//                 </div>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white">
//         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
//           <div className="flex justify-center space-x-6 md:order-2">
//             {/* Footer links if needed */}
//           </div>
//           <div className="mt-8 md:mt-0 md:order-1">
//             <p className="text-center text-base text-gray-400">
//               &copy; {new Date().getFullYear()} Chat App. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }