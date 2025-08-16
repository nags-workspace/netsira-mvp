// app/admin/categories/CategoryManager.tsx
'use client';

import { useState, useTransition, useRef } from 'react';
import { addCategoryAction, deleteCategoryAction, updateCategoryAction } from '../../../app/actions/admin.actions';
import { Trash2, Edit, X, Plus } from 'lucide-react';

type Category = {
  id: number;
  name: string;
};

type CategoryManagerProps = {
  categories: Category[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const addFormRef = useRef<HTMLFormElement>(null);
  let [isPending, startTransition] = useTransition();

  const handleDelete = (category: Category) => {
    if (confirm(`Are you sure you want to delete the "${category.name}" category? This cannot be undone.`)) {
      startTransition(() => {
        deleteCategoryAction(category.id);
      });
    }
  };

  // --- Wrapper for the ADD action ---
  const handleAddAction = async (formData: FormData) => {
    setErrorMessage(null);
    const result = await addCategoryAction(formData);
    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      // Clear the form input on successful submission
      addFormRef.current?.reset();
    }
  };

  // --- Wrapper for the UPDATE action ---
  const handleUpdateAction = async (formData: FormData) => {
    const result = await updateCategoryAction(formData);
    if (result?.error) {
      alert(`Error: ${result.error}`); // Simple alert for edit errors
    }
    setEditingCategory(null); // Exit editing mode regardless of outcome
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
        {/* The 'add' form now uses the wrapper */}
        <form ref={addFormRef} action={handleAddAction} className="flex items-center gap-2">
          <input 
            type="text" 
            name="name" 
            required 
            placeholder="New category name..."
            className="flex-grow px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" 
          />
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md">
            <Plus size={16} /> Add
          </button>
        </form>
        {errorMessage && <p className="text-sm text-red-400 mt-2">{errorMessage}</p>}
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold p-4 border-b border-slate-700">Existing Categories</h2>
        <ul className="divide-y divide-slate-700">
          {categories.map((category) => (
            <li key={category.id} className="p-4 flex justify-between items-center">
              {editingCategory?.id === category.id ? (
                // The 'update' form now uses the wrapper
                <form action={handleUpdateAction} className="flex-grow flex items-center gap-2">
                  <input type="hidden" name="id" value={category.id} />
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={category.name} 
                    required 
                    autoFocus
                    className="flex-grow px-3 py-1 bg-slate-600 border border-slate-500 rounded-md"
                  />
                  <button type="submit" disabled={isPending} className="p-2 rounded-md bg-green-800 text-green-300 hover:bg-green-700">Save</button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="p-2 rounded-md bg-slate-600 text-slate-300 hover:bg-slate-500">
                    <X size={16}/>
                  </button>
                </form>
              ) : (
                <>
                  <span className="text-slate-200">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingCategory(category)} disabled={isPending} className="p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(category)} disabled={isPending} className="p-2 rounded-md bg-red-800 text-red-300 hover:bg-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}