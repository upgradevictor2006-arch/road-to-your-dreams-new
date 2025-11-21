import express from 'express';
import { verifyTelegramAuth } from '../middleware/telegramAuth';

const router = express.Router();

// In-memory storage (в продакшене использовать базу данных)
const usersStorage: Map<string, any> = new Map();

// Get or create user
router.get('/me', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    let user = usersStorage.get(userId);
    
    if (!user) {
      // Create new user
      user = {
        id: userId,
        telegramId: req.telegramUser.id,
        firstName: req.telegramUser.first_name,
        lastName: req.telegramUser.last_name,
        username: req.telegramUser.username,
        streak: 0,
        kilometers: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      usersStorage.set(userId, user);
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/me', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    let user = usersStorage.get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user = {
      ...user,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    usersStorage.set(userId, user);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

