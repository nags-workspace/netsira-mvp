// app/categories/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Tag } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- THIS IS THE FIX ---
// The type is now a simple array of objects, which is more flexible.
type CategoryWithCount = {
  id: number;
  name: string;
  website_categories: { count: number }[]; // Correctly defined as an array
};

async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  // --- UPDATED QUERY TO MATCH THE NEW TYPE NAME ---
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, website_categories(count)')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Explore Categories</h1>
          <p className="mt-3 text-lg text-slate-400">Discover websites based on your interests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            // The safe count logic is still correct and necessary.
            const count = category.website_categories[0]?.count ?? 0;

            return (
              <Link 
                key={category.id} 
                href={`/categories/${encodeURIComponent(category.name.toLowerCase().replace(/ /g, '-'))}`}
                className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 hover:scale-105 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <Tag className="w-8 h-8 text-blue-400 mb-3" />
                  <h2 className="text-xl font-semibold text-slate-100">{category.name}</h2>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  {count} website{count !== 1 ? 's' : ''}
                </p>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  );
}