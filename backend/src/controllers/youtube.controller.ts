import { Request, Response } from 'express';
import { youtubeService } from '../services/youtube.service.js';

export class YouTubeController {
  async search(req: Request, res: Response) {
    const q = req.query.q as string;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Query parameter "q" is required.',
          retryable: false,
        },
      });
    }

    const { results, source } = await youtubeService.searchVideos(q);
    return res.json({
      ok: true,
      data: results,
      meta: {
        source,
      },
    });
  }
}

export const youtubeController = new YouTubeController();
