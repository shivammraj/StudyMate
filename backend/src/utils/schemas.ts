import { z } from 'zod';

export const Subject = z.enum([
  'computer_science',
  'electrical',
  'mathematics',
  'mechanics',
  'physics',
  'chemistry',
  'other',
]);
export type Subject = z.infer<typeof Subject>;

export const Skill = z.enum(['recall', 'understanding', 'application']);
export type Skill = z.infer<typeof Skill>;

export const Algorithm = z.enum(['binary_search', 'linear_search', 'bubble_sort']);
export type Algorithm = z.infer<typeof Algorithm>;

export const VisualSpec = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('array_algorithm'),
    algorithm: Algorithm,
    array: z.array(z.number().int().min(0).max(99)).min(4).max(10),
    target: z.number().int().min(0).max(99).nullable(),
  }),
  z.object({
    type: z.literal('circuit_series'),
    voltage: z.number().min(1).max(48),
    resistors: z
      .array(
        z.object({
          label: z.string(),
          ohms: z.number().min(1).max(1000),
        })
      )
      .min(2)
      .max(4),
  }),
  z.object({
    type: z.literal('none'),
  }),
]);
export type VisualSpec = z.infer<typeof VisualSpec>;

export const TeachingMethod = z.enum([
  'visual_code',
  'visual_circuit',
  'worked_solution',
  'concept',
]);
export type TeachingMethod = z.infer<typeof TeachingMethod>;

export const Lesson = z.object({
  detected: z.object({
    subject: Subject,
    topic: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    method: TeachingMethod,
  }),
  title: z.string(),
  bigIdea: z.string(),
  given: z.array(z.string()).max(5),
  visual: VisualSpec,
  steps: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
        formula: z.string().nullable(),
      })
    )
    .min(2)
    .max(6),
  finalAnswer: z.string().nullable(),
  commonMistakes: z.array(z.string()).min(1).max(3),
  quickCheck: z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string(),
  }),
});
export type Lesson = z.infer<typeof Lesson>;

export const QuizQuestion = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  concept: z.string(),
  skill: Skill,
  hint: z.string(),
  explanation: z.string(),
});
export type QuizQuestion = z.infer<typeof QuizQuestion>;

export const Quiz = z.object({
  topic: z.string(),
  subject: Subject,
  questions: z.array(QuizQuestion).min(2).max(6),
});
export type Quiz = z.infer<typeof Quiz>;

export const Plan = z.object({
  focus: z.string(),
  steps: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string(),
        minutes: z.number().int().min(1).max(5),
      })
    )
    .min(3)
    .max(5),
  resources: z
    .array(
      z.object({
        label: z.string(),
        query: z.string().max(80),
        kind: z.enum(['video', 'read']),
        why: z.string(),
      })
    )
    .max(3),
});
export type Plan = z.infer<typeof Plan>;

export const LessonReq = z.object({
  input: z.string().min(2).max(12000),
  intent: z.enum(['explain', 'solve']).default('explain'),
});
export type LessonReq = z.infer<typeof LessonReq>;

export const QuizReq = z.object({
  input: z.string().min(2).max(12000),
  notes: z.string().max(3000).optional(),
  focusConcepts: z.array(z.string()).min(1).max(2).optional(),
});
export type QuizReq = z.infer<typeof QuizReq>;

export const PlanReq = z.object({
  topic: z.string(),
  subject: Subject,
  weakConcepts: z.array(z.string()).min(1).max(3),
  missed: z
    .array(
      z.object({
        question: z.string(),
        concept: z.string(),
        skill: Skill,
      })
    )
    .max(6),
  confidentMistakes: z.array(z.string()).max(3),
});
export type PlanReq = z.infer<typeof PlanReq>;

export type ApiOk<T> = {
  ok: true;
  data: T;
  meta: {
    source: 'ai' | 'fallback' | 'sample';
    provider: 'gemini' | 'ollama' | 'mock';
    ms: number;
  };
};

export type ApiErr = {
  ok: false;
  error: {
    code: 'BAD_REQUEST' | 'AI_TIMEOUT' | 'AI_INVALID' | 'INTERNAL';
    message: string;
    retryable: boolean;
  };
};

export type ApiResult<T> = ApiOk<T> | ApiErr;

export const AskSubject = z.enum([
  'computer_science',
  'dsa',
  'mathematics',
  'electrical_engineering',
  'engineering_mechanics',
  'chemistry',
  'computer_networks',
  'operating_systems',
  'general_engineering',
  'other',
]);
export type AskSubject = z.infer<typeof AskSubject>;

export const AskIntent = z.enum([
  'learn_concept',
  'solve_problem',
  'debug_code',
  'write_code',
  'practice',
  'quiz',
  'compare',
  'summarize',
  'formula',
  'exam_preparation',
  'project_help',
  'general_question',
]);
export type AskIntent = z.infer<typeof AskIntent>;

export const AskLearningMode = z.enum([
  'visual',
  'step_by_step',
  'code_lab',
  'practice',
  'quiz',
  'concept_explanation',
  'debugging',
  'engineering_diagram',
  'mathematical_derivation',
  'resource_recommendation',
]);
export type AskLearningMode = z.infer<typeof AskLearningMode>;

export const AskReq = z.object({
  question: z.string().min(2).max(12000),
  mode: z.enum(['auto', 'explain', 'solve', 'visualize', 'practice', 'code', 'quiz']).default('auto'),
  student: z
    .object({
      name: z.string().default('Shivam Mavi'),
      branch: z.string().default('Computer Science & Engineering'),
      year: z.string().default('1st Year'),
    })
    .optional(),
});
export type AskReq = z.infer<typeof AskReq>;

export const AskResponse = z.object({
  subject: AskSubject,
  topic: z.string(),
  intent: AskIntent,
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  learningMode: AskLearningMode,
  title: z.string(),
  answer: z.string(),
  summary: z.string(),
  suggestedRoute: z.string(),
  visualization: z.record(z.any()).optional(),
  practice: z.record(z.any()).optional(),
  nextAction: z.object({
    label: z.string(),
    route: z.string(),
  }),
});
export type AskResponse = z.infer<typeof AskResponse>;
