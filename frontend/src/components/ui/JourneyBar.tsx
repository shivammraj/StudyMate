import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export type JourneyStep = 'ask' | 'learn' | 'practice' | 'results' | 'revision' | 'dsa';

export interface JourneyBarProps {
  current: JourneyStep;
}

const STEPS: { id: JourneyStep; label: string; path: string }[] = [
  { id: 'ask', label: '1. Ask', path: '/ask' },
  { id: 'learn', label: '2. Understand', path: '/learn/binary-search' },
  { id: 'practice', label: '3. Practice', path: '/practice' },
  { id: 'results', label: '4. Analysis', path: '/quiz/binary-search/results' },
  { id: 'revision', label: '5. Revision Mission', path: '/revision' },
];

export const JourneyBar: React.FC<JourneyBarProps> = ({ current }) => {
  const navigate = useNavigate();
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="Journey progress"
      className="w-full bg-[var(--color-surface)] border-b border-[var(--color-line)] py-2 px-4 sm:px-8"
    >
      <div className="max-w-[1200px] mx-auto flex items-center gap-1.5 sm:gap-2.5 text-[13px] sm:text-[14px] font-sans overflow-x-auto">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-2)] mr-2 shrink-0">
          Learning Loop:
        </span>
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === current;
          const isPast = currentIndex !== -1 && idx < currentIndex;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-line)] shrink-0" />
              )}

              {isPast ? (
                <button
                  type="button"
                  onClick={() => navigate(step.path)}
                  className="font-medium text-[var(--color-pen)] hover:underline cursor-pointer shrink-0"
                >
                  {step.label}
                </button>
              ) : isCurrent ? (
                <span
                  className="font-semibold text-[var(--color-pen)] bg-[#E8EEFD] border border-[var(--color-pen)]/20 px-2.5 py-0.5 rounded-[4px] shrink-0"
                  aria-current="step"
                >
                  {step.label}
                </span>
              ) : (
                <span className="text-[var(--color-ink-2)] opacity-60 shrink-0">
                  {step.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
