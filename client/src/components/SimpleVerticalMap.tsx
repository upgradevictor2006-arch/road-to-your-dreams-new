import { motion } from 'framer-motion';

interface Checkpoint {
  label: string;
  description?: string;
  completed?: boolean; // Выполнен ли чекпоинт
}

interface SimpleVerticalMapProps {
  progress?: number; // 0-100
  checkpoints?: Checkpoint[];
  goalTitle?: string;
  dailyTask?: string;
  dailyTaskNumber?: number;
  dailyTaskDate?: string;
  completedDailyTasks?: Array<{ task: string; completed: boolean; number?: number; date?: string }>; // История выполненных задач
  animateLineFill?: boolean; // Анимация заполнения линии
  animateDailyTask?: boolean; // Анимация плашки ежедневной задачи
}

const SimpleVerticalMap = ({
  progress = 0,
  checkpoints = [],
  goalTitle = 'Финальная цель',
  dailyTask = '',
  dailyTaskNumber,
  dailyTaskDate,
  completedDailyTasks = [],
  animateLineFill = false,
  animateDailyTask = false
}: SimpleVerticalMapProps) => {
  // Создаем массив всех элементов в правильном порядке:
  // Старт -> Ежедневные задачи (до первого чекпоинта) -> Чекпоинт 1 -> [после выполнения чекпоинта 1] Ежедневные задачи -> Чекпоинт 2 -> ... -> Финал
  const hasDailyTask = !!dailyTask;
  const allElements: Array<{ type: 'start' | 'daily' | 'checkpoint' | 'finish'; label: string; description?: string; completed?: boolean; checkpointIndex?: number; taskNumber?: number; taskDate?: string }> = [
    { type: 'start', label: 'Старт' }
  ];
  
  // Находим индекс последнего выполненного чекпоинта
  let lastCompletedCheckpointIndex = -1;
  for (let i = 0; i < checkpoints.length; i++) {
    if (checkpoints[i].completed) {
      lastCompletedCheckpointIndex = i;
    } else {
      break; // Прерываем, если нашли невыполненный чекпоинт
    }
  }
  
  // Если ни один чекпоинт не выполнен, показываем ежедневные задачи после старта (до первого чекпоинта)
  if (lastCompletedCheckpointIndex === -1) {
    // Добавляем выполненные задачи
    completedDailyTasks.forEach((task) => {
      allElements.push({ 
        type: 'daily' as const, 
        label: `Ежедневная задача #${task.number || completedDailyTasks.indexOf(task) + 1}`, 
        description: task.task,
        completed: task.completed,
        taskNumber: task.number,
        taskDate: task.date
      });
    });
    
    // Добавляем текущую ежедневную задачу (если есть)
    if (hasDailyTask) {
      allElements.push({ 
        type: 'daily' as const, 
        label: `Ежедневная задача #${dailyTaskNumber || completedDailyTasks.length + 1}`, 
        description: dailyTask, 
        completed: false,
        taskNumber: dailyTaskNumber || completedDailyTasks.length + 1,
        taskDate: dailyTaskDate
      });
    }
  }
  
  // Добавляем чекпоинты и ежедневные задачи
  checkpoints.forEach((cp, index) => {
    // Добавляем чекпоинт
    allElements.push({ 
      type: 'checkpoint' as const, 
      label: cp.label, 
      description: cp.description, 
      completed: cp.completed || false,
      checkpointIndex: index
    });
    
    // Если этот чекпоинт выполнен и это последний выполненный, добавляем ежедневные задачи после него
    // Но только если мы еще не добавили задачи ранее
    if (cp.completed && index === lastCompletedCheckpointIndex && lastCompletedCheckpointIndex >= 0) {
      // Добавляем выполненные задачи, которые были выполнены после этого чекпоинта
      const tasksAfterCheckpoint = completedDailyTasks;
      
      tasksAfterCheckpoint.forEach((task) => {
        allElements.push({ 
          type: 'daily' as const, 
          label: `Ежедневная задача #${task.number || tasksAfterCheckpoint.indexOf(task) + 1}`, 
          description: task.task,
          completed: task.completed,
          taskNumber: task.number,
          taskDate: task.date
        });
      });
      
      // Добавляем текущую ежедневную задачу (если есть)
      if (hasDailyTask) {
        allElements.push({ 
          type: 'daily' as const, 
          label: `Ежедневная задача #${dailyTaskNumber || completedDailyTasks.length + 1}`, 
          description: dailyTask, 
          completed: false,
          taskNumber: dailyTaskNumber || completedDailyTasks.length + 1,
          taskDate: dailyTaskDate
        });
      }
    }
  });
  
  // Добавляем финальную цель
  allElements.push({ type: 'finish', label: goalTitle });

  const lineHeight = 120; // Высота линии между элементами (удлинена)
  
  // Находим индекс текущей ежедневной задачи (последней незавершенной)
  let currentDailyTaskIndex = -1;
  for (let i = allElements.length - 1; i >= 0; i--) {
    if (allElements[i].type === 'daily' && !allElements[i].completed) {
      currentDailyTaskIndex = i;
      break;
    }
  }

  return (
    <div 
      className="w-full flex flex-col items-center"
      style={{ 
        paddingTop: '0px',
        paddingBottom: '20px'
      }}
    >
      {allElements.map((element, index) => {
        const isStart = element.type === 'start';
        const isFinish = element.type === 'finish';
        const isDaily = element.type === 'daily';
        const isCheckpoint = element.type === 'checkpoint';
        const isCurrentDailyTask = isDaily && index === currentDailyTaskIndex;
        const isCompletedDaily = element.completed === true;
        const isSkippedDaily = isDaily && element.completed === false; // Невыполненная задача
        const isCompletedCheckpoint = isCheckpoint && element.completed === true;
        
        // Определяем, завершен ли элемент
        // Старт всегда завершен
        // Финал завершен только если прогресс 100%
        // Чекпоинты завершены если они помечены как completed
        // Ежедневные задачи завершены если они помечены как completed
        let isCompleted = false;
        if (isStart) {
          isCompleted = true;
        } else if (isFinish) {
          isCompleted = progress >= 100;
        } else if (isCheckpoint) {
          isCompleted = isCompletedCheckpoint;
        } else if (isDaily) {
          isCompleted = isCompletedDaily && !isSkippedDaily;
        }
        
        // Линия завершена, если следующий элемент завершен или текущий элемент завершен
        const nextElement = index < allElements.length - 1 ? allElements[index + 1] : null;
        const isNextCompleted = nextElement ? (
          nextElement.type === 'start' ? true :
          nextElement.type === 'finish' ? progress >= 100 :
          nextElement.type === 'checkpoint' ? (nextElement.completed === true) :
          nextElement.type === 'daily' ? (nextElement.completed === true) :
          false
        ) : false;
        const isLineCompleted = isCompleted || isNextCompleted;
        
        const shouldAnimateLine = animateLineFill && index === currentDailyTaskIndex - 1 && index >= 0;
        const shouldAnimateTask = animateDailyTask && isCurrentDailyTask;

        return (
          <div key={`${element.type}-${index}-${element.description}`} className="w-full flex flex-col items-center">
            {/* Кнопка */}
            <motion.button
              initial={shouldAnimateTask ? { scale: 0.95 } : false}
              animate={shouldAnimateTask ? { 
                scale: [0.95, 1.05, 1],
                backgroundColor: ['#f3f4f6', '#dcfce7', '#dcfce7']
              } : {}}
              transition={shouldAnimateTask ? { 
                duration: 0.8,
                times: [0, 0.5, 1]
              } : {}}
              className={`rounded-lg border-2 px-6 py-3 transition-all ${
                isSkippedDaily
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 opacity-60' // Невыполненные задачи всегда красные
                  : isCompleted
                  ? isStart || isFinish
                    ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300'
                    : isCheckpoint
                    ? 'bg-green-100 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                    : 'bg-green-100 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              style={{
                minWidth: '200px',
                textAlign: 'center'
              }}
            >
              <div className="font-medium text-base">{element.label}</div>
              {element.description && (
                <div className="text-sm mt-1 opacity-80">{element.description}</div>
              )}
              {element.taskDate && (
                <div className="text-xs mt-1 opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {new Date(element.taskDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </motion.button>

            {/* Линия (кроме последнего элемента) */}
            {index < allElements.length - 1 && (
              <div className="relative w-0.5 my-4" style={{ height: `${lineHeight}px` }}>
                {/* Фоновая серая линия */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: '#d1d5db'
                  }}
                />
                {/* Зеленая заполненная линия */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: '#10b981',
                    originY: 0
                  }}
                  initial={{ scaleY: isLineCompleted ? 1 : 0 }}
                  animate={shouldAnimateLine ? { scaleY: 1 } : { scaleY: isLineCompleted ? 1 : 0 }}
                  transition={{ 
                    duration: shouldAnimateLine ? 1 : 0.3,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleVerticalMap;
