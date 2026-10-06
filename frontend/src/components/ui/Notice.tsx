import React from 'react';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from './Button.js';

export interface NoticeProps {
  variant?: 'error' | 'info' | 'success';
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const Notice: React.FC<NoticeProps> = ({
  variant = 'info',
  title,
  message,
  onRetry,
  retryLabel = 'Retry',
}) => {
  const isError = variant === 'error';
  const isSuccess = variant === 'success';
  const Icon = isError ? AlertCircle : Info;

  const bg = isError
    ? 'bg-[var(--color-weak-tint)]'
    : isSuccess
    ? 'bg-[var(--color-strong-tint)]'
    : 'bg-[#EAE6DB]';
  const border = isError
    ? 'border-[var(--color-weak)]/40'
    : isSuccess
    ? 'border-[var(--color-strong)]/40'
    : 'border-[var(--color-line)]';
  const textTitle = isError
    ? 'text-[var(--color-weak)]'
    : isSuccess
    ? 'text-[var(--color-strong)]'
    : 'text-[var(--color-ink)]';

  return (
    <div
      role="alert"
      className={`p-4 rounded-[8px] border ${bg} ${border} flex items-start gap-3.5`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${textTitle}`} />
      <div className="flex-1 flex flex-col gap-1">
        {title && <h4 className={`text-[14px] font-sans font-semibold ${textTitle}`}>{title}</h4>}
        <p className="text-[14px] font-sans text-[var(--color-ink)] leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <div className="mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{retryLabel}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
