import { Request, Response } from 'express';
import {
  LessonReq,
  QuizReq,
  PlanReq,
  Lesson,
  Quiz,
  Plan,
  TeachingMethod,
  AskReq,
  AskResponse,
} from '../utils/schemas.js';
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
import { matchSampleChip } from '../services/mock.service.js';
import { geminiService, AiServiceError } from '../services/gemini.service.js';
import { getLessonPrompt, getQuizPrompt, getPlanPrompt, getAskPrompt } from '../utils/prompts.js';

function deriveMethod(visualType: string, intent: 'explain' | 'solve'): TeachingMethod {
  if (visualType === 'array_algorithm') return 'visual_code';
  if (visualType === 'circuit_series') return 'visual_circuit';
  if (intent === 'solve') return 'worked_solution';
  return 'concept';
}

export class AiController {
  async getLesson(req: Request, res: Response) {
    const start = Date.now();
    const parsed = LessonReq.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid lesson request: ' + parsed.error.issues[0]?.message,
          retryable: false,
        },
      });
    }

    const { input, intent } = parsed.data;

    // Check instant sample chip
    const sample = matchSampleChip(input);
    if (sample === 'binary_search') {
      return res.json({
        ok: true,
        data: BINARY_SEARCH_LESSON,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'kirchhoff') {
      return res.json({
        ok: true,
        data: KIRCHHOFF_LESSON,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'integrate') {
      return res.json({
        ok: true,
        data: INTEGRATE_LESSON,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }

    let lessonData: Lesson;
    let source: 'ai' | 'fallback' = 'ai';
    let providerName: 'gemini' | 'ollama' | 'mock' = 'gemini';

    try {
      const { system, user } = getLessonPrompt(parsed.data);
      const resGen = await geminiService.generateJson({
        system,
        user,
        schema: Lesson,
        timeoutMs: 25000,
      });
      lessonData = resGen.data;
      providerName = resGen.provider;
    } catch (err: any) {
      // Fallback matching
      const low = input.toLowerCase();
      if (low.includes('search') || low.includes('binary')) {
        lessonData = BINARY_SEARCH_LESSON;
        source = 'fallback';
      } else if (low.includes('voltage') || low.includes('circuit') || low.includes('kirchhoff')) {
        lessonData = KIRCHHOFF_LESSON;
        source = 'fallback';
      } else if (low.includes('integral') || low.includes('integrate') || low.includes('calculus')) {
        lessonData = INTEGRATE_LESSON;
        source = 'fallback';
      } else {
        const code = err instanceof AiServiceError ? err.code : 'INTERNAL';
        const retryable = err instanceof AiServiceError ? err.retryable : true;
        return res.status(500).json({
          ok: false,
          error: {
            code,
            message: err.message || 'Failed to generate lesson',
            retryable,
          },
        });
      }
    }

    // Method normalization on server
    const method = deriveMethod(lessonData.visual.type, intent);
    lessonData.detected.method = method;

    if (lessonData.visual.type === 'array_algorithm') {
      if (lessonData.visual.algorithm === 'binary_search') {
        const uniqueSorted = Array.from(new Set(lessonData.visual.array)).sort((a, b) => a - b);
        if (uniqueSorted.length < 4) {
          uniqueSorted.push(50, 75);
        }
        lessonData.visual.array = uniqueSorted.slice(0, 8);
      } else if (lessonData.visual.algorithm === 'bubble_sort') {
        lessonData.visual.target = null;
      }
    }

    // Guard against inappropriate visual types
    const tLow = lessonData.detected.topic.toLowerCase();
    if (lessonData.visual.type === 'array_algorithm' && (tLow.includes('circuit') || tLow.includes('voltage'))) {
      lessonData.visual = { type: 'none' };
      lessonData.detected.method = deriveMethod('none', intent);
    } else if (lessonData.visual.type === 'circuit_series' && (tLow.includes('search') || tLow.includes('sort'))) {
      lessonData.visual = { type: 'none' };
      lessonData.detected.method = deriveMethod('none', intent);
    }

    return res.json({
      ok: true,
      data: lessonData,
      meta: {
        source,
        provider: providerName,
        ms: Date.now() - start,
      },
    });
  }

  async getQuiz(req: Request, res: Response) {
    const start = Date.now();
    const parsed = QuizReq.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid quiz request: ' + parsed.error.issues[0]?.message,
          retryable: false,
        },
      });
    }

    const { input } = parsed.data;
    const sample = matchSampleChip(input);
    if (sample === 'binary_search') {
      return res.json({
        ok: true,
        data: BINARY_SEARCH_QUIZ,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'kirchhoff') {
      return res.json({
        ok: true,
        data: KIRCHHOFF_QUIZ,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'integrate') {
      return res.json({
        ok: true,
        data: INTEGRATE_QUIZ,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }

    let quizData: Quiz;
    let source: 'ai' | 'fallback' = 'ai';
    let providerName: 'gemini' | 'ollama' | 'mock' = 'gemini';

    try {
      const { system, user } = getQuizPrompt(parsed.data);
      const resGen = await geminiService.generateJson({
        system,
        user,
        schema: Quiz,
        timeoutMs: 25000,
      });
      quizData = resGen.data;
      providerName = resGen.provider;
    } catch (err: any) {
      const low = input.toLowerCase();
      if (low.includes('search') || low.includes('binary')) {
        quizData = BINARY_SEARCH_QUIZ;
        source = 'fallback';
      } else if (low.includes('voltage') || low.includes('circuit') || low.includes('kirchhoff')) {
        quizData = KIRCHHOFF_QUIZ;
        source = 'fallback';
      } else if (low.includes('integral') || low.includes('integrate') || low.includes('calculus')) {
        quizData = INTEGRATE_QUIZ;
        source = 'fallback';
      } else {
        return res.status(500).json({
          ok: false,
          error: {
            code: err instanceof AiServiceError ? err.code : 'INTERNAL',
            message: err.message || 'Failed to generate quiz',
            retryable: true,
          },
        });
      }
    }

    // Normalize IDs to q1..qN
    quizData.questions = quizData.questions.map((q, idx) => ({
      ...q,
      id: `q${idx + 1}`,
    }));

    return res.json({
      ok: true,
      data: quizData,
      meta: {
        source,
        provider: providerName,
        ms: Date.now() - start,
      },
    });
  }

  async getPlan(req: Request, res: Response) {
    const start = Date.now();
    const parsed = PlanReq.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid plan request: ' + parsed.error.issues[0]?.message,
          retryable: false,
        },
      });
    }

    const { topic, weakConcepts } = parsed.data;
    const sample = matchSampleChip(topic);
    if (sample === 'binary_search' && (!weakConcepts || weakConcepts.length === 0 || weakConcepts.includes('Pointer adjustments'))) {
      return res.json({
        ok: true,
        data: BINARY_SEARCH_PLAN,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'kirchhoff') {
      return res.json({
        ok: true,
        data: KIRCHHOFF_PLAN,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }
    if (sample === 'integrate') {
      return res.json({
        ok: true,
        data: INTEGRATE_PLAN,
        meta: { source: 'sample', provider: 'mock', ms: Date.now() - start },
      });
    }

    let planData: Plan;
    let source: 'ai' | 'fallback' = 'ai';
    let providerName: 'gemini' | 'ollama' | 'mock' = 'gemini';

    try {
      const { system, user } = getPlanPrompt(parsed.data);
      const resGen = await geminiService.generateJson({
        system,
        user,
        schema: Plan,
        timeoutMs: 25000,
      });
      planData = resGen.data;
      providerName = resGen.provider;
    } catch {
      const weakFocus = weakConcepts[0] || topic;
      planData = {
        focus: `Targeted review on ${weakFocus}`,
        steps: [
          {
            title: `Review foundations of ${weakFocus}`,
            detail: `Walk through textbook definitions and core mechanisms to solidify the concept.`,
            minutes: 3,
          },
          {
            title: `Solve 2 targeted practice problems`,
            detail: `Apply the principles slowly without looking at solutions until completed.`,
            minutes: 4,
          },
          {
            title: `Self-check edge conditions`,
            detail: `Confirm why boundary checks and formulas hold true under limits.`,
            minutes: 3,
          },
        ],
        resources: [
          {
            label: `${weakFocus} walkthrough tutorial`,
            query: `${topic} ${weakFocus} engineering lecture`,
            kind: 'video',
            why: `Explains step-by-step resolution for your weakest area.`,
          },
          {
            label: `${weakFocus} formula & practice notes`,
            query: `${topic} ${weakFocus} worked examples`,
            kind: 'read',
            why: `Provides concrete reference solutions.`,
          },
        ],
      };
      source = 'fallback';
    }

    // Normalize minutes to sum to 10
    const totalMin = planData.steps.reduce((sum, s) => sum + s.minutes, 0);
    if (totalMin !== 10 && planData.steps.length > 0) {
      const diff = 10 - totalMin;
      let longestIdx = 0;
      for (let i = 1; i < planData.steps.length; i++) {
        if (planData.steps[i].minutes > planData.steps[longestIdx].minutes) {
          longestIdx = i;
        }
      }
      const newMin = planData.steps[longestIdx].minutes + diff;
      planData.steps[longestIdx].minutes = Math.max(1, Math.min(5, newMin));
    }

    // Filter out resources queries with http/www
    planData.resources = planData.resources
      .filter((r) => !r.query.includes('http') && !r.query.includes('www'))
      .slice(0, 3);

    return res.json({
      ok: true,
      data: planData,
      meta: {
        source,
        provider: providerName,
        ms: Date.now() - start,
      },
    });
  }

  async handleAsk(req: Request, res: Response) {
    const start = Date.now();
    const parsed = AskReq.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid ask request: ' + (parsed.error.issues[0]?.message || 'malformed input'),
          retryable: false,
        },
      });
    }

    const { question, mode, student } = parsed.data;
    const studentName = student?.name || 'Shivam Mavi';

    let askData: AskResponse;
    let source: 'ai' | 'fallback' = 'ai';
    let providerName: 'gemini' | 'ollama' | 'mock' = 'gemini';

    try {
      const { system, user } = getAskPrompt(parsed.data);
      const resGen = await geminiService.generateJson({
        system,
        user,
        schema: AskResponse,
        timeoutMs: 25000,
      });
      askData = resGen.data;
      providerName = resGen.provider;
    } catch (err: any) {
      // Deterministic classification fallback
      source = 'fallback';
      providerName = 'mock';
      askData = classifyQuestionFallback(question, mode);
    }

    return res.json({
      ok: true,
      data: askData,
      meta: {
        source,
        provider: providerName,
        ms: Date.now() - start,
      },
    });
  }
}

function classifyQuestionFallback(question: string, mode: string): AskResponse {
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

  // 0b. "How are you" / "What can you do" / "Who are you"
  if (low.includes('how are you') || low.includes('how r u') || low.includes("what's up") || low.includes('whats up')) {
    return {
      subject: 'computer_science',
      topic: 'studymate_assistant',
      intent: 'general_question',
      difficulty: 'beginner',
      learningMode: 'concept_explanation',
      title: 'Doing great and ready to learn, Shivam!',
      answer: `I'm doing great, Shivam! Ready to help you master engineering topics with maximum clarity.\n\nWhether you're debugging C++ code, learning data structures, solving calculus integrals, or exploring electrical circuits, I'm here to build interactive visual lessons for you.\n\nWhat would you like to explore right now?`,
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
      answer: `I am **StudyMate**, an intelligent learning workspace designed specifically for engineering and computer science students.\n\nUnlike a generic chatbot that just gives plain text replies, I understand your question and transform it into an active workspace:\n\n1. **Interactive Visualizers:** Step-by-step animations for algorithms and circuit loops\n2. **DSA Code Lab:** Real C++ workspace with line-by-line dry run variable inspectors\n3. **Step Derivations:** Rigorous mathematical proofs with intermediate calculations\n4. **Adaptive Practice:** Confidence-calibrated quizzes that track your mastery and diagnose weaknesses\n\nAsk any technical question or problem, and let's start learning!`,
      summary: 'StudyMate transforms any technical question into an interactive learning workspace.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Try Binary Search Lesson',
        route: '/learn/binary-search',
      },
    };
  }

  if (low.includes('thank') || low.includes('thanks') || low.includes('thx')) {
    return {
      subject: 'computer_science',
      topic: 'studymate_assistant',
      intent: 'general_question',
      difficulty: 'beginner',
      learningMode: 'concept_explanation',
      title: "You're very welcome, Shivam!",
      answer: `Glad I could help, Shivam! Keep up the momentum in your studies.\n\nIf you want to reinforce what you just learned, you can launch a quick quiz or move on to the next concept whenever you're ready!`,
      summary: 'Reinforce your knowledge through adaptive practice whenever you are ready.',
      suggestedRoute: '/practice',
      nextAction: {
        label: 'Practice Quiz',
        route: '/practice',
      },
    };
  }

  // 1. Debugging
  if (low.includes('tle') || low.includes('time limit') || low.includes('wrong answer') || low.includes('debug') || low.includes('segfault') || low.includes('segmentation') || low.includes('bug')) {
    return {
      subject: 'dsa',
      topic: 'debugging_and_complexity',
      intent: 'debug_code',
      difficulty: 'intermediate',
      learningMode: 'debugging',
      title: 'Debugging Time Limit Exceeded (TLE) & Logic Bugs',
      answer: `Time Limit Exceeded (TLE) in algorithms like Binary Search typically stems from one of three issues:\n\n1. **Pointer Stagnation (Infinite Loop):** When calculating \`mid = (low + high) / 2\` (or with integer truncation), if pointers are updated with \`low = mid\` instead of \`low = mid + 1\`, the loop condition \`while (low <= high)\` can never terminate when \`low == high - 1\`.\n\n2. **Fast I/O Bottlenecks:** In competitive programming and online judges, standard streams (\`std::cin\`, \`std::cout\`) without \`std::ios_base::sync_with_stdio(false); std::cin.tie(NULL);\` trigger expensive buffer flushes.\n\n3. **Integer Overflow:** Using \`(low + high) / 2\` can overflow 32-bit signed integers when both values are near 10^9. Always prefer \`mid = low + (high - low) / 2\`.\n\nLet's trace your code in the DSA Lab debugger to inspect pointer registers at every iteration step.`,
      summary: 'Diagnose infinite loops in while conditions, off-by-one pointer shifts, or I/O bottlenecks in C++.',
      suggestedRoute: '/dsa',
      nextAction: {
        label: 'Debug in DSA Lab',
        route: '/dsa',
      },
    };
  }

  // 2. Code Lab / DSA Code
  if (mode === 'code' || low.includes('c++') || low.includes('write binary search') || low.includes('write code') || low.includes('code binary search') || low.includes('implement')) {
    return {
      subject: 'dsa',
      topic: 'binary_search',
      intent: 'write_code',
      difficulty: 'intermediate',
      learningMode: 'code_lab',
      title: 'C++ Binary Search Implementation',
      answer: `Here is the clean, production-grade implementation of Binary Search in C++.\n\nKey design decisions:\n- Use \`mid = low + (high - low) / 2\` to guard against 32-bit integer overflow.\n- Ensure strict loop termination with \`while (low <= high)\`.\n- Update \`low = mid + 1\` or \`high = mid - 1\` to shrink the search space by half each iteration.\n\n\`\`\`cpp\n#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0;\n    int high = static_cast<int>(arr.size()) - 1;\n    \n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        \n        if (arr[mid] == target) {\n            return mid; // Found at index mid\n        } else if (arr[mid] < target) {\n            low = mid + 1; // Discard left half\n        } else {\n            high = mid - 1; // Discard right half\n        }\n    }\n    return -1; // Not found\n}\n\`\`\`\n\nOpen the DSA Lab to compile, step through test cases, and inspect variable registers live.`,
      summary: 'Iterative implementation in modern C++ with overflow-safe midpoint calculation and dry-run tracing.',
      suggestedRoute: '/dsa',
      nextAction: {
        label: 'Open DSA Lab',
        route: '/dsa',
      },
    };
  }

  // 3. Electrical Engineering / KVL
  if (low.includes('kvl') || low.includes('kirchhoff') || low.includes('circuit') || low.includes('voltage law') || low.includes('ohm')) {
    return {
      subject: 'electrical_engineering',
      topic: 'kirchhoffs_voltage_law',
      intent: 'learn_concept',
      difficulty: 'intermediate',
      learningMode: 'engineering_diagram',
      title: "Kirchhoff's Voltage Law (KVL)",
      answer: `Kirchhoff's Voltage Law (KVL) is the electrical formulation of the Law of Conservation of Energy.\n\n**Formal Statement:**\nThe algebraic sum of all voltages around any closed loop in a circuit must equal zero:\n$$\\sum_{k=1}^n V_k = 0$$\n\n**Intuitive Mental Model:**\nThink of voltage as elevation in a hiking trail. If you hike along a loop and return to your starting coordinate, your net change in elevation must be zero. When a battery lifts potential (+V), the resistive components consume that potential through voltage drops (-I·R) such that the net change is balanced.\n\nLet's open the interactive circuit visualizer where you can toggle resistances and watch potential drops recompute in real time.`,
      summary: 'Conservation of energy in closed loops: the algebraic sum of electrical potentials around any closed network is zero (Σ V = 0).',
      suggestedRoute: '/learn/kirchhoffs-voltage-law',
      nextAction: {
        label: 'Interactive Circuit Visualizer',
        route: '/learn/kirchhoffs-voltage-law',
      },
    };
  }

  // 4. Mathematics / Calculus / Algebra
  if (mode === 'solve' || low.includes('integral') || low.includes('integrate') || low.includes('calculus') || low.includes('derivative') || low.includes('dx') || low.includes('x²') || low.includes('2x + 5') || low.includes('equation') || low.includes('solve')) {
    const isIntegral = low.includes('integral') || low.includes('integrate') || low.includes('dx') || low.includes('∫');
    return {
      subject: 'mathematics',
      topic: isIntegral ? 'integration_by_parts' : 'algebraic_equations',
      intent: 'solve_problem',
      difficulty: 'intermediate',
      learningMode: 'mathematical_derivation',
      title: isIntegral ? 'Indefinite Integration: Step-by-Step Derivation' : 'Algebraic Equation Solution & Proof',
      answer: isIntegral
        ? `To solve the integral step-by-step:\n\n1. **Identify the Integrand:** Using the power rule of integration $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ for any $n \\neq -1$.\n2. **Apply Exponent Increment:** For $\\int x^2 dx$, increment the exponent from 2 to 3 and divide by the new exponent.\n3. **Result:** $\\frac{x^3}{3} + C$\n4. **Verification via Differentiation:** Taking $\\frac{d}{dx}\\left(\\frac{x^3}{3} + C\\right) = \\frac{3x^2}{3} = x^2$, confirming exact identity.\n\nLet's walk through the full step-by-step derivation interface.`
        : `Let's solve the equation step-by-step:\n\n1. **Given:** $x^2 + 5x + 6 = 0$\n2. **Factoring Strategy:** Find two numbers that multiply to $6$ and add to $5$. The pair is $2$ and $3$.\n3. **Rewrite as Product:** $(x + 2)(x + 3) = 0$\n4. **Zero Product Property:** Either $x + 2 = 0 \\implies x = -2$, or $x + 3 = 0 \\implies x = -3$.\n5. **Verification:** Substitute $x = -2$: $(-2)^2 + 5(-2) + 6 = 4 - 10 + 6 = 0$ (verified).\n\nLet's view the mathematical derivation with interactive parameter adjustments.`,
      summary: 'Break down mathematical problems into rigorous, verifiable steps with algebraic verification and practice.',
      suggestedRoute: '/learn/integration-by-parts',
      nextAction: {
        label: 'Step-by-Step Derivation',
        route: '/learn/integration-by-parts',
      },
    };
  }

  // 5. Practice & Quiz
  if (mode === 'quiz' || mode === 'practice' || low.includes('quiz') || low.includes('test me') || low.includes('5 questions') || low.includes('questions on') || low.includes('recursion questions')) {
    const isOS = low.includes('operating system') || low.includes('os');
    const topicName = isOS ? 'Operating Systems' : low.includes('recursion') ? 'Recursion' : 'Engineering Fundamentals';
    return {
      subject: isOS ? 'operating_systems' : 'dsa',
      topic: isOS ? 'operating_systems' : low.includes('recursion') ? 'recursion' : 'data_structures',
      intent: low.includes('quiz') || low.includes('test me') ? 'quiz' : 'practice',
      difficulty: 'intermediate',
      learningMode: 'quiz',
      title: `Adaptive Mastery Quiz: ${topicName}`,
      answer: `Ready to test your mastery in **${topicName}**!\n\nStudyMate has prepared adaptive diagnostic questions with 3-tier confidence tracking (Not sure / Somewhat sure / Very confident). Answering with calibrated confidence will update your mastery radar, diagnose boundary condition blindspots, and formulate your personalized 10-minute revision mission.`,
      summary: `Calibrated diagnostic questions to verify retention, uncover misconceptions, and boost mastery in ${topicName}.`,
      suggestedRoute: '/practice',
      nextAction: {
        label: `Start ${topicName} Practice`,
        route: '/practice',
      },
    };
  }

  // 6. OOP / Polymorphism / Concept
  if (low.includes('polymorphism') || low.includes('oop') || low.includes('inheritance') || low.includes('class')) {
    return {
      subject: 'computer_science',
      topic: 'object_oriented_programming',
      intent: 'learn_concept',
      difficulty: 'intermediate',
      learningMode: 'concept_explanation',
      title: 'Polymorphism & Dynamic Dispatch',
      answer: `**Polymorphism** (Greek: "many forms") is the ability of different types to respond to the same interface in type-specific ways.\n\n1. **Compile-time Polymorphism (Static Binding):** Resolved during compilation via Function Overloading and Templates. Zero runtime overhead.\n2. **Runtime Polymorphism (Dynamic Binding):** Resolved at runtime via inheritance and virtual functions (\`vptr\` and \`vtable\`). When an overridden method is called through a base class pointer or reference, the program looks up the concrete implementation dynamically.\n\nThis decouples caller code from concrete implementations, fulfilling the Open-Closed Principle (OCP).`,
      summary: 'Dynamic dispatch and virtual tables: enabling a single interface to control varied concrete implementations.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Explore Concept',
        route: '/learn/binary-search',
      },
    };
  }

  // 7. Visual Learning / Binary Search / Data Structures
  if (mode === 'visualize' || low.includes('binary search') || low.includes('search') || low.includes('pointer') || low.includes('recursion') || low.includes('stack') || low.includes('queue') || low.includes('tree') || low.includes('graph')) {
    return {
      subject: 'dsa',
      topic: 'binary_search',
      intent: 'learn_concept',
      difficulty: 'intermediate',
      learningMode: 'visual',
      title: 'Binary Search Algorithm',
      answer: `Binary Search is an optimal divide-and-conquer search algorithm operating over sorted sequences.\n\n**The Core Mechanism:**\nInstead of scanning linearly from start to end (which costs $O(n)$ time), Binary Search samples the midpoint of the search space. Because the sequence is sorted:\n- If \`arr[mid] == target\`, the search terminates immediately.\n- If \`target < arr[mid]\`, the entire right half of the sequence is mathematically guaranteed not to contain the target, so we eliminate it by shifting \`high = mid - 1\`.\n- If \`target > arr[mid]\`, we eliminate the left half by shifting \`low = mid + 1\`.\n\nEach comparison halves the remaining search interval, yielding $O(\\log n)$ logarithmic runtime.\n\nLet's open the interactive step visualizer with live pointer registers (LOW / MID / HIGH).`,
      summary: 'Divide and conquer search algorithm with O(log n) logarithmic efficiency over sorted arrays.',
      suggestedRoute: '/learn/binary-search',
      nextAction: {
        label: 'Start Learning & Visualizing',
        route: '/learn/binary-search',
      },
    };
  }

  // 8. General Engineering / Fallback
  return {
    subject: 'computer_science',
    topic: 'engineering_foundations',
    intent: 'learn_concept',
    difficulty: 'beginner',
    learningMode: 'concept_explanation',
    title: 'Core Concept & Engineering Intuition',
    answer: `Here is a clear breakdown for **${question}**:\n\nEngineering principles are best understood by connecting concrete real-world intuition to rigorous mathematical models before diving into code or implementation.\n\n1. **Core Problem:** What engineering constraint or bottleneck does this concept solve?\n2. **Underlying Mechanism:** How do the components or variables interact to guarantee correctness?\n3. **Trade-offs:** What are the time, space, energy, or architectural costs?\n\nStudyMate has prepared an interactive learning experience to explore this topic interactively.`,
    summary: 'A structured breakdown of core engineering foundations, mechanisms, and trade-offs.',
    suggestedRoute: '/learn/binary-search',
    nextAction: {
      label: 'Start Learning',
      route: '/learn/binary-search',
    },
  };
}

export const aiController = new AiController();

