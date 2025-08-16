// app/components/Footer.tsx (Updated)

import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram, Facebook, Mail, Youtube } from 'lucide-react';
import { createSupabaseServerClient } from '@/app/lib/supabase/server'; // <-- Import our server client

export default async function Footer() { // <-- Make the component async
  const currentYear = new Date().getFullYear();
  
  // <-- Fetch user session to make the link conditional
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white hover:text-slate-200 transition-colors">
              NETSira
            </Link>
            <p className="text-slate-400 text-sm">
              Community-driven website reviews and ratings you can trust.
            </p>
          </div>

          {/* Column 2 & 3: Navigation Links */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Discover</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/" className="text-base text-slate-400 hover:text-white">Home</Link></li>
                <li><Link href="/categories" className="text-base text-slate-400 hover:text-white">Categories</Link></li>
                {/* --- NEW: Add the "Submit a Website" link here --- */}
                <li>
                  <Link 
                    href={user ? "/submit-website" : "/login?redirectTo=/submit-website"} 
                    className="text-base text-slate-400 hover:text-white"
                  >
                    Submit a Website
                  </Link>
                </li>
                {/* ---------------------------------------------------- */}
                <li><Link href="/about" className="text-base text-slate-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-base text-slate-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/legal/privacy" className="text-base text-slate-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-base text-slate-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="md:col-span-1">
            {/* ... (rest of the footer is unchanged) ... */}
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Stay Updated</h3>
            <p className="mt-4 text-base text-slate-400">Get the latest news and featured sites sent to your inbox.</p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input type="email" name="email-address" id="email-address" autoComplete="email" required className="w-full min-w-0 appearance-none rounded-md border-0 bg-slate-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6" placeholder="Enter your email" />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button type="submit" className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom section with copyright and social links */}
        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
            {/* ... (rest of the footer is unchanged) ... */}
            <p className="text-sm text-slate-400 text-center md:text-left">
            &copy; {currentYear} NETSira. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="mailto:nag@gmail.com" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">Email</span><Mail /></a>
            <a href="#" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">Twitter</span><Twitter /></a>
            <a href="#" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">Instagram</span><Instagram /></a>
            <a href="#" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">Facebook</span><Facebook /></a>
            <a href="#" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">LinkedIn</span><Linkedin /></a>
            <a href="#" className="text-slate-400 hover:text-white" target='_blank'><span className="sr-only">YouTube</span><Youtube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}