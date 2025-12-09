import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIAssistant from '../components/AIAssistant';

const CreateGoalDailyTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [goalData, setGoalData] = useState<any>(null);
  const [dailyTask, setDailyTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setGoalData(location.state);
    } else {
      // Проверяем, создается ли цель для каравана
      if (location.pathname.includes('/caravans/create')) {
        navigate('/caravans/create/goal/basic');
      } else {
        navigate('/create-goal/basic');
      }
    }
  }, [location, navigate]);

  // Проверяем, нужна ли ежедневная задача
  const needsDailyTask = () => {
    if (!goalData) return true;
    
    const { deadlineType, selectedPeriod, selectedDate, checkpoints } = goalData;
    
    // Если чекпоинты по дням, ежедневная задача не нужна
    if (deadlineType === 'period') {
      if (selectedPeriod === '1 неделя' && checkpoints?.length === 7) {
        return false; // Неделя с чекпоинтами на каждый день
      }
    } else if (deadlineType === 'date' && selectedDate) {
      const endDate = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysDiff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Если цель на неделю или меньше и чекпоинты по дням
      if (daysDiff <= 7 && checkpoints?.length === daysDiff) {
        return false;
      }
    }
    
    return true;
  };

  useEffect(() => {
    // Если ежедневная задача не нужна, пропускаем этот шаг
    if (goalData && !needsDailyTask()) {
      setIsLoading(true);
      setTimeout(() => {
        const completeGoalData = { ...goalData, dailyTask: '' }; // Пустая ежедневная задача
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const newGoal = {
          id: Date.now().toString(),
          ...completeGoalData,
          progress: 0,
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          completedCheckpoints: new Array(completeGoalData.checkpoints?.length || 0).fill(false)
        };
        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));
        
        // Если это цель для каравана, создаем караван
        if (goalData?.isCaravan) {
          const newCaravan = {
            id: Date.now().toString(),
            name: goalData.name || 'Караван',
            description: goalData.description,
            members: 1,
            maxMembers: 10,
            progress: 0,
            icon: goalData.icon || 'groups',
            iconColor: goalData.iconColor || '#3B82F6',
            status: 'in-progress' as const,
            avatars: [],
            goalId: newGoal.id,
            memberIds: []
          };
          
          newGoal.caravanId = newCaravan.id;
          
          const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
          caravans.push(newCaravan);
          localStorage.setItem('caravans', JSON.stringify(caravans));
          
          // Обновляем цель с ID каравана
          const updatedGoals = goals.map((g: any) => 
            g.id === newGoal.id ? newGoal : g
          );
          localStorage.setItem('goals', JSON.stringify(updatedGoals));
        }
        
        navigate(`/map?goal=${newGoal.id}`, { 
          replace: true 
        });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData]);

  const handleNext = () => {
    if (!dailyTask.trim() && needsDailyTask()) {
      return;
    }
    setIsLoading(true);
    // Симуляция загрузки визуализации карты
    setTimeout(() => {
      // Сохраняем цель в localStorage для дальнейшего использования
      const completeGoalData = { ...goalData, dailyTask: dailyTask.trim() || '' };
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const newGoal = {
        id: Date.now().toString(),
        ...completeGoalData,
        progress: 0,
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        completedCheckpoints: new Array(completeGoalData.checkpoints?.length || 0).fill(false)
      };
      goals.push(newGoal);
      localStorage.setItem('goals', JSON.stringify(goals));
      
      // Если это цель для каравана, создаем караван
      if (goalData?.isCaravan) {
        const newCaravan = {
          id: Date.now().toString(),
          name: goalData.name || 'Караван',
          description: goalData.description,
          members: 1,
          maxMembers: 10,
          progress: 0,
          icon: goalData.icon || 'groups',
          iconColor: goalData.iconColor || '#3B82F6',
          status: 'in-progress' as const,
          avatars: [],
          goalId: newGoal.id,
          memberIds: []
        };
        
        newGoal.caravanId = newCaravan.id;
        
        const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
        caravans.push(newCaravan);
        localStorage.setItem('caravans', JSON.stringify(caravans));
        
        // Обновляем цель с ID каравана
        const updatedGoals = goals.map((g: any) => 
          g.id === newGoal.id ? newGoal : g
        );
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
      }
      
      // Переходим на карту с новой целью
      navigate(`/map?goal=${newGoal.id}`, { 
        replace: true 
      });
    }, 2000);
  };

  const handleBack = () => {
    // Проверяем, создается ли цель для каравана
    if (goalData?.isCaravan) {
      navigate('/caravans/create/goal/checkpoints', { state: goalData });
    } else {
      navigate('/create-goal/checkpoints', { state: goalData });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden text-text-light dark:text-text-dark"
    >
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-start text-[#343A40] dark:text-white"
        >
          <span className="material-symbols-outlined !text-2xl">arrow_back</span>
        </motion.button>
        <h1 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Ежедневная задача
        </h1>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between">
          <p className="text-[#343A40] dark:text-gray-300 text-sm font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Шаг 5 из 5
          </p>
        </div>
        <div className="rounded-full bg-[#CED4DA]/50 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col px-4 pt-6 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Установи ежедневную задачу
          </h2>
          <p className="text-text-light/70 dark:text-text-dark/70 text-base font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Это ежедневная обязательная задача, которую нужно выполнять каждый день для достижения своей цели.
          </p>
        </div>

        <div className="mb-6">
          <AIAssistant
            context={{
              goalTitle: goalData?.goalTitle || '',
              description: goalData?.description || '',
              aiPlanning: goalData?.aiPlanning || {},
              checkpoints: goalData?.checkpoints || [],
            }}
            currentStep="daily_task"
            onSuggestionClick={(suggestion) => {
              if (suggestion.type === 'daily_task') {
                setDailyTask(suggestion.message);
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label
            className="block text-base font-medium text-text-light dark:text-text-dark mb-2"
            htmlFor="daily-task"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Описание задачи
          </label>
          <textarea
            id="daily-task"
            value={dailyTask}
            onChange={(e) => setDailyTask(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-base text-text-light dark:text-text-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 focus:border-primary focus:ring-primary focus:outline-none resize-none"
            placeholder="Например, практика UI дизайна 30 минут"
            rows={4}
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        <div className="flex-grow"></div>

        <div className="mt-8">
          <motion.button
            whileHover={{ scale: dailyTask.trim() && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: dailyTask.trim() && !isLoading ? 0.98 : 1 }}
            onClick={handleNext}
            disabled={!dailyTask.trim() || isLoading}
            className={`w-full h-14 rounded-full text-white text-lg font-bold flex items-center justify-center shadow-lg ${
              dailyTask.trim() && !isLoading
                ? 'bg-primary shadow-primary/30'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoading ? 'Создание карты...' : 'Создать карту'}
          </motion.button>
        </div>
      </main>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex-col items-center justify-center gap-6 text-center p-8 flex z-50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 text-primary"
          >
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <p className="text-text-light dark:text-text-dark text-lg font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Визуализация карты...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateGoalDailyTask;

