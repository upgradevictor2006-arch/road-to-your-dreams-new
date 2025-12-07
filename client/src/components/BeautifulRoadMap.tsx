import { motion } from 'framer-motion';

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

interface BeautifulRoadMapProps {
  progress?: number;
  checkpoints?: Checkpoint[];
  goalTitle?: string;
  dailyTask?: string;
  dailyTaskNumber?: number;
  completedDailyTasks?: DailyTask[];
}

const BeautifulRoadMap = ({
  progress = 0,
  checkpoints = [],
  goalTitle = 'Финальная цель',
  dailyTask = '',
  dailyTaskNumber,
  completedDailyTasks = []
}: BeautifulRoadMapProps) => {
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
        label: `Задача #${task.number || completedDailyTasks.indexOf(task) + 1}`,
        description: task.task,
        completed: task.completed,
        number: task.number,
        date: task.date
      });
    });

    if (dailyTask) {
      allPoints.push({
        type: 'daily',
        label: `Задача #${dailyTaskNumber || completedDailyTasks.length + 1}`,
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
          label: `Задача #${task.number || completedDailyTasks.indexOf(task) + 1}`,
          description: task.task,
          completed: task.completed,
          number: task.number,
          date: task.date
        });
      });

      if (dailyTask) {
        allPoints.push({
          type: 'daily',
          label: `Задача #${dailyTaskNumber || completedDailyTasks.length + 1}`,
          description: dailyTask,
          completed: false,
          number: dailyTaskNumber
        });
      }
    }
  });

  // Финал
  allPoints.push({ type: 'finish', label: goalTitle, completed: progress >= 100 });

  // Вычисляем позицию машинки
  const progressPercent = progress / 100;
  const totalSegments = allPoints.length - 1;
  const currentSegment = progressPercent * totalSegments;
  const segmentIndex = Math.min(Math.floor(currentSegment), totalSegments - 1);
  const segmentProgress = currentSegment - segmentIndex;

  // Вычисляем позицию на извилистой дороге
  const getPointPosition = (index: number) => {
    const totalPoints = allPoints.length;
    const normalizedIndex = index / (totalPoints - 1);
    
    // Создаем извилистую дорогу с помощью синусоиды
    const baseX = normalizedIndex * 100;
    const waveY = Math.sin(normalizedIndex * Math.PI * 2) * 15;
    const y = 50 + waveY;
    
    return { x: baseX, y };
  };

  const startPos = getPointPosition(segmentIndex);
  const endPos = getPointPosition(segmentIndex + 1);
  const carX = startPos.x + (endPos.x - startPos.x) * segmentProgress;
  const carY = startPos.y + (endPos.y - startPos.y) * segmentProgress;

  // Генерируем SVG путь для дороги
  const generateRoadPath = () => {
    if (allPoints.length < 2) return '';
    
    let path = '';
    allPoints.forEach((_, idx) => {
      const pos = getPointPosition(idx);
      if (idx === 0) {
        path += `M ${pos.x} ${pos.y}`;
      } else {
        const prevPos = getPointPosition(idx - 1);
        // Плавная кривая Безье
        const cp1x = prevPos.x + (pos.x - prevPos.x) * 0.5;
        const cp1y = prevPos.y;
        const cp2x = prevPos.x + (pos.x - prevPos.x) * 0.5;
        const cp2y = pos.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pos.x} ${pos.y}`;
      }
    });
    return path;
  };

  const roadPath = generateRoadPath();
  const progressIndex = Math.floor(progressPercent * (allPoints.length - 1));

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-inner">
      {/* SVG для дороги */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <path id="roadPath" d={roadPath} fill="none" />
        </defs>

        {/* Фоновая дорога */}
        <use
          href="#roadPath"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />

        {/* Пройденная часть дороги */}
        {progressIndex > 0 && (
          <motion.path
            d={(() => {
              let path = '';
              for (let i = 0; i <= progressIndex; i++) {
                const pos = getPointPosition(i);
                if (i === 0) {
                  path += `M ${pos.x} ${pos.y}`;
                } else {
                  const prevPos = getPointPosition(i - 1);
                  const cp1x = prevPos.x + (pos.x - prevPos.x) * 0.5;
                  const cp1y = prevPos.y;
                  const cp2x = prevPos.x + (pos.x - prevPos.x) * 0.5;
                  const cp2y = pos.y;
                  path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pos.x} ${pos.y}`;
                }
              }
              return path;
            })()}
            stroke="#10b981"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </svg>

      {/* Элементы карты */}
      {allPoints.map((point, idx) => {
        const pos = getPointPosition(idx);
        const isCompleted = point.completed || idx <= progressIndex;
        const isCurrent = idx === progressIndex;

        return (
          <motion.div
            key={idx}
            className="absolute z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isCurrent ? 1.15 : isCompleted ? 1.05 : 1,
              opacity: 1
            }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
          >
            <div
              className={`rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800 transition-all ${
                point.type === 'start'
                  ? 'w-14 h-14 bg-gradient-to-br from-green-500 to-green-600'
                  : point.type === 'finish'
                  ? 'w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'
                  : point.type === 'checkpoint'
                  ? `w-14 h-14 ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`
                  : `w-12 h-12 ${isCompleted ? 'bg-gradient-to-br from-green-400 to-green-500' : point.completed === false ? 'bg-gradient-to-br from-red-400 to-red-500' : 'bg-gray-300 dark:bg-gray-600'}`
              }`}
            >
              {point.type === 'start' && <span className="text-xl">🏁</span>}
              {point.type === 'finish' && <span className="text-2xl">🏆</span>}
              {point.type === 'checkpoint' && <span className="text-lg">📍</span>}
              {point.type === 'daily' && <span className="text-sm">✓</span>}
            </div>

            {/* Подпись */}
            <motion.div
              className="mt-2 px-3 py-1.5 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 min-w-[90px]"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
            >
              <div className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {point.label}
              </div>
              {point.description && (
                <div className="text-[10px] text-center text-gray-600 dark:text-gray-400 mt-1 max-w-[90px] line-clamp-2">
                  {point.description}
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Машинка */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `${carX}%`,
          top: `${carY}%`,
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
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 relative"
          animate={{
            y: [0, -3, 0]
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
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-200 rounded-full blur-sm opacity-80"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BeautifulRoadMap;

