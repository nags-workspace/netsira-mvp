// app/categories/[categoryName]/page.tsx

import { createClient } from '@supabase/supabase-js';
import { WebsiteCard } from '../../../app/components/WebsiteCard'; // We will create this in the next step

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to format the URL slug back into a proper name
function formatCategoryName(slug: string): string {
    return decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default async function CategoryDetailPage({ params }: { params: { categoryName: string } }) {
  const categoryName = formatCategoryName(params.categoryName);

  // This query fetches websites that have a category matching the name from the URL
  const { data: websites, error } = await supabase
    .from('websites')
    .select('*, reviews(*), categories!inner(name)')
    .eq('categories.name', categoryName);

  if (error) {
    console.error('Error fetching websites for category:', error);
  }

  return (
    <div className="bg-slate-900 text-white">
      <section className="text-center py-20 sm:py-24">
        <p className="text-lg text-blue-400 font-semibold">Category</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">{categoryName}</h1>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20 sm:pb-32">
        {websites && websites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {websites.map((site) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 bg-slate-800 p-12 rounded-lg">
            <p>No websites found in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}