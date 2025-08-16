// app/components/StarRatingInput.tsx
'use client'; 
import { useState } from 'react';
import { Star } from 'lucide-react';

type StarRatingInputProps = {
  label: string;
  name: string;
  required?: boolean;
  initialValue?: number; // --- NEW PROP ---
};

export function StarRatingInput({ label, name, required = false, initialValue = 0 }: StarRatingInputProps) {
  // --- UPDATED: State is now initialized with the existing value ---
  const [rating, setRating] = useState(initialValue); 
  const [hover, setHover] = useState(0);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}{required && '*'}
      </label>
      <input type="hidden" name={name} value={rating} required={required} />
      
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              type="button"
              key={starValue}
              className={`transition-colors duration-200 ${
                starValue <= (hover || rating) ? 'text-yellow-400' : 'text-slate-600'
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              <Star size={28} fill="currentColor" />
            </button>
          );
        })}
      </div>
    </div>
  );
}