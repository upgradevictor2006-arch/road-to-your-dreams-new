import bot from '../bot';

interface ScheduledNotification {
  userId: number;
  goalId: string;
  taskText: string;
  scheduledTime: number; // timestamp
  sent: boolean;
}

// Хранилище запланированных уведомлений (в продакшене лучше использовать БД)
const scheduledNotifications: ScheduledNotification[] = [];

/**
 * Планирует уведомление за 5 минут до окончания времени задачи
 */
export function scheduleTaskNotification(
  userId: number,
  goalId: string,
  taskText: string,
  taskStartTime: string
) {
  // Вычисляем время окончания (24 часа от начала)
  const startTime = new Date(taskStartTime).getTime();
  const endTime = startTime + 24 * 60 * 60 * 1000; // 24 часа
  const notificationTime = endTime - 5 * 60 * 1000; // За 5 минут до окончания

  // Проверяем, не прошло ли уже время
  if (notificationTime <= Date.now()) {
    return;
  }

  // Удаляем старые уведомления для этой задачи
  const existingIndex = scheduledNotifications.findIndex(
    n => n.userId === userId && n.goalId === goalId && !n.sent
  );
  if (existingIndex !== -1) {
    scheduledNotifications.splice(existingIndex, 1);
  }

  // Добавляем новое уведомление
  scheduledNotifications.push({
    userId,
    goalId,
    taskText,
    scheduledTime: notificationTime,
    sent: false
  });

  // Планируем отправку
  const delay = notificationTime - Date.now();
  setTimeout(() => {
    sendNotification(userId, goalId, taskText);
    // Помечаем как отправленное
    const index = scheduledNotifications.findIndex(
      n => n.userId === userId && n.goalId === goalId && !n.sent
    );
    if (index !== -1) {
      scheduledNotifications[index].sent = true;
    }
  }, delay);
}

/**
 * Отправляет уведомление пользователю
 */
async function sendNotification(userId: number, goalId: string, taskText: string) {
  if (!bot) {
    console.error('Bot is not initialized');
    return;
  }

  try {
    const message = `⏰ <b>Осталось 5 минут!</b>\n\nНе забудь выполнить задачу:\n<i>${taskText}</i>\n\nПоторопись! 🚀`;

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
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Удаляет запланированное уведомление (если задача выполнена раньше)
 */
export function cancelScheduledNotification(userId: number, goalId: string) {
  const index = scheduledNotifications.findIndex(
    n => n.userId === userId && n.goalId === goalId && !n.sent
  );
  if (index !== -1) {
    scheduledNotifications.splice(index, 1);
  }
}

/**
 * Проверяет и отправляет просроченные уведомления (на случай перезапуска сервера)
 */
export function checkPendingNotifications() {
  const now = Date.now();
  scheduledNotifications.forEach((notification, index) => {
    if (!notification.sent && notification.scheduledTime <= now) {
      sendNotification(notification.userId, notification.goalId, notification.taskText);
      scheduledNotifications[index].sent = true;
    }
  });
}

// Проверяем каждую минуту
setInterval(checkPendingNotifications, 60 * 1000);

