import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaravanCreateChallenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [caravanData, setCaravanData] = useState<any>(null);
  const [taskName, setTaskName] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (location.state) {
      setCaravanData(location.state);
    } else {
      navigate('/caravans');
    }
  }, [location, navigate]);

  const periods = [
    { value: '1 неделя', label: '1 неделя' },
    { value: '2 недели', label: '2 недели' },
    { value: '1 месяц', label: '1 месяц' },
    { value: '3 месяца', label: '3 месяца' }
  ];

  const handleNext = () => {
    if (taskName.trim() && (selectedPeriod || selectedDate)) {
      // Создаем челлендж (цель с одной задачей на каждый день)
      const challengeGoal = {
        id: Date.now().toString(),
        goalTitle: caravanData.name || 'Челлендж',
        description: `Ежедневная задача: ${taskName}`,
        progress: 0,
        deadlineType: selectedDate ? 'date' : 'period',
        selectedPeriod: selectedPeriod || undefined,
        selectedDate: selectedDate || undefined,
        dailyTask: taskName.trim(),
        dailyTaskCompleted: false,
        checkpoints: [],
        completedCheckpoints: [],
        isCaravan: true,
        caravanId: null as string | null, // Будет установлен при создании каравана
        isChallenge: true,
        startDate: new Date().toISOString()
      };

      // Создаем караван
      const newCaravan = {
        id: Date.now().toString(),
        name: caravanData.name,
        description: caravanData.description,
        members: 1,
        maxMembers: 10,
        progress: 0,
        icon: caravanData.icon || 'groups',
        iconColor: caravanData.iconColor || '#3B82F6',
        status: 'in-progress' as const,
        avatars: [],
        goalId: challengeGoal.id,
        memberIds: []
      };

      challengeGoal.caravanId = newCaravan.id;

      // Сохраняем цель и караван
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      goals.push(challengeGoal);
      localStorage.setItem('goals', JSON.stringify(goals));

      const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
      caravans.push(newCaravan);
      localStorage.setItem('caravans', JSON.stringify(caravans));

      // Переходим на карту
      navigate('/map', { state: { goalId: challengeGoal.id } });
    }
  };

  const handleBack = () => {
    navigate('/caravans/create/basic', { state: caravanData });
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
        <h2 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Создать челлендж
        </h2>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-6 px-4 py-3 mt-4">
        <label className="flex flex-col w-full">
          <p className="text-[#343A40] dark:text-white text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Ежедневная задача
          </p>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#343A40] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
            placeholder="Например: Пробежать 5 км"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <p className="text-sm text-[#4c669a] dark:text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Эта задача будет повторяться каждый день
          </p>
        </label>

        <div className="flex flex-col gap-4">
          <p className="text-[#343A40] dark:text-white text-base font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Период челленджа
          </p>
          
          <div className="flex flex-col gap-3">
            {periods.map((period) => (
              <motion.label
                key={period.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  selectedPeriod === period.value
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark'
                }`}
              >
                <input
                  type="radio"
                  name="period"
                  value={period.value}
                  checked={selectedPeriod === period.value}
                  onChange={() => {
                    setSelectedPeriod(period.value);
                    setSelectedDate('');
                  }}
                  className="hidden"
                />
                <div className={`flex items-center justify-center size-6 rounded-full border-2 ${
                  selectedPeriod === period.value
                    ? 'border-primary bg-primary'
                    : 'border-gray-300 dark:border-gray-700'
                }`}>
                  {selectedPeriod === period.value && (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  )}
                </div>
                <span className="text-[#343A40] dark:text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {period.label}
                </span>
              </motion.label>
            ))}

            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                selectedDate
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark'
              }`}
            >
              <input
                type="radio"
                name="period"
                checked={!!selectedDate}
                onChange={() => {
                  setSelectedPeriod('');
                }}
                className="hidden"
              />
              <div className={`flex items-center justify-center size-6 rounded-full border-2 ${
                selectedDate
                  ? 'border-primary bg-primary'
                  : 'border-gray-300 dark:border-gray-700'
              }`}>
                {selectedDate && (
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                )}
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedPeriod('');
                }}
                className="flex-1 text-[#343A40] dark:text-white bg-transparent border-none outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </motion.label>
          </div>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="sticky bottom-0 w-full bg-background-light dark:bg-background-dark p-4 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!taskName.trim() || (!selectedPeriod && !selectedDate)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:cursor-not-allowed disabled:bg-primary/40 disabled:opacity-60"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span>Создать челлендж</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CaravanCreateChallenge;

