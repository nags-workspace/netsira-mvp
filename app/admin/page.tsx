// app/admin/page.tsx

import { createSupabaseServerClient, createSupabaseAdminClient } from '../lib/supabase/server';
import { Mail, UserCircle, Globe, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// --- Types for our dashboard data ---
type StatCounts = { websites: number; reviews: number; users: number; };
type RecentReview = { id: number; comment: string; websites: { display_name: string; domain_name: string; }; profiles: { username: string; } | null; };
type RecentWebsite = { id: number; display_name: string; };
type ContactMessage = { id: string; name: string; email: string; message: string; timestamp: string; status: string; };


// --- Data fetching functions ---

async function getStats(): Promise<StatCounts> {
    const supabase = await createSupabaseServerClient();
    const supabaseAdmin = createSupabaseAdminClient();
    const { count: websitesCount } = await supabase.from('websites').select('*', { count: 'exact', head: true });
    const { count: reviewsCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
    const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) console.error("Error fetching user count for stats:", userError);
    return { websites: websitesCount ?? 0, reviews: reviewsCount ?? 0, users: usersData?.users.length ?? 0, };
}

async function getRecentReviews(): Promise<RecentReview[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('reviews').select('*, websites(display_name, domain_name), profiles(username)').order('created_at', { ascending: false }).limit(5);
    if (error) { console.error("Error fetching recent reviews:", error); return []; }
    return data ?? [];
}

async function getRecentWebsites(): Promise<RecentWebsite[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('websites').select('*').order('id', { ascending: false }).limit(5);
    if (error) { console.error("Error fetching recent websites:", error); return []; }
    return data ?? [];
}

// --- THIS IS THE CORRECTED FUNCTION ---
// It now fetches all messages from our Google Apps Script webhook.
async function getContactMessages(): Promise<ContactMessage[]> {
    if (!process.env.GOOGLE_APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SECRET_KEY) {
        console.error("Missing Google Apps Script environment variables for admin dashboard.");
        return [];
    }
    try {
        const res = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: "getAllMessages",
                secretKey: process.env.APPS_SCRIPT_SECRET_KEY,
            }),
            next: { revalidate: 10 } // Re-fetch every 10 seconds to get new messages
        });

        const result = await res.json();
        if (result.status !== 'success') {
            console.error("Error from Apps Script (getAllMessages):", result.message);
            return [];
        }
        return result.data ?? [];
    } catch (error) {
        console.error("Failed to fetch contact messages:", error);
        return [];
    }
}


export default async function AdminDashboardPage() {
  const [stats, recentReviews, recentWebsites, contactMessages] = await Promise.all([
    getStats(),
    getRecentReviews(),
    getRecentWebsites(),
    getContactMessages()
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats at a Glance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-4">
          <Globe className="w-10 h-10 text-blue-400"/>
          <div><p className="text-sm text-slate-400">Total Websites</p><p className="text-2xl font-bold">{stats.websites}</p></div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-4">
          <MessageSquare className="w-10 h-10 text-green-400"/>
          <div><p className="text-sm text-slate-400">Total Reviews</p><p className="text-2xl font-bold">{stats.reviews}</p></div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center gap-4">
          <Users className="w-10 h-10 text-amber-400"/>
          <div><p className="text-sm text-slate-400">Total Users</p><p className="text-2xl font-bold">{stats.users}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Recent Reviews Panel */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold p-4 border-b border-slate-700">Recent Reviews</h2>
            <div className="p-4 space-y-4">
              {recentReviews.length > 0 ? recentReviews.map(review => (
                <div key={review.id} className="bg-slate-700/50 p-3 rounded-md">
                  <p className="text-slate-300 text-sm truncate">{review.comment}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    by <span className="font-semibold text-slate-200">{review.profiles?.username || 'Anonymous'}</span> on <Link href={`/site/${review.websites.domain_name}`} className="text-blue-400 hover:underline">{review.websites.display_name}</Link>
                  </p>
                </div>
              )) : <p className="text-slate-400 text-center py-4">No recent reviews.</p>}
            </div>
          </div>
          
          {/* Recent Websites Panel */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold p-4 border-b border-slate-700">Recently Added Websites</h2>
            <ul className="divide-y divide-slate-700 p-2">
              {recentWebsites.length > 0 ? recentWebsites.map(site => (
                <li key={site.id} className="p-2 flex justify-between items-center">
                  <span className="font-medium text-slate-200">{site.display_name}</span>
                  <Link href={`/admin/websites/edit/${site.id}`} className="text-xs text-blue-400 hover:underline">Edit</Link>
                </li>
              )) : <p className="text-slate-400 text-center py-4">No recent websites.</p>}
            </ul>
          </div>
        </div>

        {/* --- CORRECTED Contact Submissions Panel --- */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold p-4 border-b border-slate-700 flex items-center gap-2"><Mail size={20} /> Contact Submissions</h2>
          <div className="p-4 space-y-4">
            {contactMessages.length > 0 ? contactMessages.map((msg) => (
              <Link key={msg.id} href={`/admin/inbox/${msg.id}`} className="block bg-slate-700/50 p-4 rounded-md hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-slate-200 flex items-center gap-2 text-sm"><UserCircle size={16} /> {msg.name} ({msg.email})</p>
                  <p className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleDateString()}</p>
                </div>
                <p className="text-slate-300 text-sm truncate">{msg.message}</p>
              </Link>
            )) : <p className="text-slate-400 text-center py-4">No new messages.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}