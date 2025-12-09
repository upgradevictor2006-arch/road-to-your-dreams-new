import express from 'express';
import bot from '../bot';
import { scheduleTaskNotification, cancelScheduledNotification } from '../services/notificationScheduler';

const router = express.Router();

// Отправка уведомления пользователю через Telegram бота
router.post('/send', async (req, res) => {
  try {
    const { userId, goalId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    if (!bot) {
      return res.status(503).json({ error: 'Telegram bot is not initialized' });
    }

    // Отправляем сообщение пользователю
    await bot.sendMessage(userId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Выполнено',
              callback_data: `task_complete_${goalId}`
            },
            {
              text: '❌ Пропустить',
              callback_data: `task_skip_${goalId}`
            }
          ],
          [
            {
              text: '📱 Открыть приложение',
              web_app: { url: process.env.WEB_APP_URL || process.env.CORS_ORIGIN || '' }
            }
          ]
        ]
      }
    });

    res.json({ success: true, message: 'Notification sent' });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message || 'Failed to send notification' });
  }
});

// Планирование уведомления за 5 минут до окончания задачи
router.post('/schedule', async (req, res) => {
  try {
    const { userId, goalId, taskText, taskStartTime } = req.body;

    if (!userId || !goalId || !taskText || !taskStartTime) {
      return res.status(400).json({ error: 'userId, goalId, taskText, and taskStartTime are required' });
    }

    scheduleTaskNotification(userId, goalId, taskText, taskStartTime);

    res.json({ success: true, message: 'Notification scheduled' });
  } catch (error: any) {
    console.error('Error scheduling notification:', error);
    res.status(500).json({ error: error.message || 'Failed to schedule notification' });
  }
});

// Отмена запланированного уведомления
router.post('/cancel', async (req, res) => {
  try {
    const { userId, goalId } = req.body;

    if (!userId || !goalId) {
      return res.status(400).json({ error: 'userId and goalId are required' });
    }

    cancelScheduledNotification(userId, goalId);

    res.json({ success: true, message: 'Notification cancelled' });
  } catch (error: any) {
    console.error('Error cancelling notification:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel notification' });
  }
});

export default router;

