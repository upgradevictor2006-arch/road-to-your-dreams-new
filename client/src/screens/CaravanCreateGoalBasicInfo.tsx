import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaravanCreateGoalBasicInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [caravanData, setCaravanData] = useState<any>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (location.state) {
      setCaravanData(location.state);
    } else {
      navigate('/caravans');
    }
  }, [location, navigate]);

  const handleNext = () => {
    if (goalTitle.trim()) {
      navigate('/caravans/create/goal/deadline', { 
        state: { ...caravanData, goalTitle, description, isCaravan: true } 
      });
    }
  };

  const handleCancel = () => {
    navigate('/caravans');
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
          onClick={handleCancel}
          className="flex size-12 shrink-0 items-center justify-start text-[#343A40] dark:text-white"
        >
          <span className="material-symbols-outlined !text-2xl">close</span>
        </motion.button>
        <h2 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Цель каравана
        </h2>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between">
          <p className="text-[#343A40] dark:text-gray-300 text-sm font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Шаг 1 из 4
          </p>
        </div>
        <div className="rounded-full bg-[#CED4DA]/50 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '25%' }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 py-3 mt-4">
        <label className="flex flex-col w-full">
          <p className="text-[#343A40] dark:text-white text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Название цели
          </p>
          <input
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#343A40] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Например: Пробежать марафон"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </label>
        <label className="flex flex-col w-full">
          <div className="flex justify-between items-baseline">
            <p className="text-[#343A40] dark:text-white text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Описание
            </p>
            <p className="text-sm text-[#4c669a] dark:text-gray-500">Необязательно</p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#343A40] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-28 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Опишите свою цель..."
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </label>
      </div>

      <div className="flex-grow"></div>

      <div className="sticky bottom-0 w-full bg-background-light dark:bg-background-dark p-4 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!goalTitle.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:cursor-not-allowed disabled:bg-primary/40 disabled:opacity-60"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span>Далее</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CaravanCreateGoalBasicInfo;

