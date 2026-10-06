import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bar } from '../components/ui/Bar.js';
import { ComparisonRow } from '../components/loop/ComparisonRow.js';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const {
    masteryList,
    updateMastery,
    activeMission,
    createMission,
    weaknesses,
    resources,
    toggleSaveResource,
    addHistoryItem,
  } = useStudyMate();

  const [hasUpdated, setHasUpdated] = useState(false);
  const currentTopic = 'Binary Search';
  const existingMastery = masteryList.find(
    (m) => m.topic.toLowerCase() === currentTopic.toLowerCase()
  )?.mastery ?? 68;

  const [beforeScore] = useState(68);
  const [afterScore, setAfterScore] = useState(74);

  // Propagate state update on mount
  useEffect(() => {
    if (!hasUpdated) {
      updateMastery(currentTopic, +6, {
        concept: 92,
        application: 68,
        edgeCase: 54,
      });

      // Ensure 10-minute mission is ready
      if (!activeMission) {
        createMission(
          'Binary Search',
          'Overcome off-by-one errors when mid ± 1 recalculates',
          68
        );
      }

      addHistoryItem({
        topic: 'Binary Search',
        type: 'quiz',
        score: 80,
        delta: +6,
        summary: 'Completed Boundary Checkpoint: Mastery increased from 68% to 74%',
      });

      setHasUpdated(true);
    }
  }, [hasUpdated, updateMastery, createMission, activeMission, addHistoryItem]);

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="Diagnostic Analysis"
        lead="Here is how your practice performance directly adjusted your mastery and identified targeted areas for growth."
      />

      {/* Main Mastery Delta Callout (Master Prompt Item #16) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-[#F4FAF6] border-2 border-emerald-300 rounded-[8px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[12px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <TrendingUp className="w-4 h-4" />
            <span>Mastery Calibrated</span>
          </div>

          <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[var(--color-ink)]">
            Binary Search: {beforeScore}% → <span className="text-[var(--color-strong)]">{afterScore}%</span>
          </h2>

          <p className="font-sans text-[15px] text-[var(--color-ink-2)] max-w-[56ch] leading-relaxed">
            Great progress, Shivam. You demonstrated solid grasp of the midpoint calculation formula, but our diagnostics detected boundary hesitation on single-element arrays.
          </p>
        </div>

        {/* Big Score Indicator Pill */}
        <div className="bg-white border border-emerald-200 rounded-[8px] p-5 flex flex-col items-center justify-center min-w-[180px] shadow-xs">
          <span className="text-[12px] font-sans font-bold uppercase tracking-wider text-[var(--color-ink-2)]">
            Overall Growth
          </span>
          <div className="font-serif font-bold text-[36px] text-[var(--color-strong)] leading-none my-1">
            +6%
          </div>
          <span className="text-[13px] font-sans text-emerald-700 font-medium">
            3 of 4 Correct
          </span>
        </div>
      </div>

      {/* Skill Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13px] font-sans">
            <span className="font-semibold text-[var(--color-ink)]">Core Concepts</span>
            <span className="font-mono font-bold text-[var(--color-strong)]">92% (Solid)</span>
          </div>
          <Bar score={92} />
          <p className="text-[12px] text-[var(--color-ink-2)] mt-1">
            High accuracy on sorted array prerequisite and O(log n) reasoning.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13px] font-sans">
            <span className="font-semibold text-[var(--color-ink)]">Application</span>
            <span className="font-mono font-bold text-amber-700">68% (Developing)</span>
          </div>
          <Bar score={68} />
          <p className="text-[12px] text-[var(--color-ink-2)] mt-1">
            Solid two-pointer convergence across standard arrays.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-weak)]/40 bg-[var(--color-weak-tint)]/20 rounded-[8px] p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13px] font-sans">
            <span className="font-semibold text-[var(--color-ink)]">Edge Cases & Boundaries</span>
            <span className="font-mono font-bold text-[var(--color-weak)]">54% (Weak Spot)</span>
          </div>
          <Bar score={54} />
          <p className="text-[12px] text-[var(--color-ink-2)] mt-1">
            Hesitation on <code>low &lt;= high</code> versus <code>low &lt; high</code> condition.
          </p>
        </div>
      </div>

      {/* Weakness Engine & Generated 10-Minute Mission (Master Prompt Items #18 & #19) */}
      <Panel className="border-l-[4px] border-l-amber-600">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-amber-100 text-amber-900 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-600 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                StudyMate Generated Mission
              </span>
              <h3 className="font-serif font-bold text-[20px] text-[var(--color-ink)]">
                10-Minute Revision Mission: Fix Binary Search Boundaries
              </h3>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/revision')}
            className="inline-flex items-center gap-1.5"
          >
            <span>Start Mission Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 bg-white border border-[var(--color-line)] rounded-[6px] flex flex-col gap-1">
            <span className="text-[12px] font-mono text-[var(--color-pen)] font-bold">
              Step 1 • 2 min
            </span>
            <strong className="text-[14px] font-sans text-[var(--color-ink)]">
              Review Concept Invariant
            </strong>
            <p className="text-[12px] text-[var(--color-ink-2)] leading-relaxed">
              Verify why loop must terminate strictly when low &gt; high.
            </p>
          </div>

          <div className="p-4 bg-white border border-[var(--color-line)] rounded-[6px] flex flex-col gap-1">
            <span className="text-[12px] font-mono text-[var(--color-pen)] font-bold">
              Step 2 • 3 min
            </span>
            <strong className="text-[14px] font-sans text-[var(--color-ink)]">
              Interactive Visualization
            </strong>
            <p className="text-[12px] text-[var(--color-ink-2)] leading-relaxed">
              Run target 8 to watch left boundary contract to index 2.
            </p>
          </div>

          <div className="p-4 bg-white border border-[var(--color-line)] rounded-[6px] flex flex-col gap-1">
            <span className="text-[12px] font-mono text-[var(--color-pen)] font-bold">
              Step 3 • 5 min
            </span>
            <strong className="text-[14px] font-sans text-[var(--color-ink)]">
              Targeted Boundary Problem
            </strong>
            <p className="text-[12px] text-[var(--color-ink-2)] leading-relaxed">
              One-question retake calibrated on boundary edge cases.
            </p>
          </div>
        </div>
      </Panel>

      {/* Contextual Resource Recommendations (Master Prompt Item #20) */}
      <Panel>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
          <div>
            <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
              Learn Another Way (Contextual Recommendations)
            </h3>
            <p className="text-[13px] font-sans text-[var(--color-ink-2)] mt-0.5">
              Curated specifically because you showed boundary condition hesitation.
            </p>
          </div>
          <Link
            to="/resources"
            className="text-[13px] font-sans font-semibold text-[var(--color-pen)] hover:underline"
          >
            View all resources
          </Link>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {resources.slice(0, 2).map((res) => (
            <div
              key={res.id}
              className="p-4 bg-white border border-[var(--color-line)] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-sans font-bold uppercase rounded bg-[#E8EEFD] text-[var(--color-pen)]">
                    {res.kind}
                  </span>
                  <h4 className="font-sans font-bold text-[15px] text-[var(--color-ink)]">
                    {res.title}
                  </h4>
                </div>
                <p className="text-[13px] font-sans text-[var(--color-ink-2)] mt-1">
                  Why this is recommended: <em>{res.why}</em>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => toggleSaveResource(res.id)}
                  className="inline-flex items-center gap-1"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      res.saved ? 'fill-[var(--color-pen)] text-[var(--color-pen)]' : ''
                    }`}
                  />
                  <span>{res.saved ? 'Saved' : 'Save'}</span>
                </Button>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-line)] hover:bg-[#F0ECE1] rounded-[6px] text-[13px] font-sans font-semibold text-[var(--color-ink)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/knowledge-map')}
            className="inline-flex items-center gap-1.5"
          >
            <span>See in Knowledge Map</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/revision')}
            className="inline-flex items-center gap-1.5"
          >
            <span>Launch Revision Mission</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
