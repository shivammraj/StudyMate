import { Quiz, Subject, Skill, PlanReq } from '../types/schemas.js';

export const SKILL_WEIGHT = {
  recall: 1,
  understanding: 2,
  application: 3,
} as const;

export type Band = 'strong' | 'developing' | 'weak';

export type Answer = {
  choice: number | null;
  hinted: boolean;
  confidence: 'guess' | 'fairly' | 'certain';
};

export type ConceptResult = {
  concept: string;
  correct: number;
  total: number;
  percent: number;
  band: Band;
};

export type SkillResult = {
  skill: Skill;
  correct: number;
  total: number;
  percent: number;
};

export type Analysis = {
  topic: string;
  subject: Subject;
  at: string;
  overall: { correct: number; total: number; percent: number; band: Band };
  concepts: ConceptResult[];
  skills: SkillResult[];
  weakest: ConceptResult;
  strongest: ConceptResult;
  confidentMistakes: { questionId: string; concept: string }[];
  headline: string;
  missed: { questionId: string; question: string; concept: string; skill: Skill }[];
};

export type Comparison = {
  concept: string;
  before: number;
  after: number;
  delta: number;
}[];

export function bandFor(percent: number): Band {
  if (percent >= 80) return 'strong';
  if (percent >= 50) return 'developing';
  return 'weak';
}

export function analyze(quiz: Quiz, answers: Answer[]): Analysis {
  const at = new Date().toISOString();
  const questions = quiz.questions;

  let totalEarned = 0;
  let totalWeight = 0;
  let totalCorrect = 0;

  const conceptStats = new Map<
    string,
    { earned: number; weight: number; correct: number; total: number; originalIndex: number }
  >();
  const skillStats = new Map<
    Skill,
    { earned: number; weight: number; correct: number; total: number }
  >();

  const confidentMistakes: { questionId: string; concept: string }[] = [];
  const missed: { questionId: string; question: string; concept: string; skill: Skill }[] = [];

  questions.forEach((q, idx) => {
    const ans = answers[idx] ?? { choice: null, hinted: false, confidence: 'fairly' };
    const weight = SKILL_WEIGHT[q.skill];
    const isCorrect = ans.choice !== null && ans.choice === q.correctIndex;

    if (!conceptStats.has(q.concept)) {
      conceptStats.set(q.concept, {
        earned: 0,
        weight: 0,
        correct: 0,
        total: 0,
        originalIndex: conceptStats.size,
      });
    }
    const cStat = conceptStats.get(q.concept)!;
    cStat.weight += weight;
    cStat.total += 1;

    if (!skillStats.has(q.skill)) {
      skillStats.set(q.skill, { earned: 0, weight: 0, correct: 0, total: 0 });
    }
    const sStat = skillStats.get(q.skill)!;
    sStat.weight += weight;
    sStat.total += 1;

    totalWeight += weight;

    if (isCorrect) {
      const earned = ans.hinted ? weight / 2 : weight;
      totalEarned += earned;
      totalCorrect += 1;
      cStat.earned += earned;
      cStat.correct += 1;
      sStat.earned += earned;
      sStat.correct += 1;
    } else {
      missed.push({
        questionId: q.id,
        question: q.question,
        concept: q.concept,
        skill: q.skill,
      });
      if (ans.confidence === 'certain') {
        confidentMistakes.push({
          questionId: q.id,
          concept: q.concept,
        });
      }
    }
  });

  const overallPercent = totalWeight > 0 ? Math.round((100 * totalEarned) / totalWeight) : 0;
  const overallBand = bandFor(overallPercent);

  const concepts: ConceptResult[] = Array.from(conceptStats.entries())
    .map(([concept, stat]) => {
      const pct = stat.weight > 0 ? Math.round((100 * stat.earned) / stat.weight) : 0;
      return {
        concept,
        correct: stat.correct,
        total: stat.total,
        percent: pct,
        band: bandFor(pct),
        _order: stat.originalIndex,
      };
    })
    .sort((a, b) => {
      if (a.percent !== b.percent) return a.percent - b.percent;
      return a._order - b._order;
    })
    .map(({ _order, ...rest }) => rest);

  const skills: SkillResult[] = Array.from(skillStats.entries())
    .map(([skill, stat]) => {
      const pct = stat.weight > 0 ? Math.round((100 * stat.earned) / stat.weight) : 0;
      return {
        skill,
        correct: stat.correct,
        total: stat.total,
        percent: pct,
      };
    })
    .sort((a, b) => a.percent - b.percent);

  const weakest = concepts[0] || {
    concept: quiz.topic,
    correct: 0,
    total: 0,
    percent: 0,
    band: 'weak',
  };
  const strongest = concepts[concepts.length - 1] || weakest;

  let headline = `${weakest.concept} is the weakest part of ${quiz.topic}.`;

  const allStrong = concepts.length > 0 && concepts.every((c) => c.band === 'strong');
  if (allStrong) {
    headline = `You're solid on ${quiz.topic}. No weak spots in this practice.`;
  } else if (confidentMistakes.length > 0) {
    headline = `You felt sure about ${confidentMistakes[0].concept}, but the answer was off. Fix that first.`;
  } else if (skills.length >= 2) {
    const highestSkill = skills[skills.length - 1];
    const lowestSkill = skills[0];
    if (highestSkill.percent - lowestSkill.percent >= 30 && lowestSkill.percent < 80) {
      if (lowestSkill.skill === 'recall') {
        headline = 'You understand the ideas but miss key facts.';
      } else if (lowestSkill.skill === 'understanding') {
        headline = 'You know the facts but not why they work.';
      } else if (lowestSkill.skill === 'application') {
        headline = 'You know the idea but struggle to use it on new problems.';
      }
    }
  }

  return {
    topic: quiz.topic,
    subject: quiz.subject,
    at,
    overall: {
      correct: totalCorrect,
      total: questions.length,
      percent: overallPercent,
      band: overallBand,
    },
    concepts,
    skills,
    weakest,
    strongest,
    confidentMistakes,
    headline,
    missed,
  };
}

export function compare(before: Analysis, after: Analysis): Comparison {
  const beforeMap = new Map<string, number>();
  before.concepts.forEach((c) => beforeMap.set(c.concept, c.percent));

  return after.concepts.map((c) => {
    const beforePercent = beforeMap.get(c.concept) ?? 0;
    return {
      concept: c.concept,
      before: beforePercent,
      after: c.percent,
      delta: c.percent - beforePercent,
    };
  });
}

export function planInput(a: Analysis): PlanReq {
  let weakConcepts = a.concepts.filter((c) => c.band === 'weak').map((c) => c.concept);
  if (weakConcepts.length === 0) {
    weakConcepts = a.concepts.slice(0, 2).map((c) => c.concept);
  }
  if (weakConcepts.length === 0) {
    weakConcepts = [a.weakest.concept];
  }
  weakConcepts = weakConcepts.slice(0, 3);

  const confidentMistakes = Array.from(new Set(a.confidentMistakes.map((cm) => cm.concept))).slice(
    0,
    3
  );

  return {
    topic: a.topic,
    subject: a.subject,
    weakConcepts,
    missed: a.missed.slice(0, 6).map((m) => ({
      question: m.question,
      concept: m.concept,
      skill: m.skill,
    })),
    confidentMistakes,
  };
}
