# StudyMate contracts

Ports: client 5173, server 8787 (Vite proxies /api).
Routes: / Ask, /learn, /practice, /results, /plan, /progress, /styleguide (dev only).

## Schemas (shared/src/schemas.ts, zod, types inferred)
```ts
import { z } from 'zod';

export const Subject = z.enum(['computer_science','electrical','mathematics','mechanics','physics','chemistry','other']);
export const Skill = z.enum(['recall','understanding','application']);
export const Algorithm = z.enum(['binary_search','linear_search','bubble_sort']);

export const VisualSpec = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('array_algorithm'),
    algorithm: Algorithm,
    array: z.array(z.number().int().min(0).max(99)).min(4).max(10),
    target: z.number().int().min(0).max(99).nullable()
  }), // null for bubble_sort
  z.object({
    type: z.literal('circuit_series'),
    voltage: z.number().min(1).max(48),
    resistors: z.array(z.object({
      label: z.string(),
      ohms: z.number().min(1).max(1000)
    })).min(2).max(4)
  }),
  z.object({
    type: z.literal('none')
  }),
]);

// method is set by the SERVER from visual.type and intent, never by the AI
export const TeachingMethod = z.enum(['visual_code','visual_circuit','worked_solution','concept']);

export const Lesson = z.object({
  detected: z.object({
    subject: Subject,
    topic: z.string(), // max 6 words
    difficulty: z.enum(['beginner','intermediate','advanced']),
    method: TeachingMethod,
  }),
  title: z.string(),
  bigIdea: z.string(), // 1-2 sentences
  given: z.array(z.string()).max(5), // solve intent: what the problem gives; else []
  visual: VisualSpec,
  steps: z.array(z.object({
    heading: z.string(),
    body: z.string(),
    formula: z.string().nullable()
  })).min(2).max(6),
  finalAnswer: z.string().nullable(), // solve intent only
  commonMistakes: z.array(z.string()).min(1).max(3),
  quickCheck: z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string()
  }),
});

export const QuizQuestion = z.object({
  id: z.string(), // q1..qN, assigned by the server
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  concept: z.string(), // 2-4 words
  skill: Skill,
  hint: z.string(), // nudges without giving the answer
  explanation: z.string(), // 1-2 sentences
});

export const Quiz = z.object({
  topic: z.string(), // short title
  subject: Subject,
  questions: z.array(QuizQuestion).min(2).max(6),
});
// Rule: every concept has exactly 2 questions with different skills.
// Full practice = 3 concepts / 6 questions. Retake = 1-2 concepts / 2-4 questions.

export const Plan = z.object({
  focus: z.string(), // one sentence naming the weakest idea
  steps: z.array(z.object({
    title: z.string(),
    detail: z.string(),
    minutes: z.number().int().min(1).max(5)
  })).min(3).max(5), // minutes sum to 10 (server normalizes)
  resources: z.array(z.object({
    label: z.string(), // what to look for, in plain words
    query: z.string().max(80), // search phrase, never a URL
    kind: z.enum(['video','read']),
    why: z.string(), // ties to the student's weak idea
  })).max(3),
});

// Requests. "input" is a topic, a question, or pasted notes.
export const LessonReq = z.object({
  input: z.string().min(2).max(12000),
  intent: z.enum(['explain','solve'])
});

export const QuizReq = z.object({
  input: z.string().min(2).max(12000),
  notes: z.string().max(3000).optional(), // client sends lesson topic + bigIdea + step headings
  focusConcepts: z.array(z.string()).min(1).max(2).optional()
});

export const PlanReq = z.object({
  topic: z.string(),
  subject: Subject,
  weakConcepts: z.array(z.string()).min(1).max(3),
  missed: z.array(z.object({
    question: z.string(),
    concept: z.string(),
    skill: Skill
  })).max(6),
  confidentMistakes: z.array(z.string()).max(3), // concept names
});
```

## Endpoints
| Method | Path | Body | Returns |
|---|---|---|---|
| GET | /api/health | none | `{ ok: true, provider, mode }` |
| POST | /api/lesson | LessonReq | Lesson (detection + lesson + visual spec in ONE call) |
| POST | /api/quiz | QuizReq | Quiz |
| POST | /api/plan | PlanReq | Plan |

