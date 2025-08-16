// app/contact/page.tsx

import type { Metadata } from 'next';
import { Send } from 'lucide-react';
import { createSupabaseServerClient } from '../lib/supabase/server'; // Import the server client helper
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Contact Us | NETSira',
  description: 'Get in touch with the NETSira team.',
};

// --- UPDATED Server Action ---

// in app/contact/page.tsx

// in app/contact/page.tsx

// ... (imports)

// in app/contact/page.tsx

async function submitContactForm(formData: FormData) {
    'use server';

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const message = formData.get('message') as string;
    // --- THIS IS THE FIX ---
    const name = user ? (user.user_metadata?.username || 'Authenticated User') : formData.get('name') as string;
    const email = user ? user.email! : formData.get('email') as string;

    if (!name || !email || !message) {
        return redirect('/contact?error=Please fill out all required fields.');
    }

    try {
        const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: "addMessage",
                secretKey: process.env.APPS_SCRIPT_SECRET_KEY!,
                params: { name, email, message, userId: user?.id }
            })
        });

        const result = await response.json();
        if (result.status !== 'success') {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("Failed to send to Apps Script:", error);
        return redirect('/contact?error=Could not send message.');
    }

    redirect('/contact?success=true');
}

// ... (rest of the file)


// --- UPDATED Page Component ---
// It's now an 'async' server component.
export default async function ContactPage({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <main className="max-w-xl mx-auto px-4 py-16 sm:py-24">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="mt-4 text-lg text-slate-400">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div className="bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-slate-700">
            {searchParams.success ? (
                // --- Success Message ---
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-400">Thank You!</h3>
                    <p className="mt-2 text-slate-300">Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
            ) : (
                // --- Contact Form ---
                <form action={submitContactForm} className="space-y-6">
                    {user ? (
                        // --- Logged-In View ---
                        <div className="text-sm text-slate-400 bg-slate-700/50 p-3 rounded-md text-center">
                            You are submitting this form as <span className="font-semibold text-slate-200">{user.user_metadata?.username || user.email}</span>.
                        </div>
                    ) : (
                        // --- Logged-Out View ---
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
                                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
                                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </>
                    )}
                    
                    {/* Message and Submit button are always visible */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                        <textarea name="message" id="message" rows={5} required className="mt-1 block w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    {searchParams.error && <p className="text-sm text-red-400">{searchParams.error}</p>}
                    <div>
                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors">
                            <Send size={16} /> Send Message
                        </button>
                    </div>
                </form>
            )}
        </div>
      </main>
    </div>
  );
}