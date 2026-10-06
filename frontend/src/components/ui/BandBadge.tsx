import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Band } from '../../types/state.js';

export interface BandBadgeProps {
  band: Band;
  label?: string;
}

export const BandBadge: React.FC<BandBadgeProps> = ({ band, label }) => {
  const config = {
    strong: {
      text: label || 'Solid',
      icon: Check,
      bg: 'bg-[var(--color-strong-tint)]',
      textCol: 'text-[var(--color-strong)]',
      borderCol: 'border-[var(--color-strong)]/30',
    },
    developing: {
      text: label || 'Getting there',
      icon: Clock,
      bg: 'bg-[var(--color-developing-tint)]',
      textCol: 'text-[var(--color-developing)]',
      borderCol: 'border-[var(--color-developing)]/30',
    },
    weak: {
      text: label || 'Needs practice',
      icon: AlertCircle,
      bg: 'bg-[var(--color-weak-tint)]',
      textCol: 'text-[var(--color-weak)]',
      borderCol: 'border-[var(--color-weak)]/30',
    },
  }[band];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[13px] font-sans font-medium border ${config.bg} ${config.textCol} ${config.borderCol}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
      <span>{config.text}</span>
    </span>
  );
};
