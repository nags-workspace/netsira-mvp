// app/admin/layout.tsx (Updated)

import { createSupabaseServerClient } from '../lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
// Import icons for the sidebar
import { LayoutDashboard, Inbox, Globe, Users, Folder, MailCheck } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: role, error } = await supabase.rpc('get_my_role');

  if (error || role !== 'admin') {
    if (error) console.error("Error fetching user role:", error);
    return notFound();
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex">
      <aside className="w-64 bg-slate-800 p-6 border-r border-slate-700 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-8">Admin Portal</h1>
        <nav className="space-y-2">
          {/* I've converted these to a reusable structure with icons */}
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />}>Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/inbox" icon={<Inbox size={18} />}>Inbox</AdminNavLink>
          
          {/* --- THIS IS THE NEW LINK FOR SUBMISSIONS --- */}
          <AdminNavLink href="/admin/submissions" icon={<MailCheck size={18} />}>Submissions</AdminNavLink>
          {/* ------------------------------------------- */}

          <AdminNavLink href="/admin/websites" icon={<Globe size={18} />}>Websites</AdminNavLink>
          <AdminNavLink href="/admin/users" icon={<Users size={18} />}>Users</AdminNavLink>
          <AdminNavLink href="/admin/categories" icon={<Folder size={18} />}>Categories</AdminNavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

// Helper component for consistent styling of nav links
function AdminNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-white font-semibold rounded-md transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}