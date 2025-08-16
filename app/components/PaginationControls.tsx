// app/components/PaginationControls.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationControlsProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function PaginationControls({ hasNextPage, hasPrevPage }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const page = searchParams.get('page') ?? '1';

  const handlePrev = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (Number(page) - 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (Number(page) + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-end items-center gap-4 mt-8">
      <button
        disabled={!hasPrevPage}
        onClick={handlePrev}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="text-sm text-slate-400">
        Page {page}
      </div>

      <button
        disabled={!hasNextPage}
        onClick={handleNext}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}