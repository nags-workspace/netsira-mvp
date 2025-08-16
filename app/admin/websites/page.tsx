// app/admin/websites/page.tsx

import { createSupabaseServerClient } from '../../../app/lib/supabase/server';
import { Globe, Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import { AddWebsiteForm } from './AddWebsiteForm';
import { WebsiteActions } from './WebsiteActions';
import { PaginationControls } from '../../../app/components/PaginationControls';
import { ManageCategoriesModal } from './ManageCategoriesModal';
import { WebsiteFilters } from './WebsiteFilters'; // <-- Import the new component

const ITEMS_PER_PAGE = 10;

type Category = { id: number; name: string };
type Website = {
    id: number;
    display_name: string;
    domain_name: string;
    description: string | null;
    is_verified: boolean;
    categories: Category[];
};

// The new data fetching function from Step 1 goes here...
async function getWebsites(page: number, searchQuery: string, categoryFilter: string) {
    const supabase = await createSupabaseServerClient();
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1; 
    let query = supabase
        .from('websites')
        .select('*, categories!inner(id, name)', { count: 'exact' });
    if (searchQuery) { query = query.ilike('display_name', `%${searchQuery}%`); }
    if (categoryFilter) { query = query.eq('categories.id', categoryFilter); }
    query = query.order('id', { ascending: false }).range(from, to);
    const { data, error, count } = await query;
    if (error) { console.error("Error fetching websites:", error); return { websites: [], hasNextPage: false, totalCount: 0 }; }
    const totalCount = count ?? 0;
    const hasNextPage = (page * ITEMS_PER_PAGE) < totalCount;
    return { websites: data as Website[] ?? [], hasNextPage, totalCount };
}

async function getAllCategories() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from('categories').select('id, name').order('name');
    return data ?? [];
}

// --- UPDATED: The page now reads all search params ---
export default async function ManageWebsitesPage({ searchParams }: { 
  searchParams: { page?: string; query?: string; category?: string; } 
}) {
    const page = Number(searchParams.page ?? '1');
    const query = searchParams.query ?? '';
    const category = searchParams.category ?? '';
    
    const [ { websites, hasNextPage, totalCount }, allCategories ] = await Promise.all([
        getWebsites(page, query, category),
        getAllCategories()
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold flex items-center gap-2"><Globe size={28} /> Manage Websites</h1>
                <AddWebsiteForm />
            </div>
            <p className="text-slate-400 mb-8">{totalCount} website{totalCount !== 1 ? 's' : ''} found</p>

            {/* --- NEW: Add the filter controls --- */}
            <WebsiteFilters allCategories={allCategories} />

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Categories</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Verified</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {websites.map((site) => (
                            <tr key={site.id} className="hover:bg-slate-800/50">
                                <td className="py-4 pl-6 pr-3 text-sm">
                                    <div className="font-medium text-white">{site.display_name}</div>
                                    <div className="text-slate-400">{site.domain_name}</div>
                                </td>
                                <td className="px-3 py-4 text-sm text-slate-400">
                                    <div className="flex flex-wrap gap-1">
                                        {site.categories.map((c: Category) => (
                                            <span key={c.id} className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300">{c.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-sm">
                                    {site.is_verified ? (
                                        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-900/80 px-2 py-1 text-xs font-medium text-green-300"><CheckCircle size={14}/> Verified</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-900/80 px-2 py-1 text-xs font-medium text-red-300"><XCircle size={14}/> Not Verified</span>
                                    )}
                                </td>
                                <td className="relative py-4 pl-3 pr-6 text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <ManageCategoriesModal website={site} allCategories={allCategories} />
                                        <WebsiteActions websiteId={site.id} isVerified={site.is_verified} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls hasNextPage={hasNextPage} hasPrevPage={page > 1} />
        </div>
    );
}