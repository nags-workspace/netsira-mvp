// app/admin/websites/WebsiteActions.tsx
'use client';
import { useTransition } from 'react';
import Link from 'next/link'; // Import Link for the Edit button
import { toggleVerifyAction, deleteWebsiteAction } from '../../../app/actions/admin.actions';
import { Check, Trash2, X, Edit } from 'lucide-react'; // Import Edit icon

type WebsiteActionsProps = {
  websiteId: number;
  isVerified: boolean;
};

export function WebsiteActions({ websiteId, isVerified }: WebsiteActionsProps) {
  let [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    startTransition(() => {
      toggleVerifyAction(websiteId, isVerified);
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this website? This cannot be undone.')) {
      startTransition(() => {
        deleteWebsiteAction(websiteId);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
        {/* --- ADDED EDIT BUTTON --- */}
        {/* This will link to a future page for editing a specific website */}
        <Link href={`/admin/websites/edit/${websiteId}`} className="p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600">
            <Edit size={16} />
        </Link>
        
        <button onClick={handleVerify} disabled={isPending} title={isVerified ? 'Unverify' : 'Verify'} className={`p-2 rounded-md transition-colors ${isVerified ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            {isVerified ? <X size={16} /> : <Check size={16} />}
        </button>
        
        <button onClick={handleDelete} disabled={isPending} title="Delete" className="p-2 rounded-md bg-red-800 text-red-300 hover:bg-red-700">
            <Trash2 size={16} />
        </button>
    </div>
  );
}