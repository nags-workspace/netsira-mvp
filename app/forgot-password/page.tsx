// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction } from '../actions/auth.actions';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Wrapper function to handle the form submission ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const result = await requestPasswordResetAction(formData);

    if (result?.error) {
      setError(result.error);
    }
    if (result?.message) {
      setMessage(result.message);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-white">NETSira</h1>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
          Forgot Your Password?
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter your email and we'll send a reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-slate-700">
          {/* Form now uses the client-side handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>

            {message && <p className="text-sm text-green-400 bg-green-900/50 p-3 rounded-md">{message}</p>}
            {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Send Reset Link
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-slate-400">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-blue-400 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}