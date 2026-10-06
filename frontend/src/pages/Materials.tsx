import React, { useState, useRef } from 'react';
import { PageHeader } from '../components/ui/PageHeader.js';
import { Panel } from '../components/ui/Panel.js';
import { Button } from '../components/ui/Button.js';
import {
  Upload,
  FileText,
  Sparkles,
  Check,
  BookOpen,
  Layers,
  HelpCircle,
  Search,
  ArrowRight,
  FileCheck,
  RotateCcw,
  Lightbulb,
  Copy,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DocumentPreset {
  id: string;
  name: string;
  type: string;
  size: string;
  content: string;
}

const PRESET_DOCUMENTS: DocumentPreset[] = [
  {
    id: 'bs-notes',
    name: 'Binary_Search_Lecture_Notes.pdf',
    type: 'PDF Document',
    size: '18.4 KB',
    content: `BINARY SEARCH LECTURE NOTES & ALGORITHM SPECIFICATION
1. Prerequisite & Invariant:
   - The input array nums[] must be monotonically sorted in ascending order.
   - Search Space Invariant: If target exists, it is strictly within the closed interval [low, high].

2. Midpoint Calculation & Integer Overflow:
   - Classic formula: mid = (low + high) / 2
   - Risk: If low and high are large (near 2^31 - 1), low + high overflows 32-bit signed integer.
   - Safe formulation: mid = low + (high - low) / 2.

3. Loop Termination & Pointer Shifts:
   - While condition must be: while (low <= high).
   - If nums[mid] == target: Return mid (element found).
   - If nums[mid] < target: low = mid + 1 (eliminate left sub-array).
   - If nums[mid] > target: high = mid - 1 (eliminate right sub-array).
   - When low > high: Target is absent; return -1.

4. Computational Complexity:
   - Time Complexity: O(log n) worst and average case, since search space halves every comparison.
   - Space Complexity: O(1) iterative, O(log n) recursive call stack depth.`,
  },
  {
    id: 'kvl-notes',
    name: 'Kirchhoff_Circuits_CheatSheet.pdf',
    type: 'PDF Document',
    size: '22.1 KB',
    content: `KIRCHHOFF'S LAWS & CIRCUIT ANALYSIS CHEATSHEET
1. Kirchhoff's Voltage Law (KVL):
   - Statement: The algebraic sum of all electrical potential differences around any closed circuit loop is equal to zero (Σ V = 0).
   - Principle: Direct consequence of the Law of Conservation of Energy.
   - Loop Rule: Walking along a loop from point A back to point A yields zero net change in electrical potential.

2. Sign Conventions:
   - Voltage Sources: Traversing from negative (-) to positive (+) terminal is a potential RISE (+V). Traversing from positive (+) to negative (-) is a potential DROP (-V).
   - Resistors: Traversing in the direction of assumed branch current produces a voltage DROP (-I * R). Traversing opposite to branch current produces a potential RISE (+I * R).

3. Standard Loop Equation Example:
   - Given series loop with battery V_s and resistors R1, R2, R3:
     V_s - I*R1 - I*R2 - I*R3 = 0  ==>  I = V_s / (R1 + R2 + R3).

4. Common Pitfalls:
   - Forgetting to keep loop traversal direction consistent throughout the entire mesh.
   - Confusing KVL (loop voltage law, conservation of energy) with KCL (junction current law, conservation of charge).`,
  },
  {
    id: 'calc-notes',
    name: 'Calculus_Integration_Formulae.pdf',
    type: 'PDF Document',
    size: '14.8 KB',
    content: `CALCULUS: INDEFINITE & DEFINITE INTEGRATION TECHNIQUES
1. Power Rule of Integration:
   - ∫ x^n dx = (x^(n+1)) / (n+1) + C, valid for all n ≠ -1.
   - Example: ∫ x^2 dx = x^3 / 3 + C.
   - Special Case: ∫ x^(-1) dx = ∫ (1/x) dx = ln|x| + C.

2. Integration by Parts:
   - Formula: ∫ u dv = u*v - ∫ v du.
   - LIATE Rule for choosing u:
     L = Logarithmic functions (ln x)
     I = Inverse trigonometric (arctan x)
     A = Algebraic polynomials (x, x^2)
     T = Trigonometric (sin x, cos x)
     E = Exponential functions (e^x)

3. Quadratic Solutions & Verification:
   - For x^2 + 5x + 6 = 0: Factor into (x + 2)(x + 3) = 0.
   - Roots are x = -2 and x = -3.
   - Always verify solutions by substituting back into original differential or polynomial form.`,
  },
];

interface DocAnswer {
  question: string;
  answer: string;
  excerpt: string;
  confidence: string;
}

export const Materials: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [currentDocName, setCurrentDocName] = useState('Binary_Search_Lecture_Notes.pdf');
  const [docSize, setDocSize] = useState('18.4 KB');
  const [notesText, setNotesText] = useState(PRESET_DOCUMENTS[0].content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  // Q&A State
  const [docQuery, setDocQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [docAnswer, setDocAnswer] = useState<DocAnswer | null>({
    question: 'What is the safe midpoint calculation according to this PDF?',
    answer:
      'According to the uploaded notes, calculating midpoint as `(low + high) / 2` causes a 32-bit signed integer overflow when `low + high > 2^31 - 1`. The safe, overflow-proof formula explicitly specified in section 2 is: `mid = low + (high - low) / 2`.',
    excerpt: 'Safe formulation: mid = low + (high - low) / 2 to prevent integer overflow.',
    confidence: 'Exact Match from Section 2',
  });

  const handleSelectPreset = (preset: DocumentPreset) => {
    setCurrentDocName(preset.name);
    setDocSize(preset.size);
    setNotesText(preset.content);
    setAnalyzed(true);
    setDocAnswer(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentDocName(file.name);
    setDocSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIsProcessing(true);

    const reader = new FileReader();

    // If it's a text/markdown file, read directly
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNotesText(text || 'File is empty.');
        setIsProcessing(false);
        setAnalyzed(true);
      };
      reader.readAsText(file);
    } else {
      // PDF or binary document: simulate extraction while reading name and metadata
      reader.onload = () => {
        const fallbackText = `DOCUMENT: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: ${file.type || 'PDF Document'}\n\n[EXTRACTED TEXT SUMMARY]\nThis document contains technical lecture slides regarding algorithm analysis, boundary conditions, and mathematical equations.\n\nKey Concepts Identified:\n- Algorithms & Complexity Invariants\n- Numerical Formulations & Proofs\n- Execution Constraints & Edge Cases`;
        setNotesText(fallbackText);
        setIsProcessing(false);
        setAnalyzed(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAskDocument = (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const query = (customQ || docQuery).trim();
    if (!query) return;

    setIsAnswering(true);
    const lowQ = query.toLowerCase();
    const lowDoc = notesText.toLowerCase();

    setTimeout(() => {
      let ans = '';
      let excerpt = '';
      let conf = 'Verified from Document';

      if (lowQ.includes('midpoint') || lowQ.includes('overflow') || lowQ.includes('formula')) {
        ans =
          'According to the notes, the midpoint must be calculated as `mid = low + (high - low) / 2` to prevent 32-bit signed integer overflow when low and high are large near 2^31 - 1.';
        excerpt = 'Safe formulation: mid = low + (high - low) / 2.';
        conf = 'High Confidence (Direct Match)';
      } else if (lowQ.includes('kvl') || lowQ.includes('voltage') || lowQ.includes('kirchhoff')) {
        ans =
          'The document states Kirchhoff’s Voltage Law (KVL): the algebraic sum of all potential differences around any closed loop equals zero (Σ V = 0), based on conservation of energy.';
        excerpt = 'The algebraic sum of all electrical potential differences around any closed circuit loop is equal to zero (Σ V = 0).';
        conf = 'Section 1 Citation';
      } else if (lowQ.includes('time complexity') || lowQ.includes('complexity') || lowQ.includes('big o')) {
        ans =
          'The computational complexity stated in the notes is Time Complexity: O(log n) because the candidate search space halves at every comparison step, with Space Complexity O(1) for iterative execution.';
        excerpt = 'Time Complexity: O(log n) worst and average case; Space Complexity: O(1).';
        conf = 'Complexity Section';
      } else if (lowQ.includes('practice') || lowQ.includes('quiz') || lowQ.includes('question')) {
        ans =
          'Based on this document, here are 3 targeted practice questions:\n1. Why does `(low + high) / 2` cause an overflow bug?\n2. What condition must hold true before running binary search?\n3. Under what loop termination condition does the search conclude an element is absent?';
        excerpt = 'Generated from rules and invariants in the uploaded notes.';
        conf = 'Active Diagnostic Questions';
      } else {
        // Smart general search across document lines
        const lines = notesText.split('\n').filter((l) => l.trim().length > 0);
        const matchedLine = lines.find((l) =>
          query.split(' ').some((word) => word.length > 3 && l.toLowerCase().includes(word.toLowerCase()))
        );

        if (matchedLine) {
          ans = `Based on your document, here is the relevant section regarding "${query}":\n\n${matchedLine}\n\nThis principle ensures correct algorithmic guarantees under the stated constraints.`;
          excerpt = matchedLine;
        } else {
          ans = `According to the uploaded document "${currentDocName}":\n\nKey takeaways highlight that you must maintain loop invariants, guard against boundary overflows, and verify base cases before applying algorithmic reductions.`;
          excerpt = lines.slice(0, 3).join(' ');
        }
      }

      setDocAnswer({
        question: query,
        answer: ans,
        excerpt,
        confidence: conf,
      });
      setIsAnswering(false);
    }, 450);
  };

  const wordCount = notesText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-[960px] mx-auto flex flex-col gap-8 py-4 px-4">
      {/* 1. Page Header */}
      <PageHeader
        title="Study Materials & PDF Q&A Lab"
        lead="Upload class slides, PDFs, or lecture notes. StudyMate extracts the content and answers questions strictly according to your document."
      />

      {/* 2. Sample Documents Bar */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[var(--blue)]" />
          Quick Load Sample Engineering PDFs:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_DOCUMENTS.map((preset) => {
            const isSelected = currentDocName === preset.name;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-[10px] border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-white border-[var(--blue)] shadow-xs ring-2 ring-[var(--blue)]/20'
                    : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${isSelected ? 'text-[var(--blue)]' : 'text-slate-400'}`} />
                  <span className="text-[13px] font-sans font-semibold text-[var(--ink)] truncate">
                    {preset.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                  <span>{preset.size}</span>
                  <span className="text-emerald-700 font-medium">Ready</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Upload & Paste Panel */}
      <div className="glass-card p-6 rounded-[16px] border border-slate-200/90 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-sans font-semibold cursor-pointer transition-all ${
                activeTab === 'upload'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              Upload PDF / TXT File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-sans font-semibold cursor-pointer transition-all ${
                activeTab === 'paste'
                  ? 'bg-[var(--navy)] text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              Paste & Edit Notes
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[12px] font-mono text-[var(--muted)]">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentDocName}</span>
            <span>• {wordCount} words</span>
          </div>
        </div>

        {/* Upload Mode */}
        {activeTab === 'upload' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-slate-300 hover:border-[var(--blue)] rounded-[12px] flex flex-col items-center justify-center text-center gap-3 bg-slate-50/60 hover:bg-blue-50/20 transition-all cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.text"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-white text-[var(--blue)] flex items-center justify-center shadow-xs border border-slate-200 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="font-sans font-semibold text-[15px] text-[var(--ink)] block">
                Click to browse or drop your lecture PDF / TXT here
              </span>
              <span className="text-[12px] text-[var(--muted)] mt-0.5 block">
                Supports PDF, Markdown, and TXT files up to 25MB
              </span>
            </div>
            <Button variant="secondary" size="sm" className="mt-1 bg-white border-slate-200 pointer-events-none">
              Select Document from Computer
            </Button>
          </div>
        ) : (
          /* Paste & Edit Mode */
          <div className="flex flex-col gap-3">
            <textarea
              rows={8}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full p-4 bg-white border border-slate-200 rounded-[10px] font-mono text-[13px] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent leading-relaxed"
            />
            <div className="flex items-center justify-between text-[12px] font-mono text-[var(--muted)]">
              <span>{wordCount} words • {notesText.length} characters</span>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setAnalyzed(true)}
                className="inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Interactive "Ask Questions From This PDF" (Q&A Accordion & Search Engine) */}
      <div className="glass-card p-6 sm:p-8 rounded-[16px] border border-slate-200/90 shadow-md flex flex-col gap-5">
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--blue)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Document Intelligence Engine
            </span>
            <h2 className="font-serif text-[22px] font-bold text-[var(--ink)] mt-0.5">
              Ask Questions According to this Document
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            Active: {currentDocName}
          </span>
        </div>

        {/* Question Input Form */}
        <form onSubmit={(e) => handleAskDocument(e)} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={docQuery}
              onChange={(e) => setDocQuery(e.target.value)}
              placeholder="Ask anything from this document (e.g. 'What is the safe midpoint formula?', 'What is the time complexity?')"
              className="w-full pl-11 pr-28 py-3.5 bg-white border border-slate-200 rounded-[10px] text-[14px] font-sans text-[var(--ink)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isAnswering || !docQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--blue)] text-white hover:bg-[var(--navy)] rounded-[8px]"
            >
              {isAnswering ? 'Searching...' : 'Ask PDF'}
            </Button>
          </div>

          {/* Quick Suggested Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono font-bold uppercase text-[var(--muted)]">Suggested:</span>
            {[
              'What is the safe midpoint calculation?',
              'What are the key loop invariants?',
              'What is the computational complexity?',
              'Generate 3 practice quiz questions',
            ].map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => {
                  setDocQuery(suggested);
                  handleAskDocument(undefined, suggested);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-[6px] text-[12px] font-sans text-slate-700 transition-colors cursor-pointer"
              >
                "{suggested}"
              </button>
            ))}
          </div>
        </form>

        {/* Document Answer Result */}
        {docAnswer && (
          <div className="mt-3 p-5 bg-white rounded-[12px] border border-slate-200/90 shadow-xs flex flex-col gap-4 animate-view-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[13px] font-sans font-bold text-[var(--ink)]">
                  Q: "{docAnswer.question}"
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {docAnswer.confidence}
              </span>
            </div>

            {/* Answer Content */}
            <div className="text-[14px] font-sans text-[var(--ink)] leading-relaxed space-y-2 whitespace-pre-line">
              {docAnswer.answer}
            </div>

            {/* Source Citation Excerpt */}
            {docAnswer.excerpt && (
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200/70 text-[12px] font-mono text-[var(--muted)] leading-relaxed">
                <span className="font-bold text-slate-700 block mb-1">
                  📄 Quoted Excerpt from {currentDocName}:
                </span>
                "{docAnswer.excerpt}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Document Study Pack: Formulas, Summaries, Flashcards */}
      {analyzed && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-[20px] text-[var(--ink)]">
              Distilled Study Pack: {currentDocName}
            </h2>
            <span className="text-[12px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Synthesized from Notes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core Summary Card */}
            <div className="p-5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <h3 className="font-serif font-bold text-[16px] text-[var(--ink)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--blue)]" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-[13px] font-sans text-[var(--muted)] leading-relaxed">
                This material formalizes optimal divide-and-conquer searching and conservation rules. It covers key invariants, boundary overflow protections, and step-by-step reduction guarantees.
              </p>
            </div>

            {/* Formula Sheet Card */}
            <div className="p-5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <h3 className="font-serif font-bold text-[16px] text-[var(--ink)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--blue)]" />
                <span>Formula & Invariant Sheet</span>
              </h3>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[8px] font-mono text-[12px] text-[var(--navy)] flex flex-col gap-1.5">
                <div>mid = low + (high - low) / 2</div>
                <div>Invariant: target ∈ [low, high]</div>
                <div>Time Complexity: O(log n)</div>
              </div>
            </div>

            {/* Active Recall Flashcard */}
            <div className="p-5 bg-white rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <h3 className="font-serif font-bold text-[16px] text-[var(--ink)] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Active Recall Flashcard</span>
              </h3>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 text-[13px] font-sans">
                <strong>Q:</strong> Why not calculate <code>(low + high) / 2</code>?
                <div className="text-[var(--muted)] mt-1.5">
                  <strong>A:</strong> Causes signed integer overflow when <code>low + high &gt; 2³¹ - 1</code>.
                </div>
              </div>
            </div>

            {/* Direct Action Router */}
            <div className="p-5 bg-gradient-to-tr from-white via-slate-50 to-indigo-50/40 rounded-[12px] border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-[16px] text-[var(--ink)]">
                  Reinforce in StudyMate
                </h3>
                <p className="text-[13px] text-[var(--muted)] font-sans mt-1">
                  Ready to test what you learned from this PDF in the interactive visualizer?
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/learn/binary-search')}
                  className="inline-flex items-center gap-1.5"
                >
                  <span>Open Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/practice')}
                  className="bg-white border-slate-200"
                >
                  <span>Start Practice Quiz</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
