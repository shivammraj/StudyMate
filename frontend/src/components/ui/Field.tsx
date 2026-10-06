import React from 'react';

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, hint, error, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-sans font-medium text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full min-h-[42px] px-3.5 py-2 bg-[var(--color-surface)] border rounded-[6px] text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-2)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-pen)] focus:border-transparent transition-all ${
            error ? 'border-[var(--color-weak)]' : 'border-[var(--color-line)]'
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <span className="text-[12px] text-[var(--color-ink-2)]">{hint}</span>
        )}
        {error && (
          <span className="text-[12px] text-[var(--color-weak)] font-medium">{error}</span>
        )}
      </div>
    );
  }
);
Field.displayName = 'Field';
