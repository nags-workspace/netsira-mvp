// app/components/WebsiteCard.tsx

import Link from 'next/link';
import { Star } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export type WebsiteWithReviewsAndCategories = {
  id: number;
  domain_name: string;
  display_name: string;
  reviews: any[];
  categories: { id: number; name: string }[];
  is_verified: boolean;
};

export function WebsiteCard({ site }: { site: WebsiteWithReviewsAndCategories }) {
  const reviews = site.reviews || [];
  const totalReviews = reviews.length;
  let overallRating = 0;
  if (totalReviews > 0) {
    const total = reviews.reduce((acc: number, review: any) => acc + (review.rating_overall || 0), 0);
    overallRating = parseFloat((total / totalReviews).toFixed(1));
  }

  return (
    <Link href={`/site/${site.domain_name}`}>
      <div className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 hover:scale-105 transition-transform duration-200 cursor-pointer h-full flex flex-col">
        {/* Top section for content */}
        <div className="flex-grow">
          <div className="flex items-start gap-4">
            <img 
              src={`https://logo.clearbit.com/${site.domain_name}?size=80`} 
              alt={`${site.display_name} logo`} 
              className="w-12 h-12 rounded-md flex-shrink-0" 
            />
            {/* This div groups the text and badge together vertically */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold">{site.display_name}</h3>
              <p className="text-sm text-slate-400">
                {totalReviews > 0 ? `${totalReviews} review${totalReviews !== 1 ? 's' : ''}` : 'No reviews yet'}
              </p>
            </div>
            <div className="flex-grow-0 flex-shrink-0">
              {/* The badge is placed here to appear directly under the text */}
              {site.is_verified && <VerificationBadge size="small" className="mt-2" />}
            </div>
          </div>
          
          {site.categories && site.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {site.categories.map((category) => (
                <span key={category.id} className="inline-flex items-center rounded-md bg-blue-900/ ৫০ px-2.5 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom section for rating */}
        <div className="flex items-center justify-end mt-6">
          <span className="text-lg font-bold mr-1 text-yellow-400">{overallRating}</span>
          <Star size={20} className="text-yellow-400" fill="currentColor" />
        </div>
      </div>
    </Link>
  );
}