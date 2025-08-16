// app/search/page.tsx

import { createClient } from '@supabase/supabase-js';
import { WebsiteCard, type WebsiteWithReviewsAndCategories } from '../../app/components/WebsiteCard'; // <-- UPDATED IMPORT
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// The old type definition has been removed from this file.

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';
  let websites: WebsiteWithReviewsAndCategories[] = []; // <-- Use the imported type here

  if (query) {
    const { data, error } = await supabase
      .from('websites')
      .select('*, reviews(*), categories(id, name)')
      .ilike('display_name', `%${query}%`);

    if (error) {
      console.error('Search error:', error);
    } else {
      websites = data || [];
    }
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          {query ? (
            <>
              <h1 className="text-4xl font-bold">Search Results for:</h1>
              <p className="mt-2 text-3xl font-extrabold text-blue-400">"{query}"</p>
            </>
          ) : (
            <h1 className="text-4xl font-bold">Search for a Website</h1>
          )}
        </div>

        {websites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {websites.map((site) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 bg-slate-800 p-12 rounded-lg">
            {query ? (
              <p>No websites found matching your search. <Link href="/" className="text-blue-400 hover:underline">Return Home</Link></p>
            ) : (
              <p>Please enter a search term in the bar above.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}