// app/actions/auth.actions.ts
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- THIS IS THE CORRECTED HELPER FUNCTION ---
// It now includes the 'set' and 'remove' methods, allowing actions to handle cookies.
async function createSupabaseActionClient() {
    const cookieStore = await cookies(); // Using await is correct
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                // Add the missing methods:
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}

// --- SIGN UP ACTION ---
// in app/actions/auth.actions.ts

export async function signUpAction(formData: FormData) {
  'use server';
  // ... (form data retrieval and validation is the same)
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const terms = formData.get('terms');

  if (!email || !password || !username || terms !== 'on') {
    return { error: 'Please fill out all fields and agree to the terms.' };
  }

  const supabase = await createSupabaseActionClient();

  const { data: existingProfile } = await supabase
    .from('profiles').select('username').eq('username', username).single();
  if (existingProfile) {
    return { error: 'This username is already taken.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username } },
  });

  if (error) {
    console.error('Sign up error:', error.message);
    if (error.message.includes('User already registered')) {
        return { error: 'A user with this email address already exists.' };
    }
    return { error: 'Could not create account.' };
  }
  
  // With email confirmation disabled, this redirect now works perfectly.
  return redirect('/');
}

// --- LOG IN ACTION ---
export async function logInAction(formData: FormData) {
  // ... (form data logic is the same)
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createSupabaseActionClient(); // <--- Added await

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return { error: 'Invalid email or password.' };
  }

  redirect('/');
}

// --- SIGN OUT ACTION ---
export async function signOutAction() {
  const supabase = await createSupabaseActionClient(); // <--- Added await
  await supabase.auth.signOut();
  redirect('/login');
}



// in app/actions/auth.actions.ts

// Remove the import for 'redirect' at the top of the file
// import { redirect } from 'next/navigation';

// ... other code ...

export async function deleteReviewAction(reviewId: number, domain: string) {
  'use server';

  const supabase = await createSupabaseActionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { throw new Error('You must be logged in to delete a review.'); }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Delete review error:", error.message);
    return redirect(`/site/${domain}?error=true`);
  }
  
  // --- THIS IS THE FIX ---
  // Redirect back to the page after deletion to force a full refresh.
  return redirect(`/site/${domain}`);
}






// in app/actions/auth.actions.ts

// ... (your other actions)

// --- ADMIN PROMOTION ACTION ---
export async function promoteToAdmin(formData: FormData) {
    'use server';

    const userId = formData.get('userId') as string;
    const secret = formData.get('secret') as string;

    // Security check: Only proceed if the secret key matches.
    if (secret !== process.env.ADMIN_SECRET_KEY) {
        console.error("Invalid admin secret provided.");
        return;
    }

    const supabase = await createSupabaseActionClient();

    // Use the Admin client to update a user's claims. This requires your SERVICE_ROLE_KEY.
    // Go to Supabase Project Settings > API > Project API keys, and copy the 'service_role' key.
    // Add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await adminSupabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { user_role: 'admin' } }
    );

    if (error) {
        console.error("Error promoting user to admin:", error.message);
    } else {
        console.log("Successfully promoted user to admin:", data.user.email);
    }
}





// --- UPDATED Action to REQUEST a password reset ---
export async function requestPasswordResetAction(formData: FormData) {
  'use server'; // Good to add this explicitly
  const email = formData.get('email') as string;
  if (!email) {
    return { error: 'Please provide your email address.' };
  }
  const supabase = await createSupabaseActionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });
  if (error) {
    console.error("Password reset error:", error);
    return { error: 'Could not send password reset email.' };
  }
  return { message: 'If an account exists for this email, a password reset link has been sent.' };
}

// --- UPDATED Action to UPDATE the password ---
export async function updatePasswordAction(formData: FormData) {
  'use server';
  const password = formData.get('password') as string;
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }
  const supabase = await createSupabaseActionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("Update password error:", error.message);
    // Let's provide a more user-friendly message for common errors
    if (error.message.includes('weak password')) {
      return { error: 'Password is too weak. Please choose a stronger one.' };
    }
    return { error: 'Failed to update password. The link may have expired.' };
  }
  // If successful, redirect the user from the server action.
  return redirect('/login?message=Your password has been reset successfully. Please log in.');
}