// app/profile/page.tsx

import { createSupabaseServerClient } from "../lib/supabase/server";
import { redirect } from 'next/navigation';
import Link from "next/link";
import { deleteReviewAction } from "../actions/auth.actions";
import { Trash2, MessageSquareText, Star } from "lucide-react";
import { promoteToAdmin } from '../actions/auth.actions'; // <-- ADD THIS IMPORT

// Updated type to include a unique 'id' for each review
type ReviewWithWebsite = {
    id: number; // The unique ID for the review itself
    created_at: string;
    comment: string;
    rating_overall: number;
    websites: {
        display_name: string;
        domain_name: string; // We need this for the delete action
    } | null; 
};

export default async function ProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the review's unique ID and the website's domain_name
    const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
            id,
            created_at,
            comment,
            rating_overall,
            websites (display_name, domain_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<ReviewWithWebsite[]>();

    if (error) {
        console.error('Error fetching reviews:', error.message);
        return <p className="text-center text-red-400">Could not load your reviews.</p>;
    }
    
    const username = user.user_metadata?.username || user.email;

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Profile</h1>
                    <p className="mt-3 text-xl text-slate-400">
                        Welcome back, <span className="font-semibold text-blue-400">{username}</span>
                    </p>
                </div>


                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">My Reviews</h2>
                    
                    {reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => {
                                // --- THIS IS THE FIX ---
                                // The action now needs both the review's ID and the website's domain name.
                                // We add a check to make sure review.websites is not null.
                                const deleteActionWithData = async () => {
                                    'use server';
                                    if (review.websites) {
                                        await deleteReviewAction(review.id, review.websites.domain_name);
                                    }
                                };

                                return (
                                    <div key={review.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors duration-200">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-grow">
                                                {review.websites ? (
                                                     <Link href={`/site/${review.websites.domain_name}`} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                                                        {review.websites.display_name}
                                                     </Link>
                                                ) : (
                                                    <p className="text-2xl font-bold text-slate-500">Website no longer available</p>
                                                )}
                                               
                                                <p className="text-sm text-slate-400 mt-1 mb-4">Reviewed on {new Date(review.created_at).toLocaleDateString()}</p>
                                                <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                                                
                                                 <div className="flex items-center gap-1 text-yellow-400 font-bold mt-4 pt-4 border-t border-slate-700">
                                                    <span className="text-slate-300 font-medium">Overall:</span>
                                                    <Star size={16} fill="currentColor"/>
                                                    <span>{review.rating_overall}/5</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0">
                                                <form action={deleteActionWithData}>
                                                    <button type="submit" className="p-2 rounded-full text-slate-500 hover:bg-red-900/50 hover:text-red-400 transition-all duration-200" aria-label="Delete review">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center bg-slate-800 rounded-lg p-12 mt-8">
                            <MessageSquareText className="mx-auto h-12 w-12 text-slate-500" />
                            <h3 className="mt-4 text-lg font-semibold text-white">No reviews yet</h3>
                            <p className="mt-1 text-sm text-slate-400">When you review a website, it will show up here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}