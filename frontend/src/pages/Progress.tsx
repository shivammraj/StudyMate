import React from 'react';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Bar } from '../components/ui/Bar.js';
import { TrendingUp, Award, Clock, CheckCircle2, History } from 'lucide-react';

export const Progress: React.FC = () => {
  const { student, masteryList, history } = useStudyMate();

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="Student Learning Analytics"
        lead="Comprehensive telemetry tracking Shivam Mavi's diagnostic mastery, problem accuracy, and historical retention."
      />

      {/* Top Highlight Banner */}
      <div className="bg-gradient-to-r from-[#E8EEFD] to-[#DDE7FA] border border-[var(--color-pen)]/30 rounded-[8px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[var(--color-pen)]">
            Weekly Growth Highlight
          </span>
          <h2 className="font-serif font-bold text-[26px] text-[var(--color-ink)] mt-1">
            You improved 31% this week across algorithms!
          </h2>
          <p className="text-[14px] text-[var(--color-ink-2)] mt-1 max-w-[50ch]">
            Consistent daily practice moved Binary Search from 51% baseline up to 74% proficiency.
          </p>
        </div>

        <div className="bg-white border border-[var(--color-line)] rounded-[8px] p-4 flex flex-col items-center justify-center min-w-[170px] shadow-xs">
          <span className="text-[11px] font-sans font-bold uppercase text-[var(--color-ink-2)]">
            Total Accuracy
          </span>
          <div className="font-mono font-bold text-[32px] text-[var(--color-strong)] leading-tight my-0.5">
            {student.accuracy}%
          </div>
          <span className="text-[12px] text-[var(--color-ink-2)]">
            {student.questionsSolved} questions solved
          </span>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Panel className="p-4 flex flex-col gap-1">
          <span className="text-[12px] font-sans text-[var(--color-ink-2)] uppercase font-semibold">
            Study Hours
          </span>
          <div className="font-mono font-bold text-[22px] text-[var(--color-ink)]">
            {student.hoursLearned} hrs
          </div>
          <span className="text-[11px] text-[var(--color-strong)] font-medium">
            +2.4 hrs this week
          </span>
        </Panel>

        <Panel className="p-4 flex flex-col gap-1">
          <span className="text-[12px] font-sans text-[var(--color-ink-2)] uppercase font-semibold">
            Daily Streak
          </span>
          <div className="font-mono font-bold text-[22px] text-amber-700">
            {student.streak} Days
          </div>
          <span className="text-[11px] text-[var(--color-ink-2)]">
            Personal best streak
          </span>
        </Panel>

        <Panel className="p-4 flex flex-col gap-1">
          <span className="text-[12px] font-sans text-[var(--color-ink-2)] uppercase font-semibold">
            XP Earned
          </span>
          <div className="font-mono font-bold text-[22px] text-[var(--color-pen)]">
            {student.xp}
          </div>
          <span className="text-[11px] text-[var(--color-ink-2)]">
            Level 7 Scholar
          </span>
        </Panel>

        <Panel className="p-4 flex flex-col gap-1">
          <span className="text-[12px] font-sans text-[var(--color-ink-2)] uppercase font-semibold">
            Weak Spots Fixed
          </span>
          <div className="font-mono font-bold text-[22px] text-[var(--color-strong)]">
            5 Resolved
          </div>
          <span className="text-[11px] text-[var(--color-strong)] font-medium">
            1 Active Mission
          </span>
        </Panel>
      </div>

      {/* Mastery Progression Graph */}
      <Panel>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)] mb-4">
          <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
            Topic Mastery Calibrations
          </h3>
          <span className="text-[12px] font-sans text-[var(--color-ink-2)]">
            Evaluated continuously
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {masteryList.map((m) => (
            <div key={m.topic} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[14px] font-sans">
                <span className="font-semibold text-[var(--color-ink)]">{m.topic}</span>
                <span className="font-mono font-bold text-[var(--color-pen)]">{m.mastery}%</span>
              </div>
              <Bar score={m.mastery} />
              <div className="flex justify-between text-[11px] text-[var(--color-ink-2)]">
                <span>Concepts: {m.conceptScore}% • Application: {m.applicationScore}% • Edge cases: {m.edgeCaseScore}%</span>
                <span>{m.questionsCorrect}/{m.questionsAttempted} correct</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Recent History Feed */}
      <Panel>
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-line)] mb-3">
          <History className="w-4 h-4 text-[var(--color-pen)]" />
          <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
            Recent Study Log
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {history.map((h) => (
            <div
              key={h.id}
              className="p-3 bg-white border border-[var(--color-line)] rounded-[6px] flex items-center justify-between text-[13px] font-sans"
            >
              <div>
                <span className="font-bold text-[var(--color-ink)]">{h.topic}: </span>
                <span className="text-[var(--color-ink-2)]">{h.summary}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {h.delta && (
                  <span className="font-bold text-[var(--color-strong)]">
                    +{h.delta}%
                  </span>
                )}
                <span className="text-[11px] text-[var(--color-ink-2)]">{h.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};
