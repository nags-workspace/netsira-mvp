// app/admin/websites/edit/[websiteId]/page.tsx

import { createSupabaseServerClient } from '../../../../../app/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updateWebsiteAction } from '../../../../../app/actions/admin.actions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// Define the shape of the website data we expect
type Website = {
    id: number;
    display_name: string;
    domain_name: string;
    description: string | null;
};

// This page uses 'params' to get the ID from the URL, not 'searchParams'.
export default async function EditWebsitePage({ params }: { params: { websiteId: string } }) {
    const supabase = await createSupabaseServerClient();
    const websiteId = Number(params.websiteId);

    // Fetch the specific website to edit
    const { data: website, error } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .single<Website>();

    // If no website is found, show a 404 page
    if (error || !website) {
        return notFound();
    }

    return (
        <div>
            <Link href="/admin/websites" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8">
                <ChevronLeft size={20} /> Back to Websites
            </Link>
            <h1 className="text-3xl font-bold mb-8">Edit Website: <span className="text-blue-400">{website.display_name}</span></h1>
            
            <div className="bg-slate-800 p-8 rounded-lg w-full max-w-2xl border border-slate-700">
                <form action={updateWebsiteAction} className="space-y-4">
                    {/* Hidden input to pass the website ID to the server action */}
                    <input type="hidden" name="id" value={website.id} />

                    <div>
                        <label htmlFor="display_name" className="block text-sm font-medium">Display Name</label>
                        <input type="text" name="display_name" id="display_name" required defaultValue={website.display_name} className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="domain_name" className="block text-sm font-medium">Domain Name (e.g., google.com)</label>
                        <input type="text" name="domain_name" id="domain_name" required defaultValue={website.domain_name} className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">Description</label>
                        <textarea name="description" id="description" rows={4} defaultValue={website.description || ''} className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md"></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}