// app/admin/submissions/page.tsx (Corrected with explicit typing)

import { createSupabaseServerClient } from '@/app/lib/supabase/server';
import SubmissionsList from './SubmissionsList';
import { SubmissionWithDetails } from './actions';

export const metadata = {
  title: 'Manage Submissions | NETSira Admin',
};

// --- THIS IS THE FIX ---
// Define a type that matches the flat structure returned by our database function.
type SubmissionRpcResult = {
  id: string;
  name: string;
  url: string;
  description: string;
  created_at: string;
  suggested_category_id: string | null;
  username: string | null;
  category_name: string | null;
}
// --- END FIX ---

async function getPendingSubmissions() {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase.rpc('get_pending_submissions_with_details');

  if (error) {
    console.error('Error fetching submissions via RPC:', error);
    return [];
  }

  // When we map over the data, we now explicitly tell TypeScript the type of 'sub'.
  // This removes the "implicitly has an 'any' type" error.
  return (data as SubmissionRpcResult[]).map((sub: SubmissionRpcResult) => ({
    id: sub.id,
    name: sub.name,
    url: sub.url,
    description: sub.description,
    created_at: sub.created_at,
    suggested_category_id: sub.suggested_category_id,
    profiles: [{ username: sub.username }],
    categories: [{ name: sub.category_name }],
  })) as SubmissionWithDetails[];
}

export default async function AdminSubmissionsPage() {
  const submissions = await getPendingSubmissions();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-6">
        Pending Website Submissions
      </h1>
      <SubmissionsList submissions={submissions} />
    </div>
  );
}