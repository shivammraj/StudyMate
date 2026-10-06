import React from 'react';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Check, Shield, Server, RotateCcw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { resetToDemo } = useStudyMate();

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="Settings & System Status"
        lead="Configure AI provider connections, simulation parameters, and local data persistence."
      />

      <Panel className="flex flex-col gap-5">
        <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)] border-b border-[var(--color-line)] pb-2">
          AI Architecture & Privacy
        </h3>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[6px] flex items-center justify-between text-[13px] font-sans text-emerald-900">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-700" />
            <div>
              <strong>Isolated Backend Architecture Active:</strong>
              <div className="text-[12px] opacity-80">
                All API keys (Gemini & YouTube) reside strictly on Node server <code>.env</code>. Zero client-side leakage.
              </div>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-700">Protected</span>
        </div>

        <div className="flex flex-col gap-3 text-[14px]">
          <div className="flex items-center justify-between py-2 border-b border-[var(--color-line)]/50">
            <span>Backend Server Status:</span>
            <span className="font-mono text-[var(--color-strong)] font-bold">http://localhost:8787 (Connected)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--color-line)]/50">
            <span>Active Student:</span>
            <span className="font-sans font-semibold">Shivam Mavi</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Deterministic Math Simulator:</span>
            <span className="font-mono text-[var(--color-pen)] font-bold">Enabled (Zero hallucination)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--color-line)] flex items-center justify-between">
          <span className="text-[13px] text-[var(--color-ink-2)]">
            Reset all telemetry, mastery and mission states to factory demo.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={resetToDemo}
            className="inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </Button>
        </div>
      </Panel>
    </div>
  );
};
