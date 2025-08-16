// app/admin/users/UserActions.tsx
'use client';
import { useTransition } from 'react';
import { deleteUserAction, updateUserRoleAction } from '@/app/actions/admin.actions';
import { Shield, ShieldOff, Trash2 } from 'lucide-react';

type UserActionsProps = {
  userId: string;
  userRole: 'admin' | 'user' | undefined;
  currentUserId: string; // The ID of the currently logged-in admin
};

export function UserActions({ userId, userRole, currentUserId }: UserActionsProps) {
  let [isPending, startTransition] = useTransition();

  // Prevent an admin from deleting their own account from this UI
  const isSelf = userId === currentUserId;

  const handleRoleChange = () => {
    const newRole = userRole === 'admin' ? 'user' : 'admin';
    if (confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      startTransition(() => {
        updateUserRoleAction(userId, newRole);
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
      startTransition(() => {
        deleteUserAction(userId);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {!isSelf && (
        <>
          <button 
            onClick={handleRoleChange} 
            disabled={isPending} 
            title={userRole === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            className="p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600"
          >
            {userRole === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
          </button>
          
          <button 
            onClick={handleDelete} 
            disabled={isPending} 
            title="Delete User"
            className="p-2 rounded-md bg-red-800 text-red-300 hover:bg-red-700"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );
}