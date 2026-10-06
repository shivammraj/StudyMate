import {
  LessonReq,
  Lesson,
  QuizReq,
  Quiz,
  PlanReq,
  Plan,
  ApiResult,
  AskReq,
  AskResponse,
} from '../types/schemas.js';
import {
  BINARY_SEARCH_LESSON,
  BINARY_SEARCH_QUIZ,
  BINARY_SEARCH_PLAN,
  KIRCHHOFF_LESSON,
  KIRCHHOFF_QUIZ,
  KIRCHHOFF_PLAN,
  INTEGRATE_LESSON,
  INTEGRATE_QUIZ,
  INTEGRATE_PLAN,
} from '../utils/fixtures.js';

function matchSample(input: string): 'binary' | 'kirchhoff' | 'integrate' | null {
  const norm = input.trim().toLowerCase();
  if (norm.includes('binary') || norm.includes('binary search') || norm.includes('bs')) return 'binary';
  if (norm.includes('kirchhoff') || norm.includes('circuit') || norm.includes('kvl') || norm.includes('kcl')) return 'kirchhoff';
  if (norm.includes('integrate') || norm.includes('calculus') || norm.includes('derivative')) return 'integrate';
  return null;
}

export function buildSearchUrl(r: { kind: string; query: string }): string {
  const query = encodeURIComponent(r.query.trim());
  if (r.kind === 'video') {
    return `https://www.youtube.com/results?search_query=${query}`;
  }
  return `https://www.google.com/search?q=${query}`;
}

