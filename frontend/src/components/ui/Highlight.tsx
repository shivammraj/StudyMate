import React from 'react';

export const Highlight: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <span
      className={`bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-highlight)] bg-no-repeat [background-position:0_85%] [background-size:100%_35%] px-0.5 rounded-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
};
