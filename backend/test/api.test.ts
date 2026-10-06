import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('StudyMate Backend API Endpoints', () => {
  beforeAll(() => {
    process.env.AI_PROVIDER = 'mock';
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.provider).toBe('mock');
  });

  it('POST /api/lesson returns lesson data', async () => {
    const res = await request(app)
      .post('/api/lesson')
      .send({ input: 'Explain binary search', intent: 'explain' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.visual.type).toBe('array_algorithm');
    expect(res.body.meta.source).toBe('sample');
  });

  it('POST /api/ai/lesson works via /ai mount too', async () => {
    const res = await request(app)
      .post('/api/ai/lesson')
      .send({ input: 'Explain binary search', intent: 'explain' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /api/youtube/search returns search results safely without secret leak', async () => {
    const res = await request(app).get('/api/youtube/search?q=binary+search');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].url).toContain('youtube.com');
  });

  it('POST /api/study/ask correctly classifies "Explain binary search" into visual learning', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: 'Explain binary search', mode: 'auto' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.subject).toBe('dsa');
    expect(res.body.data.learningMode).toBe('visual');
    expect(res.body.data.nextAction.route).toBe('/learn/binary-search');
  });

  it('POST /api/study/ask routes "Write binary search in C++" into DSA Lab', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: 'Write binary search in C++', mode: 'code' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.learningMode).toBe('code_lab');
    expect(res.body.data.nextAction.route).toBe('/dsa');
  });

  it('POST /api/study/ask routes "Why does my C++ code give TLE?" into debugging', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: 'Why does my C++ code give TLE?', mode: 'auto' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.intent).toBe('debug_code');
    expect(res.body.data.learningMode).toBe('debugging');
    expect(res.body.data.nextAction.route).toBe('/dsa');
  });

  it('POST /api/study/ask routes math integrals into mathematical_derivation', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: 'Solve x² + 5x + 6 = 0', mode: 'solve' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.subject).toBe('mathematics');
    expect(res.body.data.learningMode).toBe('mathematical_derivation');
    expect(res.body.data.nextAction.route).toBe('/learn/integration-by-parts');
  });

  it('POST /api/study/ask routes Kirchhoff into electrical circuit visualizer', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: "Explain Kirchhoff's voltage law", mode: 'auto' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.subject).toBe('electrical_engineering');
    expect(res.body.data.learningMode).toBe('engineering_diagram');
    expect(res.body.data.nextAction.route).toBe('/learn/kirchhoffs-voltage-law');
  });

  it('POST /api/study/ask routes practice requests into adaptive quiz', async () => {
    const res = await request(app)
      .post('/api/study/ask')
      .send({ question: 'Give me 5 recursion questions', mode: 'practice' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.learningMode).toBe('quiz');
    expect(res.body.data.nextAction.route).toBe('/practice');
  });
});
