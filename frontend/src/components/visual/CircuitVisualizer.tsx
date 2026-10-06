import React, { useState, useEffect } from 'react';
import { VisualSpec } from '../../types/schemas.js';
import { solveSeries, circuitSteps } from '../../utils/sim.js';
import { Button } from '../ui/Button.js';
import { CheckCircle2, RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface CircuitVisualizerProps {
  spec: Extract<VisualSpec, { type: 'circuit_series' }>;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({ spec }) => {
  const solution = React.useMemo(() => solveSeries(spec), [spec]);
  const steps = React.useMemo(() => circuitSteps(spec), [spec]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Circuit Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="graph-paper border border-[var(--color-line)] rounded-[8px] p-6 flex flex-col items-center justify-center min-h-[340px] relative shadow-xs">
            <svg
              viewBox="0 0 500 320"
              className="w-full max-w-[480px] h-auto select-none"
            >
              {/* Outer Loop Wire */}
              <rect
                x="60"
                y="50"
                width="380"
                height="220"
                rx="6"
                fill="none"
                stroke="#1B1F2A"
                strokeWidth="3"
              />

              {/* DC Voltage Source (Left branch) */}
              <g transform="translate(60, 160)">
                <rect x="-16" y="-28" width="32" height="56" fill="#F4F2EC" />
                <line x1="-18" y1="-12" x2="18" y2="-12" stroke="#1B1F2A" strokeWidth="4" />
                <line x1="-10" y1="12" x2="10" y2="12" stroke="#1B1F2A" strokeWidth="3" />
                <text x="-32" y="-18" fill="#2A44A6" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                  +
                </text>
                <text x="-30" y="22" fill="#586070" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                  -
                </text>
                <text x="-48" y="4" fill="#1B1F2A" fontSize="14" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
                  {spec.voltage}V
                </text>
              </g>

              {/* Resistor R1 (Top branch) */}
              <g transform="translate(250, 50)">
                <rect x="-35" y="-14" width="70" height="28" fill="#F4F2EC" stroke="#1B1F2A" strokeWidth="2.5" rx="3" />
                <text x="0" y="5" fill="#1B1F2A" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {spec.resistors[0]?.label || 'R1'} ({spec.resistors[0]?.ohms}Ω)
                </text>
                <text x="0" y="-22" fill="#2A44A6" fontSize="12" fontWeight="semibold" textAnchor="middle" fontFamily="sans-serif">
                  {solution.drops[0]?.volts}V drop
                </text>
              </g>

              {/* Resistor R2 (Right branch) */}
              {spec.resistors[1] && (
                <g transform="translate(440, 160)">
                  <rect x="-14" y="-35" width="28" height="70" fill="#F4F2EC" stroke="#1B1F2A" strokeWidth="2.5" rx="3" />
                  <text x="24" y="4" fill="#1B1F2A" fontSize="13" fontWeight="bold" textAnchor="start" fontFamily="sans-serif">
                    {spec.resistors[1]?.label || 'R2'} ({spec.resistors[1]?.ohms}Ω)
                  </text>
                  <text x="24" y="24" fill="#2A44A6" fontSize="12" fontWeight="semibold" textAnchor="start" fontFamily="sans-serif">
                    {solution.drops[1]?.volts}V drop
                  </text>
                </g>
              )}

              {/* Direction Loop Arrow */}
              <circle cx="250" cy="160" r="42" fill="none" stroke="#2A44A6" strokeWidth="2" strokeDasharray="5,4" />
              <polygon points="250,118 258,114 258,122" fill="#2A44A6" />
              <text x="250" y="165" fill="#2A44A6" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                I = {solution.current}A
              </text>
            </svg>

            {/* Explanation Callout */}
            <div className="w-full mt-4 p-3.5 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[6px] text-center">
              <p className="text-[14px] sm:text-[15px] font-serif font-medium text-[var(--color-ink)] leading-relaxed">
                {currentStep.message}
              </p>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between p-3.5 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px]">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <Button
                variant={isPlaying ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1 min-w-[80px]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </>
                )}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={currentStepIndex >= steps.length - 1}
                className="inline-flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono text-[var(--color-ink-2)]">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <Button variant="quiet" size="sm" onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calculations Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-5 flex flex-col gap-4 shadow-xs">
            <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)] border-b border-[var(--color-line)] pb-2">
              Kirchhoff's Voltage Law (KVL)
            </h3>
            <div className="p-3 bg-[#E8EEFD] border border-[var(--color-pen)]/20 rounded-[6px] font-mono text-[13px] text-[var(--color-pen)]">
              Σ V = 0  ⇒  V_source - V_R1 - V_R2 = 0
            </div>

            <div className="flex flex-col gap-2.5 text-[14px] font-sans">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-line)]/50">
                <span className="text-[var(--color-ink-2)]">Total Equivalent Resistance:</span>
                <span className="font-mono font-bold text-[var(--color-ink)]">{solution.totalOhms} Ω</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-line)]/50">
                <span className="text-[var(--color-ink-2)]">Series Loop Current (I = V/R):</span>
                <span className="font-mono font-bold text-[var(--color-pen)]">{solution.current} A</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-line)]/50">
                <span className="text-[var(--color-ink-2)]">Voltage Drop on R1 (I × R1):</span>
                <span className="font-mono font-bold text-[var(--color-ink)]">{solution.drops[0]?.volts} V</span>
              </div>
              {solution.drops[1] !== undefined && (
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-line)]/50">
                  <span className="text-[var(--color-ink-2)]">Voltage Drop on R2 (I × R2):</span>
                  <span className="font-mono font-bold text-[var(--color-ink)]">{solution.drops[1]?.volts} V</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-[6px] bg-[var(--color-strong-tint)] text-[var(--color-strong)] flex items-center gap-2 text-[13px] font-sans font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Conservation of Energy holds: {solution.kvl.dropsTotal}V = {spec.voltage}V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
