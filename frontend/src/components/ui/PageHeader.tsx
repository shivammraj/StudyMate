import React from 'react';

export interface PageHeaderProps {
  title: string;
  lead?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, lead, actions }) => {
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
      <div>
        <h1 className="font-serif text-[28px] sm:text-[34px] font-bold text-[var(--color-ink)] tracking-tight">
          {title}
        </h1>
        {lead && (
          <p className="text-[15px] sm:text-[16px] text-[var(--color-ink-2)] mt-1.5 font-sans leading-relaxed">
            {lead}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </header>
  );
};
