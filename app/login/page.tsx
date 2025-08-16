// app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logInAction } from '../actions/auth.actions';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const result = await logInAction(formData);
    if (result && result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-white">
          NETSira
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Log in to your account to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>


            <div className="flex items-center justify-end">
            <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-400 hover:underline">
              Forgot your password?
            </Link>
            </div>
            </div>

            {errorMessage && (<p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md border border-red-500/30">{errorMessage}</p>)}
            
            <div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors">
                <LogIn size={16} /> Log In
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}