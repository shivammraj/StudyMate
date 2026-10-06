import React from 'react';
import { VisualSpec } from '../../types/schemas.js';
import { ArrayVisualizer } from './ArrayVisualizer.js';
import { CircuitVisualizer } from './CircuitVisualizer.js';

export interface VisualStageProps {
  spec: VisualSpec;
  initialTarget?: number;
  initialArray?: number[];
  onTargetChange?: (newTarget: number) => void;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  spec,
  initialTarget,
  initialArray,
  onTargetChange,
}) => {
  if (spec.type === 'none') {
    return null;
  }

  if (spec.type === 'array_algorithm') {
    return (
      <ArrayVisualizer
        spec={spec}
        initialTarget={initialTarget}
        initialArray={initialArray}
        onTargetChange={onTargetChange}
      />
    );
  }

  if (spec.type === 'circuit_series') {
    return <CircuitVisualizer spec={spec} />;
  }

  return null;
};
