import express from 'express';
import bot from '../bot';

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

export default router;

