// app/submit-website/actions.ts (Corrected)
'use server';

import { createSupabaseServerClient as createClient } from '@/app/lib/supabase/server'; // <-- CORRECTED IMPORT
import { revalidatePath } from 'next/cache';

export async function submitWebsiteAction(formData: FormData) {
  const supabase = await createClient(); // <-- Added await, as our function is async

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to submit a website.' };
  }

  // ... (rest of the function is the same)
  const rawData = {
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    description: formData.get('description') as string,
    suggested_category_id: formData.get('suggested_category_id') as string,
    submitted_by: formData.get('submitted_by') as string,
  };

  if (!rawData.name || !rawData.url || !rawData.description) {
    return { error: 'Name, URL, and Description are required.' };
  }

  if (rawData.submitted_by !== user.id) {
    return { error: 'Authentication error. Please try again.' };
  }
  
  try {
    new URL(rawData.url);
  } catch (_) {
    return { error: 'Please provide a valid URL (e.g., https://example.com).' };
  }

  const dataToInsert = {
    name: rawData.name,
    url: rawData.url,
    description: rawData.description,
    submitted_by: rawData.submitted_by,
    suggested_category_id: rawData.suggested_category_id || null,
  };

  const { error } = await supabase
    .from('website_submissions')
    .insert(dataToInsert);

  if (error) {
    console.error('Supabase submission error:', error);
    if (error.code === '23505') {
        return { error: 'This website URL has already been submitted or added.' };
    }
    return { error: 'Database error: Could not submit website. Please try again later.' };
  }
  
  return { success: true };
}