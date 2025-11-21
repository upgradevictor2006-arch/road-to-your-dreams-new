import { motion } from 'framer-motion';

interface UltraMinimalProgressProps {
  progress?: number;
}

const UltraMinimalProgress = ({ progress = 45 }: UltraMinimalProgressProps) => {
  return (
    <div className="w-full p-6 space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h3 className="text-lg font-normal text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Прогресс
        </h3>
      </div>

      {/* Основной прогресс-бар */}
      <div className="space-y-2">
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-text-light dark:bg-text-dark rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        
        {/* Проценты */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 dark:text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>0%</span>
          <span className="font-medium text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            {progress}%
          </span>
          <span className="text-gray-400 dark:text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>100%</span>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="text-center space-y-1">
        <div className="text-2xl font-light text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          {progress}/100
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          километров пройдено
        </div>
      </div>
    </div>
  );
};

export default UltraMinimalProgress;


