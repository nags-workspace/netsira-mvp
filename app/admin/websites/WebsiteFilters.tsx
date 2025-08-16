// app/admin/websites/WebsiteFilters.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type Category = {
  id: number;
  name: string;
};

export function WebsiteFilters({ allCategories }: { allCategories: Category[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // use-debounce prevents firing a search on every single keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on a new search
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on a new filter
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <input
        type="search"
        placeholder="Search by name..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="flex-grow px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
      />
      <select
        onChange={(e) => handleCategoryChange(e.target.value)}
        defaultValue={searchParams.get('category')?.toString()}
        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
      >
        <option value="">All Categories</option>
        {allCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}