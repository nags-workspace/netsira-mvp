// app/admin/submissions/actions.ts (FINAL & FULLY TYPE-SAFE)
'use server';

import { createSupabaseServerClient } from '@/app/lib/supabase/server';
import { createSupabaseAdminClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Type definition is correct and does not need to change.
export type SubmissionWithDetails = {
  id: string;
  name: string;
  url: string;
  description: string;
  created_at: string;
  profiles: { username: string | null; }[] | null;
  categories: { name: string | null; }[] | null;
  suggested_category_id: string | null;
};

// --- APPROVE ACTION (already correct, but included for completeness) ---
export async function approveSubmissionAction(submission: SubmissionWithDetails) {
  const supabase = await createSupabaseServerClient();
  const { data: role, error: rpcError } = await supabase.rpc('get_my_role');
  if (rpcError || role !== 'admin') {
    return { error: 'Unauthorized action.' };
  }

  const rootDomain = extractRootDomain(submission.url);
  if (!rootDomain) {
    return { error: `The submitted URL "${submission.url}" is invalid.` };
  }

  const adminSupabase = createSupabaseAdminClient();

  const { data: newWebsite, error: insertWebsiteError } = await adminSupabase
    .from('websites')
    .insert({
      display_name: submission.name,
      domain_name: rootDomain,
      description: submission.description,
      is_verified: true,
    })
    .select('id')
    .single();
  if (insertWebsiteError) {
    console.error('Error inserting new website:', insertWebsiteError);
    return { error: 'Failed to create the new website. The URL might already exist.' };
  }

  if (submission.suggested_category_id) {
    const { error: insertCategoryLinkError } = await adminSupabase
      .from('website_categories')
      .insert({
        website_id: newWebsite.id,
        category_id: submission.suggested_category_id,
      });
    if (insertCategoryLinkError) {
      console.error('Error linking category:', insertCategoryLinkError);
      await adminSupabase.from('websites').delete().eq('id', newWebsite.id);
      return { error: 'Website created, but failed to link category. Rolled back.' };
    }
  }

  const { error: updateSubmissionError } = await adminSupabase
    .from('website_submissions')
    .update({ status: 'approved' })
    .eq('id', submission.id);
  if (updateSubmissionError) {
    console.error('Error updating submission status:', updateSubmissionError);
    return { error: 'Website approved, but failed to update submission status.' };
  }

  revalidatePath('/admin/submissions');
  revalidatePath('/admin/websites');
  return { success: `Website "${submission.name}" has been approved and published.` };
}

// --- THIS IS THE FIX: The REJECT ACTION with explicit returns on all paths ---
export async function rejectSubmissionAction(submissionId: string) {
    const supabase = await createSupabaseServerClient();
    const { data: role, error: rpcError } = await supabase.rpc('get_my_role');
    if (rpcError || role !== 'admin') {
        return { error: 'Unauthorized action.' };
    }

    const adminSupabase = createSupabaseAdminClient();
    const { error } = await adminSupabase
        .from('website_submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

    if (error) {
        console.error('Error rejecting submission:', error);
        return { error: 'Failed to reject the submission.' };
    }

    revalidatePath('/admin/submissions');
    return { success: 'Submission has been rejected.' };
}
// --- END FIX ---



// --- NEW HELPER FUNCTION ---
/**
 * Takes a full URL string and returns the root domain.
 * e.g., "https://www.google.com/search?q=test" -> "google.com"
 * @param {string} url The full URL to process.
 * @returns {string | null} The cleaned root domain or null if invalid.
 */
function extractRootDomain(url: string): string | null {
  try {
    // The URL constructor is a robust way to parse URLs.
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;

    // Remove "www." from the beginning of the hostname if it exists.
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    
    return hostname;
  } catch (error) {
    console.error("Invalid URL format:", error);
    return null; // Return null for invalid URLs
  }
}