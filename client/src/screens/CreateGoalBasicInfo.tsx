import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateGoalBasicInfo = () => {
  const navigate = useNavigate();
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (goalTitle.trim()) {
      navigate('/create-goal/deadline', { state: { goalTitle, description } });
    }
  };

  const handleCancel = () => {
    navigate('/map');
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
          Новая цель
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

      <div className="flex flex-1 flex-col px-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold leading-tight tracking-tight text-left pb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Установи свою цель
        </motion.h1>
        <p className="text-base text-text-light/70 dark:text-text-dark/70 pb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          Каждое великое путешествие начинается с одного шага. Каков твой?
        </p>

        <div className="flex w-full flex-wrap items-end gap-4 pb-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Какова твоя цель?</p>
            <input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary h-14 placeholder:text-placeholder p-4 text-base font-normal leading-normal"
              placeholder="Например, пробежать 5 км"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </label>
        </div>

        <div className="flex w-full flex-wrap items-end gap-4 pb-4">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Описание (необязательно)</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary min-h-36 placeholder:text-placeholder p-4 text-base font-normal leading-normal"
              placeholder="Добавь детали о своей цели..."
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </label>
        </div>

        <div className="flex-grow"></div>

        <div className="flex px-0 py-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!goalTitle.trim()}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 flex-1 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="truncate">Далее</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateGoalBasicInfo;

