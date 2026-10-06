import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Calculator,
  Compass,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Zap,
  BookOpen,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Check,
  Flame,
  Copy,
  Lightbulb,
} from 'lucide-react';
import { useStudyMate } from '../hooks/useStudyMate.js';
import { api } from '../services/api.js';
import { AskResponse } from '../types/schemas.js';

type QuickMode = 'auto' | 'explain' | 'solve' | 'visualize' | 'practice' | 'code' | 'quiz';

interface RecentItem {
  id: string;
  question: string;
  timeAgo: string;
  mode?: QuickMode;
  subject?: string;
  route?: string;
}

const DEFAULT_RECENT: RecentItem[] = [
  { id: '1', question: 'Explain recursion', timeAgo: 'Today', subject: 'DSA', route: '/practice' },
  { id: '2', question: 'Why does KVL work?', timeAgo: 'Yesterday', subject: 'Electrical', route: '/learn/kirchhoffs-voltage-law' },
  { id: '3', question: 'Debug binary search', timeAgo: 'Yesterday', subject: 'DSA', route: '/dsa' },
];

interface SuggestedPrompt {
  label: string;
  category: 'Algorithm' | 'Math' | 'Circuits' | 'Code' | 'Practice';
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { label: 'Explain binary search visually', category: 'Algorithm' },
  { label: 'Solve x² + 5x + 6 = 0', category: 'Math' },
  { label: "Explain Kirchhoff's voltage law", category: 'Circuits' },
  { label: 'Why does my C++ code give TLE?', category: 'Code' },
  { label: 'Teach me recursion with an example', category: 'Algorithm' },
  { label: 'Give me 5 questions on recursion', category: 'Practice' },
  { label: 'Test me on operating systems', category: 'Practice' },
];

const PROCESSING_STAGES = [
  'Understanding your question...',
  'Detecting subject & academic domain...',
  'Choosing optimal pedagogical experience...',
  'Synthesizing interactive workspace...',
];

