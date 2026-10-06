import { Lesson, Quiz, Plan } from './schemas.js';

export const BINARY_SEARCH_LESSON: Lesson = {
  detected: {
    subject: 'computer_science',
    topic: 'Binary search',
    difficulty: 'intermediate',
    method: 'visual_code',
  },
  title: 'Binary Search Algorithm',
  bigIdea:
    'Binary search finds a value in a sorted list in logarithmic time by repeatedly discarding the half of the search range that cannot contain the target.',
  given: [],
  visual: {
    type: 'array_algorithm',
    algorithm: 'binary_search',
    array: [2, 5, 8, 12, 16, 23, 31],
    target: 23,
  },
  steps: [
    {
      heading: 'Precondition: Array must be sorted',
      body: 'Binary search only works on elements that are in strict ascending or descending order. Without sorting, eliminating halves is impossible.',
      formula: null,
    },
    {
      heading: 'Find the middle element',
      body: 'Compute the midpoint index safely using mid = low + (high - low) / 2 to avoid integer overflow.',
      formula: 'mid = low + \\lfloor(high - low) / 2\\rfloor',
    },
    {
      heading: 'Compare and discard half',
      body: 'If arr[mid] is smaller than the target, the target must lie to the right: move low to mid + 1. If larger, move high to mid - 1.',
      formula: 'arr[mid] < target \\implies low = mid + 1',
    },
    {
      heading: 'Termination condition',
      body: 'Continue while low <= high. If low crosses high without a match, the target is absent from the array, returning -1.',
      formula: 'low > high \\implies -1',
    },
  ],
  finalAnswer: null,
  commonMistakes: [
    'Using (low + high) / 2 which can overflow integer bounds in large arrays.',
    'Writing the loop condition as low < high instead of low <= high, missing single-element targets.',
    'Updating pointers to mid instead of mid + 1 or mid - 1, causing infinite loops.',
  ],
  quickCheck: {
    question: 'Why do we write mid = low + (high - low) / 2 instead of mid = (low + high) / 2?',
    options: [
      'It executes faster in machine code',
      'It prevents integer overflow when low + high exceeds maximum integer capacity',
      'It rounds to the nearest even number',
      'It works on floating point arrays',
    ],
    correctIndex: 1,
    explanation:
      'When low and high are both large positive integers, low + high can exceed 2^31 - 1, overflowing into a negative number.',
  },
};

export const BINARY_SEARCH_QUIZ: Quiz = {
  topic: 'Binary search',
  subject: 'computer_science',
  questions: [
    {
      id: 'q1',
      concept: 'Midpoint calculation',
      skill: 'recall',
      question: 'Which formula safely computes the middle index of a range [low, high] in C++?',
      options: [
        'int mid = (low + high) / 2;',
        'int mid = low + (high - low) / 2;',
        'int mid = (high - low) / 2;',
        'int mid = low + (high / 2);',
      ],
      correctIndex: 1,
      hint: 'Think about keeping the result within signed 32-bit integer limits.',
      explanation:
        'low + (high - low) / 2 prevents integer overflow that occurs when low + high exceeds INT_MAX.',
    },
    {
      id: 'q2',
      concept: 'Midpoint calculation',
      skill: 'application',
      question:
        'If low = 6 and high = 6 in an array of size 7, what is mid, and will the loop execute under while (low <= high)?',
      options: [
        'mid = 6, and the loop executes for this single element',
        'mid = 0, and the loop terminates',
        'mid = 6, but the loop exits immediately',
        'mid = 3, and low is adjusted',
      ],
      correctIndex: 0,
      hint: 'Substitute 6 into mid = 6 + (6 - 6) / 2 and check 6 <= 6.',
      explanation:
        '6 + (6 - 6)/2 = 6, and 6 <= 6 is true, ensuring a single remaining candidate element is inspected.',
    },
    {
      id: 'q3',
      concept: 'Pointer adjustments',
      skill: 'understanding',
      question: 'Why must we update low = mid + 1 instead of low = mid when arr[mid] < target?',
      options: [
        'Because mid was already checked and is strictly smaller than the target',
        'To ensure the array stays sorted',
        'To jump two steps at a time for speed',
        'Because mid is always odd',
      ],
      correctIndex: 0,
      hint: 'Did we already evaluate the value at index mid?',
      explanation:
        'Since arr[mid] is confirmed to not match the target, we can safely eliminate mid itself from future consideration.',
    },
    {
      id: 'q4',
      concept: 'Pointer adjustments',
      skill: 'application',
      question:
        'You search for target 20 in [2, 8, 14, 20, 26]. low=0, high=4, mid=2 (arr[mid]=14). What are the next pointer values?',
      options: [
        'low = 0, high = 1',
        'low = 3, high = 4',
        'low = 2, high = 4',
        'low = 3, high = 3',
      ],
      correctIndex: 1,
      hint: '14 is less than 20, so eliminate the left half up through mid.',
      explanation:
        'arr[2] = 14 is less than target 20, so low becomes mid + 1 = 3 while high remains 4.',
    },
    {
      id: 'q5',
      concept: 'Loop termination',
      skill: 'recall',
      question: 'What is the exact condition that indicates the target does not exist in the array?',
      options: [
        'low == high',
        'low > high',
        'arr[mid] == 0',
        'mid == arr.size()',
      ],
      correctIndex: 1,
      hint: 'When the search interval becomes invalid or empty.',
      explanation:
        'When low crosses high (low > high), the active search interval contains 0 elements, proving the target is absent.',
    },
    {
      id: 'q6',
      concept: 'Loop termination',
      skill: 'application',
      question:
        'If a student mistakenly writes `while (low < high)`, which target position might cause their function to fail and return -1 erroneously?',
      options: [
        'A target located at index 0 or index n-1 when narrowed to a single element',
        'Only targets in odd length arrays',
        'A target located at the exact initial midpoint',
        'No targets; the two loops behave identically',
      ],
      correctIndex: 0,
      hint: 'Consider what happens when only one element remains (low == high).',
      explanation:
        'With low < high, the loop terminates prematurely when low == high without checking the final remaining element.',
    },
  ],
};

