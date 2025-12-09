import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CreateGoalDeadline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deadlineType, setDeadlineType] = useState<'period' | 'date'>('period');
  const [selectedPeriod, setSelectedPeriod] = useState('1 месяц');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [goalData, setGoalData] = useState<any>(null);

  useEffect(() => {
    if (location.state) {
      setGoalData(location.state);
    } else {
      navigate('/create-goal/basic');
    }
  }, [location, navigate]);

  const timePeriods = ['1 неделя', '1 месяц', '3 месяца', '6 месяцев', '1 год', '5 лет'];

  const handleNext = () => {
    // Проверяем, создается ли цель для каравана
    if (goalData?.isCaravan) {
      navigate('/caravans/create/goal/checkpoints', {
        state: { ...goalData, deadlineType, selectedPeriod, selectedDate }
      });
    } else {
      navigate('/create-goal/checkpoints', {
        state: { ...goalData, deadlineType, selectedPeriod, selectedDate }
      });
    }
  };

  const handleBack = () => {
    navigate('/create-goal/basic', { state: goalData });
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setIsCalendarOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setIsYearPickerOpen(false);
  };

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Генерируем годы: от текущего года до +50 лет
    for (let i = 0; i <= 50; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden"
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
          Установи срок
        </h2>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between">
          <p className="text-[#343A40] dark:text-gray-300 text-sm font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Шаг 3 из 5
          </p>
        </div>
        <div className="rounded-full bg-[#CED4DA]/50 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <p className="text-[#343A40] dark:text-gray-300 text-base font-normal leading-normal pb-3 pt-1 px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        Каждое путешествие требует даты назначения. Давай установим твою.
      </p>

      <main className="flex-grow flex flex-col gap-4 px-4">
        <div className="flex w-full rounded-full bg-[#CED4DA]/30 dark:bg-gray-800 p-1">
          <motion.label
            whileTap={{ scale: 0.98 }}
            className={`flex-1 cursor-pointer py-2.5 px-4 rounded-full text-center transition-all duration-300 ${
              deadlineType === 'period'
                ? 'bg-white dark:bg-gray-700 shadow-md text-[#343A40] dark:text-white'
                : 'text-[#343A40]/70 dark:text-gray-400'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <input
              type="radio"
              name="deadlineType"
              value="period"
              checked={deadlineType === 'period'}
              onChange={() => setDeadlineType('period')}
              className="sr-only"
            />
            Временной период
          </motion.label>
          <motion.label
            whileTap={{ scale: 0.98 }}
            className={`flex-1 cursor-pointer py-2.5 px-2 rounded-full text-center transition-all duration-300 flex flex-col items-center justify-center ${
              deadlineType === 'date'
                ? 'bg-white dark:bg-gray-700 shadow-md text-[#343A40] dark:text-white'
                : 'text-[#343A40]/70 dark:text-gray-400'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}
          >
            <input
              type="radio"
              name="deadlineType"
              value="date"
              checked={deadlineType === 'date'}
              onChange={() => setDeadlineType('date')}
              className="sr-only"
            />
            <span className="leading-tight">
              Конкретная
            </span>
            <span className="leading-tight">
              дата
            </span>
          </motion.label>
        </div>

        {deadlineType === 'period' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Выбери временной период
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {timePeriods.map((period) => (
                <motion.label
                  key={period}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex cursor-pointer items-center justify-center rounded-lg p-4 transition-colors ring-1 ring-inset ${
                    selectedPeriod === period
                      ? 'bg-primary/20 dark:bg-primary/30 ring-2 ring-primary'
                      : 'bg-[#F8F9FA] dark:bg-gray-800/50 ring-[#CED4DA]/50 dark:ring-gray-700'
                  }`}
                >
                  <span className="text-[#343A40] dark:text-white text-base font-medium text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {period}
                  </span>
                  <input
                    type="radio"
                    name="time_period"
                    value={period}
                    checked={selectedPeriod === period}
                    onChange={() => setSelectedPeriod(period)}
                    className="sr-only"
                  />
                </motion.label>
              ))}
            </div>
          </motion.div>
        )}

        {deadlineType === 'date' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Выбери конкретную дату
            </h3>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex w-full items-center justify-between rounded-lg bg-[#F8F9FA] dark:bg-gray-800/50 p-4 ring-1 ring-inset ring-[#CED4DA]/50 dark:ring-gray-700 cursor-pointer transition-all hover:ring-primary/50"
            >
              <span className={`${selectedDate ? 'text-[#343A40] dark:text-white' : 'text-[#343A40]/70 dark:text-gray-400'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                  : 'Выбери дату'}
              </span>
              <span className="material-symbols-outlined text-[#343A40] dark:text-white">
                calendar_month
              </span>
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {isCalendarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCalendarOpen(false);
                setIsYearPickerOpen(false);
              }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#343A40] dark:text-white">chevron_left</span>
                  </motion.button>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsYearPickerOpen(true)}
                      className="px-3 py-1 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors"
                    >
                      <h3 className="text-[#343A40] dark:text-white text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#343A40] dark:text-white">chevron_right</span>
                  </motion.button>
                </div>

                {/* Year Picker */}
                <AnimatePresence>
                  {isYearPickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-border-light dark:border-border-dark overflow-hidden"
                    >
                      <div className="max-h-64 overflow-y-auto p-4 grid grid-cols-4 gap-2">
                        {getYearsList().map((year) => (
                          <motion.button
                            key={year}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleYearSelect(year)}
                            className={`
                              py-2 px-3 rounded-lg text-sm font-medium transition-colors
                              ${currentMonth.getFullYear() === year
                                ? 'bg-primary text-white shadow-md'
                                : 'text-[#343A40] dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20'
                              }
                            `}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {year}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 p-4 pb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-[#343A40]/60 dark:text-gray-400 py-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 p-4 pt-0">
                  {getDaysInMonth(currentMonth).map((date, index) => (
                    <motion.button
                      key={index}
                      whileHover={date && !isDateDisabled(date) ? { scale: 1.1 } : {}}
                      whileTap={date && !isDateDisabled(date) ? { scale: 0.9 } : {}}
                      onClick={() => date && !isDateDisabled(date) && handleDateSelect(date)}
                      disabled={!date || isDateDisabled(date)}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-colors
                        ${!date ? 'cursor-default' : ''}
                        ${date && isDateDisabled(date)
                          ? 'text-[#343A40]/20 dark:text-gray-600 cursor-not-allowed'
                          : date && isDateSelected(date)
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-[#343A40] dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20'
                        }
                      `}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {date?.getDate()}
                    </motion.button>
                  ))}
                </div>

                {/* Calendar Footer */}
                <div className="p-4 pt-2 border-t border-border-light dark:border-border-dark">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCalendarOpen(false);
                      setIsYearPickerOpen(false);
                    }}
                    className="w-full rounded-full bg-primary py-3 px-4 text-center text-base font-bold text-white shadow-lg shadow-primary/30"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {selectedDate ? 'Готово' : 'Отмена'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80 p-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={deadlineType === 'date' && !selectedDate}
          className="w-full rounded-full bg-primary py-4 px-5 text-center text-base font-bold text-white shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Продолжить
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CreateGoalDeadline;

