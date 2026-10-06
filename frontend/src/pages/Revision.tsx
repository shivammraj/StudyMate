import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bar } from '../components/ui/Bar.js';
import {
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const Revision: React.FC = () => {
  const navigate = useNavigate();
  const { activeMission, completeMissionStep, student } = useStudyMate();
  const [retakeSelected, setRetakeSelected] = useState<number | null>(null);
  const [retakeChecked, setRetakeChecked] = useState(false);

  if (!activeMission) {
    return (
      <div className="max-w-[700px] mx-auto py-12 text-center flex flex-col items-center gap-4">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-strong)]" />
        <h2 className="font-serif font-bold text-[24px]">All Revision Missions Complete!</h2>
        <p className="text-[14px] text-[var(--color-ink-2)]">
          You currently have zero active weak spot missions. Continue exploring new topics or practicing existing concepts.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const completedCount = activeMission.steps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedCount / activeMission.steps.length) * 100);

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="10-Minute Revision Mission"
        lead="A hyper-focused 3-step sprint designed to repair the exact boundary invariant causing missed points."
      />

      {/* Mission Status Header */}
      <div className="bg-[var(--color-surface)] border-2 border-amber-300 rounded-[8px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>Targeted Sprint</span>
          </div>
          <h2 className="font-serif font-bold text-[24px] text-[var(--color-ink)] mt-1">
            {activeMission.title}
          </h2>
          <p className="font-sans text-[14px] text-[var(--color-ink-2)] mt-1">
            Topic: <strong>{activeMission.topic}</strong> • Goal: Increase mastery from{' '}
            {activeMission.beforeMastery}% to {activeMission.afterMastery}%
          </p>
        </div>

        <div className="bg-white border border-[var(--color-line)] rounded-[8px] p-4 min-w-[180px] flex flex-col items-center justify-center shadow-xs">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)]">
            Mission Progress
          </span>
          <div className="font-mono font-bold text-[28px] text-[var(--color-pen)] my-0.5">
            {progressPercent}%
          </div>
          <span className="text-[12px] text-[var(--color-ink-2)]">
            {completedCount} of {activeMission.steps.length} Steps
          </span>
        </div>
      </div>

      {/* 3 Step Interactive Checklist */}
      <div className="flex flex-col gap-5">
        {/* Step 1: Concept Review */}
        <Panel className="border-l-[4px] border-l-[var(--color-pen)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={activeMission.steps[0]?.done}
                onChange={() => completeMissionStep(activeMission.steps[0]?.id)}
                className="mt-1 w-5 h-5 rounded text-[var(--color-pen)] cursor-pointer"
              />
              <div>
                <span className="text-[12px] font-mono font-bold text-[var(--color-pen)]">
                  Step 1 • 2 Minutes
                </span>
                <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                  Review the Loop Invariant
                </h3>
                <p className="text-[14px] text-[var(--color-ink-2)] mt-1 leading-relaxed">
                  The binary search invariant states: <em>If the target exists in the array, it is guaranteed to lie in the range <code>[low..high]</code>.</em>
                </p>
                <div className="p-3 my-2 bg-white rounded border border-[var(--color-line)] font-mono text-[13px] text-[var(--color-ink)]">
                  while (low &lt;= high) &#123; <br />
                  &nbsp;&nbsp;int mid = low + (high - low) / 2;<br />
                  &nbsp;&nbsp;if (nums[mid] == target) return mid;<br />
                  &nbsp;&nbsp;if (nums[mid] &lt; target) low = mid + 1; // eliminate left<br />
                  &nbsp;&nbsp;else high = mid - 1; // eliminate right<br />
                  &#125;
                </div>
              </div>
            </div>

            <Button
              variant={activeMission.steps[0]?.done ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => completeMissionStep(activeMission.steps[0]?.id)}
            >
              {activeMission.steps[0]?.done ? 'Done ✓' : 'Mark Done'}
            </Button>
          </div>
        </Panel>

        {/* Step 2: Interactive Visualizer Test */}
        <Panel className="border-l-[4px] border-l-[var(--color-highlight)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={activeMission.steps[1]?.done}
                onChange={() => completeMissionStep(activeMission.steps[1]?.id)}
                className="mt-1 w-5 h-5 rounded text-[var(--color-pen)] cursor-pointer"
              />
              <div>
                <span className="text-[12px] font-mono font-bold text-amber-800">
                  Step 2 • 3 Minutes
                </span>
                <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                  Interactive Visualization Test
                </h3>
                <p className="text-[14px] text-[var(--color-ink-2)] mt-1 leading-relaxed">
                  Verify how the pointers behave when searching for boundary values (first and last elements).
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/learn/binary-search')}
                    className="inline-flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Interactive Visualizer</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant={activeMission.steps[1]?.done ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => completeMissionStep(activeMission.steps[1]?.id)}
            >
              {activeMission.steps[1]?.done ? 'Done ✓' : 'Mark Done'}
            </Button>
          </div>
        </Panel>

        {/* Step 3: Targeted Retake Challenge */}
        <Panel className="border-l-[4px] border-l-[var(--color-strong)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                checked={activeMission.steps[2]?.done}
                onChange={() => completeMissionStep(activeMission.steps[2]?.id)}
                className="mt-1 w-5 h-5 rounded text-[var(--color-pen)] cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-[12px] font-mono font-bold text-[var(--color-strong)]">
                  Step 3 • 5 Minutes
                </span>
                <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                  Targeted Boundary Retake Challenge
                </h3>
                <p className="text-[14px] text-[var(--color-ink)] mt-2 font-medium">
                  If <code>low = 3</code> and <code>high = 3</code>, what is the value of <code>mid = low + (high - low) / 2</code>, and will the loop execute?
                </p>

                <div className="flex flex-col gap-2 mt-3">
                  {[
                    'mid = 3; yes, loop executes because low <= high is true',
                    'mid = 3; no, loop terminates because low equals high',
                    'mid = 0; index out of bounds error',
                  ].map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`p-3 rounded border text-[13px] font-sans flex items-center gap-3 cursor-pointer select-none transition-colors ${
                        retakeSelected === oIdx
                          ? 'bg-[#E8EEFD] border-[var(--color-pen)] font-semibold'
                          : 'bg-white border-[var(--color-line)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="retake"
                        checked={retakeSelected === oIdx}
                        onChange={() => {
                          setRetakeSelected(oIdx);
                          setRetakeChecked(false);
                        }}
                        className="text-[var(--color-pen)]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {retakeChecked && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-[13px]">
                    ✓ Correct! When low == high, exactly 1 element remains to be inspected, so the loop executes.
                  </div>
                )}

                <div className="mt-3">
                  {!retakeChecked ? (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={retakeSelected === null}
                      onClick={() => {
                        setRetakeChecked(true);
                        completeMissionStep(activeMission.steps[2]?.id);
                      }}
                    >
                      Verify Answer
                    </Button>
                  ) : (
                    <span className="text-[13px] font-sans font-bold text-[var(--color-strong)]">
                      Challenge passed!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Completion Banner */}
      {activeMission.completed && (
        <div className="p-6 bg-gradient-to-r from-emerald-100 to-teal-50 border-2 border-emerald-400 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[var(--color-strong)]" />
            <div>
              <h3 className="font-serif font-bold text-[20px] text-[var(--color-ink)]">
                Mission Completed! +6% Mastery Calibrated
              </h3>
              <p className="text-[13px] text-[var(--color-ink-2)]">
                Shivam's Binary Search score has been increased from 68% to 74% across the Knowledge Map and Dashboard.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};