export const BINARY_SEARCH_PLAN: Plan = {
  focus: 'Pointer adjustments when shrinking the search space.',
  steps: [
    {
      title: 'Review midpoint elimination boundaries',
      detail:
        'Trace why excluding mid via mid + 1 and mid - 1 guarantees progress towards termination without off-by-one errors.',
      minutes: 3,
    },
    {
      title: 'Simulate search on 2-element arrays',
      detail:
        'Work through targets smaller, larger, and present in a 2-element list to observe low and high transitions.',
      minutes: 4,
    },
    {
      title: 'Verify termination inequalities',
      detail:
        'Write out why low <= high handles single-element checks and low > high signals target absence.',
      minutes: 3,
    },
  ],
  resources: [
    {
      label: 'Binary search pointer transitions tutorial',
      query: 'binary search low mid high pointer updates visualization',
      kind: 'video',
      why: 'Watch visual animations showing how search intervals contract safely.',
    },
    {
      label: 'Preventing off-by-one in binary search',
      query: 'binary search boundary conditions off by one guide',
      kind: 'read',
      why: 'Clarifies boundary invariants (low <= high vs low < high).',
    },
  ],
};

export const KIRCHHOFF_LESSON: Lesson = {
  detected: {
    subject: 'electrical',
    topic: "Kirchhoff's voltage law",
    difficulty: 'intermediate',
    method: 'visual_circuit',
  },
  title: "Kirchhoff's Voltage Law (KVL) in Series Circuits",
  bigIdea:
    "Kirchhoff's Voltage Law states that the algebraic sum of all electrical potential differences around any closed circuit loop is strictly equal to zero.",
  given: [],
  visual: {
    type: 'circuit_series',
    voltage: 12,
    resistors: [
      { label: 'R1', ohms: 2 },
      { label: 'R2', ohms: 4 },
      { label: 'R3', ohms: 6 },
    ],
  },
  steps: [
    {
      heading: 'Closed Loop Conservation of Energy',
      body: 'KVL represents energy conservation: the electrical potential energy provided by the voltage source is entirely converted into heat across the resistors.',
      formula: '\\sum V_{loop} = 0',
    },
    {
      heading: 'Calculate Equivalent Series Resistance',
      body: 'In a single series loop, all components share identical current. Total resistance is the direct sum of individual resistances.',
      formula: 'R_{total} = R_1 + R_2 + R_3',
    },
    {
      heading: "Determine Loop Current via Ohm's Law",
      body: 'Current equals total source voltage divided by total equivalent resistance.',
      formula: 'I = \\frac{V_{source}}{R_{total}}',
    },
    {
      heading: 'Calculate Component Voltage Drops',
      body: "Multiply loop current by each individual component resistance to find each component's voltage drop.",
      formula: 'V_k = I \\cdot R_k',
    },
  ],
  finalAnswer: null,
  commonMistakes: [
    'Confusing series loops (same current) with parallel branches (same voltage).',
    'Mixing up polarity signs when traversing the loop (+ to - is a voltage drop).',
    'Assuming higher resistor values have higher current in series.',
  ],
  quickCheck: {
    question:
      'In a 12 V series circuit with resistors 2 Ω, 4 Ω, and 6 Ω, what is the voltage drop across the 4 Ω resistor?',
    options: ['2 V', '4 V', '6 V', '12 V'],
    correctIndex: 1,
    explanation:
      'Total resistance is 2 + 4 + 6 = 12 Ω. Current is 12 V / 12 Ω = 1 A. Voltage across R2 is 1 A × 4 Ω = 4 V.',
  },
};

