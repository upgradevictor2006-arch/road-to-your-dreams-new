# 🚀 Полное руководство по развертыванию Telegram Mini App "Road To Your Dream"

## 📋 Содержание
1. [Подготовка фронтенда к деплою](#1-подготовка-фронтенда-к-деплою)
2. [Создание и деплой бэкенда](#2-создание-и-деплой-бэкенда)
3. [Интеграция фронтенда и бэкенда](#3-интеграция-фронтенда-и-бэкенда)
4. [Настройка Telegram Mini App](#4-настройка-telegram-mini-app)
5. [Тестирование](#5-тестирование)

---

## 1. ПОДГОТОВКА ФРОНТЕНДА К ДЕПЛОЮ

### 1.1. Создание файла переменных окружения

Создайте файл `.env` в папке `client/`:

```bash
cd client
```

Создайте файл `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

И файл `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 1.2. Обновление vite.config.ts

Обновите конфигурацию Vite для правильной работы с базовым путем:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

### 1.3. Добавление скрипта Telegram WebApp в index.html

Обновите `client/index.html`:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/ico.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Road To Your Dream</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 2. СОЗДАНИЕ И ДЕПЛОЙ БЭКЕНДА

### 2.1. Создание структуры бэкенда

Создайте папку `server/` в корне проекта:

```bash
mkdir server
cd server
npm init -y
```

### 2.2. Установка зависимостей

```bash
npm install express cors dotenv jsonwebtoken bcryptjs
npm install --save-dev @types/express @types/cors @types/jsonwebtoken @types/bcryptjs typescript ts-node nodemon @types/node
```

### 2.3. Создание структуры папок

```bash
mkdir src
mkdir src/controllers
mkdir src/routes
mkdir src/middleware
mkdir src/models
mkdir src/services
mkdir src/utils
```

---

## 3. ИНТЕГРАЦИЯ ФРОНТЕНДА И БЭКЕНДА

См. файлы в папке `server/` и обновления в `client/src/services/`

---

## 4. НАСТРОЙКА TELEGRAM MINI APP

### 4.1. Создание бота через BotFather

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен бота
4. Сохраните токен в `.env` файлах

### 4.2. Настройка Web App

1. Отправьте BotFather команду `/newapp`
2. Выберите вашего бота
3. Укажите название приложения
4. Загрузите иконку (512x512px)
5. Укажите URL вашего фронтенда: `https://your-frontend-domain.com`
6. Сохраните полученный URL

---

## 5. ТЕСТИРОВАНИЕ

### 5.1. Локальное тестирование

```bash
# Запуск бэкенда
cd server
npm run dev

# Запуск фронтенда
cd ../client
npm run dev
```

### 5.2. Тестирование в Telegram

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку меню или команду `/start`
3. Проверьте работу всех функций

---

## 📦 Деплой

### Вариант 1: Vercel (Фронтенд) + Railway/Render (Бэкенд)

### Вариант 2: Netlify (Фронтенд) + Heroku (Бэкенд)

### Вариант 3: VPS (оба на одном сервере)

См. детальные инструкции в соответствующих разделах ниже.

