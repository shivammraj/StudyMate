import React from 'react';
import { Check, X } from 'lucide-react';

export interface OptionRowProps {
  index: number;
  text: string;
  selected: boolean;
  disabled?: boolean;
  isCorrect?: boolean | null;
  showCorrectFeedback?: boolean;
  onClick: () => void;
}

export const OptionRow: React.FC<OptionRowProps> = ({
  index,
  text,
  selected,
  disabled = false,
  isCorrect = null,
  showCorrectFeedback = false,
  onClick,
}) => {
  const keyNumber = index + 1;

  let stateClasses =
    'bg-[var(--color-surface)] border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-pen)] hover:bg-[#F3EFE6]';

  if (selected && !showCorrectFeedback) {
    stateClasses =
      'bg-[var(--color-surface)] border-[var(--color-pen)] ring-1 ring-[var(--color-pen)] text-[var(--color-ink)]';
  }

  if (showCorrectFeedback) {
    if (isCorrect === true) {
      stateClasses =
        'bg-[var(--color-strong-tint)] border-[var(--color-strong)] text-[var(--color-strong)]';
    } else if (selected && isCorrect === false) {
      stateClasses =
        'bg-[var(--color-weak-tint)] border-[var(--color-weak)] text-[var(--color-weak)]';
    } else {
      stateClasses =
        'bg-[var(--color-surface)] border-[var(--color-line)] opacity-60 text-[var(--color-ink)]';
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[48px] px-4 py-3 border rounded-[6px] text-left flex items-start gap-3 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pen)] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${stateClasses}`}
    >
      <span
        className={`w-6 h-6 rounded-[4px] border border-[var(--color-line)] flex items-center justify-center text-[12px] font-sans font-semibold shrink-0 mt-0.5 ${
          selected
            ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)]'
            : 'bg-white text-[var(--color-ink-2)]'
        }`}
      >
        {keyNumber}
      </span>

      <span className="flex-1 text-[15px] font-sans leading-relaxed">{text}</span>

      {showCorrectFeedback && (
        <span className="shrink-0 flex items-center mt-1">
          {isCorrect === true && (
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-strong)]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Correct</span>
            </span>
          )}
          {selected && isCorrect === false && (
            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-weak)]">
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Incorrect</span>
            </span>
          )}
        </span>
      )}
    </button>
  );
};
