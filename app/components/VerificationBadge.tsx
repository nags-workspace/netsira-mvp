// app/components/VerificationBadge.tsx

import Image from 'next/image';

// --- NEW: Define the props for our component ---
type VerificationBadgeProps = {
  // We can define a set of allowed sizes for consistency
  size?: 'small' | 'medium'; 
  className?: string;
};

// --- UPDATED: The component now accepts props ---
export function VerificationBadge({ size = 'medium', className = '' }: VerificationBadgeProps) {
  // Define the dimensions for each size variant
  const sizes = {
    small: { width: 90, height: 26},
    medium: { width: 160, height: 42 },
  };

  const { width, height } = sizes[size];

  return (
    // The 'mt-4' margin is now passed in via className for more control
    <div className={className}>
      <Image
        src="/verified-badge.png"
        alt="Verified by NETSira"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}