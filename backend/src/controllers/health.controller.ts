import { Request, Response } from 'express';

export class HealthController {
  check(_req: Request, res: Response) {
    const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
    res.json({
      ok: true,
      provider,
      mode: process.env.NODE_ENV || 'development',
    });
  }
}

export const healthController = new HealthController();
