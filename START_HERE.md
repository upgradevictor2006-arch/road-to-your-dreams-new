# 🎯 НАЧНИТЕ ЗДЕСЬ

## 📚 Документация

1. **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)** - Полная пошаговая инструкция по развертыванию
2. **[QUICK_START_COMMANDS.md](./QUICK_START_COMMANDS.md)** - Команды для быстрого старта
3. **[README.md](./README.md)** - Общая информация о проекте

## ⚡ Быстрый старт (5 минут)

### 1. Установите зависимости

```bash
# Бэкенд
cd server
npm install

# Фронтенд
cd ../client
npm install
```

### 2. Создайте файлы .env

**server/.env:**
```env
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_bot_token_here
JWT_SECRET=dev_secret_key
CORS_ORIGIN=http://localhost:5173
```

**client/.env:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 3. Запустите

**Терминал 1:**
```bash
cd server
npm run dev
```

**Терминал 2:**
```bash
cd client
npm run dev
```

### 4. Откройте браузер

- http://localhost:5173 - Фронтенд
- http://localhost:3000/health - API

## 🚀 Следующие шаги

1. **Создайте Telegram бота** через [@BotFather](https://t.me/BotFather)
2. **Получите токен** и добавьте в `.env` файлы
3. **Протестируйте** локально
4. **Разверните** на хостинге (см. [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md))

## 📖 Что дальше?

- Прочитайте [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) для полной инструкции
- Изучите структуру проекта в [README.md](./README.md)
- Используйте [QUICK_START_COMMANDS.md](./QUICK_START_COMMANDS.md) для быстрого доступа к командам

---

**Удачи! 🎉**

