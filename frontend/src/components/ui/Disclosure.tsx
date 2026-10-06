import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DisclosureProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  defaultOpen = false,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`border border-[var(--color-line)] rounded-[8px] bg-[var(--color-surface)] overflow-hidden transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-sans font-medium text-[15px] text-[var(--color-ink)] hover:bg-[#F0ECE1] transition-colors cursor-pointer select-none"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-ink-2)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-[14px] text-[var(--color-ink-2)] border-t border-[var(--color-line)]/50 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};
