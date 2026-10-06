import { z } from 'zod';
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

export function matchSampleChip(input: string): 'binary_search' | 'kirchhoff' | 'integrate' | null {
  const norm = input.trim().toLowerCase();
  if (norm === 'explain binary search' || norm === 'binary search') {
    return 'binary_search';
  }
  if (
    norm === "explain kirchhoff's voltage law" ||
    norm === "explain kirchhoff's law" ||
    norm === 'kirchhoff' ||
    norm === "kirchhoff's voltage law"
  ) {
    return 'kirchhoff';
  }
  if (
    norm === 'solve: integrate x e^x dx' ||
    norm === 'integrate x e^x dx' ||
    norm.includes('integrate x e^x')
  ) {
    return 'integrate';
  }
  return null;
}

export class MockService {
  async generateJson<T>(userText: string, schema: z.ZodType<T>): Promise<T> {
    const low = userText.toLowerCase();

    if (low.includes('kirchhoff') || low.includes('circuit')) {
      if (low.includes('quiz')) return schema.parse(KIRCHHOFF_QUIZ) as T;
      if (low.includes('plan')) return schema.parse(KIRCHHOFF_PLAN) as T;
      return schema.parse(KIRCHHOFF_LESSON) as T;
    }

    if (low.includes('integrate') || low.includes('calculus')) {
      if (low.includes('quiz')) return schema.parse(INTEGRATE_QUIZ) as T;
      if (low.includes('plan')) return schema.parse(INTEGRATE_PLAN) as T;
      return schema.parse(INTEGRATE_LESSON) as T;
    }

    // Default to binary search
    if (low.includes('quiz')) return schema.parse(BINARY_SEARCH_QUIZ) as T;
    if (low.includes('plan')) return schema.parse(BINARY_SEARCH_PLAN) as T;
    return schema.parse(BINARY_SEARCH_LESSON) as T;
  }
}

export const mockService = new MockService();
