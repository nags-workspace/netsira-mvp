// app/admin/websites/AddWebsiteForm.tsx
'use client';
import { useState } from 'react';
import { addWebsiteAction } from '../../../app/actions/admin.actions';

export function AddWebsiteForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- THIS IS THE FIX ---
  // This wrapper function calls the server action and handles the return value.
  const formActionWrapper = async (formData: FormData) => {
    setErrorMessage(null);
    const result = await addWebsiteAction(formData);
    
    if (result && result.error) {
      setErrorMessage(result.error);
    } else {
      // If successful, close the modal
      setIsOpen(false);
    }
  };
  
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
        Add Website
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-slate-800 p-8 rounded-lg w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add a New Website</h2>
            {/* The form now calls the wrapper function */}
            <form action={formActionWrapper} className="space-y-4">
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium">Display Name</label>
                <input type="text" name="display_name" id="display_name" required className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md" />
              </div>
              <div>
                <label htmlFor="domain_name" className="block text-sm font-medium">Domain Name (e.g., google.com)</label>
                <input type="text" name="domain_name" id="domain_name" required className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <textarea name="description" id="description" rows={3} className="mt-1 block w-full px-3 py-2 bg-slate-700 rounded-md"></textarea>
              </div>
              
              {errorMessage && (<p className="text-sm text-red-400">{errorMessage}</p>)}

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => { setIsOpen(false); setErrorMessage(null); }} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Website</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}