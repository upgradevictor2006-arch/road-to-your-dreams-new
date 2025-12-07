import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface InteractiveGameMapProps {
  progress?: number; // 0-100
  checkpoints?: Checkpoint[];
  goalTitle?: string;
  dailyTask?: string;
  dailyTaskNumber?: number;
  dailyTaskDate?: string;
  completedDailyTasks?: DailyTask[];
  onCheckpointClick?: (index: number) => void;
  onTaskClick?: () => void;
}

const InteractiveGameMap = ({
  progress = 0,
  checkpoints = [],
  goalTitle = 'Финальная цель',
  dailyTask = '',
  dailyTaskNumber,
  dailyTaskDate,
  completedDailyTasks = [],
  onCheckpointClick,
  onTaskClick
}: InteractiveGameMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [carAngle, setCarAngle] = useState(0);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);

  // Создаем массив всех точек на карте
  const allPoints: Array<{
    type: 'start' | 'daily' | 'checkpoint' | 'finish';
    label: string;
    description?: string;
    completed?: boolean;
    x: number;
    y: number;
    index: number;
  }> = [];

  // Стартовая точка
  allPoints.push({
    type: 'start',
    label: 'Старт',
    completed: true,
    x: 50,
    y: 85,
    index: 0
  });

  // Добавляем ежедневные задачи до первого чекпоинта
  const lastCompletedCheckpointIndex = checkpoints.findIndex(cp => !cp.completed);
  const hasUncompletedCheckpoints = lastCompletedCheckpointIndex !== -1;

  if (!hasUncompletedCheckpoints || lastCompletedCheckpointIndex === 0) {
    // Добавляем выполненные задачи
    completedDailyTasks.forEach((task, idx) => {
      const angle = (idx + 1) * (Math.PI / (completedDailyTasks.length + 2));
      allPoints.push({
        type: 'daily',
        label: `Задача #${task.number || idx + 1}`,
        description: task.task,
        completed: task.completed,
        x: 50 + Math.cos(angle) * 15,
        y: 85 + Math.sin(angle) * 15,
        index: allPoints.length
      });
    });

    // Добавляем текущую задачу
    if (dailyTask) {
      const angle = (completedDailyTasks.length + 1) * (Math.PI / (completedDailyTasks.length + 3));
      allPoints.push({
        type: 'daily',
        label: `Задача #${dailyTaskNumber || completedDailyTasks.length + 1}`,
        description: dailyTask,
        completed: false,
        x: 50 + Math.cos(angle) * 15,
        y: 85 + Math.sin(angle) * 15,
        index: allPoints.length
      });
    }
  }

  // Добавляем чекпоинты
  checkpoints.forEach((cp, idx) => {
    const progressPercent = (idx + 1) / (checkpoints.length + 1);
    const angle = progressPercent * Math.PI * 0.8 - Math.PI * 0.4; // Извилистая дорога
    const radius = 20 + idx * 8;
    
    allPoints.push({
      type: 'checkpoint',
      label: cp.label,
      description: cp.description,
      completed: cp.completed || false,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      index: allPoints.length
    });

    // После выполненного чекпоинта добавляем задачи
    if (cp.completed && idx === lastCompletedCheckpointIndex - 1) {
      completedDailyTasks.forEach((task, taskIdx) => {
        const taskAngle = angle + (taskIdx + 1) * 0.2;
        allPoints.push({
          type: 'daily',
          label: `Задача #${task.number || taskIdx + 1}`,
          description: task.task,
          completed: task.completed,
          x: 50 + Math.cos(taskAngle) * (radius + 5),
          y: 50 + Math.sin(taskAngle) * (radius + 5),
          index: allPoints.length
        });
      });
    }
  });

  // Финальная точка
  allPoints.push({
    type: 'finish',
    label: goalTitle,
    completed: progress >= 100,
    x: 50,
    y: 15,
    index: allPoints.length
  });

  // Вычисляем позицию машинки на основе прогресса
  useEffect(() => {
    if (allPoints.length === 0) return;

    const progressPercent = progress / 100;
    const totalDistance = allPoints.length - 1;
    const currentSegment = progressPercent * totalDistance;
    const segmentIndex = Math.floor(currentSegment);
    const segmentProgress = currentSegment - segmentIndex;

    if (segmentIndex >= allPoints.length - 1) {
      const last = allPoints[allPoints.length - 1];
      setCarPosition({ x: last.x, y: last.y });
      return;
    }

    const start = allPoints[segmentIndex];
    const end = allPoints[segmentIndex + 1];

    // Интерполяция позиции
    const x = start.x + (end.x - start.x) * segmentProgress;
    const y = start.y + (end.y - start.y) * segmentProgress;

    // Вычисляем угол движения
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setCarPosition({ x, y });
    setCarAngle(angle);
  }, [progress, allPoints.length]);

  // Рисуем дорогу на canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const width = canvas.width;
    const height = canvas.height;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Фон - небо и земля
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.7, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.7);

    const groundGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Рисуем дорогу
    ctx.strokeStyle = '#2D2D2D';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    allPoints.forEach((point, idx) => {
      const x = (point.x / 100) * width;
      const y = (point.y / 100) * height;

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        // Плавная кривая Безье
        const prevPoint = allPoints[idx - 1];
        const prevX = (prevPoint.x / 100) * width;
        const prevY = (prevPoint.y / 100) * height;

        const cp1x = prevX + (x - prevX) * 0.5;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) * 0.5;
        const cp2y = y;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }
    });
    ctx.stroke();

    // Рисуем пройденную часть дороги (зеленая)
    const progressIndex = Math.floor((progress / 100) * (allPoints.length - 1));
    if (progressIndex > 0) {
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 10;
      ctx.beginPath();
      allPoints.slice(0, progressIndex + 1).forEach((point, idx) => {
        const x = (point.x / 100) * width;
        const y = (point.y / 100) * height;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevPoint = allPoints[idx - 1];
          const prevX = (prevPoint.x / 100) * width;
          const prevY = (prevPoint.y / 100) * height;

          const cp1x = prevX + (x - prevX) * 0.5;
          const cp1y = prevY;
          const cp2x = prevX + (x - prevX) * 0.5;
          const cp2y = y;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
      });
      ctx.stroke();
    }
  }, [progress, allPoints]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-sky-200 to-green-200">
      {/* Canvas для дороги */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Элементы карты */}
      {allPoints.map((point, idx) => {
        const x = point.x;
        const y = point.y;
        const isCompleted = point.completed || (idx < Math.floor((progress / 100) * allPoints.length));
        const isActive = idx === Math.floor((progress / 100) * allPoints.length);

        return (
          <motion.div
            key={idx}
            className="absolute z-10 cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isActive ? 1.2 : isCompleted ? 1.1 : 1,
              opacity: 1
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedElement(idx);
              if (point.type === 'checkpoint' && onCheckpointClick) {
                onCheckpointClick(point.index);
              } else if (point.type === 'daily' && onTaskClick) {
                onTaskClick();
              }
            }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Иконка элемента */}
            <div
              className={`rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all ${
                point.type === 'start'
                  ? 'w-14 h-14 bg-green-500'
                  : point.type === 'finish'
                  ? 'w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500'
                  : point.type === 'checkpoint'
                  ? `w-14 h-14 ${isCompleted ? 'bg-blue-500' : 'bg-gray-400'}`
                  : `w-12 h-12 ${isCompleted ? 'bg-green-400' : point.completed === false ? 'bg-red-400' : 'bg-gray-300'}`
              }`}
            >
              {point.type === 'start' && <span className="text-2xl">🏁</span>}
              {point.type === 'finish' && <span className="text-3xl">🏆</span>}
              {point.type === 'checkpoint' && <span className="text-xl">📍</span>}
              {point.type === 'daily' && <span className="text-lg">📝</span>}
            </div>

            {/* Текст под элементом */}
            <motion.div
              className="mt-2 px-2 py-1 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {point.label}
              </div>
              {point.description && (
                <div className="text-[10px] text-center text-gray-600 dark:text-gray-400 mt-0.5 max-w-[80px] truncate">
                  {point.description}
                </div>
              )}
            </motion.div>

            {/* Индикатор завершения */}
            {isCompleted && point.type !== 'start' && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <span className="text-white text-[10px]">✓</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Машинка */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `${carPosition.x}%`,
          top: `${carPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${carAngle}deg)`
        }}
        animate={{
          x: 0,
          y: 0,
          rotate: carAngle
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15
        }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl flex items-center justify-center border-4 border-white relative"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            y: {
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <span className="text-3xl">🚗</span>
          {/* Свет фар */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full blur-sm opacity-75"></div>
        </motion.div>
      </motion.div>

      {/* Облака для атмосферы */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-0 opacity-30"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 5}%`,
          }}
          animate={{
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div className="text-4xl">☁️</div>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveGameMap;

