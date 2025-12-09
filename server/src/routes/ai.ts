import express from 'express';
import { verifyTelegramAuth } from '../middleware/telegramAuth';
import {
  generateCheckpointSuggestions,
  generateDailyTaskSuggestions,
  generateMotivationalMessage,
  analyzeGoal,
  getContextualHelp,
} from '../services/aiAssistant';

const router = express.Router();

// Получить предложения для чекпоинтов
router.post('/suggestions/checkpoints', verifyTelegramAuth, async (req: any, res) => {
  try {
    const context = req.body;
    const suggestions = await generateCheckpointSuggestions(context);
    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating checkpoint suggestions:', error);
    res.status(500).json({ error: error.message || 'Failed to generate suggestions' });
  }
});

// Получить предложения для ежедневных задач
router.post('/suggestions/daily-tasks', verifyTelegramAuth, async (req: any, res) => {
  try {
    const context = req.body;
    const suggestions = await generateDailyTaskSuggestions(context);
    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating daily task suggestions:', error);
    res.status(500).json({ error: error.message || 'Failed to generate suggestions' });
  }
});

// Получить мотивационное сообщение
router.post('/motivation', verifyTelegramAuth, async (req: any, res) => {
  try {
    const { context, progress } = req.body;
    const message = await generateMotivationalMessage(context, progress || 0);
    res.json({ message });
  } catch (error: any) {
    console.error('Error generating motivational message:', error);
    res.status(500).json({ error: error.message || 'Failed to generate message' });
  }
});

// Анализ цели и предложения по улучшению
router.post('/analyze', verifyTelegramAuth, async (req: any, res) => {
  try {
    const context = req.body;
    const suggestions = await analyzeGoal(context);
    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error analyzing goal:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze goal' });
  }
});

// Получить контекстную помощь
router.post('/help', verifyTelegramAuth, async (req: any, res) => {
  try {
    const { context, currentStep } = req.body;
    const suggestions = await getContextualHelp(context, currentStep);
    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error getting contextual help:', error);
    res.status(500).json({ error: error.message || 'Failed to get help' });
  }
});

export default router;

