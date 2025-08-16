// app/components/Navbar.tsx

import Link from 'next/link';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { signOutAction } from '../actions/auth.actions';
import { User, Search } from 'lucide-react'; // Make sure Search is imported

export default async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const username = user?.user_metadata?.username;

  return (
    // Main header with dark theme
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Left side: Logo and maybe categories link */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-white">
            NETSira
          </Link>
          <Link href="/categories" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Categories
          </Link>
        </div>

        {/* --- THIS IS THE SEARCH BAR --- */}
        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="w-full max-w-lg lg:max-w-xs">
            {/* This form correctly sends the user to /search with their query */}
            <form action="/search" method="GET" className="relative">
              <input
                type="search"
                name="q"
                id="search"
                className="block w-full rounded-md border-0 bg-slate-700 py-2 pl-10 pr-3 text-slate-100 placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Search websites..."
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
            </form>
          </div>
        </div>

        {/* Right side: User auth status */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/profile" className="hidden sm:flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <User size={16} />
                <span>{username || 'Profile'}</span>
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}