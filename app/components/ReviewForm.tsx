// app/components/ReviewForm.tsx
'use client'; 
import { StarRatingInput } from './StarRatingInput';

type ReviewData = {
    comment: string;
    rating_overall: number;
    rating_design: number;
    rating_usability: number;
    rating_content: number;
    rating_reliability: number;
} | null | undefined;

type ReviewFormProps = {
    websiteId: number;
    domain: string;
    submitReviewAction: (formData: FormData) => Promise<void>;
    existingReview?: ReviewData;
};

export function ReviewForm({ websiteId, domain, submitReviewAction, existingReview }: ReviewFormProps) {
    return (
        <form action={submitReviewAction} className="bg-slate-800 p-6 rounded-lg mb-8 space-y-6">
            <input type="hidden" name="website_id" value={websiteId} />
            <input type="hidden" name="domain" value={domain} />

            <div className="border-b border-slate-700 pb-6">
                <StarRatingInput label="Overall Rating" name="rating_overall" required={true} initialValue={existingReview?.rating_overall} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StarRatingInput label="Design" name="rating_design" initialValue={existingReview?.rating_design} />
                <StarRatingInput label="Usability" name="rating_usability" initialValue={existingReview?.rating_usability} />
                <StarRatingInput label="Content" name="rating_content" initialValue={existingReview?.rating_content} />
                <StarRatingInput label="Reliability" name="rating_reliability" initialValue={existingReview?.rating_reliability} />
            </div>

            <div>
                {/* --- THIS IS THE FIX --- */}
                {/* The label no longer has a '*' and the textarea is no longer 'required' */}
                <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-2">Your Review (Optional)</label>
                <textarea 
                    name="comment" 
                    id="comment" 
                    rows={5} 
                    placeholder="Share your experience, what you liked, and what could be improved..." 
                    className="w-full bg-slate-700 text-white p-3 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y transition-colors"
                    defaultValue={existingReview?.comment}
                ></textarea>
            </div>
            
            <button 
                type="submit" 
                className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
            >
                {existingReview ? 'Update Your Review' : 'Submit Review'}
            </button>
        </form>
    );
}