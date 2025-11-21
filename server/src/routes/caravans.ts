import express from 'express';
import { verifyTelegramAuth } from '../middleware/telegramAuth';

const router = express.Router();

// In-memory storage (в продакшене использовать базу данных)
const caravansStorage: Map<string, any[]> = new Map();

// Get all caravans for user
router.get('/', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const caravans = caravansStorage.get(userId) || [];
    res.json(caravans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get caravan by ID
router.get('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const caravans = caravansStorage.get(userId) || [];
    const caravan = caravans.find(c => c.id === req.params.id);
    
    if (!caravan) {
      return res.status(404).json({ error: 'Caravan not found' });
    }
    
    res.json(caravan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new caravan
router.post('/', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const caravans = caravansStorage.get(userId) || [];
    
    const newCaravan = {
      id: Date.now().toString(),
      ...req.body,
      userId,
      members: 1,
      memberIds: [userId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    caravans.push(newCaravan);
    caravansStorage.set(userId, caravans);
    
    res.status(201).json(newCaravan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update caravan
router.put('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const caravans = caravansStorage.get(userId) || [];
    const caravanIndex = caravans.findIndex(c => c.id === req.params.id);
    
    if (caravanIndex === -1) {
      return res.status(404).json({ error: 'Caravan not found' });
    }
    
    caravans[caravanIndex] = {
      ...caravans[caravanIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    caravansStorage.set(userId, caravans);
    res.json(caravans[caravanIndex]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete caravan
router.delete('/:id', verifyTelegramAuth, (req: any, res) => {
  try {
    const userId = req.telegramUser.id.toString();
    const caravans = caravansStorage.get(userId) || [];
    const filteredCaravans = caravans.filter(c => c.id !== req.params.id);
    
    caravansStorage.set(userId, filteredCaravans);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

