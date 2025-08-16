// app/actions/admin.actions.ts
'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// This is a special server-only Supabase client that uses the SERVICE_ROLE_KEY
// It's necessary because only an admin should be able to modify websites.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Action to add a new website ---
export async function addWebsiteAction(formData: FormData) {
  const displayName = formData.get('display_name') as string;
  const domainName = formData.get('domain_name') as string;
  const description = formData.get('description') as string;
  
  if (!displayName || !domainName) {
    return { error: 'Display Name and Domain Name are required.' };
  }

  const { error } = await supabaseAdmin.from('websites').insert({
    display_name: displayName,
    domain_name: domainName,
    description: description,
    is_verified: false, // Websites start as unverified by default
  });

  if (error) {
    console.error("Error adding website:", error);
    return { error: error.message };
  }
  revalidatePath('/admin/websites');
}

// --- Action to toggle the 'is_verified' status ---
// --- Action to toggle the 'is_verified' status ---
export async function toggleVerifyAction(websiteId: number, currentState: boolean) {
  // --- THIS IS THE FIX ---
  // We first need to get the website's domain name to revalidate its specific page.
  const { data: website, error: fetchError } = await supabaseAdmin
    .from('websites')
    .select('domain_name')
    .eq('id', websiteId)
    .single();

  if (fetchError) {
    console.error("Error fetching website for revalidation:", fetchError);
    return { error: fetchError.message };
  }
  
  const { error } = await supabaseAdmin
    .from('websites')
    .update({ is_verified: !currentState })
    .eq('id', websiteId);

  if (error) {
    console.error("Error toggling verification:", error);
    return { error: error.message };
  }
  
  // Now, revalidate ALL the paths where this data is displayed.
  revalidatePath('/admin/websites');      // The admin list page
  revalidatePath('/');                     // The homepage
  revalidatePath(`/site/${website.domain_name}`); // The specific website's profile page
  // We could also revalidate category pages, but revalidating the homepage is often enough.
}

// --- Action to delete a website ---
export async function deleteWebsiteAction(websiteId: number) {
  const { error } = await supabaseAdmin
    .from('websites')
    .delete()
    .eq('id', websiteId);

  if (error) {
    console.error("Error deleting website:", error);
    return { error: error.message };
  }
  revalidatePath('/admin/websites');
}

// --- Action to UPDATE an existing website ---
export async function updateWebsiteAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const displayName = formData.get('display_name') as string;
  const domainName = formData.get('domain_name') as string;
  const description = formData.get('description') as string;

  if (!id || !displayName || !domainName) {
    // This should ideally return an error to the UI
    console.error("Missing required fields for update.");
    return;
  }

  const { error } = await supabaseAdmin
    .from('websites')
    .update({
      display_name: displayName,
      domain_name: domainName,
      description: description,
    })
    .eq('id', id);
  
  if (error) {
    console.error("Error updating website:", error);
    // Handle error, maybe redirect with an error message
    return;
  }

  // Revalidate the path to ensure the list is updated
  revalidatePath('/admin/websites');
  // Redirect the user back to the main websites list
  redirect('/admin/websites');
}

// --- Action to DELETE a user ---
export async function deleteUserAction(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Error deleting user:", error);
    return { error: error.message };
  }
  revalidatePath('/admin/users');
}

// --- Action to UPDATE a user's role (promote/demote) ---
export async function updateUserRoleAction(userId: string, newRole: 'admin' | 'user') {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { user_metadata: { user_role: newRole } }
  );

  if (error) {
    console.error("Error updating user role:", error);
    return { error: error.message };
  }
  revalidatePath('/admin/users');
}




// --- Action to ADD a new category ---
export async function addCategoryAction(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) { return { error: 'Category name is required.' }; }

  const { error } = await supabaseAdmin.from('categories').insert({ name });
  if (error) {
    console.error("Error adding category:", error);
    if (error.code === '23505') { // Postgres code for unique violation
        return { error: 'A category with this name already exists.' };
    }
    return { error: error.message };
  }
  revalidatePath('/admin/categories');
}

// --- Action to DELETE a category ---
export async function deleteCategoryAction(categoryId: number) {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', categoryId);
  if (error) {
    console.error("Error deleting category:", error);
    return { error: error.message };
  }
  revalidatePath('/admin/categories');
}

// --- Action to UPDATE a category's name ---
export async function updateCategoryAction(formData: FormData) {
    const id = Number(formData.get('id'));
    const name = formData.get('name') as string;
    if (!id || !name) { return { error: 'Missing required data.' }; }
    
    const { error } = await supabaseAdmin.from('categories').update({ name }).eq('id', id);
    if (error) {
        console.error("Error updating category:", error);
        return { error: error.message };
    }
    revalidatePath('/admin/categories');
}




// --- Action to UPDATE the categories for a single website ---
export async function updateWebsiteCategoriesAction(websiteId: number, categoryIds: number[]) {
  // This is a transaction: a set of operations that must all succeed or all fail.
  try {
    // 1. Delete all existing category links for this website.
    // This is the simplest way to handle additions and removals.
    const { error: deleteError } = await supabaseAdmin
      .from('website_categories')
      .delete()
      .eq('website_id', websiteId);

    if (deleteError) throw deleteError;

    // 2. If the user selected any new categories, insert them.
    if (categoryIds.length > 0) {
      const newLinks = categoryIds.map(catId => ({
        website_id: websiteId,
        category_id: catId,
      }));
      
      const { error: insertError } = await supabaseAdmin
        .from('website_categories')
        .insert(newLinks);

      if (insertError) throw insertError;
    }

    // 3. Revalidate the path to show the updated categories.
    revalidatePath('/admin/websites');
    return { success: true };

  } catch (error: any) {
    console.error("Error updating website categories:", error);
    return { error: error.message };
  }
}



// --- Action to FETCH a single contact message by ID ---
export async function getContactMessageById(messageId: number) {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) {
    console.error("Error fetching message:", error);
    return null;
  }
  return data;
}


// --- UPDATED Action to SEND a reply ---
export async function sendReplyAction(formData: FormData) {
  'use server';
  const recipientEmail = formData.get('recipientEmail') as string;
  const recipientName = formData.get('recipientName') as string;
  const originalMessage = formData.get('originalMessage') as string;
  const replyMessage = formData.get('replyMessage') as string;
  const messageId = formData.get('messageId') as string;

  try {
    const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: "sendReply",
            secretKey: process.env.APPS_SCRIPT_SECRET_KEY!,
            params: { messageId, recipientEmail, recipientName, originalMessage, replyMessage }
        })
    });

    const result = await response.json();
    if (result.status !== 'success') {
        throw new Error(result.message);
    }
    
    revalidatePath('/admin/inbox');
    revalidatePath(`/admin/inbox/${messageId}`);
    // Redirect back to the main inbox on success
    redirect('/admin/inbox');

  } catch (error: any) { // <-- THE MISSING CATCH BLOCK
    console.error("Failed to send reply via Google Apps Script:", error);
    // Redirect back to the message page with an error
    return redirect(`/admin/inbox/${messageId}?error=${encodeURIComponent(error.message)}`);
  }
}