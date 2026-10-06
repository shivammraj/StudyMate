import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[var(--color-line)]/50 rounded-[4px] ${className}`}
    />
  );
};
