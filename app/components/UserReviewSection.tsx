// app/components/UserReviewSection.tsx

'use client';

import { useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { Star, Edit, Trash2 } from 'lucide-react';

// Define the shape of the review data
type ReviewData = {
    id: number;
    comment: string;
    rating_overall: number;
    rating_design: number;
    rating_usability: number;
    rating_content: number;
    rating_reliability: number;
    profiles: { username: string; } | null;
};

type UserReviewSectionProps = {
    websiteId: number;
    domain: string;
    initialReview: ReviewData | null | undefined;
    submitAction: (formData: FormData) => Promise<void>;
    deleteAction: (reviewId: number, domain: string) => Promise<void>;
};

export function UserReviewSection({ initialReview, websiteId, domain, submitAction, deleteAction }: UserReviewSectionProps) {
    const [isEditing, setIsEditing] = useState(!initialReview);

    if (isEditing) {
        return (
            <div>
                <ReviewForm
                    websiteId={websiteId}
                    domain={domain}
                    submitReviewAction={submitAction}
                    existingReview={initialReview}
                />
                {initialReview && (
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="w-full mt-2 py-2 px-4 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        );
    }
    
    // Safety guard
    if (!initialReview) {
        return null; 
    }
    
    // --- THIS IS THE FIX ---
    // We create a new server action with the arguments already bound to it.
    // This is the most reliable way to call server actions with arguments from a form.
    const boundDeleteAction = deleteAction.bind(null, initialReview.id, domain);

    // If not editing and a review exists, show the Display Card.
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-blue-500/50">
             <div className="flex justify-between items-start">
                <p className="font-semibold text-lg text-slate-100">Your Review</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700">
                        <Edit size={16} /> Edit
                    </button>
                    {/* The form now uses the more robust 'boundDeleteAction' */}
                    <form action={boundDeleteAction}>
                        <button type="submit" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-900/50">
                            <Trash2 size={16} /> Delete
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-1 text-yellow-400 font-bold mb-4">
                    <span className="text-slate-300 font-medium">Overall:</span>
                    <Star size={16} fill="currentColor"/>
                    <span>{initialReview.rating_overall}/5</span>
                </div>
                <p className="text-slate-300">{initialReview.comment}</p>
                 <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                    {initialReview.rating_design > 0 && <span>Design: <span className="font-semibold text-slate-300">{initialReview.rating_design}/5</span></span>}
                    {initialReview.rating_usability > 0 && <span>Usability: <span className="font-semibold text-slate-300">{initialReview.rating_usability}/5</span></span>}
                    {initialReview.rating_content > 0 && <span>Content: <span className="font-semibold text-slate-300">{initialReview.rating_content}/5</span></span>}
                    {initialReview.rating_reliability > 0 && <span>Reliability: <span className="font-semibold text-slate-300">{initialReview.rating_reliability}/5</span></span>}
                </div>
            </div>
        </div>
    );
}