import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SimpleProgressMap from '../components/SimpleProgressMap';
import { goalsStorage } from '../services/storage';

interface Checkpoint {
  label: string;
  description: string;
  completed?: boolean;
}

interface Goal {
  id: string;
  title?: string;
  goalTitle?: string;
  progress: number;
  target?: string;
  category?: string;
  completed?: boolean;
  reward?: string;
  checkpoints?: Checkpoint[];
  dailyTask?: string;
  isCaravan?: boolean;
  caravanId?: string;
}

const GoalsListScreen = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);

  // Загружаем цели через storage service
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const savedGoals = await goalsStorage.getAll();
        setGoals(savedGoals);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      }
    };
    loadGoals();
  }, []);

  // Если целей нет, перенаправляем на экран создания первой цели
  // Но только если мы не на пути создания цели
  useEffect(() => {
    if (goals.length === 0 && !window.location.pathname.includes('/create-goal') && !window.location.pathname.includes('/create-dream-intro')) {
      navigate('/create-dream-intro', { replace: true });
    }
  }, [goals.length, navigate]);

  const handleAddGoal = () => {
    navigate('/create-goal/basic');
  };

  const handleGoalClick = (goalId: string) => {
    navigate(`/map?goal=${goalId}`);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex sticky top-0 z-10 items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pt-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Мои цели
        </h1>
        <div className="flex w-12 items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddGoal}
            className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-text-light dark:text-text-dark"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </motion.button>
        </div>
      </header>

      <main className="flex flex-col gap-4 p-4">
        {goals.map((goal, index) => {
          // Преобразуем цель в формат для SimpleProgressMap
          const checkpoints = goal.checkpoints || [];
          const totalKm = 100; // Общий прогресс в процентах
          const currentKm = goal.progress || 0;
          
          // Создаем чекпоинты для карты прогресса
          const mapCheckpoints = checkpoints.length > 0 
            ? checkpoints.map((cp: any, idx: number) => ({
                id: idx + 1,
                name: cp.label || `Чекпоинт ${idx + 1}`,
                km: Math.round((idx + 1) * (100 / (checkpoints.length + 1))),
                completed: goal.progress >= ((idx + 1) / (checkpoints.length + 1)) * 100
              }))
            : [
                { id: 1, name: "Старт", km: 0, completed: true },
                { id: 2, name: "Финиш", km: 100, completed: goal.progress >= 100 }
              ];
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleGoalClick(goal.id)}
              className={`flex flex-col gap-4 rounded-lg p-4 shadow-sm cursor-pointer border-2 transition-all ${
                goal.isCaravan
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-400 dark:border-blue-600 shadow-blue-200/50 dark:shadow-blue-900/30'
                  : 'bg-card-light dark:bg-card-dark border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Заголовок цели */}
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="text-lg font-bold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {goal.goalTitle || goal.title}
                  </h3>
                  {goal.isCaravan && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="material-symbols-outlined text-sm">groups</span>
                      Общая цель
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {goal.reward && (
                    <>
                      <p className="text-sm font-medium text-primary">{goal.reward}</p>
                      <span className="material-symbols-outlined text-accent-orange fill-icon">star</span>
                    </>
                  )}
                </div>
              </div>

              {/* Упрощенная карта прогресса */}
              <SimpleProgressMap
                currentKm={currentKm}
                totalKm={totalKm}
                checkpoints={mapCheckpoints}
              />

              {/* Дополнительная информация */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium ${
                      goal.completed ? 'text-accent-green' : 'text-primary'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {goal.completed ? 'Завершено!' : `${Math.round(goal.progress || 0)}% выполнено`}
                  </p>
                  {goal.isCaravan && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">people</span>
                      Общая
                    </span>
                  )}
                </div>
                {goal.category && (
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      goal.completed 
                        ? 'bg-accent-green/10 text-accent-green' 
                        : 'bg-primary/10 text-primary'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {goal.category}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </main>
    </div>
  );
};

export default GoalsListScreen;

