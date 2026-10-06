import React from 'react';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import { Bookmark, CheckCircle2, ExternalLink, Video, BookOpen, Compass } from 'lucide-react';

export const Resources: React.FC = () => {
  const { resources, toggleSaveResource, toggleCompleteResource } = useStudyMate();

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8 py-2">
      <PageHeader
        title="Contextual Recommendations"
        lead="Targeted external learning materials dynamically surfaced by StudyMate based on your current diagnostic blind spots."
      />

      <div className="flex flex-col gap-5">
        {resources.map((res) => (
          <Panel
            key={res.id}
            className={`border-l-[4px] ${
              res.completed ? 'border-l-[var(--color-strong)] opacity-80' : 'border-l-[var(--color-pen)]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-[6px] bg-[#E8EEFD] text-[var(--color-pen)] flex items-center justify-center shrink-0 mt-0.5">
                  {res.kind === 'video' ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold uppercase tracking-wider bg-[#EDE9DE] text-[var(--color-ink)]">
                      {res.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold uppercase tracking-wider bg-[#E8EEFD] text-[var(--color-pen)]">
                      {res.kind}
                    </span>
                    {res.completed && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-[18px] text-[var(--color-ink)]">
                    {res.title}
                  </h3>

                  <div className="p-3 bg-[#FAF8F3] border border-[var(--color-line)] rounded text-[13px] font-sans text-[var(--color-ink-2)] mt-1">
                    <strong>Why this is recommended:</strong> {res.why}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => toggleCompleteResource(res.id)}
                  className="inline-flex items-center gap-1 text-[13px]"
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      res.completed ? 'text-[var(--color-strong)]' : 'text-[var(--color-ink-2)]'
                    }`}
                  />
                  <span>{res.completed ? 'Completed' : 'Mark Done'}</span>
                </Button>

                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => toggleSaveResource(res.id)}
                  className="inline-flex items-center gap-1 text-[13px]"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      res.saved ? 'fill-[var(--color-pen)] text-[var(--color-pen)]' : 'text-[var(--color-ink-2)]'
                    }`}
                  />
                  <span>{res.saved ? 'Saved' : 'Save'}</span>
                </Button>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[var(--color-pen)] hover:bg-[var(--color-pen-hover)] text-white text-[13px] font-sans font-semibold rounded-[6px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
};
