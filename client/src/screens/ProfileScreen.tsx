import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileScreen = () => {
  const navigate = useNavigate();

  const achievements = [
    { id: 1, name: 'Первая цель', icon: 'flag', unlocked: true },
    { id: 2, name: '100 км пройдено', icon: 'add_road', unlocked: true },
    { id: 3, name: 'Серия 7 дней', icon: 'local_fire_department', unlocked: true },
    { id: 4, name: 'Воин дорог', icon: 'lock', unlocked: false },
    { id: 5, name: 'На волне', icon: 'lock', unlocked: false },
    { id: 6, name: 'Мастер карт', icon: 'lock', unlocked: false }
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10"></div>
        <h1 className="text-xl font-bold text-[#0d121b] dark:text-[#f8f9fc]" style={{ fontFamily: 'Inter, sans-serif' }}>Профиль</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center w-10 h-10 text-[#0d121b] dark:text-[#f8f9fc]"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
        </motion.button>
      </div>

      <div className="flex p-4">
        <div className="flex w-full flex-col gap-4 items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex gap-4 flex-col items-center"
          >
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-white dark:border-[#1a2332] shadow-md bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-primary">person</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[#0d121b] dark:text-[#f8f9fc] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                RoadTripper
              </p>
              <p className="text-[#4c669a] dark:text-[#a6b4d3] text-base font-normal leading-normal text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                Исследователь 12 уровня
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-sm font-medium text-[#0d121b] dark:text-[#f8f9fc]" style={{ fontFamily: 'Inter, sans-serif' }}>Следующий уровень</p>
          <p className="text-[#4c669a] dark:text-[#a6b4d3] text-sm font-normal leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            1200 / 2000 XP
          </p>
        </div>
        <div className="rounded-full bg-[#cfd7e7] dark:bg-[#2c3852]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1 }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        {[
          { label: 'Целей завершено', value: '42' },
          { label: 'Км пройдено', value: '1,280' },
          { label: 'Текущая серия', value: '14 дней' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cfd7e7] dark:border-[#2c3852] bg-white dark:bg-[#1a2332]"
          >
            <p className="text-[#4c669a] dark:text-[#a6b4d3] text-base font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
              {stat.label}
            </p>
            <p className="text-[#0d121b] dark:text-[#f8f9fc] tracking-light text-2xl font-bold leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex w-full max-w-[480px] gap-3 p-4 mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/garage')}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-[#e7ebf3] dark:bg-[#2c3852] text-[#0d121b] dark:text-[#f8f9fc] text-sm font-bold leading-normal tracking-[0.015em] flex-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="truncate">Мой автомобиль</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/shop')}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-primary text-[#f8f9fc] text-sm font-bold leading-normal tracking-[0.015em] flex-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="truncate">Магазин</span>
        </motion.button>
      </div>

      <div className="flex justify-between items-center px-4 pb-3 pt-5">
        <h2 className="text-[#0d121b] dark:text-[#f8f9fc] text-[22px] font-bold leading-tight tracking-[-0.015em]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Достижения
        </h2>
        <a className="text-primary text-sm font-bold" href="#" style={{ fontFamily: 'Inter, sans-serif' }}>
          Смотреть все
        </a>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 p-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center gap-2 ${!achievement.unlocked ? 'opacity-40' : ''}`}
          >
            <div className="w-24 h-24 bg-cover bg-center flex flex-col items-center rounded-full justify-center aspect-square shadow-lg bg-primary/20">
              <span className="material-symbols-outlined text-white text-4xl">
                {achievement.icon}
              </span>
            </div>
            <p className="text-[#0d121b] dark:text-[#f8f9fc] text-sm font-medium leading-tight text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              {achievement.name}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="h-5"></div>
    </div>
  );
};

export default ProfileScreen;

