// app/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { WebsiteCard, type WebsiteWithReviewsAndCategories } from '../app/components/WebsiteCard'; // <-- UPDATED IMPORT
import { ChevronRight } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

// The old type definitions have been removed from this file.

type CategoryWithWebsites = {
  id: number;
  name: string;
  websites: WebsiteWithReviewsAndCategories[]; // <-- Use the imported type here
};

async function getCategoriesWithWebsites(): Promise<CategoryWithWebsites[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, websites!inner(*, reviews(*), categories(id, name))')
    .not('websites', 'is', null)
    .limit(4, { foreignTable: 'websites' });
  
  if (error) {
    console.error("Error fetching categories with websites:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const categoriesWithWebsites = await getCategoriesWithWebsites();

  return (
    <div className="bg-slate-900 text-white">
      <section className="text-center pt-20 pb-16 sm:pt-28 sm:pb-24">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Discover & Review</h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">
          Browse websites by category and share your experience with the community.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20 sm:pb-32 space-y-16">
        {categoriesWithWebsites.map((category) => (
          <div key={category.id}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{category.name}</h2>
              <Link href={`/categories/${encodeURIComponent(category.name.toLowerCase().replace(/ /g, '-'))}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                View All <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.websites.map((site) => (
                <WebsiteCard key={site.id} site={site} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}