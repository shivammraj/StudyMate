import React, { useState } from 'react';
import { OptionRow } from '../ui/OptionRow.js';
import { HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface QuickCheckProps {
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const QuickCheck: React.FC<QuickCheckProps> = ({ quickCheck }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const isChecked = selectedIdx !== null;
  const isCorrect = selectedIdx === quickCheck.correctIndex;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center gap-2 text-[15px] font-sans font-semibold text-[var(--color-pen)]">
        <HelpCircle className="w-4 h-4" />
        <span>Quick Check (Formative Checkpoint)</span>
      </div>

      <p className="text-[16px] font-sans font-medium text-[var(--color-ink)] leading-relaxed">
        {quickCheck.question}
      </p>

      <div className="flex flex-col gap-2.5">
        {quickCheck.options.map((opt, idx) => (
          <OptionRow
            key={idx}
            index={idx}
            text={opt}
            selected={selectedIdx === idx}
            disabled={isChecked}
            isCorrect={idx === quickCheck.correctIndex}
            showCorrectFeedback={isChecked}
            onClick={() => setSelectedIdx(idx)}
          />
        ))}
      </div>

      {isChecked && (
        <div
          className={`p-4 rounded-[6px] border flex flex-col gap-1.5 transition-all ${
            isCorrect
              ? 'bg-[var(--color-strong-tint)] border-[var(--color-strong)]/40 text-[var(--color-strong)]'
              : 'bg-[var(--color-weak-tint)] border-[var(--color-weak)]/40 text-[var(--color-weak)]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-sans font-semibold text-[14px]">
            {isCorrect ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Spot on, Shivam!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Not quite — here is the key intuition:</span>
              </>
            )}
          </div>
          <p className="text-[14px] font-sans text-[var(--color-ink)] leading-relaxed">
            {quickCheck.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
