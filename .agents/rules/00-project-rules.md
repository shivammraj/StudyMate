# StudyMate: project rules

## Product
StudyMate is a visual AI learning platform for engineering students.
Loop: Ask -> Learn (see it) -> Practice -> Results -> Plan -> Retake.
Promise: "Understand it. Visualize it. Master it."

## The one principle
AI chooses and explains. Code computes.
- AI writes explanations, picks which visual to use and its inputs, and writes questions.
- Code computes every visualization step, every score, every percentage, every code listing shown in a visualizer, and every link.
- Never ask the AI to calculate, trace an algorithm, score an answer, or produce URLs.

## Stack (locked)
- Monorepo, npm workspaces: client/, server/, shared/. TypeScript strict everywhere.
- Client: React, Vite, Tailwind v4, React Router, lucide-react (the only icon library). CSS transitions for motion. No state library.
- Server: Node, Express, zod, helmet, express-rate-limit, @google/genai.
- Storage: localStorage (studymate.v1) and sessionStorage. No database. No auth.
- AI provider by env: AI_PROVIDER = gemini | ollama | mock.
- Allowed dependencies are the ones above plus vitest, supertest, tsx, dotenv, concurrently. Ask before adding anything else.

## Source of truth
- @../../CONTRACTS.md: every type, endpoint, function signature and the reference code listings.
- @01-design-system.md: every visual decision. Use tokens. No hard-coded colors, radii or sizes.
- @02-ux-rules.md: how the product must feel to use.
- To change a contract: edit CONTRACTS.md and shared/src/schemas.ts in the same commit and list it under "Contract changes" in your final summary.

## Ownership
Edit only the folders you own.
| Owner | Folders |
|---|---|
| Foundation (PROMPT 0) | everything once, then hands off |
| UI-Learn (PROMPT 1) | client/src/screens/Home.tsx, Learn.tsx, client/src/components/learn/ |
| UI-Visual (PROMPT 2) | client/src/components/visual/ |
| UI-Loop (PROMPT 3) | client/src/screens/Practice.tsx, Results.tsx, Plan.tsx, Progress.tsx, client/src/components/loop/ |
| Backend (PROMPT 4) | server/ |
| Engine (PROMPT 5) | shared/src/engine/, shared/src/sim/, client/src/lib/progress.ts |
| Integration (PROMPT 6) | whatever is needed to connect, nothing more |
| Polish (PROMPT 7) | fixes only |

Frozen after PROMPT 0 (only Integration may change): client/src/app/, client/src/components/ui/, shared/src/schemas.ts, shared/src/fixtures/ (Backend may add fixtures), all package.json files, CONTRACTS.md.
Need something from another owner? Put it under "Needs from others" in your summary. Don't fix it yourself.

## Scope
Build only what CONTRACTS.md lists. No extra screens, nav items, or features.
Not in this build: auth, database, payments, social, code execution, uploads, voice, whiteboard, RAG.

## Quality bar
- Every async view has loading, error (with retry), empty and success states.
- No console errors or warnings. No `any`. No leftover TODOs or dead code.
- Reuse components/ui. Don't duplicate.
- Works at 390px and 1280px wide. Everything works by keyboard.

## Honesty
- No fake numbers. Every statistic comes from real quiz data.
- Demo data only with ?demo=1, visibly tagged.
- Sample content must be factually correct. Check formulas, code and answer keys.
- Content served from saved samples is labelled "Sample lesson".

## Definition of done (every prompt)
1. Run /verify. Typecheck, tests and build pass.
2. Run the app and exercise what you built.
3. Final summary: files changed, Contract changes, Needs from others.

## Git
Conventional commits. One commit per finished prompt.
