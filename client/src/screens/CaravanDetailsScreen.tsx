import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Caravan {
  id: string;
  name: string;
  description?: string;
  members: number;
  maxMembers: number;
  progress: number;
  icon: string;
  iconColor: string;
  status: 'in-progress' | 'public' | 'completed';
  avatars: string[];
  goalId?: string;
  memberIds?: string[];
}

const CaravanDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [caravan, setCaravan] = useState<Caravan | null>(null);

  useEffect(() => {
    if (id) {
      const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
      const foundCaravan = caravans.find((c: Caravan) => c.id === id);
      setCaravan(foundCaravan || null);
    }
  }, [id]);

  const handleInvite = () => {
    // Логика приглашения участников
    // Можно использовать Telegram WebApp для приглашения
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.showAlert('Функция приглашения будет доступна в следующем обновлении');
    } else {
      alert('Функция приглашения будет доступна в следующем обновлении');
    }
  };

  if (!caravan) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden items-center justify-center">
        <p className="text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Караван не найден
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/caravans')}
          className="mt-4 px-6 py-3 rounded-xl bg-primary text-white font-medium"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Назад
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <header className="flex items-center p-4 pt-6 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/caravans')}
          className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </motion.button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12" style={{ fontFamily: 'Inter, sans-serif' }}>
          {caravan.name}
        </h1>
      </header>

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden px-4 py-4">
        <div className="space-y-6">
          {/* Иконка и основная информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-24 flex items-center justify-center"
              style={{ backgroundColor: `${caravan.iconColor}20` }}
            >
              <span className="material-symbols-outlined text-6xl" style={{ color: caravan.iconColor }}>
                {caravan.icon}
              </span>
            </div>
            {caravan.description && (
              <p className="text-text-light/70 dark:text-text-dark/70 text-center max-w-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                {caravan.description}
              </p>
            )}
          </motion.div>

          {/* Прогресс */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-light dark:text-text-dark font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Прогресс</h3>
              <p className="font-bold text-lg" style={{ color: caravan.iconColor }}>
                {caravan.progress}%
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${caravan.progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-3 rounded-full"
                style={{ backgroundColor: caravan.iconColor }}
              />
            </div>
          </motion.div>

          {/* Участники */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card-light dark:bg-card-dark rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-text-light dark:text-text-dark font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Участники ({caravan.members} / {caravan.maxMembers})
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {caravan.avatars.map((avatar, idx) => (
                <img
                  key={idx}
                  className="inline-block h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  src={avatar}
                  alt={`Member ${idx + 1}`}
                />
              ))}
              {caravan.members < caravan.maxMembers && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleInvite}
                  className="h-12 w-12 rounded-full bg-primary/20 border-2 border-dashed border-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-primary">add</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Кнопка перехода к карте */}
          {caravan.goalId && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/map', { state: { goalId: caravan.goalId } })}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Перейти к карте
            </motion.button>
          )}

          {/* Кнопка приглашения */}
          {caravan.members < caravan.maxMembers && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInvite}
              className="w-full py-4 rounded-xl bg-card-light dark:bg-card-dark border-2 border-primary text-primary font-bold text-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Пригласить участников
            </motion.button>
          )}
        </div>
      </main>

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

export default CaravanDetailsScreen;

