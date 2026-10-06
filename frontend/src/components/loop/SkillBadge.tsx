import React from 'react';
import { BookOpen, Lightbulb, Wrench } from 'lucide-react';
import { Skill } from '../../types/schemas.js';

interface SkillBadgeProps {
  skill: Skill;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const config = {
    recall: {
      label: 'Core Concept Recall',
      icon: BookOpen,
      bg: 'bg-[#EDE9DE]',
      text: 'text-[var(--color-ink-2)]',
    },
    understanding: {
      label: 'Algorithmic Intuition',
      icon: Lightbulb,
      bg: 'bg-[var(--color-developing-tint)]',
      text: 'text-[var(--color-developing)]',
    },
    application: {
      label: 'Edge Case & Boundary',
      icon: Wrench,
      bg: 'bg-[#E3E8F8]',
      text: 'text-[var(--color-pen)]',
    },
  }[skill];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[12px] font-sans font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
