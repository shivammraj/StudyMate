import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bar } from '../components/ui/Bar.js';
import { AlertTriangle, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const Weaknesses: React.FC = () => {
  const navigate = useNavigate();
  const { weaknesses, createMission } = useStudyMate();

  const handleStartMission = (topic: string, area: string, score: number) => {
    createMission(topic, area, score);
    navigate('/revision');
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto py-2">
      <PageHeader
        title="Weakness Diagnostic Engine"
        lead="Targeted error-clustering identifies the specific cognitive blind spots holding your mastery back."
      />

      <div className="flex flex-col gap-6">
        {weaknesses.map((w) => (
          <Panel
            key={w.id}
            className={`border-l-[4px] ${
              w.severity === 'weak' ? 'border-l-[var(--color-weak)]' : 'border-l-amber-600'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 ${
                    w.severity === 'weak'
                      ? 'bg-[var(--color-weak-tint)] text-[var(--color-weak)]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                      {w.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-sans font-bold uppercase ${
                        w.severity === 'weak'
                          ? 'bg-[var(--color-weak-tint)] text-[var(--color-weak)]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {w.severity.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[14px] font-sans text-[var(--color-ink-2)] mt-0.5">
                    {w.area}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[12px] font-sans text-[var(--color-ink-2)]">
                  Area Score:
                </span>
                <div className="font-mono font-bold text-[16px] text-[var(--color-ink)]">
                  {w.score}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-[13px] font-sans">
              <div className="p-3 bg-white rounded border border-[var(--color-line)]">
                <span className="text-[var(--color-ink-2)]">Repeated Misses:</span>
                <div className="font-bold text-[15px] text-[var(--color-weak)]">
                  {w.missedQuestionsCount} questions
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-[var(--color-line)]">
                <span className="text-[var(--color-ink-2)]">Last Triggered:</span>
                <div className="font-bold text-[15px]">{w.lastEncountered}</div>
              </div>
              <div className="p-3 bg-white rounded border border-[var(--color-line)]">
                <span className="text-[var(--color-ink-2)]">Remediation:</span>
                <div className="font-bold text-[15px] text-[var(--color-pen)]">
                  10-min Revision Mission
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--color-line)] flex items-center justify-between">
              <span className="text-[12px] text-[var(--color-ink-2)]">
                Completing the 10-minute mission will recalibrate this score to &gt;60%.
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStartMission(w.topic, w.area, w.score)}
                className="inline-flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch Revision Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
};