There is no scoring endpoint. Scoring and simulation run in shared code on the client.

```ts
type ApiOk<T> = {
  ok: true;
  data: T;
  meta: {
    source: 'ai' | 'fallback' | 'sample';
    provider: 'gemini' | 'ollama' | 'mock';
    ms: number
  }
};

type ApiErr = {
  ok: false;
  error: {
    code: 'BAD_REQUEST' | 'AI_TIMEOUT' | 'AI_INVALID' | 'INTERNAL';
    message: string;
    retryable: boolean
  }
};

type ApiResult<T> = ApiOk<T> | ApiErr;
```

source 'sample' = the input exactly matched a sample chip, served instantly from fixtures.
source 'fallback' = the AI failed and a fixture topic matched.

Client API (client/src/lib/api.ts). With VITE_USE_MOCKS=true it returns fixtures after 600-900 ms (instant for samples).

```ts
api.lesson(req: LessonReq): Promise<ApiResult<Lesson>>
api.quiz(req: QuizReq): Promise<ApiResult<Quiz>>
api.plan(req: PlanReq): Promise<ApiResult<Plan>>
buildSearchUrl(r: Plan['resources'][number]): string
// video -> https://www.youtube.com/results?search_query=<query>
// read -> https://www.google.com/search?q=<query>
```

## Sample chips (instant, served from fixtures)
"Explain binary search", "Explain Kirchhoff's voltage law", "Solve: integrate x e^x dx"

## Engine (shared/src/engine/index.ts, pure functions)
```ts
export const SKILL_WEIGHT = { recall: 1, understanding: 2, application: 3 } as const;
export type Band = 'strong' | 'developing' | 'weak';
export type Answer = { choice: number | null; hinted: boolean; confidence: 'guess' | 'fairly' | 'certain' };
export type ConceptResult = { concept: string; correct: number; total: number; percent: number; band: Band };
export type SkillResult = { skill: Skill; correct: number; total: number; percent: number };

export type Analysis = {
  topic: string;
  subject: Subject;
  at: string;
  overall: { correct: number; total: number; percent: number; band: Band };
  concepts: ConceptResult[]; // weakest first, ties keep quiz order
  skills: SkillResult[]; // lowest first, only skills present
  weakest: ConceptResult;
  strongest: ConceptResult;
  confidentMistakes: { questionId: string; concept: string }[]; // wrong AND confidence 'certain'
  headline: string;
  missed: { questionId: string; question: string; concept: string; skill: Skill }[];
};

export type Comparison = { concept: string; before: number; after: number; delta: number }[];

export function bandFor(percent: number): Band; // >=80 strong, >=50 developing, else weak
export function analyze(quiz: Quiz, answers: Answer[]): Analysis; // choice null = unanswered = wrong
export function compare(before: Analysis, after: Analysis): Comparison;
export function planInput(a: Analysis): PlanReq;
```

Mastery: earned = weight if correct and no hint, weight / 2 if correct with a hint, 0 if wrong.
percent = round(100 x earned / sum of all weights in scope).
Same formula per concept, per skill and overall.
`correct` counts questions answered correctly (hinted or not).

Headline, first match wins:
1. Every concept strong: "You're solid on {topic}. No weak spots in this practice."
2. At least one confident mistake: "You felt sure about {concept}, but the answer was off. Fix that first."
3. At least 2 skills present, highest minus lowest skill percent is 30 or more, lowest under 80:
   - recall: "You understand the ideas but miss key facts."
   - understanding: "You know the facts but not why they work."
   - application: "You know the idea but struggle to use it on new problems."
4. Otherwise: "{weakest.concept} is the weakest part of {topic}."

