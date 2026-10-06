import React from 'react';
import { Subject, TeachingMethod } from '../../types/schemas.js';
import { Tag } from '../ui/Tag.js';

interface LessonHeaderProps {
  title: string;
  subject: Subject;
  topic: string;
  method: TeachingMethod;
  bigIdea: string;
  isSampleOrFallback?: boolean;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  subject,
  topic,
  method,
  bigIdea,
  isSampleOrFallback = false,
}) => {
  const subjectDisplay = {
    computer_science: 'Computer Science',
    electrical: 'Electrical Engineering',
    mathematics: 'Mathematics',
    mechanics: 'Mechanics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    other: 'Engineering',
  }[subject];

  const methodDisplay = {
    visual_code: 'Interactive Simulation',
    visual_circuit: 'Circuit Walkthrough',
    worked_solution: 'Worked Solution',
    concept: 'Conceptual Foundation',
  }[method];

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[var(--color-line)]">
      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        <Tag label={subjectDisplay} variant="default" />
        <Tag label={topic} variant="default" />
        <Tag label={methodDisplay} variant="pen" />
        {isSampleOrFallback && <Tag label="Verified Interactive Lesson" variant="highlight" />}
      </div>

      {/* Main Title */}
      <h1 className="text-[28px] sm:text-[34px] leading-[36px] sm:leading-[42px] font-serif font-bold text-[var(--color-ink)] tracking-tight">
        {title}
      </h1>

      {/* Big Idea */}
      <div className="p-4 sm:p-5 rounded-[6px] bg-[var(--color-surface)] border-l-[4px] border-[var(--color-pen)] border-y border-r border-[var(--color-line)] shadow-xs">
        <div className="text-[12px] font-sans font-semibold uppercase tracking-wider text-[var(--color-pen)] mb-1">
          Core Mental Model
        </div>
        <p className="text-[17px] sm:text-[18px] leading-[28px] font-serif text-[var(--color-ink)] max-w-[70ch]">
          {bigIdea}
        </p>
      </div>
    </div>
  );
};
