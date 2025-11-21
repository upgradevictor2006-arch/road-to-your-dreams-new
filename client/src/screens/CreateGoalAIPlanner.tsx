import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateGoalAIPlanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [planningChoice, setPlanningChoice] = useState<'automatic' | 'manual'>('automatic');
  const [isLoading, setIsLoading] = useState(false);
  const [goalData, setGoalData] = useState<any>(null);

  useEffect(() => {
    if (location.state) {
      setGoalData(location.state);
    } else {
      navigate('/create-goal/basic');
    }
  }, [location, navigate]);

  const handleContinue = () => {
    if (planningChoice === 'automatic') {
      setIsLoading(true);
      // Simulate AI planning
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to goals list after creation
        navigate('/goals');
      }, 2000);
    } else {
      // Navigate to manual planning (could be another screen)
      navigate('/goals');
    }
  };

  const handleBack = () => {
    navigate('/create-goal/daily-task', { state: goalData });
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
          Планирование пути
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

      <main className="flex-1 flex flex-col px-4 pt-4 pb-6">
        <div className="text-center">
          <h2 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight pb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Как ты хочешь спланировать свой путь?
          </h2>
          <p className="text-text-light/70 dark:text-text-dark/70 text-base font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Выбери, как настроить контрольные точки для своей цели.
          </p>
        </div>

        <div className="flex-shrink-0 my-6">
          <div className="w-full flex justify-center">
            <img
              alt="Planning choice illustration"
              className="w-full max-w-[280px] h-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHiW58XAd9p4zSpydisJ1XTPA2aUlIFXj_Q_Fo6EahSGvHvpbP45-orGb3ih_mL74kjHhzSjjpg5bDKKX6WZMHKEHQBZk8ScfTixJJmKShEpIrbzgacsup4jyL8iQp0rJG3gfuQE1y6hA0XXghH_s2EQdsoi2nydLdPywffntC5jRCJE1PSjUh1rCnX5EiJL9clTzGEDSdY3gXpWb6UJzxlxhDpTvI46ItCYJ-HC6FU5YOOuJ7N-NU0bxuddjiz6FpOg4BpbTBxOBR"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 rounded-lg border-2 border-solid p-4 transition-all ${
              planningChoice === 'automatic'
                ? 'border-primary bg-primary/10 dark:bg-primary/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex grow flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-bold leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Автоматическое планирование
              </p>
              <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Позволь нашему ИИ проанализировать твою цель и создать оптимизированный путь для тебя.
              </p>
            </div>
            <input
              type="radio"
              name="planning-choice"
              checked={planningChoice === 'automatic'}
              onChange={() => setPlanningChoice('automatic')}
              className="form-radio h-5 w-5 border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
            />
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 rounded-lg border-2 border-solid p-4 transition-all ${
              planningChoice === 'manual'
                ? 'border-primary bg-primary/10 dark:bg-primary/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex grow flex-col">
              <p className="text-text-light dark:text-text-dark text-base font-bold leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ручное планирование
              </p>
              <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ты сам определяешь каждую остановку и контрольную точку на своем пути.
              </p>
            </div>
            <input
              type="radio"
              name="planning-choice"
              checked={planningChoice === 'manual'}
              onChange={() => setPlanningChoice('manual')}
              className="form-radio h-5 w-5 border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
            />
          </motion.label>
        </div>

        <div className="flex-grow"></div>

        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full h-14 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoading ? 'Планирование...' : 'Продолжить'}
          </motion.button>
        </div>
      </main>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm flex-col items-center justify-center gap-6 text-center p-8 flex"
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
            Наш ИИ строит твою карту пути...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateGoalAIPlanner;

