import { motion } from 'framer-motion';

interface MapElement {
  type: 'start' | 'checkpoint' | 'finish';
  x: number; // процент от левого края (0-100)
  y: number; // процент от верхнего края (0-100)
  icon?: string;
  text?: string;
  isActive?: boolean;
  completed?: boolean;
}

interface GameProgressMapProps {
  progress?: number; // текущий прогресс 0-100
  elements?: MapElement[];
  width?: string;
  height?: string;
}

const GameProgressMap = ({
  progress = 45,
  elements = [
    { type: 'start', x: 5, y: 50, icon: '🏁', completed: true },
    { type: 'checkpoint', x: 25, y: 40, icon: '📚', text: 'Учеба', completed: false },
    { type: 'checkpoint', x: 50, y: 60, icon: '💪', text: 'Спорт', completed: false },
    { type: 'checkpoint', x: 75, y: 45, icon: '💰', text: 'Финансы', completed: false },
    { type: 'finish', x: 95, y: 50, icon: '🏆', completed: false }
  ],
  width = '100%',
  height = '600px'
}: GameProgressMapProps) => {
  // Получаем размеры контейнера (будем использовать 1000x600 как базовые для SVG)
  const svgWidth = 1000;
  const svgHeight = 600;

  // Генерируем извилистый путь дороги через все элементы
  const generateRoadPath = () => {
    if (elements.length === 0) return '';
    
    const sortedElements = [...elements].sort((a, b) => a.x - b.x);
    
    // Конвертируем проценты в абсолютные координаты
    const convertToAbsolute = (x: number, y: number) => ({
      x: (x / 100) * svgWidth,
      y: (y / 100) * svgHeight
    });
    
    // Создаем плавный извилистый путь
    const first = convertToAbsolute(sortedElements[0].x, sortedElements[0].y);
    let path = `M ${first.x} ${first.y}`;
    
    for (let i = 1; i < sortedElements.length; i++) {
      const prev = convertToAbsolute(sortedElements[i - 1].x, sortedElements[i - 1].y);
      const curr = convertToAbsolute(sortedElements[i].x, sortedElements[i].y);
      
      // Создаем кривую Безье для плавного перехода
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  };

  const roadPath = generateRoadPath();

  // Вычисляем позицию машинки на дороге
  const getCarPosition = () => {
    if (elements.length === 0) return { x: 0, y: 50 };
    
    const sortedElements = [...elements].sort((a, b) => a.x - b.x);
    const progressPercent = progress / 100;
    const totalDistance = sortedElements.length - 1;
    const currentSegment = progressPercent * totalDistance;
    const segmentIndex = Math.floor(currentSegment);
    const segmentProgress = currentSegment - segmentIndex;
    
    if (segmentIndex >= sortedElements.length - 1) {
      const last = sortedElements[sortedElements.length - 1];
      return { x: last.x, y: last.y };
    }
    
    const start = sortedElements[segmentIndex];
    const end = sortedElements[segmentIndex + 1];
    
    // Линейная интерполяция между точками
    const x = start.x + (end.x - start.x) * segmentProgress;
    const y = start.y + (end.y - start.y) * segmentProgress;
    
    return { x, y };
  };

  const carPosition = getCarPosition();

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl"
      style={{ 
        width, 
        height,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* SVG дорога */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <path id="roadPath" d={roadPath} fill="none" />
        </defs>
        
        {/* Фоновая дорога (серая) */}
        <use
          href="#roadPath"
          stroke="#2D2D2D"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        
        {/* Прогресс дороги (цветная) */}
        <motion.use
          href="#roadPath"
          stroke="#4ade80"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* Элементы карты */}
      {elements.map((element, index) => (
        <MapElement
          key={index}
          type={element.type}
          x={element.x}
          y={element.y}
          icon={element.icon}
          text={element.text}
          isActive={element.isActive}
          completed={element.completed || (element.x <= carPosition.x && element.type !== 'finish')}
        />
      ))}

      {/* Машинка */}
      <Car x={carPosition.x} y={carPosition.y} />
    </div>
  );
};

// Компонент элемента карты
interface MapElementProps {
  type: 'start' | 'checkpoint' | 'finish';
  x: number;
  y: number;
  icon?: string;
  text?: string;
  isActive?: boolean;
  completed?: boolean;
}

const MapElement = ({ type, x, y, icon, text, isActive, completed }: MapElementProps) => {
  const getElementStyles = () => {
    switch (type) {
      case 'start':
        return {
          bg: completed ? 'bg-green-500' : 'bg-gray-400',
          size: 'w-12 h-12',
          border: 'border-4 border-white'
        };
      case 'checkpoint':
        return {
          bg: completed ? 'bg-blue-500' : isActive ? 'bg-yellow-500' : 'bg-gray-400',
          size: 'w-14 h-14',
          border: 'border-4 border-white'
        };
      case 'finish':
        return {
          bg: completed ? 'bg-purple-500' : 'bg-gray-400',
          size: 'w-16 h-16',
          border: 'border-4 border-white'
        };
    }
  };

  const styles = getElementStyles();

  return (
    <motion.div
      className="absolute z-10 flex flex-col items-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.2 : completed ? 1.1 : 1,
        opacity: 1
      }}
      transition={{ 
        delay: 0.2,
        type: 'spring',
        stiffness: 200
      }}
      whileHover={{ scale: 1.15 }}
    >
      {/* Иконка элемента */}
      <div className={`${styles.size} ${styles.bg} ${styles.border} rounded-full flex items-center justify-center shadow-lg`}>
        {icon && (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
      
      {/* Текст под элементом */}
      {text && (
        <motion.div
          className="mt-2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-xs font-medium text-text-light dark:text-text-dark whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
            {text}
          </span>
        </motion.div>
      )}
      
      {/* Индикатор завершения */}
      {completed && type !== 'start' && (
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Компонент машинки
interface CarProps {
  x: number;
  y: number;
}

const Car = ({ x, y }: CarProps) => {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ x: 0, y: 0 }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <motion.div
        className="w-12 h-12 bg-white rounded-lg shadow-xl flex items-center justify-center border-4 border-blue-500"
        whileHover={{ scale: 1.1 }}
        animate={{ 
          rotate: [0, -5, 5, -5, 0],
        }}
        transition={{ 
          rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
        }}
      >
        <span className="text-2xl">🚗</span>
      </motion.div>
    </motion.div>
  );
};

export default GameProgressMap;

