// app/admin/categories/page.tsx
import { createSupabaseServerClient } from '../../../app/lib/supabase/server';
import { Tag } from 'lucide-react';
import { CategoryManager } from './CategoryManager'; // Import the client component

async function getCategories() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export default async function ManageCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Tag size={28} /> Manage Categories
        </h1>
      </div>
      
      <CategoryManager categories={categories} />
    </div>
  );
}