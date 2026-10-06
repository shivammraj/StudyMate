import React, { useState, useEffect, useRef } from 'react';
import { VisualSpec } from '../../types/schemas.js';
import { simulate, ArrayStep } from '../../utils/sim.js';
import { REFERENCE_CODE } from '../../utils/code.js';
import { Button } from '../ui/Button.js';
import { SegmentedControl } from '../ui/SegmentedControl.js';
import { Check, RotateCcw, Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ArrayVisualizerProps {
  spec: Extract<VisualSpec, { type: 'array_algorithm' }>;
  initialTarget?: number;
  initialArray?: number[];
  onTargetChange?: (newTarget: number) => void;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  spec,
  initialTarget,
  initialArray,
  onTargetChange,
}) => {
  const [target, setTarget] = useState<number>(initialTarget ?? (spec.target ?? 23));
  const [arrayData] = useState<number[]>(initialArray ?? spec.array);
  const [targetInput, setTargetInput] = useState<string>(String(target));

  // Compute simulation steps dynamically from current target & array
  const steps = React.useMemo(() => {
    return simulate({
      ...spec,
      array: arrayData,
      target: target,
    });
  }, [spec, arrayData, target]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'watch' | 'predict'>('watch');

  // Predict mode state
  const [predictedAnswers, setPredictedAnswers] = useState<Record<number, number>>({});
  const [predictFeedback, setPredictFeedback] = useState<string | null>(null);

  const step: ArrayStep = steps[currentStepIndex] || steps[0] || {
    array: arrayData,
    pointers: {},
    ruledOut: [],
    message: 'Starting search',
    line: 1,
  };

  const codeInfo = REFERENCE_CODE[spec.algorithm] || REFERENCE_CODE.binary_search;
  const activeLineNumber = step.line;

  // Auto-play timer (1.2s interval)
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
      }, 1300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length]);

  // Active code line auto scroll
  const activeLineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setPredictFeedback(null);
    } else {
      setIsPlaying(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setPredictFeedback(null);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setPredictedAnswers({});
    setPredictFeedback(null);
  };

  const handlePresetTarget = (newVal: number) => {
    setTarget(newVal);
    setTargetInput(String(newVal));
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setPredictFeedback(null);
    if (onTargetChange) onTargetChange(newVal);
  };

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(targetInput.trim(), 10);
    if (!isNaN(parsed)) {
      setTarget(parsed);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setPredictFeedback(null);
      if (onTargetChange) onTargetChange(parsed);
    }
  };

  const handlePredictAnswer = (choiceIdx: number) => {
    if (!step.predict) return;
    setPredictedAnswers((prev) => ({ ...prev, [currentStepIndex]: choiceIdx }));
    const isCorrect = choiceIdx === step.predict.correctIndex;
    if (isCorrect) {
      setPredictFeedback('✓ Correct! Search space halves exactly as expected.');
      setTimeout(() => {
        handleNext();
      }, 900);
    } else {
      setPredictFeedback('Not quite. Notice the pointer boundaries (low/high).');
      setTimeout(() => {
        handleNext();
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Interactive Controls Bar */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        {/* Preset Target Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-sans font-medium text-[var(--color-ink-2)] mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => handlePresetTarget(8)}
            className={`px-2.5 py-1 text-[13px] font-sans rounded-[4px] border transition-colors cursor-pointer ${
              target === 8
                ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)] font-semibold'
                : 'bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:bg-[#F0ECE1]'
            }`}
          >
            Find 8
          </button>
          <button
            type="button"
            onClick={() => handlePresetTarget(16)}
            className={`px-2.5 py-1 text-[13px] font-sans rounded-[4px] border transition-colors cursor-pointer ${
              target === 16
                ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)] font-semibold'
                : 'bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:bg-[#F0ECE1]'
            }`}
          >
            Find 16
          </button>
          <button
            type="button"
            onClick={() => handlePresetTarget(23)}
            className={`px-2.5 py-1 text-[13px] font-sans rounded-[4px] border transition-colors cursor-pointer ${
              target === 23
                ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)] font-semibold'
                : 'bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:bg-[#F0ECE1]'
            }`}
          >
            Find 23
          </button>
          <button
            type="button"
            onClick={() => handlePresetTarget(99)}
            className={`px-2.5 py-1 text-[13px] font-sans rounded-[4px] border transition-colors cursor-pointer ${
              target === 99
                ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)] font-semibold'
                : 'bg-white text-[var(--color-ink)] border-[var(--color-line)] hover:bg-[#F0ECE1]'
            }`}
          >
            Not found (99)
          </button>
        </div>

        {/* Custom Target Form & Mode Switch */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleTargetSubmit} className="flex items-center gap-1.5">
            <label htmlFor="target-input" className="text-[13px] font-sans text-[var(--color-ink-2)]">
              Target:
            </label>
            <input
              id="target-input"
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-16 h-8 px-2 bg-white border border-[var(--color-line)] rounded-[4px] text-center font-mono font-bold text-[14px] text-[var(--color-pen)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pen)]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[4px] text-[12px] font-sans font-medium text-[var(--color-ink)] hover:bg-[#F0ECE1] cursor-pointer"
            >
              Set
            </button>
          </form>

          <SegmentedControl
            options={[
              { id: 'watch', label: 'Watch' },
              { id: 'predict', label: 'Predict' },
            ]}
            value={mode}
            onChange={(val) => {
              setMode(val as 'watch' | 'predict');
              setIsPlaying(false);
            }}
          />
        </div>
      </div>

      {/* Main Grid: Visualizer Stage + Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Stage Column (Visual) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="graph-paper border border-[var(--color-line)] rounded-[8px] p-4 sm:p-6 flex flex-col items-center justify-center min-h-[340px] overflow-x-auto relative shadow-xs">
            {/* Target indicator banner */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-[var(--color-line)]/50 text-[13px] font-sans text-[var(--color-ink-2)] mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[var(--color-pen)]" />
                Algorithm: <strong className="text-[var(--color-ink)] capitalize">{spec.algorithm.replace('_', ' ')}</strong>
              </span>
              <span>
                Target Value: <strong className="text-[var(--color-pen)] font-mono font-bold text-[15px] bg-white px-2 py-0.5 rounded border border-[var(--color-line)]">{target}</strong>
              </span>
            </div>

            {/* Array Cells Row */}
            <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 py-8 px-2 min-w-max">
              {step.array.map((val, idx) => {
                const isMid = step.pointers.mid === idx;
                const isLow = step.pointers.low === idx;
                const isHigh = step.pointers.high === idx;
                const isFound = step.found === idx;
                const isRuledOut = step.ruledOut.includes(idx);

                // Collect pointer labels
                const pointerLabels: string[] = [];
                if (isLow) pointerLabels.push('low');
                if (isMid) pointerLabels.push('mid');
                if (isHigh) pointerLabels.push('high');

                // Styling logic per design system
                let cellClasses =
                  'w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] border rounded-[6px] flex items-center justify-center font-mono font-bold text-[16px] sm:text-[18px] transition-all duration-300 select-none';

                if (isFound) {
                  cellClasses +=
                    ' bg-[var(--color-strong-tint)] text-[var(--color-strong)] border-[var(--color-strong)] ring-2 ring-[var(--color-strong)] scale-110 shadow-md';
                } else if (isMid) {
                  cellClasses +=
                    ' bg-[var(--color-highlight)] text-[var(--color-ink)] border-[var(--color-ink)] ring-2 ring-[var(--color-pen)] scale-105 shadow-sm';
                } else if (isRuledOut) {
                  cellClasses +=
                    ' opacity-25 line-through bg-[#ECE8DC] border-[var(--color-line)] text-[var(--color-ink-2)]';
                } else {
                  cellClasses +=
                    ' bg-white border-[var(--color-line)] text-[var(--color-ink)] shadow-xs';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* The cell box */}
                    <div className={cellClasses}>{val}</div>

                    {/* Array Index */}
                    <span className="text-[11px] sm:text-[12px] font-mono text-[var(--color-ink-2)] mt-1.5 select-none">
                      [{idx}]
                    </span>

                    {/* Stacked Pointer Labels */}
                    <div className="flex flex-col items-center mt-1 min-h-[44px]">
                      {pointerLabels.map((lbl) => (
                        <span
                          key={lbl}
                          className={`text-[11px] font-sans font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-0.5 ${
                            lbl === 'mid'
                              ? 'bg-[var(--color-highlight)] text-[var(--color-ink)] border border-[var(--color-ink)]'
                              : 'bg-[var(--color-pen)] text-white'
                          }`}
                        >
                          {lbl}
                        </span>
                      ))}
                      {isFound && (
                        <span className="text-[11px] text-[var(--color-strong)] font-sans font-bold flex items-center gap-0.5 mt-0.5 animate-bounce">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Found!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Message */}
            <div
              aria-live="polite"
              className="w-full mt-2 p-3.5 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[6px] text-center"
            >
              <p className="text-[14px] sm:text-[15px] font-serif font-medium text-[var(--color-ink)] leading-relaxed">
                {step.message}
              </p>
            </div>

            {/* Predict Mode Overlay Question */}
            {mode === 'predict' && step.predict && (
              <div className="w-full mt-4 p-4 rounded-[6px] bg-[#EBF1FA] border border-[var(--color-pen)]/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-sans font-bold text-[var(--color-pen)] uppercase tracking-wider">
                    Prediction Challenge
                  </span>
                  <span className="text-[12px] font-sans text-[var(--color-ink-2)]">
                    Step {currentStepIndex + 1}
                  </span>
                </div>
                <p className="text-[14px] font-sans font-semibold text-[var(--color-ink)]">
                  {step.predict.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.predict.options.map((opt, oIdx) => {
                    const isSelected = predictedAnswers[currentStepIndex] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handlePredictAnswer(oIdx)}
                        className={`px-3 py-1.5 rounded-[4px] text-[13px] font-sans font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--color-pen)] text-white border-[var(--color-pen)]'
                            : 'bg-white border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[#F0ECE1]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {predictFeedback && (
                  <p className="text-[13px] font-sans font-semibold text-[var(--color-pen)] mt-1">
                    {predictFeedback}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Stepper Controls Bar */}
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
              <span className="text-[13px] font-mono text-[var(--color-ink-2)] tabular-nums">
                Step <strong>{currentStepIndex + 1}</strong> of <strong>{steps.length}</strong>
              </span>

              <Button
                variant="quiet"
                size="sm"
                onClick={handleReset}
                title="Reset simulation"
                className="inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Code Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#1C202B] text-[#D2D7E0] border border-[var(--color-line)] rounded-[8px] overflow-hidden flex flex-col font-mono text-[13px] shadow-sm">
            {/* Code Header */}
            <div className="px-4 py-2.5 bg-[#141720] border-b border-[#2B303E] flex items-center justify-between text-[12px] text-[#8C93A4] font-sans">
              <span className="font-semibold text-white">
                {spec.algorithm}.cpp ({codeInfo.language.toUpperCase()})
              </span>
              <span>Line {activeLineNumber}</span>
            </div>

            {/* Code lines container */}
            <div className="p-3 overflow-x-auto max-h-[380px] overflow-y-auto">
              {codeInfo.lines.map((codeLine, idx) => {
                const lineNum = idx + 1;
                const isActive = lineNum === activeLineNumber;

                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    className={`flex items-start py-0.5 px-2 rounded-[3px] transition-colors ${
                      isActive
                        ? 'bg-[var(--color-pen)]/35 text-white font-semibold border-l-2 border-[var(--color-highlight)]'
                        : 'text-[#B0B7C6] hover:bg-white/5'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-[#5B6376] font-mono text-[11px]">
                      {lineNum}
                    </span>
                    <pre className="font-mono text-[12px] whitespace-pre overflow-visible">
                      {codeLine}
                    </pre>
                  </div>
                );
              })}
            </div>

            {/* Live Variable Inspector Footer */}
            <div className="px-4 py-2.5 bg-[#141720] border-t border-[#2B303E] flex items-center justify-between text-[12px] text-[#A0A8BA]">
              <span className="text-[11px] uppercase tracking-wider text-[#687082]">
                Variables:
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span>low = <strong className="text-white">{step.pointers.low ?? '-'}</strong></span>
                <span>mid = <strong className="text-[var(--color-highlight)]">{step.pointers.mid ?? '-'}</strong></span>
                <span>high = <strong className="text-white">{step.pointers.high ?? '-'}</strong></span>
                <span>target = <strong className="text-emerald-400">{target}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
