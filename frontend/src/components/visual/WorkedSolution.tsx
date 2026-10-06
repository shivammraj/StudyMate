import React from 'react';
import { Lesson } from '../../types/schemas.js';

interface WorkedSolutionProps {
  lesson: Lesson;
}

export const WorkedSolution: React.FC<WorkedSolutionProps> = ({ lesson }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-6 flex flex-col gap-5 shadow-xs">
      <div className="border-b border-[var(--color-line)] pb-3 flex items-center justify-between">
        <h3 className="text-[17px] font-serif font-bold text-[var(--color-ink)]">
          Worked Derivation & Reasoning
        </h3>
        <span className="text-[13px] font-sans text-[var(--color-ink-2)]">
          Step-by-step mathematical proof
        </span>
      </div>

      {/* Steps breakdown */}
      <div className="flex flex-col gap-4">
        {lesson.steps.map((st, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 p-4 rounded-[6px] bg-[#FAF8F2] border border-[var(--color-line)]/60"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--color-pen)] text-white text-[12px] font-sans font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h4 className="text-[14px] font-sans font-bold text-[var(--color-ink)]">
                {st.heading}
              </h4>
            </div>

            <p className="text-[14px] font-serif text-[var(--color-ink)] pl-7 leading-relaxed">
              {st.body}
            </p>

            {st.formula && (
              <div className="ml-7 mt-1 px-3 py-2 bg-white rounded border border-[var(--color-line)] font-mono text-[13px] text-[var(--color-pen)] overflow-x-auto">
                {st.formula}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final Answer callout if present */}
      {lesson.finalAnswer && (
        <div className="mt-2 p-4 rounded-[6px] bg-[var(--color-strong-tint)] border border-[var(--color-strong)]/40 flex items-center justify-between">
          <span className="text-[14px] font-sans font-semibold text-[var(--color-strong)]">
            Analytical Result:
          </span>
          <span className="font-mono font-bold text-[16px] text-[var(--color-strong)]">
            {lesson.finalAnswer}
          </span>
        </div>
      )}
    </div>
  );
};