export const KIRCHHOFF_QUIZ: Quiz = {
  topic: "Kirchhoff's voltage law",
  subject: 'electrical',
  questions: [
    {
      id: 'q1',
      concept: 'Conservation of energy in loops',
      skill: 'recall',
      question: 'Which fundamental physical law forms the basis of Kirchhoff’s Voltage Law (KVL)?',
      options: [
        'Conservation of charge',
        'Conservation of energy',
        'Conservation of momentum',
        'Faraday’s law of induction',
      ],
      correctIndex: 1,
      hint: 'Potential difference measures energy per unit charge around a closed path.',
      explanation:
        'KVL directly expresses conservation of electrical potential energy around a closed path.',
    },
    {
      id: 'q2',
      concept: 'Conservation of energy in loops',
      skill: 'understanding',
      question:
        'If a 24 V source powers a series circuit with two identical resistors, what is the voltage drop across each resistor?',
      options: ['24 V each', '12 V each', '6 V each', '0 V'],
      correctIndex: 1,
      hint: 'The sum of drops must equal the source voltage.',
      explanation:
        'Because both resistors share equal resistance and current, each drops exactly half of 24 V, which is 12 V.',
    },
    {
      id: 'q3',
      concept: 'Series loop current',
      skill: 'understanding',
      question: 'How does current behave through different resistors connected strictly in series?',
      options: [
        'It splits inversely proportional to resistance',
        'It is identical through every component in the series path',
        'It decreases sequentially as it passes each resistor',
        'It depends on the position relative to ground',
      ],
      correctIndex: 1,
      hint: 'Charge has only one continuous path to flow.',
      explanation:
        'In a single closed loop without branching nodes, current is identical everywhere in the loop.',
    },
    {
      id: 'q4',
      concept: 'Series loop current',
      skill: 'application',
      question:
        'A 10 V source is connected to a 3 Ω and a 7 Ω resistor in series. What is the total current flowing in the circuit?',
      options: ['1.0 A', '0.7 A', '2.0 A', '10 A'],
      correctIndex: 0,
      hint: 'Total resistance is 3 + 7 = 10 Ω. Apply I = V / R.',
      explanation:
        'R_total = 3 + 7 = 10 Ω. I = 10 V / 10 Ω = 1.0 A.',
    },
    {
      id: 'q5',
      concept: 'KVL algebraic summation',
      skill: 'recall',
      question:
        'What is the standard algebraic sum of all potential drops and rises around any closed loop?',
      options: ['Equals the battery current', 'Always equals 0 V', 'Equals the largest resistor voltage', 'Infinite'],
      correctIndex: 1,
      hint: 'Ending at the same node you started yields zero net potential change.',
      explanation:
        'Sum of voltage rises minus sum of voltage drops around a complete loop equals exactly zero.',
    },
    {
      id: 'q6',
      concept: 'KVL algebraic summation',
      skill: 'application',
      question:
        'In a loop with a 15 V source, resistor A drops 5 V and resistor B drops 4 V. What must be the voltage drop across resistor C?',
      options: ['6 V', '9 V', '15 V', '1 V'],
      correctIndex: 0,
      hint: '15 V - 5 V - 4 V - V_C = 0.',
      explanation:
        '15 V - (5 V + 4 V) = 6 V must drop across the remaining resistor to satisfy KVL.',
    },
  ],
};

