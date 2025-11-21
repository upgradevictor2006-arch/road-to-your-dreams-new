import { motion } from 'framer-motion';

interface Stage {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface VerticalProgressRoadmapProps {
  currentStage?: number;
  stages?: Stage[];
}

const VerticalProgressRoadmap = ({ 
  currentStage = 2,
  stages = [
    { id: 1, title: "Начало пути", description: "Основы и введение", completed: true },
    { id: 2, title: "Активное развитие", description: "Практика и углубление", completed: false },
    { id: 3, title: "Продвинутый уровень", description: "Сложные задачи", completed: false },
    { id: 4, title: "Мастерство", description: "Экспертное владение", completed: false }
  ]
}: VerticalProgressRoadmapProps) => {
  const getStageStatus = (stageId: number) => {
    if (stageId < currentStage) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'upcoming';
  };

  const getProgressPercentage = () => {
    const completedStages = stages.filter(s => s.completed || s.id < currentStage).length;
    return Math.round((completedStages / stages.length) * 100);
  };

  // Вычисляем минимальную высоту для дороги (больше расстояния между чекпоинтами)
  const minHeight = stages.length * 200; // 200px между каждым этапом

  return (
    <div className="w-full pb-8" style={{ minHeight: `${minHeight}px` }}>
      {/* Вертикальная линия прогресса - снизу вверх */}
      <div className="relative flex flex-col items-center justify-end" style={{ minHeight: `${minHeight}px` }}>
        {/* Центральная вертикальная линия - начинается снизу */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700">
          {/* Заполненная часть линии - снизу вверх */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-text-light dark:bg-text-dark origin-bottom"
            initial={{ scaleY: 0 }}
            animate={{ 
              scaleY: getProgressPercentage() / 100 
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Этапы - снизу вверх, все на центральной линии */}
        <div className="relative w-full" style={{ minHeight: `${minHeight}px` }}>
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';

            // Позиционируем снизу вверх: первый этап внизу, последний вверху
            const reversedIndex = stages.length - 1 - index;
            const bottomPosition = 50 + (reversedIndex * 200); // 200px между этапами, начинаем с 50px от низа

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 w-full"
                style={{ bottom: `${bottomPosition}px` }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Центральная точка на линии */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className={`w-5 h-5 rounded-full border-4 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent-green border-accent-green shadow-lg'
                          : isCurrent
                          ? 'bg-primary border-primary shadow-lg scale-125'
                          : 'bg-white dark:bg-card-dark border-gray-300 dark:border-gray-600'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: isCurrent ? 1.25 : 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                    >
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="text-white text-[10px]">✓</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Карточка с описанием - справа от точки */}
                  <div className="absolute left-1/2 ml-8 w-64">
                    <motion.div
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isCompleted
                          ? 'bg-accent-green/5 border-accent-green/20'
                          : isCurrent
                          ? 'bg-primary/5 border-primary/30 shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }`}
                      whileHover={isCurrent ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className={`text-base font-medium mb-1 ${
                            isCompleted
                              ? 'text-accent-green'
                              : isCurrent
                              ? 'text-primary'
                              : 'text-text-light/60 dark:text-text-dark/60'
                          }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {stage.title}
                          </h4>
                          <p className={`text-sm ${
                            isCompleted
                              ? 'text-accent-green/80'
                              : isCurrent
                              ? 'text-text-light/80 dark:text-text-dark/80'
                              : 'text-text-light/50 dark:text-text-dark/50'
                          }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {stage.description}
                          </p>
                        </div>
                        {isCurrent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">→</span>
                            </div>
                          </motion.div>
                        )}
                        {isCompleted && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalProgressRoadmap;

