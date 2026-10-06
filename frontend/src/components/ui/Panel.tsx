import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  bordered = true,
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--color-surface)] ${
        bordered ? 'border border-[var(--color-line)]' : ''
      } rounded-[8px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
