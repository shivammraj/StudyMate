import React from 'react';

export interface Option<T extends string> {
  id: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex bg-[#EAE6DB] p-1 rounded-[6px] border border-[var(--color-line)] ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={opt.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            onClick={() => onChange(opt.id)}
            className={`min-h-[32px] px-3 text-[13px] font-sans font-medium rounded-[4px] transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-white text-[var(--color-ink)] shadow-xs font-semibold'
                : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
