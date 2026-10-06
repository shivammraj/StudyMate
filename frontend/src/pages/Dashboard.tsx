import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bar } from '../components/ui/Bar.js';
import {
  Sparkles,
  Zap,
  Flame,
  Award,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Code2,
  Network,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { student, masteryList, activeMission, weaknesses, completeMissionStep } = useStudyMate();
  const navigate = useNavigate();

  const binarySearchMastery = masteryList.find(
    (m) => m.topic.toLowerCase() === 'binary search'
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--color-surface)] to-[#F4EFE6] border border-[var(--color-line)] rounded-[8px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#E8EEFD] text-[var(--color-pen)] text-[12px] font-sans font-semibold mb-3 border border-[var(--color-pen)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Learning Engine Active</span>
          </div>
          <h1 className="font-serif font-bold text-[28px] sm:text-[34px] text-[var(--color-ink)] tracking-tight leading-tight">
            Good morning, Shivam.
          </h1>
          <p className="font-sans text-[16px] text-[var(--color-ink-2)] mt-2 leading-relaxed">
            Ready to understand something new today? Your current focus is closing the edge-case gap in <strong className="text-[var(--color-ink)]">Binary Search</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/ask')}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask StudyMate</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/learn/binary-search')}
              className="inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Binary Search</span>
            </Button>
            <Button
              variant="quiet"
              size="md"
              onClick={() => navigate('/dsa')}
              className="inline-flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Open DSA Lab</span>
            </Button>
          </div>
        </div>

        {/* Student Quick Stats Pill */}
        <div className="bg-white border border-[var(--color-line)] rounded-[8px] p-5 flex flex-col gap-3 min-w-[220px] shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-line)]/60">
            <span className="text-[12px] uppercase font-sans font-bold text-[var(--color-ink-2)]">
              Daily Streak
            </span>
            <span className="flex items-center gap-1 font-sans font-bold text-amber-700 text-[14px]">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
              {student.streak} Days
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-line)]/60">
            <span className="text-[12px] uppercase font-sans font-bold text-[var(--color-ink-2)]">
              Experience
            </span>
            <span className="font-mono font-bold text-[var(--color-pen)] text-[14px]">
              {student.xp} XP
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase font-sans font-bold text-[var(--color-ink-2)]">
              Questions Solved
            </span>
            <span className="font-mono font-bold text-[var(--color-ink)] text-[14px]">
              {student.questionsSolved}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Active Revision Mission + Weak Spot Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active 10-Minute Mission (Master Prompt Item #19) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {activeMission && (
            <Panel className="border-l-[4px] border-l-amber-600">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[4px] bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Zap className="w-4 h-4 fill-amber-600 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800">
                      10-Minute Revision Mission
                    </span>
                    <h2 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                      {activeMission.title}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[12px] font-sans text-[var(--color-ink-2)]">
                    Target Mastery:
                  </span>
                  <div className="font-mono font-bold text-[14px] text-[var(--color-strong)]">
                    {activeMission.beforeMastery}% → {activeMission.afterMastery}%
                  </div>
                </div>
              </div>

              <p className="text-[14px] font-sans text-[var(--color-ink-2)] mt-3 leading-relaxed">
                Focus: <strong>{activeMission.focus}</strong>. Generated automatically after detecting boundary mistakes.
              </p>

              {/* Mission Steps Checklist */}
              <div className="flex flex-col gap-2.5 mt-4">
                {activeMission.steps.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => completeMissionStep(st.id)}
                    className={`p-3 rounded-[6px] border flex items-start gap-3 transition-colors cursor-pointer select-none ${
                      st.done
                        ? 'bg-[var(--color-strong-tint)] border-[var(--color-strong)]/40 text-[var(--color-strong)]'
                        : 'bg-white border-[var(--color-line)] hover:bg-[#FAF8F3] text-[var(--color-ink)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={st.done}
                      onChange={() => completeMissionStep(st.id)}
                      className="mt-0.5 w-4 h-4 rounded text-[var(--color-pen)] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-semibold text-[14px]">
                          {st.title}
                        </span>
                        <span className="text-[12px] text-[var(--color-ink-2)] font-mono">
                          {st.minutes} min
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--color-ink-2)] mt-0.5">
                        {st.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex items-center justify-between">
                <span className="text-[12px] font-sans text-[var(--color-ink-2)]">
                  {activeMission.steps.filter((s) => s.done).length} of {activeMission.steps.length} tasks completed
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/revision')}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>Launch Revision Mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Panel>
          )}

          {/* Quick Ask StudyMate Card */}
          <Panel>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--color-pen)]" />
              <h2 className="font-serif font-bold text-[17px] text-[var(--color-ink)]">
                Ask StudyMate a Concept
              </h2>
            </div>
            <p className="text-[14px] font-sans text-[var(--color-ink-2)] mb-3">
              StudyMate will determine subject, detect difficulty, and prepare a tailored interactive visualizer.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate('/ask');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                defaultValue="Explain binary search"
                readOnly
                className="flex-1 min-h-[42px] px-3.5 bg-white border border-[var(--color-line)] rounded-[6px] text-[15px] font-sans text-[var(--color-ink)]"
              />
              <Button type="submit" variant="primary" size="md">
                Analyze
              </Button>
            </form>
          </Panel>
        </div>

        {/* Right Column: Weak Spot Diagnosis & Knowledge Map Highlights */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Weakness Engine Card */}
          <Panel>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--color-weak)]" />
                <h2 className="font-serif font-bold text-[17px] text-[var(--color-ink)]">
                  Active Weak Spots
                </h2>
              </div>
              <Link
                to="/weaknesses"
                className="text-[12px] font-sans font-semibold text-[var(--color-pen)] hover:underline"
              >
                View all ({weaknesses.length})
              </Link>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {weaknesses.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="p-3 bg-white border border-[var(--color-line)] rounded-[6px] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-sans font-bold text-[var(--color-ink)]">
                      {w.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-[var(--color-weak-tint)] text-[var(--color-weak)] border border-[var(--color-weak)]/30">
                      {w.score}% Mastery
                    </span>
                  </div>
                  <p className="text-[12px] font-sans text-[var(--color-ink-2)]">
                    {w.area}
                  </p>
                  <div className="text-[11px] text-[var(--color-ink-2)]/80 mt-0.5">
                    Missed in practice: {w.missedQuestionsCount} times
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-line)]">
              <Link
                to="/practice"
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#E8EEFD] text-[var(--color-pen)] text-[13px] font-sans font-semibold rounded-[6px] hover:bg-[#DDE6FC] transition-colors"
              >
                <span>Practice Weak Areas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Panel>

          {/* Current Mastery Overview */}
          <Panel>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
              <h2 className="font-serif font-bold text-[17px] text-[var(--color-ink)]">
                Topic Mastery
              </h2>
              <Link
                to="/knowledge-map"
                className="text-[12px] font-sans font-semibold text-[var(--color-pen)] hover:underline"
              >
                Full Knowledge Map
              </Link>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
              {masteryList.slice(0, 4).map((m) => (
                <div key={m.topic} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[13px] font-sans">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {m.topic}
                    </span>
                    <span className="font-mono text-[var(--color-ink-2)]">
                      {m.mastery}%
                    </span>
                  </div>
                  <Bar score={m.mastery} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
