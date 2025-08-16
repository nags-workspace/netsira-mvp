// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- IMPORT the new Footer component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NETSira - Website Reviews',
  description: 'Find and share reviews for your favorite websites.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      {/* 
        This body structure ensures the footer sticks to the bottom,
        even on pages with very little content.
      */}
      <body className={`${inter.className} bg-slate-900 text-slate-100 flex flex-col min-h-screen`}>
        <Navbar />
        {/* The 'flex-grow' class makes the main content area expand to fill all available space */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer /> {/* <-- RENDER the new Footer component here */}
      </body>
    </html>
  );
}