export const KIRCHHOFF_PLAN: Plan = {
  focus: 'Applying KVL equations with proper loop polarities.',
  steps: [
    {
      title: 'Trace loop directions and sign conventions',
      detail:
        'Practice treating potential increases as positive and resistor drops as negative around clockwise loops.',
      minutes: 3,
    },
    {
      title: 'Solve multi-resistor voltage dividers',
      detail:
        'Derive component voltages using V_k = V_s * (R_k / R_total) to reinforce proportional drops.',
      minutes: 4,
    },
    {
      title: 'Check residual loop balances',
      detail:
        'Confirm that source voltage minus all drops leaves exactly zero residual voltage.',
      minutes: 3,
    },
  ],
  resources: [
    {
      label: "Kirchhoff's Voltage Law step by step solver",
      query: 'kirchhoff voltage law series circuit loop equations',
      kind: 'video',
      why: 'Demonstrates sign conventions on practical circuit loops.',
    },
    {
      label: 'Series circuit voltage drop guide',
      query: 'series circuit voltage divider rule practice',
      kind: 'read',
      why: 'Reinforces Ohm’s law applied across series branches.',
    },
  ],
};

export const INTEGRATE_LESSON: Lesson = {
  detected: {
    subject: 'mathematics',
    topic: 'Integration by parts',
    difficulty: 'intermediate',
    method: 'worked_solution',
  },
  title: 'Solve: ∫ x e^x dx (Integration by Parts)',
  bigIdea:
    'Integration by parts transforms the integral of a product of functions into a simpler integral using the formula ∫ u dv = u v - ∫ v du.',
  given: ['Integrand: x · e^x dx', 'Method: Integration by parts (LIATE rule)'],
  visual: {
    type: 'none',
  },
  steps: [
    {
      heading: 'Choose u and dv using LIATE rule',
      body: 'Algebraic terms take precedence over exponentials for u. Let u = x and dv = e^x dx.',
      formula: 'u = x, \\quad dv = e^x dx',
    },
    {
      heading: 'Compute du and v',
      body: 'Differentiate u to get du, and integrate dv to find v.',
      formula: 'du = dx, \\quad v = \\int e^x dx = e^x',
    },
    {
      heading: 'Apply the integration by parts formula',
      body: 'Substitute u, v, and du into the formula ∫ u dv = u v - ∫ v du.',
      formula: '\\int x e^x dx = x e^x - \\int e^x dx',
    },
    {
      heading: 'Evaluate the remaining integral and add constant C',
      body: 'Integrate e^x dx to get e^x and include the arbitrary constant of integration C.',
      formula: '= x e^x - e^x + C',
    },
  ],
  finalAnswer: 'x e^x - e^x + C',
  commonMistakes: [
    'Choosing u = e^x and dv = x dx, which complicates the integral to ∫ x² e^x dx.',
    'Forgetting the minus sign before the second integral ∫ v du.',
    'Omitting the constant of integration + C.',
  ],
  quickCheck: {
    question: 'According to the LIATE rule, which function should be chosen as u in ∫ x cos(x) dx?',
    options: ['cos(x) (trigonometric)', 'x (algebraic)', 'dx', 'Neither'],
    correctIndex: 1,
    explanation:
      'In LIATE (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential), Algebraic (x) comes before Trigonometric (cos x), so choose u = x.',
  },
};

