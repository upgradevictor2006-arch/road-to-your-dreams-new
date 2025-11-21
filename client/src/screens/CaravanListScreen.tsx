import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Caravan {
  id: string;
  name: string;
  members: number;
  maxMembers: number;
  progress: number;
  icon: string;
  iconColor: string;
  status: 'in-progress' | 'public' | 'completed';
  avatars: string[];
  goalId?: string; // ID связанной цели
}

const CaravanListScreen = () => {
  const navigate = useNavigate();
  const [caravans, setCaravans] = useState<Caravan[]>([]);

  useEffect(() => {
    // Загружаем караваны из localStorage
    const savedCaravans = JSON.parse(localStorage.getItem('caravans') || '[]');
    setCaravans(savedCaravans);
  }, []);

  const handleCaravanClick = (caravanId: string) => {
    navigate(`/caravans/${caravanId}`);
  };

  const handleCreateCaravan = () => {
    navigate('/caravans/create/type');
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <header className="flex items-center p-4 pt-6 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Караваны
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden px-4">
        {caravans.length === 0 ? (
          // Пустая страница с кнопкой создания
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-6xl mb-4">🚗</div>
              <h2 className="text-text-light dark:text-text-dark text-xl font-bold text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                Создай свой караван
              </h2>
              <p className="text-text-light/70 dark:text-text-dark/70 text-center max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                Двигайся к цели вместе с друзьями
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateCaravan}
                className="mt-4 px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Создать караван
              </motion.button>
            </motion.div>
          </div>
        ) : (
          // Список караванов
          <div className="space-y-4 py-4">
            {caravans.map((caravan, index) => (
              <motion.div
                key={caravan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCaravanClick(caravan.id)}
                className="flex flex-col gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 flex items-center justify-center"
                    style={{ backgroundColor: `${caravan.iconColor}20` }}
                  >
                    <span className="material-symbols-outlined text-4xl" style={{ color: caravan.iconColor }}>
                      {caravan.icon}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {caravan.name}
                    </p>
                    <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {caravan.members} / {caravan.maxMembers} участников
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="material-symbols-outlined text-text-light/70 dark:text-text-dark/70">key</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-text-light/70 dark:text-text-dark/70 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Прогресс</p>
                    <p className="font-semibold text-sm" style={{ color: caravan.iconColor }}>
                      {caravan.progress}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${caravan.progress}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: caravan.iconColor }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-3">
                      {caravan.avatars.slice(0, 3).map((avatar, idx) => (
                        <img
                          key={idx}
                          className="inline-block h-9 w-9 rounded-full ring-2 ring-background-light dark:ring-background-dark object-cover"
                          src={avatar}
                          alt={`Member ${idx + 1}`}
                        />
                      ))}
                      {caravan.members > 3 && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-background-light dark:ring-background-dark text-xs font-medium text-text-light/70 dark:text-text-dark/70">
                          +{caravan.members - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  {caravan.goalId && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/map', { state: { goalId: caravan.goalId } });
                      }}
                      className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      К карте
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Кнопка создания каравана (если есть караваны) */}
      {caravans.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCreateCaravan}
          className="absolute z-40 right-6 bottom-28 h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
        >
          <span className="material-symbols-outlined !text-3xl">add</span>
        </motion.button>
      )}

      {/* Нижнее меню */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 bg-card-light/90 dark:bg-card-dark/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center h-20 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/caravans')}
            className="flex flex-col items-center justify-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined fill-icon">groups</span>
            <span className="text-xs font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Караван</span>
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
            className="flex flex-col items-center justify-center gap-1 text-text-light/70 dark:text-text-dark/70"
          >
            <span className="material-symbols-outlined">garage</span>
            <span className="text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Гараж</span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
};

export default CaravanListScreen;
