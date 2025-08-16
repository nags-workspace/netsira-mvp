// app/submit-website/SubmitWebsiteForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { submitWebsiteAction } from '@/app/submit-website/actions'; // <-- Corrected import path
import { AlertTriangle, CheckCircle } from 'lucide-react';
interface SubmitWebsiteFormProps {
  user: User;
  categories: { id: string; name: string }[];
}

export default function SubmitWebsiteForm({ user, categories }: SubmitWebsiteFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitWebsiteAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Submission successful! Thank you for your contribution. Redirecting...');
      // Reset form or redirect
      setTimeout(() => {
        router.push('/'); // Redirect to homepage after a short delay
      }, 2000);
    }
    
    setIsPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800/50 p-8 rounded-lg shadow-lg space-y-6 border border-gray-700"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Website Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g., Vercel"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
          Website URL
        </label>
        <input
          type="url"
          id="url"
          name="url"
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="https://vercel.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="A brief summary of what the website offers."
        />
      </div>

      <div>
        <label htmlFor="suggested_category_id" className="block text-sm font-medium text-gray-300 mb-1">
          Suggest a Category (Optional)
        </label>
        <select
          id="suggested_category_id"
          name="suggested_category_id"
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Hidden input to pass the user ID */}
      <input type="hidden" name="submitted_by" value={user.id} />

      {error && (
        <div className="flex items-center gap-x-2 rounded-md bg-red-900/50 p-3 text-sm text-red-300 border border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-x-2 rounded-md bg-green-900/50 p-3 text-sm text-green-300 border border-green-800">
          <CheckCircle className="h-4 w-4" />
          <p>{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !!success}
        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
}