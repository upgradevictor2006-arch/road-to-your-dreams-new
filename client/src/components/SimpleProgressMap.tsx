import { motion } from 'framer-motion';

interface Checkpoint {
  id: number;
  name: string;
  km: number;
  completed: boolean;
}

interface SimpleProgressMapProps {
  currentKm?: number;
  totalKm?: number;
  checkpoints?: Checkpoint[];
}

const SimpleProgressMap = ({ 
  currentKm = 45, 
  totalKm = 100, 
  checkpoints = [
    { id: 1, name: "Старт", km: 0, completed: true },
    { id: 2, name: "Чекпоинт 1", km: 25, completed: true },
    { id: 3, name: "Чекпоинт 2", km: 50, completed: false },
    { id: 4, name: "Чекпоинт 3", km: 75, completed: false },
    { id: 5, name: "Финиш", km: 100, completed: false }
  ]
}: SimpleProgressMapProps) => {
  const progress = (currentKm / totalKm) * 100;
  
  return (
    <div className="w-full bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Заголовок и прогресс */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Прогресс пути
        </h3>
        <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
      </div>
      
      {/* Основная линия прогресса */}
      <div className="relative mb-8">
        {/* Фон линии */}
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        
        {/* Заполненный прогресс */}
        <motion.div 
          className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary to-accent-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Текущая позиция - машинка */}
        <motion.div 
          className="absolute top-1/2 w-8 h-8 transform -translate-y-1/2 -translate-x-1/2 z-10"
          initial={{ left: '0%' }}
          animate={{ left: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="w-8 h-8 bg-white dark:bg-card-dark border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-lg">🚗</span>
          </div>
        </motion.div>
      </div>
      
      {/* Чекпоинты */}
      <div className="flex justify-between relative">
        {checkpoints.map((checkpoint, index) => {
          const isActive = currentKm >= checkpoint.km;
          
          return (
            <div key={checkpoint.id} className="flex flex-col items-center relative" style={{ flex: 1 }}>
              {/* Соединительная линия (кроме последнего) */}
              {index < checkpoints.length - 1 && (
                <div 
                  className={`absolute top-3 left-1/2 w-full h-0.5 -z-10 ${
                    isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
              
              {/* Точка чекпоинта */}
              <motion.div 
                className={`w-6 h-6 rounded-full border-4 mb-2 relative z-10 ${
                  checkpoint.completed 
                    ? 'bg-accent-green border-accent-green' 
                    : isActive
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-card-dark border-gray-300 dark:border-gray-600'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {checkpoint.completed && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                    ✓
                  </span>
                )}
              </motion.div>
              
              {/* Название чекпоинта */}
              <span className={`text-xs text-center max-w-[60px] ${
                checkpoint.completed || isActive
                  ? 'text-text-light dark:text-text-dark font-medium' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {checkpoint.name}
              </span>
              
              {/* Километраж */}
              <span className={`text-xs mt-1 ${
                checkpoint.completed || isActive
                  ? 'text-text-light/70 dark:text-text-dark/70' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {checkpoint.km}км
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Статистика */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            Пройдено: <strong className="text-primary">{currentKm}км</strong>
          </span>
          <span className="text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            Осталось: <strong className="text-primary">{totalKm - currentKm}км</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleProgressMap;