export const api = {
  async lesson(req: LessonReq): Promise<ApiResult<Lesson>> {
    const isSample = matchSample(req.input);

    try {
      const res = await fetch('/api/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Backend unavailable; fallback smoothly
    }

    // Return sample or fallback
    if (isSample === 'kirchhoff') {
      return { ok: true, data: KIRCHHOFF_LESSON, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    if (isSample === 'integrate') {
      return { ok: true, data: INTEGRATE_LESSON, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    return { ok: true, data: BINARY_SEARCH_LESSON, meta: { source: 'sample', provider: 'mock', ms: 12 } };
  },

  async quiz(req: QuizReq): Promise<ApiResult<Quiz>> {
    const isSample = matchSample(req.input);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Backend unavailable; fallback smoothly
    }

    if (isSample === 'kirchhoff') {
      return { ok: true, data: KIRCHHOFF_QUIZ, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    if (isSample === 'integrate') {
      return { ok: true, data: INTEGRATE_QUIZ, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    return { ok: true, data: BINARY_SEARCH_QUIZ, meta: { source: 'sample', provider: 'mock', ms: 12 } };
  },

  async plan(req: PlanReq): Promise<ApiResult<Plan>> {
    const isSample = matchSample(req.topic);

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Backend unavailable; fallback smoothly
    }

    if (isSample === 'kirchhoff') {
      return { ok: true, data: KIRCHHOFF_PLAN, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    if (isSample === 'integrate') {
      return { ok: true, data: INTEGRATE_PLAN, meta: { source: 'sample', provider: 'mock', ms: 12 } };
    }
    return { ok: true, data: BINARY_SEARCH_PLAN, meta: { source: 'sample', provider: 'mock', ms: 12 } };
  },

  async ask(req: AskReq): Promise<ApiResult<AskResponse>> {
    try {
      const res = await fetch('/api/study/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Backend unavailable; fallback smoothly
    }

    return {
      ok: true,
      data: clientClassifyAsk(req.question, req.mode),
      meta: { source: 'fallback', provider: 'mock', ms: 25 },
    };
  },
};

export function clientClassifyAsk(question: string, mode?: string): AskResponse {
  const low = question.toLowerCase().trim();

  // 0. Greetings & Conversational Queries
  const isGreeting =
    /^(hi|hii|hiii|hello|hey|heyy|heya|hola|sup|yo|good morning|good afternoon|good evening)\b/i.test(low) ||
    low === 'hi' ||
    low === 'hii' ||
    low === 'hello' ||
    low === 'hey';

  if (isGreeting) {
    return {
      subject: 'computer_science',
      topic: 'studymate_assistant',
      intent: 'general_question',
      difficulty: 'beginner',
      learningMode: 'concept_explanation',
      title: 'Hey Shivam! 👋 How can StudyMate help you today?',
      answer: `Hello Shivam! 👋 I am **StudyMate**, your AI engineering and computer science learning partner.\n\nAsk me anything! Here is what we can do:\n\n- 🔍 **Explain Concepts:** "Explain binary search visually", "What is polymorphism?", "How does virtual memory work?"\n- 💻 **DSA & Code:** "Write binary search in C++", "Why does my code give TLE?", "Explain pointers with an example"\n- 📐 **Mathematics & Calculus:** "Solve x² + 5x + 6 = 0", "Solve ∫ x² dx step-by-step"\n- ⚡ **Circuits & Hardware:** "Explain Kirchhoff's Voltage Law (KVL)", "How does Ohm's Law work?"\n- 📝 **Practice & Quizzes:** "Give me 5 questions on recursion", "Test me on operating systems"\n\nType any question above or choose a mode to get started!`,
      summary: 'Personalized greeting from StudyMate: ready to explain, solve, visualize, code, or quiz.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Explore Interactive Lessons',
        route: '/learn/binary-search',
      },
    };
  }

  if (low.includes('how are you') || low.includes('how r u') || low.includes("what's up") || low.includes('whats up')) {
    return {
      subject: 'computer_science',
      topic: 'studymate_assistant',
      intent: 'general_question',
      difficulty: 'beginner',
      learningMode: 'concept_explanation',
      title: 'Doing great and ready to learn, Shivam!',
      answer: `I'm doing great, Shivam! Ready to help you master engineering topics with maximum clarity.\n\nWhat would you like to explore right now?`,
      summary: 'StudyMate is ready to build your next learning session.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Start Learning',
        route: '/learn/binary-search',
      },
    };
  }

  if (low.includes('who are you') || low.includes('what are you') || low.includes('what can you do') || low === 'help' || low.includes('help me')) {
    return {
      subject: 'computer_science',
      topic: 'studymate_assistant',
      intent: 'general_question',
      difficulty: 'beginner',
      learningMode: 'concept_explanation',
      title: 'About StudyMate: The Intelligent Learning Engine',
      answer: `I am **StudyMate**, an intelligent learning workspace designed specifically for engineering and computer science students.\n\nUnlike a generic chatbot that just gives plain text replies, I understand your question and transform it into an active workspace:\n\n1. **Interactive Visualizers:** Step-by-step animations for algorithms and circuit loops\n2. **DSA Code Lab:** Real C++ workspace with line-by-line dry run variable inspectors\n3. **Step Derivations:** Rigorous mathematical proofs with intermediate calculations\n4. **Adaptive Practice:** Confidence-calibrated quizzes that track your mastery and diagnose weaknesses`,
      summary: 'StudyMate transforms any technical question into an interactive learning workspace.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Try Binary Search Lesson',
        route: '/learn/binary-search',
      },
    };
  }

  // Debugging
  if (low.includes('tle') || low.includes('time limit') || low.includes('wrong answer') || low.includes('debug') || low.includes('segfault') || low.includes('bug')) {
    return {
      subject: 'dsa',
      topic: 'debugging_and_complexity',
      intent: 'debug_code',
      difficulty: 'intermediate',
      learningMode: 'debugging',
      title: 'Debugging Time Limit Exceeded (TLE) & Logic Bugs',
      answer: `Time Limit Exceeded (TLE) typically occurs from infinite loops in while conditions (e.g. low = mid instead of low = mid + 1), unsynchronized I/O streams in competitive programming, or integer overflow in midpoint calculations.\n\nLet's trace your code in the DSA Lab debugger to inspect pointer registers step-by-step.`,
      summary: 'Diagnose infinite loops, boundary condition bugs, and algorithmic bottlenecks in C++.',
      suggestedRoute: '/dsa',
      nextAction: { label: 'Debug in DSA Lab', route: '/dsa' },
    };
  }

  // Code Lab / DSA Code
  if (mode === 'code' || low.includes('c++') || low.includes('write binary search') || low.includes('write code') || low.includes('implement')) {
    return {
      subject: 'dsa',
      topic: 'binary_search',
      intent: 'write_code',
      difficulty: 'intermediate',
      learningMode: 'code_lab',
      title: 'C++ Binary Search Implementation',
      answer: `Here is the optimal implementation of Binary Search in C++ with boundary guards against integer overflow:\n\n\`\`\`cpp\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\`\`\`\n\nOpen the DSA Lab to compile, step through test cases, and inspect variable registers.`,
      summary: 'Iterative implementation in modern C++ with overflow-safe midpoint calculation and dry-run tracing.',
      suggestedRoute: '/dsa',
      nextAction: { label: 'Open DSA Lab', route: '/dsa' },
    };
  }

  // Circuits / KVL
  if (low.includes('kvl') || low.includes('kirchhoff') || low.includes('circuit') || low.includes('voltage') || low.includes('ohm')) {
    return {
      subject: 'electrical_engineering',
      topic: 'kirchhoffs_voltage_law',
      intent: 'learn_concept',
      difficulty: 'intermediate',
      learningMode: 'engineering_diagram',
      title: "Kirchhoff's Voltage Law (KVL)",
      answer: `Kirchhoff's Voltage Law (KVL) states that the directed sum of electrical potential differences (voltages) around any closed circuit network is strictly zero:\n\n$$\\sum_{k=1}^n V_k = 0$$\n\nIt is the conservation of electrical energy expressed per unit of charge. When traversing a loop, the electric potential lifted by voltage sources is consumed by resistive drops.\n\nOpen the interactive circuit visualizer to adjust loop resistance and calculate branch currents.`,
      summary: 'Conservation of energy in closed loops: the algebraic sum of electrical potentials around any closed network is zero.',
      suggestedRoute: '/learn/kirchhoffs-voltage-law',
      nextAction: { label: 'Interactive Circuit Visualizer', route: '/learn/kirchhoffs-voltage-law' },
    };
  }

  // Mathematics / Calculus
  if (mode === 'solve' || low.includes('integral') || low.includes('integrate') || low.includes('calculus') || low.includes('derivative') || low.includes('dx') || low.includes('x²') || low.includes('solve')) {
    const isIntegral = low.includes('integral') || low.includes('integrate') || low.includes('dx') || low.includes('∫');
    return {
      subject: 'mathematics',
      topic: isIntegral ? 'integration_by_parts' : 'algebraic_equations',
      intent: 'solve_problem',
      difficulty: 'intermediate',
      learningMode: 'mathematical_derivation',
      title: isIntegral ? 'Indefinite Integration: Step-by-Step Derivation' : 'Algebraic Equation Solution & Proof',
      answer: isIntegral
        ? `To solve the integral step-by-step:\n\n1. Identify integrand and apply the power rule of integration $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$.\n2. For $\\int x^2 dx$, increment power to 3 and divide by 3: $\\frac{x^3}{3} + C$.\n3. Verify via differentiation: $\\frac{d}{dx}\\left(\\frac{x^3}{3} + C\\right) = x^2$.\n\nLet's walk through the full step-by-step derivation.`
        : `Solving $x^2 + 5x + 6 = 0$:\n\n1. Find two factors that multiply to 6 and add to 5: 2 and 3.\n2. Factor into $(x + 2)(x + 3) = 0$.\n3. Zero product property yields roots $x = -2$ and $x = -3$.\n4. Verified by substitution: $(-2)^2 + 5(-2) + 6 = 0$.\n\nLet's walk through the full mathematical derivation interface.`,
      summary: 'Step-by-step mathematical problem decomposition with rigorous proofs and practice checks.',
      suggestedRoute: '/learn/integration-by-parts',
      nextAction: { label: 'Step-by-Step Derivation', route: '/learn/integration-by-parts' },
    };
  }

  // Practice & Quiz
  if (mode === 'quiz' || mode === 'practice' || low.includes('quiz') || low.includes('test me') || low.includes('questions on') || low.includes('recursion questions')) {
    const isOS = low.includes('operating system') || low.includes('os');
    const topicName = isOS ? 'Operating Systems' : low.includes('recursion') ? 'Recursion' : 'Engineering Fundamentals';
    return {
      subject: isOS ? 'operating_systems' : 'dsa',
      topic: isOS ? 'operating_systems' : low.includes('recursion') ? 'recursion' : 'data_structures',
      intent: low.includes('quiz') || low.includes('test me') ? 'quiz' : 'practice',
      difficulty: 'intermediate',
      learningMode: 'quiz',
      title: `Adaptive Mastery Quiz: ${topicName}`,
      answer: `Ready to test your mastery in **${topicName}**! StudyMate has configured adaptive diagnostic questions with calibrated confidence tracking.`,
      summary: `Calibrated diagnostic questions to verify retention and diagnose boundary conditions in ${topicName}.`,
      suggestedRoute: '/practice',
      nextAction: { label: `Start ${topicName} Practice`, route: '/practice' },
    };
  }

  // Visual / Binary search default
  return {
    subject: 'dsa',
    topic: 'binary_search',
    intent: 'learn_concept',
    difficulty: 'intermediate',
    learningMode: 'visual',
    title: 'Binary Search Algorithm',
    answer: `Binary Search is an optimal divide-and-conquer algorithm that locates an element in a sorted collection in $O(\\log n)$ logarithmic time.\n\nAt each comparison, comparing the target against \`arr[mid]\` eliminates half of the remaining array elements.\n\nLet's launch the interactive step visualizer with live pointer registers (LOW / MID / HIGH).`,
    summary: 'Divide and conquer search algorithm with O(log n) logarithmic efficiency over sorted arrays.',
    suggestedRoute: '/learn/binary-search',
    nextAction: { label: 'Start Learning & Visualizing', route: '/learn/binary-search' },
  };
}

