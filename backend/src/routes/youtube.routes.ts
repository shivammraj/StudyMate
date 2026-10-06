import { Router } from 'express';
import { youtubeController } from '../controllers/youtube.controller.js';

export const youtubeRouter = Router();

youtubeRouter.get('/search', (req, res) => youtubeController.search(req, res));
