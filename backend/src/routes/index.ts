import { Router } from 'express';
import { aiRouter } from './ai.routes.js';
import { youtubeRouter } from './youtube.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

// Modular Route Mounts
apiRouter.use('/health', healthRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/study', aiRouter);
apiRouter.use('/youtube', youtubeRouter);

// Direct Aliases for backwards compatibility with existing frontend calls
apiRouter.use('/', aiRouter);

