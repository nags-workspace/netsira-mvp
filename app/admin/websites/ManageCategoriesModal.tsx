// app/admin/websites/ManageCategoriesModal.tsx
'use client';
import { useState, useTransition } from 'react';
import { updateWebsiteCategoriesAction } from '../../../app/actions/admin.actions';
import { Tag, X } from 'lucide-react';

// Define the types for the props
type Category = { id: number; name: string };
type Website = {
    id: number;
    display_name: string;
    categories: Category[];
};

type ManageCategoriesModalProps = {
  website: Website;
  allCategories: Category[];
};

export function ManageCategoriesModal({ website, allCategories }: ManageCategoriesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(
    new Set(website.categories.map(c => c.id))
  );
  let [isPending, startTransition] = useTransition();

  const handleCheckboxChange = (categoryId: number) => {
    const newSet = new Set(selectedCategoryIds);
    if (newSet.has(categoryId)) {
      newSet.delete(categoryId);
    } else {
      newSet.add(categoryId);
    }
    setSelectedCategoryIds(newSet);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await updateWebsiteCategoriesAction(website.id, Array.from(selectedCategoryIds));
      setIsOpen(false);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600">
        <Tag size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-slate-800 p-8 rounded-lg w-full max-w-lg border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manage Categories for <span className="text-blue-400">{website.display_name}</span></h2>
              <button onClick={() => setIsOpen(false)}><X/></button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {allCategories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.has(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600">Cancel</button>
              <button onClick={handleSubmit} disabled={isPending} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isPending ? 'Saving...' : 'Save Categories'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}