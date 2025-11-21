import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaravanBasicInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [caravanName, setCaravanName] = useState('');
  const [description, setDescription] = useState('');
  const [caravanData, setCaravanData] = useState<any>(null);

  useEffect(() => {
    if (location.state) {
      setCaravanData(location.state);
    } else {
      navigate('/caravans/create/type');
    }
  }, [location, navigate]);

  const handleNext = () => {
    if (caravanName.trim()) {
      // Сохраняем данные каравана и переходим к созданию цели
      const caravanInfo = {
        ...caravanData,
        name: caravanName.trim(),
        description: description.trim() || undefined,
        icon: caravanData?.icon || 'groups',
        iconColor: caravanData?.iconColor || '#3B82F6',
        type: caravanData?.type || 'collaborative'
      };
      
      // Переходим к созданию цели для каравана
      if (caravanInfo.type === 'challenge') {
        navigate('/caravans/create/challenge', { state: caravanInfo });
      } else {
        navigate('/caravans/create/goal/basic', { state: caravanInfo });
      }
    }
  };

  const handleBack = () => {
    navigate('/caravans/create/type', { state: caravanData });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display text-[#0d121b] dark:text-white"
    >
      <div className="flex items-center p-4 pb-2 justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-center text-[#0d121b] dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </motion.button>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Create Your Caravan
        </h1>
      </div>

      <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
        <div className="h-2 w-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
        <div className="h-2 w-2 rounded-full bg-primary"></div>
        <div className="h-2 w-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
        <div className="h-2 w-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
      </div>

      <div className="px-4">
        <h2 className="text-[#0d121b] dark:text-white tracking-light text-[28px] font-bold leading-tight text-left pt-5">
          Name Your Caravan
        </h2>
        <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-normal pb-3 pt-1">
          Every great journey needs a name.
        </p>
      </div>

      <div className="flex flex-col gap-6 px-4 py-3 mt-4">
        <label className="flex flex-col w-full">
          <p className="text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2">
            Caravan Name
          </p>
          <input
            value={caravanName}
            onChange={(e) => setCaravanName(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
            placeholder="The Adventurers' Alliance"
          />
        </label>
        <label className="flex flex-col w-full">
          <div className="flex justify-between items-baseline">
            <p className="text-[#0d121b] dark:text-white text-base font-medium leading-normal pb-2">
              Description
            </p>
            <p className="text-sm text-[#4c669a] dark:text-gray-500">Optional</p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-28 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Our journey to run a half-marathon!"
          />
        </label>
      </div>

      <div className="flex-grow"></div>

      <div className="sticky bottom-0 w-full bg-background-light dark:bg-background-dark p-4 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!caravanName.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:cursor-not-allowed disabled:bg-primary/40 disabled:opacity-60"
        >
          <span>Next</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CaravanBasicInfo;

