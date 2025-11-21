import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaravanTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'collaborative' | 'challenge' | null>(null);

  const types = [
    {
      id: 'collaborative' as const,
      title: 'Collaborative Goal',
      description: 'Work together with friends on a long-term goal.',
      icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOnx2L_EvZwlUxMC3lHZuKmzv4Zi5SoI7lW6_bR3GmkJ3xJRjfkfF5MIaRR1C6BpBF8g9pRiUs5B35pqpidCH4PIo-M8ZBqKcYZCcs0e_tIwa5OCRZCAjKDCzXTvwxz-yv-ulQSm6bVNTWUABqYKxedhfJ581zjCuHnjy0PZbQGGODdf4qfNckhf4BVeowBIX8P4tgZWD3KC5O8_zaalACE0EAOAiVoO5Tgw45vvvWpsFmw-HVZh_R93d7wn14kyZgSJU_7bsU-wFK'
    },
    {
      id: 'challenge' as const,
      title: 'Challenge',
      description: 'Compete in a short-term race to the finish line.',
      icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYJUaZFa7axyfAX-GsGuPYsT2fIekFspU5DPeUYjzJguEk4UyI9XsRYns8Yu0aPmV-RaKnF4d1L6QYzBvT8dcas_GwuI3J0Dbp_tqKLibjfIb2sZDgzqqOfYZH12hVcCrm-lphs-53QYcibXsg5JvGix9ejCWQcul1pWTHLOMpOz3o1-m97H8YTs3mNUEr4ck88ECifMO9sCtZY7yqL71q5wIqwthG6HQo2t7DQSNXSGx2EWdHQ5bYu0U3NWxravFrX2U9Fa3awM6O'
    }
  ];

  const handleNext = () => {
    if (selectedType) {
      navigate('/caravans/create/basic', { state: { type: selectedType } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display text-slate-800 dark:text-slate-200"
    >
      <header className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/caravans')}
          className="flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </motion.button>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-slate-900 dark:text-white">
          Start a New Caravan
        </h1>
        <div className="flex size-12 shrink-0"></div>
      </header>

      <main className="flex-grow flex flex-col px-4">
        <h2 className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight text-left pb-3 pt-5">
          Choose the type of your adventure.
        </h2>

        <div className="flex flex-col gap-4 py-4">
          {types.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className={`relative group flex flex-row items-center justify-start rounded-lg p-4 gap-4 bg-white dark:bg-slate-800/50 ring-2 transition-all cursor-pointer shadow-sm ${
                selectedType === type.id
                  ? 'ring-primary'
                  : 'ring-transparent group-hover:ring-primary/50'
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center size-16 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <img className="w-8 h-8" src={type.icon} alt={type.title} />
              </div>
              <div className="flex flex-col items-start justify-center gap-1 flex-grow">
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">
                  {type.title}
                </p>
                <p className="text-base font-normal leading-normal text-slate-600 dark:text-slate-400">
                  {type.description}
                </p>
              </div>
              <div
                className={`flex items-center justify-center size-8 rounded-full border-2 transition-colors ${
                  selectedType === type.id
                    ? 'border-primary bg-primary'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-white text-base transition-opacity ${
                    selectedType === type.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  check
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="sticky bottom-0 p-4 bg-gradient-to-t from-background-light via-background-light/90 to-transparent dark:from-background-dark dark:via-background-dark/90">
        <div className="flex pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!selectedType}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">Next</span>
          </motion.button>
        </div>
      </footer>
    </motion.div>
  );
};

export default CaravanTypeSelection;

