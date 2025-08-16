// app/admin/submissions/SubmissionsList.tsx

'use client';

import { useState, useTransition } from 'react';
import { approveSubmissionAction, rejectSubmissionAction, SubmissionWithDetails } from './actions';
import { ExternalLink, User, Clock, Tag, Check, X } from 'lucide-react';

// A simple toast-like notification component for user feedback
function Notification({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  // Automatically dismiss after 5 seconds
  useState(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  });

  return (
    <div className={`fixed top-20 right-5 p-4 rounded-lg shadow-lg text-white z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}


export default function SubmissionsList({ submissions }: { submissions: SubmissionWithDetails[] }) {
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleApprove = (submission: SubmissionWithDetails) => {
    startTransition(async () => {
      const result = await approveSubmissionAction(submission);
      if (result.error) {
        setNotification({ message: result.error, type: 'error' });
      } else {
        setNotification({ message: result.success!, type: 'success' });
      }
    });
  };

  const handleReject = (submissionId: string) => {
    if (window.confirm('Are you sure you want to reject this submission? This action cannot be undone.')) {
      startTransition(async () => {
        const result = await rejectSubmissionAction(submissionId);
        if (result.error) {
          setNotification({ message: result.error, type: 'error' });
        } else {
          setNotification({ message: result.success!, type: 'success' });
        }
      });
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white">All Clear!</h3>
        <p className="mt-2 text-gray-400">There are no pending submissions in the queue.</p>
      </div>
    );
  }

  return (
    <>
      {notification && <Notification {...notification} onDismiss={() => setNotification(null)} />}
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                <a href={sub.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
                  {sub.url} <ExternalLink size={14} />
                </a>
                <p className="mt-3 text-gray-300 max-w-2xl">{sub.description}</p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0 flex-shrink-0">
                <button
                  onClick={() => handleApprove(sub)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  onClick={() => handleReject(sub.id)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <User size={14} />Submitted by: {sub.profiles?.[0]?.username || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />{new Date(sub.created_at).toLocaleString()}
              </span>
              {sub.categories?.[0]?.name && (
                <span className="flex items-center gap-1.5">
                    <Tag size={14} />Suggested Category: {sub.categories[0].name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}