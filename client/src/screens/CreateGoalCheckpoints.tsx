import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIAssistant from '../components/AIAssistant';

interface Checkpoint {
  id: string;
  label: string;
  description: string;
}

const CreateGoalCheckpoints = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [goalData, setGoalData] = useState<any>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (location.state) {
      setGoalData(location.state);
      generateCheckpoints(location.state);
    } else {
      // Проверяем, создается ли цель для каравана
      if (location.pathname.includes('/caravans/create')) {
        navigate('/caravans/create/goal/basic');
      } else {
        navigate('/create-goal/basic');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCheckpoints = (data: any) => {
    const { deadlineType, selectedPeriod, selectedDate } = data;
    let count = 0;
    let labels: string[] = [];

    if (deadlineType === 'period') {
      switch (selectedPeriod) {
        case '1 неделя':
          count = 7;
          labels = Array.from({ length: 7 }, (_, i) => `День ${i + 1}`);
          break;
        case '1 месяц':
          count = 4;
          labels = Array.from({ length: 4 }, (_, i) => `Неделя ${i + 1}`);
          break;
        case '3 месяца':
          count = 3;
          labels = Array.from({ length: 3 }, (_, i) => `${i + 1} месяц`);
          break;
        case '6 месяцев':
          count = 6;
          labels = Array.from({ length: 6 }, (_, i) => `${i + 1} месяц`);
          break;
        case '1 год':
          count = 4;
          labels = ['1-й квартал (3 месяца)', '2-й квартал (6 месяцев)', '3-й квартал (9 месяцев)', '4-й квартал (12 месяцев)'];
          break;
        case '5 лет':
          count = 10;
          labels = Array.from({ length: 10 }, (_, i) => `${i * 6 + 6} месяцев`);
          break;
        default:
          count = 4;
          labels = Array.from({ length: 4 }, (_, i) => `Этап ${i + 1}`);
      }
    } else if (deadlineType === 'date' && selectedDate) {
      const endDate = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysDiff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        count = daysDiff;
        labels = Array.from({ length: daysDiff }, (_, i) => `День ${i + 1}`);
      } else if (daysDiff <= 30) {
        count = Math.ceil(daysDiff / 7);
        labels = Array.from({ length: count }, (_, i) => `Неделя ${i + 1}`);
      } else if (daysDiff <= 180) {
        count = Math.ceil(daysDiff / 30);
        labels = Array.from({ length: count }, (_, i) => `${i + 1} месяц`);
      } else if (daysDiff <= 365) {
        count = 4;
        labels = ['1-й квартал (3 месяца)', '2-й квартал (6 месяцев)', '3-й квартал (9 месяцев)', '4-й квартал (12 месяцев)'];
      } else {
        count = Math.ceil(daysDiff / 182); // каждые 6 месяцев
        count = Math.min(count, 12); // максимум 12 чекпоинтов
        labels = Array.from({ length: count }, (_, i) => `${i * 6 + 6} месяцев`);
      }
    } else {
      count = 4;
      labels = Array.from({ length: 4 }, (_, i) => `Этап ${i + 1}`);
    }

    const newCheckpoints = Array.from({ length: count }, (_, i) => ({
      id: `checkpoint-${i}`,
      label: labels[i] || `Этап ${i + 1}`,
      description: '',
    }));

    setCheckpoints(newCheckpoints);
  };

  const areAllCheckpointsFilled = () => {
    return checkpoints.every((cp) => cp.description.trim().length > 0);
  };

  const handleCheckpointChange = (id: string, description: string) => {
    setCheckpoints((prev) =>
      prev.map((cp) => (cp.id === id ? { ...cp, description } : cp))
    );
    // Очищаем сообщение об ошибке при изменении
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    if (!areAllCheckpointsFilled()) {
      setErrorMessage('Пожалуйста, заполни все этапы перед продолжением');
      return;
    }
    setErrorMessage('');
    
    // Проверяем, создается ли цель для каравана
    if (goalData?.isCaravan) {
      navigate('/caravans/create/goal/daily-task', {
        state: { ...goalData, checkpoints },
      });
    } else {
      navigate('/create-goal/daily-task', {
        state: { ...goalData, checkpoints },
      });
    }
  };

  const handleBack = () => {
    // Проверяем, создается ли цель для каравана
    if (goalData?.isCaravan) {
      navigate('/caravans/create/goal/deadline', { state: goalData });
    } else {
      navigate('/create-goal/deadline', { state: goalData });
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
          Чекпоинты цели
        </h1>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between">
          <p className="text-[#343A40] dark:text-gray-300 text-sm font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Шаг 4 из 5
          </p>
        </div>
        <div className="rounded-full bg-[#CED4DA]/50 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80%' }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col px-4 pt-4 pb-6">
        <div className="text-center">
          <h2 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Разбей свой путь
          </h2>
          <p className="text-text-light/70 dark:text-text-dark/70 text-base font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Определи ключевые этапы для отслеживания прогресса. Чего ты хочешь достичь на каждом этапе?
          </p>
        </div>

        <div className="mt-6 mb-4">
          <AIAssistant
            context={{
              goalTitle: goalData?.goalTitle || '',
              description: goalData?.description || '',
              aiPlanning: goalData?.aiPlanning || {},
              checkpoints: checkpoints.map(cp => ({ label: cp.label, description: cp.description })),
            }}
            currentStep="checkpoints"
            onSuggestionClick={(suggestion) => {
              if (suggestion.type === 'checkpoint' && checkpoints.length > 0) {
                const firstEmpty = checkpoints.findIndex(cp => !cp.description.trim());
                if (firstEmpty !== -1) {
                  handleCheckpointChange(checkpoints[firstEmpty].id, suggestion.message);
                }
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-0 mt-8">
          {checkpoints.map((checkpoint, index) => (
            <motion.div
              key={checkpoint.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start ${index < checkpoints.length - 1 ? 'pb-8' : ''}`}
            >
              <div className="flex flex-col items-center mr-4 self-stretch">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark z-10 flex-shrink-0"></div>
                {index < checkpoints.length - 1 && (
                  <div className="w-[2px] h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                )}
              </div>
              <div className="w-full">
                <label
                  className="block text-base font-bold text-text-light dark:text-text-dark mb-2"
                  htmlFor={checkpoint.id}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {checkpoint.label}
                </label>
                <textarea
                  id={checkpoint.id}
                  value={checkpoint.description}
                  onChange={(e) => handleCheckpointChange(checkpoint.id, e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-base text-text-light dark:text-text-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 focus:border-primary focus:ring-primary focus:outline-none resize-none"
                  placeholder="Например, пробежать 2 км"
                  rows={3}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </motion.div>
          ))}

          {/* Final Goal */}
          <div className="flex items-start mt-4">
            <div className="flex flex-col items-center mr-4">
              <div className="w-10 h-10 rounded-full bg-accent-orange flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark text-background-dark z-10 flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">flag</span>
              </div>
            </div>
            <div className="flex flex-col pt-1">
              <p className="text-sm font-medium text-text-light/70 dark:text-text-dark/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Финальная цель
              </p>
              <p className="text-xl font-bold text-accent-orange" style={{ fontFamily: 'Inter, sans-serif' }}>
                {goalData?.goalTitle || 'Моя цель'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {errorMessage}
            </p>
          </motion.div>
        )}

        <div className="mt-4">
          <motion.button
            whileHover={{ scale: areAllCheckpointsFilled() ? 1.02 : 1 }}
            whileTap={{ scale: areAllCheckpointsFilled() ? 0.98 : 1 }}
            onClick={handleNext}
            disabled={!areAllCheckpointsFilled()}
            className={`w-full h-14 rounded-full text-white text-lg font-bold flex items-center justify-center shadow-lg ${
              areAllCheckpointsFilled()
                ? 'bg-primary shadow-primary/30'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Продолжить
          </motion.button>
        </div>
      </main>
    </motion.div>
  );
};

export default CreateGoalCheckpoints;

