// import './globals.css';
// import global
import './globals.css'

import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import AuthProvider from './api/components/auth/authprovider';
// import AuthProvider from './components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat Application',
  description: 'A modern chat application built with Next.js, Tailwind CSS, and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}