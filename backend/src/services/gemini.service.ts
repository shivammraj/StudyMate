import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { mockService } from './mock.service.js';

export class AiServiceError extends Error {
  code: 'AI_TIMEOUT' | 'AI_INVALID' | 'BAD_REQUEST' | 'INTERNAL';
  retryable: boolean;

  constructor(
    code: 'AI_TIMEOUT' | 'AI_INVALID' | 'BAD_REQUEST' | 'INTERNAL',
    message: string,
    retryable = true
  ) {
    super(message);
    this.name = 'AiServiceError';
    this.code = code;
    this.retryable = retryable;
  }
}

export interface GenerateOptions<T> {
  system: string;
  user: string;
  schema: z.ZodType<T>;
  timeoutMs?: number;
}

export class GeminiService {
  private getProviderName(): 'gemini' | 'ollama' | 'mock' {
    const p = (process.env.AI_PROVIDER || 'mock').toLowerCase();
    if (p === 'gemini') return 'gemini';
    if (p === 'ollama') return 'ollama';
    return 'mock';
  }

  async generateJson<T>(opts: GenerateOptions<T>): Promise<{ data: T; provider: 'gemini' | 'ollama' | 'mock' }> {
    const provider = this.getProviderName();

    if (provider === 'mock') {
      const data = await mockService.generateJson(opts.user, opts.schema);
      return { data, provider: 'mock' };
    }

    if (provider === 'ollama') {
      const data = await this.callOllama(opts);
      return { data, provider: 'ollama' };
    }

    // Default to Gemini
    const data = await this.callGemini(opts);
    return { data, provider: 'gemini' };
  }

  private async callGemini<T>(opts: GenerateOptions<T>): Promise<T> {
    let apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    if (!apiKey) {
      throw new AiServiceError('INTERNAL', 'GEMINI_API_KEY is not configured on server', false);
    }
    if (apiKey.startsWith('Ab8RN6')) {
      apiKey = 'AQ.' + apiKey;
    }

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const candidateModels = [primaryModel, 'gemini-3.5-flash'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );
    const client = new GoogleGenAI({ apiKey });
    const timeoutMs = opts.timeoutMs ?? 25000;

    const cleanJsonText = (str: string): string => {
      let cleaned = str.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return cleaned.trim();
    };

    let activeModel = candidateModels[0];

    const callApi = async (extraInstruction = '', model = activeModel): Promise<string> => {
      const fullPrompt = `${opts.system}\n\nIMPORTANT: Return strictly raw valid JSON adhering to the required schema. Do not wrap in markdown fences or add explanatory text.\n${extraInstruction}\n\n${opts.user}`;

      const responsePromise = client.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new AiServiceError('AI_TIMEOUT', 'Gemini response timed out after 25s', true)),
          timeoutMs
        );
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);
      return response.text || '';
    };

    let rawText = '';
    let lastError: any = null;

    for (const modelToTry of candidateModels) {
      try {
        activeModel = modelToTry;
        rawText = await callApi('', modelToTry);
        if (rawText) break;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        // If high demand (503) or not found (404), try fallback model
        if (msg.includes('503') || msg.includes('demand') || msg.includes('404')) {
          continue;
        }
        if (err instanceof AiServiceError) throw err;
      }
    }

    if (!rawText) {
      if (lastError instanceof AiServiceError) throw lastError;
      throw new AiServiceError('AI_TIMEOUT', lastError?.message || 'Error communicating with Gemini', true);
    }

    const normalizeParsed = (obj: any): any => {
      if (obj && typeof obj === 'object') {
        if (!obj.topic && obj.title) {
          obj.topic = String(obj.title).toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
        }
        if (typeof obj.detected === 'string') {
          obj.detected = {
            subject: obj.subject || 'physics',
            topic: String(obj.detected).slice(0, 40),
            difficulty: 'intermediate',
            method: 'concept',
          };
        } else if (!obj.detected && (obj.steps || obj.bigIdea)) {
          obj.detected = {
            subject: obj.subject || 'physics',
            topic: String(obj.topic || obj.title || 'General Engineering').slice(0, 40),
            difficulty: 'intermediate',
            method: 'concept',
          };
        } else if (obj.detected && typeof obj.detected === 'object') {
          if (!obj.detected.subject) obj.detected.subject = 'physics';
          if (!obj.detected.difficulty) obj.detected.difficulty = 'intermediate';
          if (!obj.detected.method) obj.detected.method = 'concept';
          if (!obj.detected.topic) obj.detected.topic = String(obj.title || 'Concept').slice(0, 40);
        }
        if (!obj.visual && obj.steps) {
          obj.visual = { type: 'none' };
        }
      }
      return obj;
    };

    try {
      const parsed = normalizeParsed(JSON.parse(cleanJsonText(rawText)));
      return opts.schema.parse(parsed);
    } catch (firstErr: any) {
      // Retry once with validation feedback
      try {
        const retryText = await callApi(
          `Previous response failed validation with error: ${firstErr.message}. Fix and return valid JSON matching schema.`
        );
        const retryParsed = normalizeParsed(JSON.parse(cleanJsonText(retryText)));
        return opts.schema.parse(retryParsed);
      } catch (retryErr: any) {
        throw new AiServiceError(
          'AI_INVALID',
          `AI output failed schema validation: ${retryErr.message}`,
          true
        );
      }
    }
  }

  private async callOllama<T>(opts: GenerateOptions<T>): Promise<T> {
    const rawUrl = process.env.OLLAMA_URL || 'https://ollama.com/api';
    const apiKey = process.env.OLLAMA_API_KEY;
    const model = process.env.OLLAMA_MODEL || 'gemma4:31b';
    const timeoutMs = opts.timeoutMs ?? 30000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const prompt = `${opts.system}\n\nReturn strictly valid JSON:\n\n${opts.user}`;

      // Support either /api/chat or /api/generate
      const endpoint = rawUrl.includes('/chat')
        ? rawUrl
        : rawUrl.endsWith('/')
        ? `${rawUrl}chat`
        : `${rawUrl}/chat`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: opts.system },
            { role: 'user', content: `${opts.user}\n\nRespond with strictly valid JSON.` },
          ],
          format: 'json',
          stream: false,
          options: { temperature: 0.2 },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // If chat endpoint fails, try legacy generate endpoint
        const genEndpoint = rawUrl.replace('/chat', '') + '/generate';
        const fallbackRes = await fetch(genEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            prompt,
            format: 'json',
            stream: false,
          }),
          signal: controller.signal,
        });

        if (!fallbackRes.ok) {
          throw new Error(`Ollama returned status ${res.status}`);
        }

        const genData: any = await fallbackRes.json();
        const parsed = JSON.parse(genData.response);
        return opts.schema.parse(parsed);
      }

      const data: any = await res.json();
      const rawContent = data.message?.content || data.response;
      const parsed = JSON.parse(rawContent);
      return opts.schema.parse(parsed);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new AiServiceError('AI_TIMEOUT', 'Ollama request timed out', true);
      }
      throw new AiServiceError('AI_INVALID', err.message || 'Ollama generation failed', true);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const geminiService = new GeminiService();
