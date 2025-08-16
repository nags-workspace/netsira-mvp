// app/submit-website/page.tsx (Corrected)

import { createSupabaseServerClient as createClient } from '@/app/lib/supabase/server'; // <-- CORRECTED IMPORT
import { redirect } from 'next/navigation';
import SubmitWebsiteForm from '@/app/submit-website/SubmitWebsiteForm';
import Link from 'next/link';

export const metadata = {
  title: 'Submit a Website | NETSira',
  description: 'Contribute to the NETSira platform by submitting a new website for review.',
};

export default async function SubmitWebsitePage() {
  const supabase = await createClient(); // <-- Added await, as our function is async

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login?message=Please log in to submit a website&redirectTo=/submit-website');
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Submit a Website</h1>
        <p className="text-gray-400 mt-2">
          Help grow our collection. Submissions are reviewed by our team before publishing.
        </p>
      </div>
      
      <SubmitWebsiteForm user={user} categories={categories || []} />

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>By submitting, you agree to our <Link href="/terms" className="underline hover:text-indigo-400">Terms of Service</Link>.</p>
      </div>
    </div>
  );
}