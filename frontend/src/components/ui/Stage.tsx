import React from 'react';

export interface StageProps {
  children: React.ReactNode;
  className?: string;
}

export const Stage: React.FC<StageProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full rounded-[8px] border border-[var(--color-line)] graph-paper p-4 sm:p-6 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
