# StudyMate

### *“Understand it. Visualize it. Master it.”*

StudyMate is a visual AI learning platform designed for engineering students. We are **not** building another AI chat app. StudyMate replaces walls of text with interactive algorithm simulations, circuit loop solvers, and targeted diagnostic quizzes that pinpoint exactly what a student understands versus what they struggle to apply.

---

## ⚡ The Core Architecture in 60 Seconds

> **“AI chooses and explains. Code computes.”**

* **AI writes explanations and chooses the visual mode**: A single structured call analyzes the student's question, determines subject & difficulty, selects the visualizer type (`array_algorithm`, `circuit_series`, or `worked_solution`), and authors 6 targeted diagnostic questions across 3 concepts.
* **Deterministic code computes every step**: Visualizer steps (binary search boundaries, ruled-out indices, C++ active lines, and Kirchhoff's loop voltages) are computed entirely by pure TypeScript simulation engines—**never** by the LLM. An LLM cannot make off-by-one errors or hallucinate math because code controls the state.
* **Diagnostic closed loop**: Ask ➔ Learn (interactive visualizer + code sync) ➔ Practice (6 questions, 3 concepts × 2 skills) ➔ Results (actionable diagnostic headline + before/after deltas) ➔ Plan (10-minute intervention) ➔ Retake.

---

## 🧮 How Mastery is Calculated

1. **Skill Weights**: Each question tests one of three skill levels:
   * `recall` = 1 point
   * `understanding` = 2 points
   * `application` = 3 points
2. **Scoring**: Full credit is earned for an unhinted correct answer; **half credit** is awarded if the student opened the hint; 0 points for incorrect or unanswered questions.
3. **Mastery Percentage**: $\text{Percent} = \text{round}\left(100 \times \frac{\sum \text{Earned Weights}}{\sum \text{Total Weights}}\right)$, computed overall, per concept, and per skill.
4. **Bands**:
   * $\ge 80\%$: **Solid** (Green)
   * $50\% - 79\%$: **Getting there** (Amber)
   * $< 50\%$: **Needs practice** (Red)
5. **Diagnostic Headline**: First match wins:
   * All concepts solid: *"You're solid on [topic]. No weak spots in this practice."*
   * Confident mistake (marked "Certain" but wrong): *"You felt sure about [concept], but the answer was off. Fix that first."*
   * $\ge 30\%$ gap between highest and lowest skill:
     - Lowest is application: *"You know the idea but struggle to use it on new problems."*
     - Lowest is understanding: *"You know the facts but not why they work."*
     - Lowest is recall: *"You understand the ideas but miss key facts."*
   * Otherwise: *"[Weakest concept] is the weakest part of [topic]."*

---

## 🚀 Running Locally

### Prerequisites
* Node.js v20+ and npm

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration runs in `AI_PROVIDER=mock` mode (instant and offline).
To connect live Google Gemini:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Start Development Server
```bash
npm run dev
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:8787](http://localhost:8787)
* **Design System Styleguide**: [http://localhost:5173/styleguide](http://localhost:5173/styleguide)

### 4. Run Verification Suite
```bash
npm run verify
```
Runs strict TypeScript checks, Vitest engine/simulator tests, and full monorepo build.

---

## 📁 Repository Structure

```
StudyMate/
├── .agents/
│   ├── rules/                # Project, Design System, and UX rules
│   └── workflows/            # /verify automation workflow
├── CONTRACTS.md              # Frozen schema definitions, types, endpoints & code
├── shared/                   # Shared TypeScript library
│   ├── src/schemas.ts        # Zod schemas & inferred types
│   ├── src/engine/           # Pure scoring, analysis & headline engine
│   ├── src/sim/              # Deterministic array & circuit simulators
│   └── src/fixtures/         # Verified offline samples (Binary search, KVL, Calculus)
├── server/                   # Express backend
│   ├── src/ai/               # Gemini, Ollama & Mock provider orchestration
│   ├── src/routes/           # API endpoints (/api/lesson, /api/quiz, /api/plan)
│   └── test/                 # Supertest API test suite
└── client/                   # Vite + React + Tailwind v4 frontend
    ├── src/components/ui/    # Accessible paper/lab notebook UI primitives
    ├── src/components/visual/# ArrayVisualizer, CircuitVisualizer, WorkedSolution
    ├── src/screens/          # Home, Learn, Practice, Results, Plan, Progress
    └── src/lib/              # LocalStorage progress & API client
```
