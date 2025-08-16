// app/admin/users/page.tsx

import { createClient } from '@supabase/supabase-js';
import { Users } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { UserActions } from './UserActions';
import { createSupabaseServerClient } from '../../../app/lib/supabase/server';
import { PaginationControls } from '../../../app/components/PaginationControls'; // 1. IMPORT Pagination

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 2. DEFINE how many users to show per page
const ITEMS_PER_PAGE = 10;

// 3. UPDATE the data fetching function to handle pagination
async function getUsers(page: number) {
    // The listUsers method uses 'page' (1-indexed) and 'perPage'
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: page,
        perPage: ITEMS_PER_PAGE,
    });

    if (error) {
        console.error("Error fetching users:", error);
        return { users: [], hasNextPage: false };
    }

    // Check if there might be a next page by seeing if we received a full page of results
    const hasNextPage = data.users.length === ITEMS_PER_PAGE;
    
    return {
        users: data.users,
        hasNextPage: hasNextPage,
    };
}

// 4. UPDATE the page component to accept searchParams
export default async function ManageUsersPage({ searchParams }: { searchParams: { page?: string } }) {
    // Get the current page from the URL, defaulting to 1
    const page = Number(searchParams.page ?? '1');
    const { users, hasNextPage } = await getUsers(page);
    
    const supabase = await createSupabaseServerClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Users size={28} /> Manage Users
                </h1>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Email</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Username</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Last Sign In</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((user: User) => (
                            <tr key={user.id} className="hover:bg-slate-800/50">
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-white">{user.email}</td>
                                <td className="px-3 py-4 text-sm text-slate-300">{user.user_metadata?.username || 'N/A'}</td>
                                <td className="px-3 py-4 text-sm text-slate-300">
                                    {user.user_metadata?.user_role === 'admin' ? (
                                        <span className="font-semibold text-amber-400">Admin</span>
                                    ) : (
                                        <span>User</span>
                                    )}
                                </td>
                                <td className="px-3 py-4 text-sm text-slate-400">
                                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                                </td>
                                <td className="relative py-4 pl-3 pr-6 text-right text-sm font-medium">
                                    {currentUser && <UserActions userId={user.id} userRole={user.user_metadata?.user_role} currentUserId={currentUser.id} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* 5. RENDER the pagination controls at the bottom */}
            <PaginationControls
                hasNextPage={hasNextPage}
                hasPrevPage={page > 1}
            />
        </div>
    );
}