## Simulators (shared/src/sim/, pure functions, no AI)
```ts
export type ArrayStep = {
  kind: 'start' | 'check' | 'move' | 'found' | 'notfound' | 'compare' | 'swap' | 'done';
  line: number; // 1-based line in REFERENCE_CODE[algorithm].lines
  message: string; // one plain sentence for the student
  array: number[]; // current array (changes in bubble sort)
  pointers: { low?: number; mid?: number; high?: number; i?: number; j?: number };
  ruledOut: number[]; // indexes no longer in play
  swapped?: [number, number];
  found?: number;
  predict?: { question: string; options: string[]; correctIndex: number }; // binary_search 'check' steps only
};

export function simulate(spec: Extract<VisualSpec, { type: 'array_algorithm' }>): ArrayStep[];
// binary_search: sort ascending and de-duplicate the array first.

export type CircuitSolution = {
  totalOhms: number;
  current: number;
  drops: { label: string; ohms: number; volts: number }[];
  kvl: { sourceVolts: number; dropsTotal: number; residual: number }
};

export type CircuitStep = {
  heading: string;
  message: string;
  highlight: 'source' | 'loop' | 'all' | string
};

export function solveSeries(spec: Extract<VisualSpec, { type: 'circuit_series' }>): CircuitSolution;
export function circuitSteps(spec: Extract<VisualSpec, { type: 'circuit_series' }>): CircuitStep[];
// 4 steps: total resistance, current (I = V / R), voltage drop across each resistor, KVL check.
// Round displayed values to 2 decimals.
```

Binary search step pattern (line numbers refer to the reference code below):
- start (line 3): low = 0, high = n-1.
- per loop pass: `check` (line 5, mid highlighted, message names arr[mid] and the target, includes `predict`), then `move` (line 9 or 11, low or high updated, ruledOut updated) OR `found` (line 7).
- `notfound` (line 14) when low > high.

```ts
// shared/src/sim/code.ts
export const REFERENCE_CODE: Record<Algorithm, {
  language: 'cpp';
  lines: string[];
  complexity: { time: string; space: string }
}>;
```

Reference code for binary_search:
```cpp
int binarySearch(vector<int>& arr, int target) {       // 1
    int low = 0;                                       // 2
    int high = arr.size() - 1;                         // 3
    while (low <= high) {                              // 4
        int mid = low + (high - low) / 2;              // 5
        if (arr[mid] == target) {                      // 6
            return mid;                                // 7
        } else if (arr[mid] < target) {                // 8
            low = mid + 1;                             // 9
        } else {                                       // 10
            high = mid - 1;                            // 11
        }                                              // 12
    }                                                  // 13
    return -1;                                         // 14
}                                                      // 15
```

Complexity shown in the UI comes from REFERENCE_CODE (binary_search: O(log n) time, O(1) space), not from the AI.
linear_search and bubble_sort: write your own listing and line map, same rules.

## Progress (client/src/lib/progress.ts, localStorage key "studymate.v1")
```ts
type StoredSession = {
  id: string;
  topic: string;
  subject: Subject;
  at: string;
  overallPercent: number;
  concepts: { concept: string; percent: number }[];
  kind: 'practice' | 'retake'
};
// stored shape: { sessions: StoredSession[]; demo: boolean }, capped at 50

progress.save(a: Analysis, kind: 'practice' | 'retake'): void
progress.sessions(): StoredSession[]
progress.topicMap(): { subject: Subject; topics: { topic: string; percent: number; band: Band; at: string }[] }[]
progress.continueCandidate(): StoredSession | null // lowest latest overallPercent
progress.seedDemo(): void // only via ?demo=1
progress.clear(): void
```

## Session (client/src/app/session.tsx, React context mirrored to sessionStorage "studymate.session")
```ts
type SessionState = {
  mode: 'full' | 'retake';
  input?: string;
  intent?: 'explain' | 'solve';
  lesson?: Lesson;
  quiz?: Quiz;
  answers: Answer[];
  analysis?: Analysis;
  previousAnalysis?: Analysis;
  plan?: Plan;
  source?: 'ai' | 'fallback' | 'sample';
};
```

## Component contract between UI agents
`<VisualStage spec={lesson.visual} />` in client/src/components/visual/VisualStage.tsx.
Foundation ships a placeholder. UI-Visual owns the real one. It renders nothing for `type: 'none'`.

## Server env (.env.example)
```
AI_PROVIDER=mock
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
PORT=8787
CORS_ORIGIN=http://localhost:5173
```
Client: VITE_USE_MOCKS=false
