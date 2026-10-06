import React from 'react';
import { Band } from '../../types/state.js';

export interface BarProps {
  score: number; // 0 to 100
  band?: Band;
  label?: string;
  className?: string;
}

export const Bar: React.FC<BarProps> = ({ score, band, label, className = '' }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  const computedBand =
    band || (clamped >= 80 ? 'strong' : clamped >= 50 ? 'developing' : 'weak');

  const fillClass = {
    strong: 'bg-[var(--color-strong)]',
    developing: 'bg-[var(--color-developing)]',
    weak: 'bg-[var(--color-weak)]',
  }[computedBand];

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-[13px] font-sans">
          <span className="font-medium text-[var(--color-ink)]">{label}</span>
          <span className="text-[var(--color-ink-2)] tabular-nums">{clamped}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-[var(--color-line)] rounded-full overflow-hidden p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
