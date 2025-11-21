import express from 'express';
import { verifyTelegramAuth } from '../middleware/telegramAuth';

const router = express.Router();

// In-memory storage (в продакшене использовать базу данных)
const goalsStorage: Map<string, any[]> = new Map();

// Get all goals for user
router.get('/', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const goals = goalsStorage.get(userId) || [];
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get goal by ID
router.get('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const goals = goalsStorage.get(userId) || [];
    const goal = goals.find(g => g.id === req.params.id);
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new goal
router.post('/', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const goals = goalsStorage.get(userId) || [];
    
    const newGoal = {
      id: Date.now().toString(),
      ...req.body,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    goals.push(newGoal);
    goalsStorage.set(userId, goals);
    
    res.status(201).json(newGoal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const goals = goalsStorage.get(userId) || [];
    const goalIndex = goals.findIndex(g => g.id === req.params.id);
    
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    goalsStorage.set(userId, goals);
    res.json(goals[goalIndex]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const goals = goalsStorage.get(userId) || [];
    const filteredGoals = goals.filter(g => g.id !== req.params.id);
    
    goalsStorage.set(userId, filteredGoals);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

