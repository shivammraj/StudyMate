import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

export const aiRouter = Router();

aiRouter.post('/lesson', (req, res) => aiController.getLesson(req, res));
aiRouter.post('/quiz', (req, res) => aiController.getQuiz(req, res));
aiRouter.post('/plan', (req, res) => aiController.getPlan(req, res));
aiRouter.post('/ask', (req, res) => aiController.handleAsk(req, res));