export const INTEGRATE_QUIZ: Quiz = {
  topic: 'Integration by parts',
  subject: 'mathematics',
  questions: [
    {
      id: 'q1',
      concept: 'LIATE rule prioritization',
      skill: 'recall',
      question: 'What does the acronym LIATE stand for in choosing u for integration by parts?',
      options: [
        'Linear, Integral, Algebraic, Tangent, Exponential',
        'Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential',
        'Logarithmic, Implicit, Asymptotic, Transcendental, Exact',
        'Limits, Integrals, Area, Tangent, Evaluation',
      ],
      correctIndex: 1,
      hint: 'The order prioritizes functions whose derivatives simplify readily.',
      explanation:
        'LIATE stands for Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential.',
    },
    {
      id: 'q2',
      concept: 'LIATE rule prioritization',
      skill: 'application',
      question: 'For ∫ x ln(x) dx, what should be assigned as u and dv?',
      options: [
        'u = x, dv = ln(x) dx',
        'u = ln(x), dv = x dx',
        'u = x ln(x), dv = dx',
        'u = 1/x, dv = x dx',
      ],
      correctIndex: 1,
      hint: 'Logarithmic (L) precedes Algebraic (A) in LIATE.',
      explanation:
        'Logarithmic comes first in LIATE, so choose u = ln(x) and dv = x dx.',
    },
    {
      id: 'q3',
      concept: 'Core formula execution',
      skill: 'recall',
      question: 'What is the correct Integration by Parts formula?',
      options: [
        '∫ u dv = u v + ∫ v du',
        '∫ u dv = u v - ∫ v du',
        '∫ u dv = u du - v dv',
        '∫ u dv = (u v) / 2',
      ],
      correctIndex: 1,
      hint: 'Derived by integrating the product rule d(uv) = u dv + v du.',
      explanation:
        '∫ u dv = u v - ∫ v du is the fundamental integration by parts formula.',
    },
    {
      id: 'q4',
      concept: 'Core formula execution',
      skill: 'understanding',
      question: 'Why does letting u = x in ∫ x e^x dx make the remaining integral easier?',
      options: [
        'Because du = dx, reducing the polynomial factor from degree 1 to degree 0',
        'Because e^x becomes zero',
        'Because dx cancels out completely',
        'Because u becomes a trigonometric function',
      ],
      correctIndex: 0,
      hint: 'Look at the derivative of x.',
      explanation:
        'Differentiating x yields du = dx, which eliminates the variable factor in the second integral ∫ e^x dx.',
    },
    {
      id: 'q5',
      concept: 'Sign and constant bookkeeping',
      skill: 'understanding',
      question: 'What sign precedes the integral ∫ v du in the formula ∫ u dv = u v [?] ∫ v du?',
      options: ['Plus (+)', 'Minus (-)', 'Multiplication (×)', 'Division (÷)'],
      correctIndex: 1,
      hint: 'd(uv) = u dv + v du implies u dv = d(uv) - v du.',
      explanation:
        'The formula uses a minus sign: u v - ∫ v du.',
    },
    {
      id: 'q6',
      concept: 'Sign and constant bookkeeping',
      skill: 'application',
      question:
        'What is the final result of ∫ x e^(2x) dx using integration by parts?',
      options: [
        '(x/2) e^(2x) - (1/4) e^(2x) + C',
        'x e^(2x) - e^(2x) + C',
        '(x/2) e^(2x) + (1/2) e^(2x) + C',
        '2x e^(2x) - 4 e^(2x) + C',
      ],
      correctIndex: 0,
      hint: 'u = x, dv = e^(2x) dx implies v = (1/2) e^(2x).',
      explanation:
        'u = x, v = (1/2)e^(2x) gives (x/2)e^(2x) - ∫ (1/2)e^(2x) dx = (x/2)e^(2x) - (1/4)e^(2x) + C.',
    },
  ],
};

export const INTEGRATE_PLAN: Plan = {
  focus: 'Applying LIATE substitution rules correctly.',
  steps: [
    {
      title: 'Practice LIATE identification drills',
      detail:
        'Identify u and dv for 5 standard product integrands without evaluating to build instinct.',
      minutes: 3,
    },
    {
      title: 'Trace multi-step algebraic integrals',
      detail:
        'Work through repeated integration by parts on polynomials multiplied by exponentials.',
      minutes: 4,
    },
    {
      title: 'Check signs and constants',
      detail:
        'Audit common minus-sign distribution errors across nested brackets.',
      minutes: 3,
    },
  ],
  resources: [
    {
      label: 'LIATE rule integration by parts guide',
      query: 'integration by parts LIATE rule examples calculus',
      kind: 'video',
      why: 'Breaks down function selection to avoid infinite integral loops.',
    },
    {
      label: 'Calculus product integration cheat sheet',
      query: 'integration by parts step by step practice problems',
      kind: 'read',
      why: 'Offers worked examples with tricky negative signs.',
    },
  ],
};
