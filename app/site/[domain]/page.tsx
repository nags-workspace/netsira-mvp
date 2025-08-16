// app/site/[domain]/page.tsx

import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import Link from 'next/link';
import { Star, CheckCircle, UserCircle } from 'lucide-react';
import { UserReviewSection } from '../../components/UserReviewSection';
import { deleteReviewAction } from '../../actions/auth.actions';
import { VerificationBadge } from '../../../app/components/VerificationBadge'; // <-- IMPORT the new badg

export const dynamic = 'force-dynamic';

// --- CHANGE #1: Add Category type ---
type Category = { id: number; name: string };

// Type definitions are correct
type Review = {
    id: number;
    user_id: string;
    website_id: number;
    comment: string;
    rating_overall: number;
    rating_design: number;
    rating_usability: number;
    rating_content: number;
    rating_reliability: number;
    profiles: { username: string; } | null;
};
// --- CHANGE #2: Update Website type to include categories ---
type Website = { 
    id: number; 
    domain_name: string; 
    display_name: string; 
    description: string | null; 
    is_verified: boolean; 
    categories: Category[]; // Added this line
};

// Server Action is correct
async function submitReviewAction(formData: FormData) {
  'use server';
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { throw new Error('You must be logged in.'); }
  const domain = formData.get('domain') as string;
  const websiteId = Number(formData.get('website_id'));
  await supabase.from('reviews').delete().match({ user_id: user.id, website_id: websiteId });
  const reviewData = {
    user_id: user.id,
    website_id: websiteId,
    comment: formData.get('comment') as string,
    rating_overall: Number(formData.get('rating_overall')),
    rating_design: Number(formData.get('rating_design')),
    rating_content: Number(formData.get('rating_content')),
    rating_reliability: Number(formData.get('rating_reliability')),
    rating_usability: Number(formData.get('rating_usability')),
  };
  const { error } = await supabase.from('reviews').insert(reviewData);
  if (error) { return redirect(`/site/${domain}?error=Could not submit review`); }
  return redirect(`/site/${domain}`);
}

// --- Main Page Component ---
export default async function WebsiteProfilePage({ params: { domain } }: { params: { domain: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // --- CHANGE #3: Update the Supabase query to fetch categories ---
  const { data: website } = await supabase
    .from('websites')
    .select('*, categories(id, name)') // Added categories here
    .eq('domain_name', domain)
    .single<Website>();
  if (!website) { notFound(); }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(username)')
    .eq('website_id', website.id)
    .order('created_at', { ascending: false })
    .returns<Review[]>();

  const safeReviews = reviews ?? [];
  const userReview = user ? safeReviews.find(review => review.user_id === user.id) : null;
  const totalReviews = safeReviews.length;
  const otherReviews = safeReviews.filter(review => review.user_id !== user?.id);
  
  const averageRatings = { overall: 0, design: 0, usability: 0, content: 0, reliability: 0, };
  if (totalReviews > 0) {
    const total = safeReviews.reduce((acc, review) => {
        acc.overall += review.rating_overall || 0;
        acc.design += review.rating_design || 0;
        acc.usability += review.rating_usability || 0;
        acc.content += review.rating_content || 0;
        acc.reliability += review.rating_reliability || 0;
        return acc;
    }, { overall: 0, design: 0, usability: 0, content: 0, reliability: 0 });
    averageRatings.overall = parseFloat((total.overall / totalReviews).toFixed(1));
    averageRatings.design = parseFloat((total.design / totalReviews).toFixed(1));
    averageRatings.usability = parseFloat((total.usability / totalReviews).toFixed(1));
    averageRatings.content = parseFloat((total.content / totalReviews).toFixed(1));
    averageRatings.reliability = parseFloat((total.reliability / totalReviews).toFixed(1));
  }
  
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <section className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={`https://www.google.com/s2/favicons?domain=${website.domain_name}&sz=64`} alt="favicon" className="w-16 h-16 rounded-lg"/>
                <div className="flex-grow">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold">{website.display_name}</h1>
                        {website.is_verified && <VerificationBadge size="medium" className="mt-4" />}
                    </div>
                    <a href={`https://${website.domain_name}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors break-all">
                        {website.domain_name}
                    </a>
                </div>
            </div>
            {/* --- THIS IS THE FIX --- */}
            {/* Render the badge if the site is verified */}
            <p className="mt-4 text-lg text-slate-300 max-w-4xl">{website.description || 'No description available.'}</p>
            
            {/* --- CHANGE #4: Add the JSX to display the category badges --- */}
            {website.categories && website.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                    {website.categories.map((category) => (
                        <span key={category.id} className="inline-flex items-center rounded-md bg-blue-900/50 px-2.5 py-1 text-sm font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
                            {category.name}
                        </span>
                    ))}
                </div>
            )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-4">{userReview ? 'Your Review' : 'Leave a Review'}</h2>
              
              {user ? (
                <UserReviewSection 
                  websiteId={website.id} 
                  domain={website.domain_name}
                  initialReview={userReview}
                  submitAction={submitReviewAction}
                  deleteAction={deleteReviewAction}
                />
              ) : (
                <div className="bg-slate-800 p-6 rounded-lg text-center mb-8">
                  <p className="text-slate-300">You must be{' '}<Link href="/login" className="font-semibold text-blue-400 hover:underline">logged in</Link>{' '}to leave a review.</p>
                </div>
              )}
              
              <div className="space-y-6 mt-12">
                {otherReviews.length > 0 && (
                    <h3 className="text-2xl font-bold text-slate-300">Other User Reviews</h3>
                )}
                {otherReviews.map((review: Review) => (
                    <div key={review.id} className="bg-slate-800 p-6 rounded-lg flex gap-4">
                      <UserCircle className="w-10 h-10 text-slate-500 flex-shrink-0 mt-1"/>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-lg text-slate-100">{review.profiles?.username || 'Anonymous'}</p>
                                <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                    <Star size={16} fill="currentColor"/>
                                    <span>{review.rating_overall}/5</span>
                                </div>
                            </div>
                            <p className="text-slate-300 mt-2">{review.comment}</p>
                        </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
          
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-slate-800 p-6 rounded-lg sticky top-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-200">Overall Rating</h3>
                <div className="flex items-baseline justify-center gap-2 my-2">
                  <span className="text-6xl font-bold">{averageRatings.overall}</span>
                  <span className="text-2xl text-slate-400">/ 5</span>
                </div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={28} className={i < Math.round(averageRatings.overall) ? 'text-yellow-400' : 'text-slate-600'} fill="currentColor"/>
                  ))}
                </div>
                <p className="text-slate-400 mt-3">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
              </div>
              {totalReviews > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Rating Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(averageRatings)
                      .filter(([key]) => key !== 'overall')
                      .map(([key, value]) => (
                        value > 0 && (
                          <div key={key}>
                            <div className="flex justify-between text-sm capitalize text-slate-300 font-medium">
                              <span>{key}</span>
                              <span>{value} / 5</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width:`${(value/5)*100}%`}}></div>
                            </div>
                          </div>
                        )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}