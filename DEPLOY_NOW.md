# 🚀 Пошаговая инструкция по деплою

## 📋 Вариант 1: Vercel (Фронтенд) + Railway (Бэкенд) - РЕКОМЕНДУЕТСЯ

### ШАГ 1: Подготовка проекта

1. **Создайте аккаунты:**
   - [Vercel](https://vercel.com) - для фронтенда (бесплатно)
   - [Railway](https://railway.app) - для бэкенда (бесплатно с ограничениями)

2. **Установите Git (если еще не установлен):**
   ```bash
   # Проверьте, установлен ли Git
   git --version
   ```

3. **Инициализируйте Git репозиторий:**
   ```bash
   cd "c:\Users\upgra\Downloads\stitch_welcome_screen (1)\stitch_welcome_screen"
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Создайте репозиторий на GitHub:**
   - Откройте [GitHub](https://github.com)
   - Создайте новый репозиторий (New Repository)
   - НЕ добавляйте README, .gitignore или лицензию
   - Скопируйте URL репозитория

5. **Подключите локальный репозиторий к GitHub:**
   ```bash
   git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
   git branch -M main
   git push -u origin main
   ```

---

### ШАГ 2: Деплой бэкенда на Railway

1. **Зарегистрируйтесь на Railway:**
   - Откройте https://railway.app
   - Войдите через GitHub

2. **Создайте новый проект:**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий
   - Выберите папку `server` (Root Directory: `server`)

3. **Настройте переменные окружения:**
   - В настройках проекта найдите "Variables"
   - Добавьте следующие переменные:
     ```
     PORT=3000
     NODE_ENV=production
     TELEGRAM_BOT_TOKEN=8296730382:AAFubPJjekcbZvQTAcnYUt0NR_3vRdfjQjg
     JWT_SECRET=ваш_секретный_ключ_для_продакшена
     CORS_ORIGIN=https://ваш-фронтенд.vercel.app
     ```
   - **ВАЖНО:** `CORS_ORIGIN` пока оставьте пустым, обновим после деплоя фронтенда

4. **Настройте деплой:**
   - Railway автоматически определит Node.js проект
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Получите URL бэкенда:**
   - После деплоя Railway даст вам URL (например: `https://your-app.railway.app`)
   - Скопируйте этот URL

---

### ШАГ 3: Деплой фронтенда на Vercel

1. **Зарегистрируйтесь на Vercel:**
   - Откройте https://vercel.com
   - Войдите через GitHub

2. **Создайте новый проект:**
   - Нажмите "Add New Project"
   - Выберите ваш репозиторий
   - Настройте проект:
     - **Framework Preset:** Vite
     - **Root Directory:** `client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Добавьте переменные окружения:**
   - В настройках проекта найдите "Environment Variables"
   - Добавьте:
     ```
     VITE_API_URL=https://ваш-бэкенд.railway.app/api
     VITE_TELEGRAM_BOT_TOKEN=8296730382:AAFubPJjekcbZvQTAcnYUt0NR_3vRdfjQjg
     ```
   - Используйте URL бэкенда из Railway

4. **Деплой:**
   - Нажмите "Deploy"
   - Дождитесь завершения деплоя
   - Скопируйте URL фронтенда (например: `https://your-app.vercel.app`)

---

### ШАГ 4: Обновление CORS в бэкенде

1. **Вернитесь в Railway:**
   - Откройте настройки проекта
   - Перейдите в "Variables"
   - Обновите `CORS_ORIGIN`:
     ```
     CORS_ORIGIN=https://ваш-фронтенд.vercel.app
     ```
   - Railway автоматически перезапустит сервер

---

### ШАГ 5: Настройка Telegram Mini App

1. **Откройте [@BotFather](https://t.me/BotFather) в Telegram**

2. **Отправьте команду:**
   ```
   /myapps
   ```

3. **Выберите ваше приложение**

4. **Выберите "Edit Web App URL"**

5. **Введите URL вашего фронтенда:**
   ```
   https://ваш-фронтенд.vercel.app
   ```

6. **Готово!** Теперь ваше приложение доступно в Telegram

---

## 📋 Вариант 2: Netlify (Фронтенд) + Render (Бэкенд)

### Бэкенд на Render:

1. Зарегистрируйтесь на https://render.com
2. Создайте новый "Web Service"
3. Подключите GitHub репозиторий
4. Настройки:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Добавьте переменные окружения (как в Railway)

### Фронтенд на Netlify:

1. Зарегистрируйтесь на https://netlify.com
2. Создайте новый сайт из Git
3. Настройки:
   - **Base directory:** `client`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `client/dist`
4. Добавьте переменные окружения

---

## 📋 Вариант 3: VPS (оба на одном сервере)

### Требования:
- VPS с Ubuntu/Debian
- Доступ по SSH
- Домен (опционально, можно использовать IP)

### Шаги:

1. **Подключитесь к серверу:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Установите Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Установите Nginx:**
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

4. **Установите PM2:**
   ```bash
   sudo npm install -g pm2
   ```

5. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/ваш-username/ваш-репозиторий.git
   cd ваш-репозиторий
   ```

6. **Настройте бэкенд:**
   ```bash
   cd server
   npm install
   npm run build
   # Создайте .env файл
   nano .env
   # Добавьте все переменные окружения
   ```

7. **Запустите бэкенд с PM2:**
   ```bash
   pm2 start dist/index.js --name "road-to-dream-api"
   pm2 save
   pm2 startup
   ```

8. **Соберите фронтенд:**
   ```bash
   cd ../client
   npm install
   # Создайте .env.production
   nano .env.production
   # Добавьте VITE_API_URL=http://your-server-ip:3000/api
   npm run build
   ```

9. **Настройте Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/road-to-dream
   ```
   
   Добавьте конфигурацию:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # или your-server-ip

       # Frontend
       location / {
           root /home/user/ваш-репозиторий/client/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Активируйте конфигурацию:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/road-to-dream /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

11. **Настройте SSL (Let's Encrypt):**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

## ✅ Чеклист после деплоя:

- [ ] Бэкенд доступен по URL
- [ ] Фронтенд доступен по URL
- [ ] API отвечает на запросы
- [ ] CORS настроен правильно
- [ ] Telegram Web App URL обновлен
- [ ] Приложение работает в Telegram

---

## 🎯 Рекомендация:

**Используйте Вариант 1 (Vercel + Railway)** - это самый простой и быстрый способ!

---

**Готово к деплою! 🚀**


