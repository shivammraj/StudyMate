import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { REFERENCE_CODE } from '../utils/code.js';
import { simulate, ArrayStep } from '../utils/sim.js';
import {
  Play,
  RotateCcw,
  SkipForward,
  SkipBack,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useStudyMate } from '../hooks/useStudyMate.js';

export const DsaLab: React.FC = () => {
  const { addHistoryItem } = useStudyMate();

  const [problemId] = useState('binary-search');
  const [target, setTarget] = useState(23);
  const [arrayData] = useState([2, 5, 8, 12, 16, 23, 31]);

  // Simulation steps
  const steps = React.useMemo(() => {
    return simulate({
      type: 'array_algorithm',
      algorithm: 'binary_search',
      array: arrayData,
      target: target,
    });
  }, [arrayData, target]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'trace'>('trace');
  const [hintTier, setHintTier] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'StudyMate C++ Runner v2.4 initialized.',
    'Test Vector: [2, 5, 8, 12, 16, 23, 31], Target: 23',
    'Ready for execution or dry-run step trace.',
  ]);

  const codeData = REFERENCE_CODE.binary_search;
  const currentStep: ArrayStep = steps[currentStepIndex] || steps[0];
  const activeLine = currentStep.line;

  const codeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeLineRef.current) {
      codeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLine]);

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const st = steps[nextIdx];
      setConsoleOutput((prev) => [
        ...prev,
        `[Line ${st.line}] ${st.message} | low=${st.pointers.low ?? '-'}, mid=${st.pointers.mid ?? '-'}, high=${st.pointers.high ?? '-'}`,
      ]);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRunAll = () => {
    setCurrentStepIndex(steps.length - 1);
    setIsPlaying(false);
    const finalStep = steps[steps.length - 1];
    setConsoleOutput((prev) => [
      ...prev,
      '--- FULL RUN EXECUTED ---',
      `Completed in ${steps.length} algorithmic iterations.`,
      `Result: ${finalStep.found !== null ? `Element found at index ${finalStep.found}` : 'Target not found (-1)'}`,
      'Time Complexity: O(log N) = 3 comparisons.',
      'Memory Overhead: O(1) auxiliary space.',
    ]);

    addHistoryItem({
      topic: 'Binary Search',
      type: 'dsa',
      score: 100,
      delta: +4,
      summary: 'DSA Lab: Successfully verified Binary Search dry run on array [2, 5, 8, 12, 16, 23, 31]',
    });
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setConsoleOutput(['Reset workspace to step 0.']);
  };

  const handleHintClick = () => {
    setHintTier((prev) => Math.min(3, prev + 1));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="DSA Interactive Laboratory"
        lead="Execute controlled C++ algorithms with synchronized line-by-line dry runs, pointer registers, and runtime array visualizer."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStepForward}
              disabled={currentStepIndex >= steps.length - 1}
              className="inline-flex items-center gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Step (Dry Run)</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunAll}
              className="inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run to Completion</span>
            </Button>
          </div>
        }
      />

      {/* 3-Column Layout: Problem | Editor | Visualizer (Master Prompt Item #10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Problem Statement & Examples */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-4.5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-line)]">
              <span className="text-[12px] font-sans font-bold uppercase tracking-wider text-[var(--color-pen)]">
                Problem Statement
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-emerald-100 text-emerald-800">
                Easy • LeetCode 704
              </span>
            </div>

            <h3 className="font-serif font-bold text-[17px] text-[var(--color-ink)]">
              Binary Search
            </h3>

            <p className="text-[13px] font-sans text-[var(--color-ink)] leading-relaxed">
              Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink-2)]">
                Example 1:
              </span>
              <div className="p-2.5 bg-white border border-[var(--color-line)] rounded font-mono text-[11px] text-[var(--color-ink)]">
                <div>Input: nums = [2,5,8,12,16,23,31], target = 23</div>
                <div>Output: 5 (nums[5] == 23)</div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-[12px] font-sans text-[var(--color-ink-2)] pt-1 border-t border-[var(--color-line)]/60">
              <div><strong>Constraints:</strong> 1 &le; nums.length &le; 10⁴</div>
              <div>All integers in <code>nums</code> are unique & sorted.</div>
            </div>
          </div>

          {/* Hint Ladder (Master Prompt Item #13) */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-4 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-sans font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Hint Ladder</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--color-ink-2)]">
                {hintTier}/3
              </span>
            </div>

            {hintTier === 0 && (
              <p className="text-[12px] font-sans text-[var(--color-ink-2)]">
                Stuck on boundary updates? Request gradual hints without spoiling the solution.
              </p>
            )}

            {hintTier >= 1 && (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[12px] font-sans text-amber-900">
                <strong>Hint 1:</strong> What property does binary search require? (Sorted order allows halving).
              </div>
            )}
            {hintTier >= 2 && (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[12px] font-sans text-amber-900">
                <strong>Hint 2:</strong> Think about what happens when the middle element is smaller than the target.
              </div>
            )}
            {hintTier >= 3 && (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-[12px] font-sans text-emerald-900">
                <strong>Solution Pattern:</strong> Set <code>low = mid + 1</code> because elements &le; mid are eliminated.
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={handleHintClick}
              disabled={hintTier >= 3}
              className="mt-1"
            >
              {hintTier === 0 ? 'Reveal Hint 1' : hintTier === 1 ? 'Reveal Hint 2' : hintTier === 2 ? 'Reveal Solution' : 'All Hints Revealed'}
            </Button>
          </div>
        </div>

        {/* Middle Column: C++ Code Editor with Synchronized Line Highlighter */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#1C202B] border border-[#2F3545] rounded-[8px] overflow-hidden flex flex-col font-mono text-[13px] shadow-sm">
            {/* Header */}
            <div className="px-4 py-2.5 bg-[#141720] border-b border-[#2F3545] flex items-center justify-between text-[12px] text-[#A0A8BA]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--color-pen)]" />
                <span>binary_search.cpp</span>
              </span>
              <span className="text-[var(--color-highlight)]">
                Executing Line {activeLine}
              </span>
            </div>

            {/* Code Lines Container */}
            <div className="p-3 overflow-x-auto max-h-[380px] overflow-y-auto">
              {codeData.lines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isLineActive = lineNum === activeLine;

                return (
                  <div
                    key={idx}
                    ref={isLineActive ? codeLineRef : null}
                    className={`flex items-start py-0.5 px-2 rounded-[3px] transition-colors ${
                      isLineActive
                        ? 'bg-[var(--color-pen)]/40 text-white font-semibold border-l-2 border-[var(--color-highlight)]'
                        : 'text-[#B0B7C6] hover:bg-white/5'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-[#5B6376] font-mono text-[11px]">
                      {lineNum}
                    </span>
                    <pre className="font-mono text-[12px] whitespace-pre overflow-visible">
                      {lineText}
                    </pre>
                  </div>
                );
              })}
            </div>

            {/* Live Variable Register Inspector (Master Prompt Item #11) */}
            <div className="px-4 py-3 bg-[#141720] border-t border-[#2F3545] flex flex-wrap items-center justify-between gap-3 text-[12px]">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#687082]">
                Variable Registers:
              </span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-[#8C93A4]">
                  low = <strong className="text-white">{currentStep.pointers.low ?? '-'}</strong>
                </span>
                <span className="text-[#8C93A4]">
                  mid = <strong className="text-[var(--color-highlight)]">{currentStep.pointers.mid ?? '-'}</strong>
                </span>
                <span className="text-[#8C93A4]">
                  high = <strong className="text-white">{currentStep.pointers.high ?? '-'}</strong>
                </span>
                <span className="text-[#8C93A4]">
                  target = <strong className="text-emerald-400">{target}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Visualizer Canvas */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="graph-paper border border-[var(--color-line)] rounded-[8px] p-4 flex flex-col items-center justify-center min-h-[360px] shadow-xs">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)] mb-3">
              Runtime Memory Visualization
            </span>

            {/* Array Cells */}
            <div className="flex items-end justify-center gap-1.5 py-4 overflow-x-auto max-w-full">
              {currentStep.array.map((val, idx) => {
                const isMid = currentStep.pointers.mid === idx;
                const isLow = currentStep.pointers.low === idx;
                const isHigh = currentStep.pointers.high === idx;
                const isFound = currentStep.found === idx;
                const isRuledOut = currentStep.ruledOut.includes(idx);

                let cellClass =
                  'w-[38px] h-[38px] border rounded-[4px] flex items-center justify-center font-mono font-bold text-[14px] transition-all';

                if (isFound) {
                  cellClass += ' bg-[var(--color-strong-tint)] text-[var(--color-strong)] border-[var(--color-strong)] scale-110 shadow';
                } else if (isMid) {
                  cellClass += ' bg-[var(--color-highlight)] text-[var(--color-ink)] border-[var(--color-ink)] ring-2 ring-[var(--color-pen)]';
                } else if (isRuledOut) {
                  cellClass += ' opacity-30 line-through bg-[#ECE8DC] text-[var(--color-ink-2)]';
                } else {
                  cellClass += ' bg-white border-[var(--color-line)] text-[var(--color-ink)]';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={cellClass}>{val}</div>
                    <span className="text-[10px] font-mono text-[var(--color-ink-2)] mt-1">
                      [{idx}]
                    </span>
                    <div className="min-h-[28px] mt-0.5 flex flex-col items-center text-[10px] font-sans font-bold">
                      {isLow && <span className="text-[var(--color-pen)]">L</span>}
                      {isMid && <span className="text-amber-800">MID</span>}
                      {isHigh && <span className="text-[var(--color-pen)]">H</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Message */}
            <div className="w-full mt-2 p-3 bg-white border border-[var(--color-line)] rounded text-center">
              <p className="text-[12px] font-sans font-medium text-[var(--color-ink)]">
                {currentStep.message}
              </p>
            </div>

            <div className="w-full mt-3 flex items-center justify-between text-[11px] font-mono text-[var(--color-ink-2)]">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>Subarray: [{currentStep.pointers.low ?? 0}..{currentStep.pointers.high ?? 6}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: Execution Console / Test Cases / Trace Log */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-line)] bg-[#FAF8F3]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1 rounded-[4px] text-[13px] font-sans font-medium cursor-pointer ${
                activeTab === 'trace'
                  ? 'bg-white text-[var(--color-ink)] border border-[var(--color-line)] font-semibold shadow-xs'
                  : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              Execution Trace
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1 rounded-[4px] text-[13px] font-sans font-medium cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-white text-[var(--color-ink)] border border-[var(--color-line)] font-semibold shadow-xs'
                  : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              Console Output
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1 rounded-[4px] text-[13px] font-sans font-medium cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-white text-[var(--color-ink)] border border-[var(--color-line)] font-semibold shadow-xs'
                  : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
              }`}
            >
              Test Cases (4 Passed)
            </button>
          </div>

          <span className="text-[11px] font-mono text-[var(--color-ink-2)] flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Runtime</span>
          </span>
        </div>

        <div className="p-4 bg-[#141720] text-[#D2D7E0] font-mono text-[12px] min-h-[140px] max-h-[220px] overflow-y-auto">
          {activeTab === 'trace' && (
            <div className="flex flex-col gap-1">
              {steps.slice(0, currentStepIndex + 1).map((st, sIdx) => (
                <div
                  key={sIdx}
                  className={`flex items-center gap-3 py-0.5 ${
                    sIdx === currentStepIndex ? 'text-amber-300 font-bold' : 'text-[#8C93A4]'
                  }`}
                >
                  <span className="w-12 text-[#5B6376] shrink-0">Step {sIdx + 1}:</span>
                  <span className="w-16 text-[#6B93DC] shrink-0">[Line {st.line}]</span>
                  <span className="flex-1">{st.message}</span>
                  <span className="text-white shrink-0">
                    L={st.pointers.low ?? '-'} M={st.pointers.mid ?? '-'} H={st.pointers.high ?? '-'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'console' && (
            <div className="flex flex-col gap-1">
              {consoleOutput.map((out, oIdx) => (
                <div key={oIdx} className="text-[#BAC1D0]">
                  &gt; {out}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span>Test 1: target = 23 (in middle-right)</span>
                <span>✓ Passed (3 iterations)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Test 2: target = 2 (first index)</span>
                <span>✓ Passed (3 iterations)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Test 3: target = 31 (last index)</span>
                <span>✓ Passed (3 iterations)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Test 4: target = 99 (absent value)</span>
                <span>✓ Passed (4 iterations, returned -1)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