export const Ask: React.FC = () => {
  const navigate = useNavigate();
  const { student, updateSession, addHistoryItem } = useStudyMate();

  const [question, setQuestion] = useState('');
  const [selectedMode, setSelectedMode] = useState<QuickMode>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<RecentItem[]>(() => {
    try {
      const saved = localStorage.getItem('studymate_recent_questions');
      return saved ? JSON.parse(saved) : DEFAULT_RECENT;
    } catch {
      return DEFAULT_RECENT;
    }
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Focus textarea on initial load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Smooth scroll to result when ready
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  // Handle Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async (overrideQuestion?: string, overrideMode?: QuickMode) => {
    const q = (overrideQuestion ?? question).trim();
    const mode = overrideMode ?? selectedMode;

    if (!q) return;

    setIsProcessing(true);
    setProcessingStageIndex(0);
    setErrorMessage(null);
    setResult(null);

    // Staged cognitive transition timer
    const stageTimer1 = setTimeout(() => setProcessingStageIndex(1), 350);
    const stageTimer2 = setTimeout(() => setProcessingStageIndex(2), 750);
    const stageTimer3 = setTimeout(() => setProcessingStageIndex(3), 1150);

    try {
      const res = await api.ask({
        question: q,
        mode,
        student: {
          name: student.name || 'Shivam Mavi',
          branch: 'Computer Science & Engineering',
          year: '1st Year',
        },
      });

      // Clear timers if finished
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      if (res.ok) {
        setResult(res.data);

        // Update StudyMate session
        updateSession({
          topic: res.data.title,
          subject: res.data.subject,
        });

        // Add to history
        addHistoryItem({
          topic: res.data.title,
          type: res.data.learningMode === 'quiz' ? 'quiz' : res.data.learningMode === 'code_lab' ? 'dsa' : 'lesson',
          summary: res.data.summary,
        });

        // Update recent questions
        const newRecent: RecentItem = {
          id: Date.now().toString(),
          question: q,
          timeAgo: 'Just now',
          mode,
          subject: formatSubject(res.data.subject),
          route: res.data.nextAction.route,
        };
        const updatedRecent = [newRecent, ...recentQuestions.filter((item) => item.question !== q)].slice(0, 8);
        setRecentQuestions(updatedRecent);
        try {
          localStorage.setItem('studymate_recent_questions', JSON.stringify(updatedRecent));
        } catch {}
      } else {
        setErrorMessage(res.error.message || "StudyMate couldn't process that question.");
      }
    } catch {
      setErrorMessage("StudyMate is temporarily busy. Try again in a moment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaunchExperience = (route: string) => {
    navigate(route);
  };

  const handleSelectRecent = (item: RecentItem) => {
    setQuestion(item.question);
    handleSubmit(item.question, item.mode || 'auto');
  };

  const handleSelectSuggested = (prompt: string) => {
    setQuestion(prompt);
    handleSubmit(prompt, selectedMode);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="max-w-[880px] mx-auto flex flex-col gap-8 py-6 px-4">
      {/* 1. Header with Editorial Aura */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 shadow-xs text-[11px] font-mono font-bold tracking-wider uppercase text-[var(--navy)]">
            <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-pulse" />
            AI Cognitive Router
          </span>
          <span className="text-[12px] font-mono text-[var(--muted)]">
            Student: <strong className="text-[var(--ink)]">{student.name}</strong> • 1st Year CSE
          </span>
        </div>

        <h1 className="font-serif text-[34px] sm:text-[38px] font-bold text-[var(--ink)] tracking-tight leading-none mt-1">
          ASK STUDYMATE
        </h1>
        <p className="font-sans text-[15px] sm:text-[16px] text-[var(--muted)] max-w-[620px] leading-relaxed">
          Ask anything. StudyMate will figure out how to teach it.
        </p>
      </div>

      {/* 2. Main Input Box: Ultra-Premium Glow Card */}
      <div className="glow-panel glass-card p-6 rounded-[16px] relative shadow-[0_12px_40px_rgba(31,43,61,0.06)] border border-slate-200/90 transition-all duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="ask-input"
              className="text-[14px] font-sans font-semibold text-[var(--ink)] flex items-center gap-2"
            >
              <span>What do you want to understand, solve, practice or build?</span>
            </label>
            <span className="text-[11px] font-mono text-[var(--muted)] bg-slate-100/80 px-2.5 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              Ctrl + Enter
            </span>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              id="ask-input"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Explain binary search visually, Why does my C++ code give TLE?, Solve x² + 5x + 6 = 0, Explain Kirchhoff's voltage law..."
              disabled={isProcessing}
              className="w-full p-4 bg-white/90 border border-slate-200/90 rounded-[10px] text-[15px] font-sans text-[var(--ink)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent focus:bg-white transition-all resize-y min-h-[115px] shadow-2xs"
            />
          </div>

          {/* Quick Action Modes Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/70">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] mr-1">
                ASK ANYTHING:
              </span>
              {[
                { id: 'explain', label: 'Explain', icon: Lightbulb },
                { id: 'solve', label: 'Solve', icon: Calculator },
                { id: 'visualize', label: 'Visualize', icon: Activity },
                { id: 'practice', label: 'Practice', icon: CheckCircle2 },
                { id: 'code', label: 'Code', icon: Code2 },
                { id: 'quiz', label: 'Quiz', icon: HelpCircle },
              ].map(({ id, label, icon: Icon }) => {
                const isActive = selectedMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedMode(isActive ? 'auto' : (id as QuickMode))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-sans font-medium transition-all cursor-pointer border select-none ${
                      isActive
                        ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-xs scale-[1.02]'
                        : 'bg-white/80 text-slate-700 border-slate-200/80 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-300' : 'text-slate-400'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
              {selectedMode !== 'auto' && (
                <button
                  type="button"
                  onClick={() => setSelectedMode('auto')}
                  className="text-[11px] font-sans text-[var(--blue)] hover:underline ml-1 cursor-pointer font-medium"
                >
                  Reset (Auto)
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={isProcessing || !question.trim()}
              onClick={() => handleSubmit()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--navy)] via-[var(--blue)] to-[#405bbd] text-white hover:shadow-[0_8px_25px_rgba(83,111,216,0.35)] hover:-translate-y-0.5 active:translate-y-0 rounded-[10px] font-sans font-semibold text-[14px] transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{isProcessing ? 'Analyzing...' : 'ASK STUDYMATE'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Showcase */}
      {!result && !isProcessing && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Suggested Prompts for Shivam:
            </span>
            <span className="text-[11px] font-sans text-[var(--muted)]">Click any prompt to run</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => handleSelectSuggested(prompt.label)}
                className="p-3 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-[10px] hover:border-[var(--blue)] hover:bg-white hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {prompt.category}
                  </span>
                  <span className="text-[13px] font-sans font-medium text-[var(--ink)] group-hover:text-[var(--blue)] truncate">
                    "{prompt.label}"
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--blue)] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Cognitive Processing Transition State */}
      {isProcessing && (
        <div className="glass-card border-2 border-[var(--blue)]/40 p-6 sm:p-8 rounded-[16px] shadow-lg animate-view-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--blue)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-ping" />
                Cognitive Intent Analysis
              </span>
              <h2 className="font-serif font-bold text-[22px] text-[var(--ink)] mt-1">
                {PROCESSING_STAGES[processingStageIndex] || PROCESSING_STAGES[0]}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--pale)] text-[var(--blue)] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 animate-spin text-[var(--blue)]" />
            </div>
          </div>

          <div className="p-4 my-5 bg-slate-50/80 rounded-[8px] font-sans text-[14px] text-[var(--ink)] border border-slate-200">
            "{question}"
          </div>

          <div className="flex flex-col gap-3">
            {PROCESSING_STAGES.map((stage, idx) => {
              const isPast = idx < processingStageIndex;
              const isCurrent = idx === processingStageIndex;
              return (
                <div
                  key={stage}
                  className={`flex items-center gap-3.5 text-[13px] font-sans transition-all duration-300 ${
                    isPast
                      ? 'text-[var(--green)] font-medium'
                      : isCurrent
                      ? 'text-[var(--blue)] font-bold'
                      : 'text-[var(--muted)]/40'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    {isPast ? (
                      <Check className="w-4 h-4 text-[var(--green)] stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue)] animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-200" />
                    )}
                  </div>
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Error State */}
      {errorMessage && (
        <div className="border border-red-200 bg-red-50/80 p-5 rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-sans font-semibold text-[14px] text-red-900">
                StudyMate couldn't process that question.
              </h3>
              <p className="font-sans text-[13px] text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSubmit()}
            className="shrink-0 bg-white border-red-200 text-red-800 hover:bg-red-100"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Try again
          </Button>
        </div>
      )}

      {/* 5. Detected Intent & Learning Workspace Router (Item #10 & #11) */}
      {result && !isProcessing && (
        <div ref={resultRef} className="flex flex-col gap-6 animate-fade-in scroll-mt-6">
          {/* Main Response & Understanding Card */}
          <div className="glass-card border border-slate-200/90 shadow-[0_16px_48px_rgba(31,43,61,0.08)] rounded-[16px] overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

            <div className="p-6 sm:p-8 flex flex-col gap-5">
              {/* Header with Title & Subject */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--navy)] to-[var(--blue)] text-white flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--blue)]">
                        StudyMate Response
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted)]">• For Shivam</span>
                    </div>
                    <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[var(--ink)] mt-0.5 leading-tight">
                      {result.title}
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {result.difficulty}
                </span>
              </div>

              {/* Direct Answer Box */}
              <div className="text-[15px] font-sans text-[var(--ink)] leading-relaxed space-y-3.5 bg-white/95 p-5 sm:p-6 rounded-[12px] border border-slate-200 shadow-xs">
                {result.answer.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('```')) {
                    const cleanCode = paragraph.replace(/```[a-z]*\n?/gi, '').trim();
                    return (
                      <div key={idx} className="relative group my-3">
                        <div className="flex items-center justify-between bg-slate-900 text-slate-400 px-4 py-2 rounded-t-[8px] text-[11px] font-mono border-b border-slate-800">
                          <span>CODE SNIPPET</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(cleanCode, idx)}
                            className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedCodeIndex === idx ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-4 bg-slate-950 text-[#edf1ff] rounded-b-[8px] font-mono text-[13px] overflow-x-auto leading-relaxed">
                          <code>{cleanCode}</code>
                        </pre>
                      </div>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>

              {/* Cognitive Understanding Matrix */}
              <div className="pt-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] block mb-3">
                  STUDYMATE UNDERSTOOD:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-[10px] border border-slate-200/80">
                  <div className="p-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Subject</span>
                    <div className="text-[13px] font-sans font-bold text-[var(--ink)] mt-0.5 flex items-center gap-1.5">
                      {getSubjectIcon(result.subject)}
                      <span>{formatSubject(result.subject)}</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Topic</span>
                    <div className="text-[13px] font-sans font-bold text-[var(--ink)] mt-0.5">
                      {formatTopic(result.topic)}
                    </div>
                  </div>

                  <div className="p-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Intent</span>
                    <div className="text-[13px] font-sans font-bold text-[var(--navy)] mt-0.5">
                      {formatIntent(result.intent)}
                    </div>
                  </div>

                  <div className="p-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Mode</span>
                    <div className="text-[13px] font-sans font-bold text-[var(--green)] mt-0.5">
                      {formatLearningMode(result.learningMode)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct CTA Router */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setQuestion('');
                    textareaRef.current?.focus();
                  }}
                  className="text-[13px] font-sans font-medium text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer inline-flex items-center gap-1"
                >
                  ← Ask another question
                </button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleLaunchExperience(result.nextAction.route || result.suggestedRoute)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--navy)] via-[var(--blue)] to-[#405bbd] text-white hover:shadow-[0_8px_25px_rgba(83,111,216,0.35)] font-sans font-bold text-[15px] rounded-[10px] transition-all shadow-md cursor-pointer hover:-translate-y-0.5"
                >
                  <span>{result.nextAction.label || 'Start Learning'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Recent Questions Section (Item #13) */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Recent Questions
          </span>
          {recentQuestions.length > 0 && (
            <span className="text-[11px] font-sans text-[var(--muted)]">
              Click to revisit learning session
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentQuestions.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectRecent(item)}
              className="p-4 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-[12px] hover:border-[var(--blue)] hover:shadow-xs hover:bg-white transition-all cursor-pointer flex flex-col justify-between gap-2.5 text-left group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-sans font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] line-clamp-2">
                  {item.question}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--blue)] shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                  {item.subject || 'Concept'}
                </span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helpers for formatted display labels & icons
function formatSubject(subject: string): string {
  switch (subject) {
    case 'dsa':
      return 'DSA & Algorithms';
    case 'computer_science':
      return 'Computer Science';
    case 'mathematics':
      return 'Mathematics';
    case 'electrical_engineering':
      return 'Electrical Eng.';
    case 'engineering_mechanics':
      return 'Eng. Mechanics';
    case 'operating_systems':
      return 'Operating Systems';
    case 'computer_networks':
      return 'Networks';
    case 'chemistry':
      return 'Chemistry';
    default:
      return 'Engineering';
  }
}

function getSubjectIcon(subject: string) {
  switch (subject) {
    case 'dsa':
      return <Code2 className="w-4 h-4 text-[var(--blue)]" />;
    case 'mathematics':
      return <Calculator className="w-4 h-4 text-amber-600" />;
    case 'electrical_engineering':
      return <Zap className="w-4 h-4 text-purple-600" />;
    case 'operating_systems':
      return <Cpu className="w-4 h-4 text-emerald-600" />;
    default:
      return <BookOpen className="w-4 h-4 text-[var(--navy)]" />;
  }
}

function formatTopic(topic: string): string {
  return topic
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatIntent(intent: string): string {
  switch (intent) {
    case 'learn_concept':
      return 'Concept Learning';
    case 'solve_problem':
      return 'Problem Solving';
    case 'debug_code':
      return 'Code Debugging';
    case 'write_code':
      return 'DSA Implementation';
    case 'practice':
      return 'Adaptive Practice';
    case 'quiz':
      return 'Diagnostic Quiz';
    default:
      return 'Engineering Analysis';
  }
}

function formatLearningMode(mode: string): string {
  switch (mode) {
    case 'visual':
      return 'Interactive Visualizer';
    case 'code_lab':
      return 'DSA Code Lab';
    case 'debugging':
      return 'Live Code Debugger';
    case 'mathematical_derivation':
      return 'Step Derivation';
    case 'engineering_diagram':
      return 'Circuit Simulation';
    case 'practice':
      return 'Adaptive Practice';
    case 'quiz':
      return 'Mastery Quiz';
    default:
      return 'Concept Breakdown';
  }
}
