import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TopicMastery,
  RevisionMission,
  Weakness,
  SavedResource,
  StudyHistoryItem,
  LearningSession,
} from '../types/state.js';
import { Lesson, Quiz, Plan } from '../types/schemas.js';

export interface StudentProfile {
  name: string;
  year: string;
  branch: string;
  college: string;
  rollNo: string;
  goal: string;
  preferredLanguage: string;
  bio: string;
  greeting: string;
  streak: number;
  xp: number;
  questionsSolved: number;
  accuracy: number;
  hoursLearned: number;
}

export interface StudyMateContextType {
  student: StudentProfile;
  updateStudent: (patch: Partial<StudentProfile>) => void;
  masteryList: TopicMastery[];
  getMastery: (topic: string) => TopicMastery;
  updateMastery: (
    topic: string,
    delta: number,
    breakdown?: { concept?: number; application?: number; edgeCase?: number }
  ) => void;
  weaknesses: Weakness[];
  addWeakness: (weakness: Omit<Weakness, 'id' | 'lastEncountered'>) => void;
  resolveWeakness: (id: string) => void;
  activeMission: RevisionMission | null;
  completeMissionStep: (stepId: string) => void;
  createMission: (topic: string, focus: string, beforeMastery: number) => RevisionMission;
  resources: SavedResource[];
  toggleSaveResource: (id: string) => void;
  toggleCompleteResource: (id: string) => void;
  history: StudyHistoryItem[];
  addHistoryItem: (item: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => void;
  session: LearningSession;
  updateSession: (patch: Partial<LearningSession>) => void;
  resetSession: () => void;
  resetToDemo: () => void;
}

const STORAGE_KEY = 'studymate_shivam_state_v1';

const INITIAL_MASTERY: TopicMastery[] = [
  {
    topic: 'Binary Search',
    subject: 'Computer Science',
    mastery: 68,
    conceptScore: 89,
    applicationScore: 61,
    edgeCaseScore: 42,
    questionsAttempted: 14,
    questionsCorrect: 10,
    lastPracticed: '2 hours ago',
  },
  {
    topic: 'Arrays',
    subject: 'Computer Science',
    mastery: 82,
    conceptScore: 92,
    applicationScore: 84,
    edgeCaseScore: 78,
    questionsAttempted: 28,
    questionsCorrect: 24,
    lastPracticed: '1 day ago',
  },
  {
    topic: 'Sorting',
    subject: 'Computer Science',
    mastery: 61,
    conceptScore: 75,
    applicationScore: 65,
    edgeCaseScore: 50,
    questionsAttempted: 18,
    questionsCorrect: 11,
    lastPracticed: '3 days ago',
  },
  {
    topic: 'Recursion',
    subject: 'Computer Science',
    mastery: 42,
    conceptScore: 58,
    applicationScore: 40,
    edgeCaseScore: 32,
    questionsAttempted: 12,
    questionsCorrect: 5,
    lastPracticed: '4 days ago',
  },
  {
    topic: 'Linked Lists',
    subject: 'Computer Science',
    mastery: 56,
    conceptScore: 70,
    applicationScore: 55,
    edgeCaseScore: 45,
    questionsAttempted: 16,
    questionsCorrect: 9,
    lastPracticed: '5 days ago',
  },
  {
    topic: 'Trees',
    subject: 'Computer Science',
    mastery: 34,
    conceptScore: 48,
    applicationScore: 30,
    edgeCaseScore: 25,
    questionsAttempted: 10,
    questionsCorrect: 3,
    lastPracticed: '1 week ago',
  },
  {
    topic: 'Graphs',
    subject: 'Computer Science',
    mastery: 20,
    conceptScore: 35,
    applicationScore: 18,
    edgeCaseScore: 10,
    questionsAttempted: 8,
    questionsCorrect: 2,
    lastPracticed: '2 weeks ago',
  },
];

const INITIAL_WEAKNESSES: Weakness[] = [
  {
    id: 'w-1',
    topic: 'Binary Search',
    area: 'Boundary Conditions & Edge Cases (low <= high vs low < high)',
    severity: 'weak',
    score: 42,
    missedQuestionsCount: 4,
    lastEncountered: 'Just now',
  },
  {
    id: 'w-2',
    topic: 'Recursion',
    area: 'Base Case Verification on empty/single nodes',
    severity: 'needs_practice',
    score: 42,
    missedQuestionsCount: 3,
    lastEncountered: '2 days ago',
  },
  {
    id: 'w-3',
    topic: 'Trees',
    area: 'Post-order Traversal recursion stack',
    severity: 'weak',
    score: 34,
    missedQuestionsCount: 5,
    lastEncountered: '4 days ago',
  },
];

const INITIAL_MISSION: RevisionMission = {
  id: 'mission-bs-1',
  topic: 'Binary Search',
  title: 'Fix Binary Search Boundaries',
  focus: 'Overcome off-by-one errors when mid ± 1 recalculates',
  beforeMastery: 68,
  afterMastery: 74,
  completed: false,
  createdAt: 'Today',
  steps: [
    {
      id: 'step-1',
      title: '2 min: Review concept',
      detail: 'Re-read the invariant: target is guaranteed in subarray [low..high].',
      minutes: 2,
      done: false,
    },
    {
      id: 'step-2',
      title: '3 min: Interactive visualization',
      detail: 'Run trace for target 23 and target 8 to watch search space halve.',
      minutes: 3,
      done: false,
    },
    {
      id: 'step-3',
      title: '5 min: Targeted problem',
      detail: 'Solve the edge-case practice check with a single element array.',
      minutes: 5,
      done: false,
    },
  ],
};

const INITIAL_RESOURCES: SavedResource[] = [
  {
    id: 'res-1',
    topic: 'Binary Search',
    title: 'Visualizing Binary Search & Boundary Conditions',
    query: 'binary search boundary conditions tutorial visualization',
    url: 'https://www.youtube.com/results?search_query=binary+search+boundary+conditions+visualization',
    kind: 'video',
    why: 'You repeatedly struggled with boundary conditions (low <= high).',
    saved: true,
    completed: false,
  },
  {
    id: 'res-2',
    topic: 'Binary Search',
    title: 'LeetCode 704 & 35: Search Insert Position Patterns',
    query: 'binary search invariant off by one error guide',
    url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm',
    kind: 'read',
    why: 'Explains the loop invariant proof mathematically.',
    saved: false,
    completed: false,
  },
  {
    id: 'res-3',
    topic: 'Recursion',
    title: 'Recursion Call Stack & Visual Tree Execution',
    query: 'recursion call stack visualizer dry run',
    url: 'https://www.youtube.com/results?search_query=recursion+call+stack+visualizer',
    kind: 'video',
    why: 'Recommended after 3 base-case misses on tree traversals.',
    saved: false,
    completed: false,
  },
];

const INITIAL_HISTORY: StudyHistoryItem[] = [
  {
    id: 'hist-1',
    topic: 'Binary Search',
    type: 'quiz',
    score: 80,
    delta: +6,
    timestamp: '15 mins ago',
    summary: 'Mastered midpoint calculation floor(low + (high - low)/2)',
  },
  {
    id: 'hist-2',
    topic: 'Arrays',
    type: 'dsa',
    score: 100,
    delta: +4,
    timestamp: 'Yesterday',
    summary: 'Completed Two-Pointer simulation in C++',
  },
];

const StudyMateContext = createContext<StudyMateContextType | null>(null);

export const StudyMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masteryList, setMasteryList] = useState<TopicMastery[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_mastery');
      return saved ? JSON.parse(saved) : INITIAL_MASTERY;
    } catch {
      return INITIAL_MASTERY;
    }
  });

  const [weaknesses, setWeaknesses] = useState<Weakness[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_weaknesses');
      return saved ? JSON.parse(saved) : INITIAL_WEAKNESSES;
    } catch {
      return INITIAL_WEAKNESSES;
    }
  });

  const [activeMission, setActiveMission] = useState<RevisionMission | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_mission');
      return saved ? JSON.parse(saved) : INITIAL_MISSION;
    } catch {
      return INITIAL_MISSION;
    }
  });

  const [resources, setResources] = useState<SavedResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [history, setHistory] = useState<StudyHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  const INITIAL_STUDENT_DATA = {
    name: 'Shivam Mavi',
    year: '1st Year',
    branch: 'Computer Science & Engineering',
    college: 'Engineering Institute of Technology',
    rollNo: 'CSE-2026-042',
    goal: 'DSA Mastery & Top Placement',
    preferredLanguage: 'C++',
    bio: 'Passionate about algorithmic efficiency, operating systems, and building high-performance systems.',
    greeting: 'Good morning, Shivam. Ready to understand something new?',
    streak: 12,
    xp: 2450,
    questionsSolved: 84,
    hoursLearned: 14.5,
  };

  const [studentData, setStudentData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_student');
      return saved ? { ...INITIAL_STUDENT_DATA, ...JSON.parse(saved) } : INITIAL_STUDENT_DATA;
    } catch {
      return INITIAL_STUDENT_DATA;
    }
  });

  const updateStudent = (patch: Partial<StudentProfile>) => {
    setStudentData((prev: typeof INITIAL_STUDENT_DATA) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY + '_student', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [session, setSession] = useState<LearningSession>({
    topic: 'Binary Search',
    subject: 'Computer Science',
    customTarget: 23,
    customArray: [2, 5, 8, 12, 16, 23, 31],
    answers: [],
  });

  // Persist to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_mastery', JSON.stringify(masteryList));
      localStorage.setItem(STORAGE_KEY + '_weaknesses', JSON.stringify(weaknesses));
      localStorage.setItem(STORAGE_KEY + '_mission', JSON.stringify(activeMission));
      localStorage.setItem(STORAGE_KEY + '_resources', JSON.stringify(resources));
      localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify(history));
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [masteryList, weaknesses, activeMission, resources, history]);

  const getMastery = (topicName: string): TopicMastery => {
    const found = masteryList.find(
      (m) => m.topic.toLowerCase() === topicName.toLowerCase()
    );
    if (found) return found;
    return {
      topic: topicName,
      subject: 'Computer Science',
      mastery: 50,
      conceptScore: 50,
      applicationScore: 50,
      edgeCaseScore: 50,
      questionsAttempted: 0,
      questionsCorrect: 0,
      lastPracticed: 'Just started',
    };
  };

  const updateMastery = (
    topicName: string,
    delta: number,
    breakdown?: { concept?: number; application?: number; edgeCase?: number }
  ) => {
    setMasteryList((prev) => {
      const exists = prev.find((m) => m.topic.toLowerCase() === topicName.toLowerCase());
      if (exists) {
        return prev.map((m) => {
          if (m.topic.toLowerCase() === topicName.toLowerCase()) {
            const nextMastery = Math.min(100, Math.max(0, m.mastery + delta));
            return {
              ...m,
              mastery: nextMastery,
              conceptScore: breakdown?.concept ?? m.conceptScore,
              applicationScore: breakdown?.application ?? m.applicationScore,
              edgeCaseScore: breakdown?.edgeCase ?? m.edgeCaseScore,
              questionsAttempted: m.questionsAttempted + 1,
              questionsCorrect: delta > 0 ? m.questionsCorrect + 1 : m.questionsCorrect,
              lastPracticed: 'Just now',
            };
          }
          return m;
        });
      } else {
        const nextMastery = Math.min(100, Math.max(0, 50 + delta));
        return [
          ...prev,
          {
            topic: topicName,
            subject: 'Computer Science',
            mastery: nextMastery,
            conceptScore: breakdown?.concept ?? 60,
            applicationScore: breakdown?.application ?? 50,
            edgeCaseScore: breakdown?.edgeCase ?? 40,
            questionsAttempted: 1,
            questionsCorrect: delta > 0 ? 1 : 0,
            lastPracticed: 'Just now',
          },
        ];
      }
    });

    setStudentData((s: any) => ({
      ...s,
      xp: s.xp + (delta > 0 ? 50 : 15),
      questionsSolved: s.questionsSolved + 1,
    }));
  };

  const addWeakness = (weaknessData: Omit<Weakness, 'id' | 'lastEncountered'>) => {
    setWeaknesses((prev) => [
      {
        id: 'w-' + Date.now(),
        lastEncountered: 'Just now',
        ...weaknessData,
      },
      ...prev,
    ]);
  };

  const resolveWeakness = (id: string) => {
    setWeaknesses((prev) => prev.filter((w) => w.id !== id));
  };

  const createMission = (topic: string, focus: string, beforeMastery: number): RevisionMission => {
    const newMission: RevisionMission = {
      id: 'mission-' + Date.now(),
      topic,
      title: `Fix ${topic} Boundaries`,
      focus,
      beforeMastery,
      afterMastery: Math.min(100, beforeMastery + 6),
      completed: false,
      createdAt: 'Just now',
      steps: [
        {
          id: 'step-review',
          title: '2 min: Review concept',
          detail: 'Revisit invariant condition and boundary update rules.',
          minutes: 2,
          done: false,
        },
        {
          id: 'step-visual',
          title: '3 min: Interactive visualization',
          detail: 'Step through an edge case target to see the index convergence.',
          minutes: 3,
          done: false,
        },
        {
          id: 'step-problem',
          title: '5 min: Targeted problem',
          detail: 'Solve one tricky boundary question with full confidence.',
          minutes: 5,
          done: false,
        },
      ],
    };
    setActiveMission(newMission);
    return newMission;
  };

  const completeMissionStep = (stepId: string) => {
    if (!activeMission) return;
    const updatedSteps = activeMission.steps.map((st) =>
      st.id === stepId ? { ...st, done: !st.done } : st
    );
    const allDone = updatedSteps.every((st) => st.done);

    setActiveMission({
      ...activeMission,
      steps: updatedSteps,
      completed: allDone,
    });

    if (allDone) {
      // Boost mastery as promised in mission
      updateMastery(activeMission.topic, 6);
      addHistoryItem({
        topic: activeMission.topic,
        type: 'revision',
        delta: +6,
        summary: `Completed 10-Minute Mission: ${activeMission.title}`,
      });
    }
  };

  const toggleSaveResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r))
    );
  };

  const toggleCompleteResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const addHistoryItem = (item: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prev) => [
      {
        id: 'hist-' + Date.now(),
        timestamp: 'Just now',
        ...item,
      },
      ...prev,
    ]);
  };

  const updateSession = (patch: Partial<LearningSession>) => {
    setSession((prev) => ({ ...prev, ...patch }));
  };

  const resetSession = () => {
    setSession({
      topic: 'Binary Search',
      subject: 'Computer Science',
      customTarget: 23,
      customArray: [2, 5, 8, 12, 16, 23, 31],
      answers: [],
    });
  };

  const resetToDemo = () => {
    setMasteryList(INITIAL_MASTERY);
    setWeaknesses(INITIAL_WEAKNESSES);
    setActiveMission(INITIAL_MISSION);
    setResources(INITIAL_RESOURCES);
    setHistory(INITIAL_HISTORY);
    setStudentData(INITIAL_STUDENT_DATA);
    resetSession();
  };

  // Compute accuracy
  const totalAttempted = masteryList.reduce((acc, m) => acc + m.questionsAttempted, 0);
  const totalCorrect = masteryList.reduce((acc, m) => acc + m.questionsCorrect, 0);
  const calculatedAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 74;

  const student: StudentProfile = {
    ...studentData,
    accuracy: calculatedAccuracy,
  };

  return (
    <StudyMateContext.Provider
      value={{
        student,
        updateStudent,
        masteryList,
        getMastery,
        updateMastery,
        weaknesses,
        addWeakness,
        resolveWeakness,
        activeMission,
        completeMissionStep,
        createMission,
        resources,
        toggleSaveResource,
        toggleCompleteResource,
        history,
        addHistoryItem,
        session,
        updateSession,
        resetSession,
        resetToDemo,
      }}
    >
      {children}
    </StudyMateContext.Provider>
  );
};

export function useStudyMate() {
  const context = useContext(StudyMateContext);
  if (!context) {
    throw new Error('useStudyMate must be used within a StudyMateProvider');
  }
  return context;
}
