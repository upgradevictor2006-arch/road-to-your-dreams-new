import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import goalsRoutes from './routes/goals';
import usersRoutes from './routes/users';
import caravansRoutes from './routes/caravans';
import notificationsRoutes from './routes/notifications';
import { verifyTelegramWebAppData } from './middleware/telegramAuth';
import './bot'; // Инициализируем Telegram бота

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Road To Your Dream API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      goals: '/api/goals',
      users: '/api/users',
      caravans: '/api/caravans'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/goals', goalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/caravans', caravansRoutes);
app.use('/api/notifications', notificationsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

