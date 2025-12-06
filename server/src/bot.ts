import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEB_APP_URL = process.env.WEB_APP_URL || process.env.CORS_ORIGIN || 'https://your-frontend.vercel.app';

let bot: TelegramBot | null = null;

// Проверяем наличие токена
if (!BOT_TOKEN) {
  console.warn('⚠️  TELEGRAM_BOT_TOKEN не установлен. Telegram бот не будет работать.');
} else {
  // Создаем экземпляр бота
  bot = new TelegramBot(BOT_TOKEN, { polling: true });

  // Приветственное сообщение
  const welcomeMessage = `🌟 <b>Добро пожаловать в "Road To Your Dream"!</b> 🌟

🎯 <b>Твой путь к мечте начинается здесь!</b>

Каждый день - это шаг к твоей цели. 
Каждая задача - это километр на твоей карте успеха.
Каждый чекпоинт - это победа над собой.

💪 <b>Начни свой путь прямо сейчас!</b>

Создай свою первую цель, разбей её на этапы и двигайся к мечте каждый день. 
Вместе мы достигнем невозможного! 🚀

✨ <i>Помни: мечты становятся реальностью, когда ты действуешь!</i>`;

  // Обработчик команды /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      // Отправляем приветственное сообщение с изображением
      // Используем встроенное изображение или URL
      const photoUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
      // Или используйте локальное изображение из public папки после деплоя
      
      await bot!.sendPhoto(chatId, photoUrl, {
        caption: welcomeMessage,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 НАЧНИ СВОЮ ДОРОГУ К ЦЕЛЯМ',
                web_app: { url: WEB_APP_URL }
              }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('Error sending welcome message:', error);
      
      // Если не удалось отправить фото, отправляем только текст с кнопкой
      try {
        await bot!.sendMessage(chatId, welcomeMessage, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 НАЧНИ СВОЮ ДОРОГУ К ЦЕЛЯМ',
                  web_app: { url: WEB_APP_URL }
                }
              ]
            ]
          }
        });
      } catch (err) {
        console.error('Error sending text message:', err);
      }
    }
  });

  // Обработчик команды /help
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpText = `📖 <b>Помощь</b>

<b>Доступные команды:</b>
/start - Начать работу с ботом
/help - Показать эту справку

<b>Как использовать:</b>
1. Нажмите кнопку "НАЧНИ СВОЮ ДОРОГУ К ЦЕЛЯМ"
2. Создайте свою первую цель
3. Разбейте её на этапы (чекпоинты)
4. Выполняйте ежедневные задачи
5. Двигайтесь к своей мечте! 🎯

<b>Поддержка:</b>
Если у вас возникли вопросы, напишите нам!`;

    bot!.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  });

  // Обработчик callback-кнопок для задач
  bot.on('callback_query', async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) return;

    try {
      if (data.startsWith('task_complete_')) {
        const goalId = data.replace('task_complete_', '');
        await bot!.answerCallbackQuery(query.id, { text: '✅ Задача отмечена как выполненная!' });
        await bot!.editMessageText(
          '✅ Задача выполнена! Продолжай в том же духе! 💪',
          {
            chat_id: chatId,
            message_id: query.message?.message_id,
          }
        );
      } else if (data.startsWith('task_skip_')) {
        const goalId = data.replace('task_skip_', '');
        await bot!.answerCallbackQuery(query.id, { text: '❌ Задача пропущена' });
        await bot!.editMessageText(
          '❌ Задача пропущена. Не расстраивайся, завтра новый день! 🌅',
          {
            chat_id: chatId,
            message_id: query.message?.message_id,
          }
        );
      }
    } catch (error) {
      console.error('Error handling callback query:', error);
    }
  });

  // Обработка ошибок
  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });

  console.log('🤖 Telegram bot is running...');
}

export default bot;
