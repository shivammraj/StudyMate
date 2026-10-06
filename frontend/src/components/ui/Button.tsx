import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quiet' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 cursor-pointer select-none rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pen)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40';

  const sizeClasses = {
    sm: 'min-h-[36px] px-3 py-1.5 text-[14px]',
    md: 'min-h-[42px] px-4 py-2 text-[15px]',
    lg: 'min-h-[48px] px-6 py-2.5 text-[16px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--color-pen)] text-white hover:bg-[var(--color-pen-hover)] active:translate-y-[1px] shadow-sm',
    secondary:
      'bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[#F0ECE1] active:translate-y-[1px]',
    quiet:
      'bg-transparent text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]',
    accent:
      'bg-[var(--color-strong)] text-white hover:opacity-90 active:translate-y-[1px]',
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
