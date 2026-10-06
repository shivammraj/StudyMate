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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AiServiceError('INTERNAL', 'GEMINI_API_KEY is not configured on server', false);
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const client = new GoogleGenAI({ apiKey });
    const timeoutMs = opts.timeoutMs ?? 25000;

    const callApi = async (extraInstruction = ''): Promise<string> => {
      const fullPrompt = `${opts.system}\n\nIMPORTANT: Return strictly raw valid JSON adhering to the required schema. Do not wrap in markdown fences or add explanatory text.\n${extraInstruction}\n\n${opts.user}`;

      const responsePromise = client.models.generateContent({
        model: modelName,
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
    try {
      rawText = await callApi();
    } catch (err: any) {
      if (err instanceof AiServiceError) throw err;
      throw new AiServiceError('AI_TIMEOUT', err.message || 'Error communicating with Gemini', true);
    }

    try {
      const parsed = JSON.parse(rawText);
      return opts.schema.parse(parsed);
    } catch (firstErr: any) {
      // Retry once with validation feedback
      try {
        const retryText = await callApi(
          `Previous response failed validation with error: ${firstErr.message}. Fix and return valid JSON matching schema.`
        );
        const retryParsed = JSON.parse(retryText);
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
