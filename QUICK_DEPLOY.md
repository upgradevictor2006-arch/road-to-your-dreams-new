# ⚡ Быстрый деплой - 5 минут

## 🎯 Самый простой способ (Vercel + Railway)

### 1️⃣ Подготовка (2 минуты)

```bash
# В корне проекта
cd "c:\Users\upgra\Downloads\stitch_welcome_screen (1)\stitch_welcome_screen"

# Инициализируйте Git
git init
git add .
git commit -m "Ready for deploy"

# Создайте репозиторий на GitHub и выполните:
# git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
# git push -u origin main
```

### 2️⃣ Деплой бэкенда на Railway (2 минуты)

1. Откройте https://railway.app
2. Войдите через GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Выберите репозиторий
5. В настройках:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
6. Добавьте переменные:
   ```
   PORT=3000
   NODE_ENV=production
   TELEGRAM_BOT_TOKEN=8296730382:AAFubPJjekcbZvQTAcnYUt0NR_3vRdfjQjg
   JWT_SECRET=your_secret_key_here
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
7. Скопируйте URL бэкенда (например: `https://your-app.railway.app`)

### 3️⃣ Деплой фронтенда на Vercel (1 минута)

1. Откройте https://vercel.com
2. Войдите через GitHub
3. "Add New Project" → выберите репозиторий
4. Настройки:
   - **Root Directory:** `client`
   - **Framework:** Vite
5. Добавьте переменные:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_TELEGRAM_BOT_TOKEN=8296730382:AAFubPJjekcbZvQTAcnYUt0NR_3vRdfjQjg
   ```
6. Нажмите "Deploy"
7. Скопируйте URL фронтенда

### 4️⃣ Обновите CORS в Railway

В Railway → Variables → обновите:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

### 5️⃣ Настройте Telegram

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/myapps` → выберите приложение
3. "Edit Web App URL" → вставьте URL фронтенда

---

## ✅ Готово!

Ваше приложение теперь доступно в Telegram! 🎉

---

**Подробная инструкция в файле DEPLOY_NOW.md**


