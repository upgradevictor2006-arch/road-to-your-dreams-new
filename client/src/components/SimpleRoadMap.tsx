import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Checkpoint {
  label: string;
  description?: string;
  completed?: boolean;
}

interface DailyTask {
  task: string;
  completed: boolean;
  number?: number;
  date?: string;
}

interface SimpleRoadMapProps {
  progress?: number;
  checkpoints?: Checkpoint[];
  goalTitle?: string;
  dailyTask?: string;
  dailyTaskNumber?: number;
  completedDailyTasks?: DailyTask[];
}

const SimpleRoadMap = ({
  progress = 0,
  checkpoints = [],
  goalTitle = 'Финальная цель',
  dailyTask = '',
  dailyTaskNumber,
  completedDailyTasks = []
}: SimpleRoadMapProps) => {
  const [carPosition, setCarPosition] = useState(0);

  // Создаем упорядоченный список всех точек
  const allPoints: Array<{
    type: 'start' | 'daily' | 'checkpoint' | 'finish';
    label: string;
    description?: string;
    completed?: boolean;
    number?: number;
    date?: string;
  }> = [];

  // Старт
  allPoints.push({ type: 'start', label: 'Старт', completed: true });

  // Находим последний выполненный чекпоинт
  const lastCompletedIndex = checkpoints.findIndex(cp => !cp.completed);
  const hasUncompleted = lastCompletedIndex !== -1;

  // Добавляем задачи до первого чекпоинта
  if (!hasUncompleted || lastCompletedIndex === 0) {
    completedDailyTasks.forEach((task) => {
      allPoints.push({
        type: 'daily',
        label: `#${task.number || completedDailyTasks.indexOf(task) + 1}`,
        description: task.task,
        completed: task.completed,
        number: task.number,
        date: task.date
      });
    });

    if (dailyTask) {
      allPoints.push({
        type: 'daily',
        label: `#${dailyTaskNumber || completedDailyTasks.length + 1}`,
        description: dailyTask,
        completed: false,
        number: dailyTaskNumber
      });
    }
  }

  // Добавляем чекпоинты
  checkpoints.forEach((cp, idx) => {
    allPoints.push({
      type: 'checkpoint',
      label: cp.label,
      description: cp.description,
      completed: cp.completed || false
    });

    // После выполненного чекпоинта добавляем задачи
    if (cp.completed && idx === lastCompletedIndex - 1) {
      completedDailyTasks.forEach((task) => {
        allPoints.push({
          type: 'daily',
          label: `#${task.number || completedDailyTasks.indexOf(task) + 1}`,
          description: task.task,
          completed: task.completed,
          number: task.number,
          date: task.date
        });
      });

      if (dailyTask) {
        allPoints.push({
          type: 'daily',
          label: `#${dailyTaskNumber || completedDailyTasks.length + 1}`,
          description: dailyTask,
          completed: false,
          number: dailyTaskNumber
        });
      }
    }
  });

  // Финал
  allPoints.push({ type: 'finish', label: goalTitle, completed: progress >= 100 });

  // Вычисляем позицию машинки в процентах
  useEffect(() => {
    const progressPercent = progress / 100;
    const totalPoints = allPoints.length - 1;
    const currentPoint = progressPercent * totalPoints;
    const pointIndex = Math.floor(currentPoint);
    const pointProgress = currentPoint - pointIndex;

    // Каждая точка занимает равную часть (100% / количество точек)
    const pointWidth = 100 / totalPoints;
    const position = (pointIndex * pointWidth) + (pointProgress * pointWidth);

    setCarPosition(Math.min(position, 100));
  }, [progress, allPoints.length]);

  const totalWidth = Math.max(allPoints.length * 250, 1200); // Минимальная ширина для каждого элемента

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-x-auto overflow-y-hidden bg-gradient-to-b from-sky-100 to-emerald-50 dark:from-slate-900 dark:to-slate-800 shadow-inner">
      {/* Подсказка для прокрутки */}
      {allPoints.length > 5 && (
        <div className="absolute top-2 right-2 z-30 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full text-xs text-gray-600 dark:text-gray-400 backdrop-blur-sm">
          ← Прокрутите для просмотра →
        </div>
      )}
      {/* Контейнер с дорогой */}
      <div className="relative h-full" style={{ minWidth: `${totalWidth}px` }}>
        {/* Горизонтальная дорога - более толстая и заметная */}
        <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-gray-400 dark:bg-gray-700 rounded-full shadow-inner border-2 border-gray-500/30 dark:border-gray-600/30">
          {/* Разметка дороги (пунктир) */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-yellow-300/50"></div>
          
          {/* Пройденная часть дороги */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${carPosition}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Элементы на дороге */}
        {allPoints.map((point, idx) => {
          const position = (idx / (allPoints.length - 1)) * 100;
          const isCompleted = point.completed || idx < Math.floor((progress / 100) * (allPoints.length - 1));
          const isCurrent = idx === Math.floor((progress / 100) * (allPoints.length - 1));

          return (
            <motion.div
              key={idx}
              className="absolute top-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${position}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isCurrent ? 1.2 : isCompleted ? 1.1 : 1,
                opacity: 1
              }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200 }}
            >
              {/* Иконка элемента */}
              <div
                className={`rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800 transition-all ${
                  point.type === 'start'
                    ? 'w-16 h-16 bg-gradient-to-br from-green-500 to-green-600'
                    : point.type === 'finish'
                    ? 'w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'
                    : point.type === 'checkpoint'
                    ? `w-16 h-16 ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`
                    : `w-14 h-14 ${isCompleted ? 'bg-gradient-to-br from-green-400 to-green-500' : point.completed === false ? 'bg-gradient-to-br from-red-400 to-red-500' : 'bg-gray-300 dark:bg-gray-600'}`
                }`}
              >
                {point.type === 'start' && <span className="text-2xl">🏁</span>}
                {point.type === 'finish' && <span className="text-3xl">🏆</span>}
                {point.type === 'checkpoint' && <span className="text-xl">📍</span>}
                {point.type === 'daily' && (
                  <span className="text-sm font-bold text-white">{point.label}</span>
                )}
              </div>

              {/* Подпись под элементом */}
              <motion.div
                className="mt-4 px-3 py-2 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-sm border-2 border-gray-200/70 dark:border-gray-700/70 min-w-[140px] max-w-[180px]"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.2 }}
              >
                <div className="text-sm font-bold text-center text-gray-800 dark:text-gray-200 mb-1">
                  {point.type === 'daily' ? `Задача ${point.label}` : point.label}
                </div>
                {point.description && (
                  <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">
                    {point.description}
                  </div>
                )}
                {point.date && (
                  <div className="text-[10px] text-center text-gray-500 dark:text-gray-500 mt-1.5 font-medium">
                    {new Date(point.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </motion.div>

              {/* Индикатор завершения */}
              {isCompleted && point.type !== 'start' && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.3, type: 'spring' }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Машинка */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${carPosition}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            x: 0,
            y: 0
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 relative"
            animate={{
              y: [0, -4, 0]
            }}
            transition={{
              y: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
          >
            <span className="text-3xl">🚗</span>
            {/* Свет фар */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-200 rounded-full blur-sm opacity-90"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleRoadMap;

