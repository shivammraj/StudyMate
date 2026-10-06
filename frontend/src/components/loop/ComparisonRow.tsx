import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Bar } from '../ui/Bar.js';
import { Band } from '../../types/state.js';

interface ComparisonRowProps {
  concept: string;
  before: number;
  after: number;
  delta: number;
}

function bandFor(score: number): Band {
  if (score >= 80) return 'strong';
  if (score >= 50) return 'developing';
  return 'weak';
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  concept,
  before,
  after,
  delta,
}) => {
  const isGain = delta > 0;
  const isLoss = delta < 0;

  return (
    <div className="p-4 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-line)] flex flex-col gap-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-sans font-semibold text-[var(--color-ink)]">
          {concept}
        </span>
        <div className="flex items-center gap-1.5 font-sans font-bold text-[13px]">
          {isGain ? (
            <span className="inline-flex items-center gap-0.5 text-[var(--color-strong)]">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              +{delta}%
            </span>
          ) : isLoss ? (
            <span className="inline-flex items-center gap-0.5 text-[var(--color-weak)]">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              {delta}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-[var(--color-ink-2)]">
              <Minus className="w-4 h-4" />
              0%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[12px] font-sans text-[var(--color-ink-2)]">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Before practice</span>
            <span className="font-semibold text-[var(--color-ink)]">{before}%</span>
          </div>
          <Bar score={before} band={bandFor(before)} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>After practice</span>
            <span className="font-semibold text-[var(--color-ink)]">{after}%</span>
          </div>
          <Bar score={after} band={bandFor(after)} />
        </div>
      </div>
    </div>
  );
};
