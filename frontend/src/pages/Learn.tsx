import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { LessonHeader } from '../components/learn/LessonHeader.js';
import { VisualStage } from '../components/visual/VisualStage.js';
import { WorkedSolution } from '../components/visual/WorkedSolution.js';
import { QuickCheck } from '../components/learn/QuickCheck.js';
import { Button } from '../components/ui/Button.js';
import { Panel } from '../components/ui/Panel.js';
import {
  BINARY_SEARCH_LESSON,
  KIRCHHOFF_LESSON,
  INTEGRATE_LESSON,
} from '../utils/fixtures.js';
import { ArrowRight, Code2, CheckCircle2, RotateCcw } from 'lucide-react';

export const Learn: React.FC = () => {
  const { topic } = useParams<{ topic?: string }>();
  const navigate = useNavigate();
  const { session, updateSession } = useStudyMate();

  // Select lesson data based on URL topic parameter
  let lesson = BINARY_SEARCH_LESSON;
  if (topic === 'kirchhoffs-voltage-law' || topic === 'kirchhoff') {
    lesson = KIRCHHOFF_LESSON;
  } else if (topic === 'integration-by-parts' || topic === 'integrate') {
    lesson = INTEGRATE_LESSON;
  }

  const [customTarget, setCustomTarget] = useState<number>(session.customTarget ?? 23);

  const handleTargetChange = (newTarget: number) => {
    setCustomTarget(newTarget);
    updateSession({ customTarget: newTarget });
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1140px] mx-auto">
      {/* Lesson Header */}
      <LessonHeader
        title={lesson.title}
        subject={lesson.detected.subject}
        topic={lesson.detected.topic}
        method={lesson.detected.method}
        bigIdea={lesson.bigIdea}
        isSampleOrFallback={true}
      />

      {/* Visual Simulation Stage */}
      {lesson.visual.type !== 'none' && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-[20px] text-[var(--color-ink)]">
              Interactive Simulation
            </h2>
            <span className="text-[13px] font-sans text-[var(--color-ink-2)]">
              Change the target value to observe search space contraction
            </span>
          </div>

          <VisualStage
            spec={lesson.visual}
            initialTarget={customTarget}
            onTargetChange={handleTargetChange}
          />
        </section>
      )}

      {/* Mathematical / Worked Derivation if applicable */}
      {lesson.detected.method === 'worked_solution' && (
        <WorkedSolution lesson={lesson} />
      )}

      {/* Formative Quick Check */}
      {lesson.quickCheck && (
        <section className="mt-2">
          <QuickCheck quickCheck={lesson.quickCheck} />
        </section>
      )}

      {/* Navigation Footer to Next Steps in Loop */}
      <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-[17px] text-[var(--color-ink)]">
            Ready to test your intuition?
          </h3>
          <p className="text-[14px] font-sans text-[var(--color-ink-2)] mt-0.5">
            Answer 3 adaptive questions with confidence ratings to calibrate your mastery score.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/dsa')}
            className="inline-flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Open in DSA Lab</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-2"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
