// app/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { updatePasswordAction } from '../actions/auth.actions';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);

  // --- Wrapper function to handle the form submission ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await updatePasswordAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-white">NETSira</h1>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
          Create a New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-slate-700">
          {/* Form now uses the client-side handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">New Password</label>
              <input id="password" name="password" type="password" required minLength={6} className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="6+ characters" />
            </div>

            {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}