# ⚡ Быстрый старт - Команды

## 🚀 Локальный запуск (разработка)

### 1. Установка зависимостей

```bash
# Бэкенд
cd server
npm install

# Фронтенд
cd ../client
npm install
```

### 2. Настройка переменных окружения

**server/.env:**
```bash
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_bot_token_here
JWT_SECRET=dev_secret_key
CORS_ORIGIN=http://localhost:5173
```

**client/.env:**
```bash
VITE_API_URL=http://localhost:3000/api
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 3. Запуск

**Терминал 1 (Бэкенд):**
```bash
cd server
npm run dev
```

**Терминал 2 (Фронтенд):**
```bash
cd client
npm run dev
```

### 4. Откройте в браузере

- Фронтенд: http://localhost:5173
- Бэкенд API: http://localhost:3000/health

---

## 📦 Сборка для продакшена

### Бэкенд
```bash
cd server
npm run build
npm start
```

### Фронтенд
```bash
cd client
npm run build
# Файлы будут в client/dist/
```

---

## 🔧 Полезные команды

### Проверка работы API
```bash
curl http://localhost:3000/health
```

### Проверка переменных окружения
```bash
# Бэкенд
cd server
node -e "require('dotenv').config(); console.log(process.env.TELEGRAM_BOT_TOKEN)"

# Фронтенд
cd client
node -e "console.log(import.meta.env.VITE_API_URL)"
```

---

## 🐳 Docker (опционально)

### Создайте Dockerfile для бэкенда

**server/Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Запуск с Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - ./server/.env

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
```

```bash
docker-compose up -d
```

