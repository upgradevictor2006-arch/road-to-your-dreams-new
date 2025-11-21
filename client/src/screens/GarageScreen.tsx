import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegram } from '../contexts/TelegramContext';

const GarageScreen = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const [showCarModal, setShowCarModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#F97316');
  const [kilometers] = useState(() => {
    const saved = localStorage.getItem('kilometers');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Получаем данные пользователя из Telegram
  const userName = user?.first_name || user?.username || 'Пользователь';
  const userPhoto = user?.photo_url || null;

  const goals = JSON.parse(localStorage.getItem('goals') || '[]');
  const completedGoals = goals.filter((g: any) => g.completed).length;
  const streak = parseInt(localStorage.getItem('streak') || '0', 10);
  const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');

  const colors = [
    { value: '#FFFFFF', name: 'Белый', price: 0 },
    { value: '#1F2937', name: 'Черный', price: 0 },
    { value: '#EF4444', name: 'Красный', price: 500 },
    { value: '#F97316', name: 'Оранжевый', price: 500 },
    { value: '#EAB308', name: 'Желтый', price: 500 },
    { value: '#22C55E', name: 'Зеленый', price: 500 },
    { value: '#3B82F6', name: 'Синий', price: 500 },
    { value: '#8B5CF6', name: 'Фиолетовый', price: 500 }
  ];

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <header className="flex items-center p-4 pt-6 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/map')}
          className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </motion.button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12" style={{ fontFamily: 'Inter, sans-serif' }}>
          Гараж
        </h1>
      </header>

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden px-4 py-4">
        {/* Информация о пользователе */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex gap-4 flex-col items-center"
          >
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white dark:border-[#1a2332] shadow-md bg-primary/20 flex items-center justify-center overflow-hidden">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-6xl text-primary">person</span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                {userName}
              </p>
              <p className="text-text-light/70 dark:text-text-dark/70 text-base font-normal leading-normal text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                Исследователь {Math.floor(completedGoals / 3) + 1} уровня
              </p>
            </div>
          </motion.div>
        </div>

        {/* Прогресс до следующего уровня */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-text-light dark:text-text-dark text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Следующий уровень
            </p>
            <p className="text-text-light dark:text-text-dark text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              {completedGoals * 100} / {(Math.floor(completedGoals / 3) + 1) * 300} XP
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((completedGoals * 100) / ((Math.floor(completedGoals / 3) + 1) * 300) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
              className="bg-primary h-2.5 rounded-full"
            />
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm"
          >
            <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-medium mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Целей завершено
            </p>
            <p className="text-text-light dark:text-text-dark text-3xl font-bold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {completedGoals}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm"
          >
            <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-medium mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Км пройдено
            </p>
            <p className="text-text-light dark:text-text-dark text-3xl font-bold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {kilometers.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm"
          >
            <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-medium mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Текущая серия
            </p>
            <p className="text-text-light dark:text-text-dark text-3xl font-bold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {streak} дней
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm"
          >
            <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-medium mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Караваны
            </p>
            <p className="text-text-light dark:text-text-dark text-3xl font-bold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {caravans.length}
            </p>
          </motion.div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col gap-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCarModal(true)}
            className="w-full py-4 rounded-xl bg-card-light dark:bg-card-dark border-2 border-primary text-primary font-bold text-base shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Мой автомобиль
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/shop')}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Магазин
          </motion.button>
        </div>
      </main>

      {/* Нижнее меню */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 bg-card-light/90 dark:bg-card-dark/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center h-20 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/caravans')}
            className="flex flex-col items-center justify-center gap-1 text-text-light/70 dark:text-text-dark/70"
          >
            <span className="material-symbols-outlined">groups</span>
            <span className="text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Караван</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/map')}
            className="flex flex-col items-center justify-center gap-1 text-text-light/70 dark:text-text-dark/70"
          >
            <span className="material-symbols-outlined">map</span>
            <span className="text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Карта</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/garage')}
            className="flex flex-col items-center justify-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined fill-icon">garage</span>
            <span className="text-xs font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Гараж</span>
          </motion.button>
        </div>
      </nav>

      {/* Модальное окно "Мой автомобиль" */}
      <AnimatePresence>
        {showCarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-background-light dark:bg-background-dark rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Мой автомобиль
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCarModal(false)}
                  className="flex items-center justify-center size-10 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark"
                >
                  <span className="material-symbols-outlined">close</span>
                </motion.button>
              </div>

              {/* Изображение автомобиля */}
              <div className="flex w-full bg-background-light dark:bg-background-dark py-4 mb-6">
                <div className="w-full gap-1 overflow-hidden bg-background-light dark:bg-background-dark aspect-[3/2] flex">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-center bg-no-repeat bg-contain aspect-auto rounded-xl flex-1"
                    style={{
                      backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuDA_C2UnZGMGNY14CD2zTrp22qXtGsVP5twDxSkg_GsIQ-dsDXd3FQY0jvUCKpS5BHyN4ZnQsI6EcEst3aAaDQzWOqc3WE3FYDtc91lCUgzMHvlHyipIb7xYkOLfOOfhv11zuBOSsL53u9Je3txqY1SSxNdGqIEky52uUIGZ7ZG1uPvc38GUmpsz0p3pLQgXIhlX7a9656HsmmXPobbP54iqaVQJCjpYqKlcwvEv57ZTSpREadS5FHWddb8IdhYrUZf96HUVYFTw_Zl)`,
                      filter: `hue-rotate(${colors.findIndex(c => c.value === selectedColor) * 45}deg)`
                    }}
                  />
                </div>
              </div>

              {/* Выбор цвета */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Цвет кузова
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color, index) => (
                    <motion.label
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`size-12 rounded-full border-2 cursor-pointer transition-all ${
                        selectedColor === color.value
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      <input
                        type="radio"
                        name="body-color-selector"
                        value={color.value}
                        checked={selectedColor === color.value}
                        onChange={() => setSelectedColor(color.value)}
                        className="invisible"
                      />
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Кнопка применить */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Сохраняем выбранный цвет
                  localStorage.setItem('carColor', selectedColor);
                  setShowCarModal(false);
                }}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base shadow-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Применить изменения
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GarageScreen;
