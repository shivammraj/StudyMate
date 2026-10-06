import React from 'react';

export interface TagProps {
  label: string;
  variant?: 'default' | 'pen' | 'highlight' | 'subtle';
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-[#EAE6DB] text-[var(--color-ink)] border-[var(--color-line)]',
    pen: 'bg-[#E8EEFD] text-[var(--color-pen)] border-[var(--color-pen)]/30',
    highlight: 'bg-[#FFF6CC] text-[#7A5B00] border-[#E8D882]',
    subtle: 'bg-[var(--color-surface)] text-[var(--color-ink-2)] border-[var(--color-line)]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-sans font-medium border ${variantClasses} ${className}`}
    >
      {label}
    </span>
  );
};
