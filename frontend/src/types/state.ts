import { Lesson, Quiz, Plan } from './schemas.js';

export type Band = 'strong' | 'developing' | 'weak';

export type TopicMastery = {
  topic: string;
  subject: string;
  mastery: number; // 0 - 100
  conceptScore: number;
  applicationScore: number;
  edgeCaseScore: number;
  questionsAttempted: number;
  questionsCorrect: number;
  lastPracticed: string;
};

export type RevisionStep = {
  id: string;
  title: string;
  detail: string;
  minutes: number;
  done: boolean;
};

export type RevisionMission = {
  id: string;
  topic: string;
  title: string;
  focus: string;
  steps: RevisionStep[];
  beforeMastery: number;
  afterMastery?: number;
  completed: boolean;
  createdAt: string;
};

export type Weakness = {
  id: string;
  topic: string;
  area: string;
  severity: 'weak' | 'needs_practice' | 'developing';
  score: number;
  missedQuestionsCount: number;
  lastEncountered: string;
};

export type SavedResource = {
  id: string;
  title: string;
  query: string;
  url: string;
  kind: 'video' | 'read' | 'practice';
  why: string;
  topic: string;
  saved: boolean;
  completed: boolean;
};

export type StudyHistoryItem = {
  id: string;
  topic: string;
  type: 'quiz' | 'lesson' | 'dsa' | 'revision';
  score?: number;
  delta?: number;
  timestamp: string;
  summary: string;
};

export type LearningSession = {
  topic: string;
  subject: string;
  lesson?: Lesson;
  quiz?: Quiz;
  answers: { choice: number | null; hinted: boolean; confidence: 'guess' | 'fairly' | 'certain' }[];
  plan?: Plan;
  customTarget?: number;
  customArray?: number[];
};
