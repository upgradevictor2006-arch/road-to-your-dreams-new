import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsItems = [
    { id: 'account', label: 'Аккаунт', icon: 'person', action: () => {} },
    { id: 'notifications', label: 'Уведомления', icon: 'notifications', toggle: notifications, onToggle: setNotifications },
    { id: 'theme', label: 'Темная тема', icon: 'dark_mode', toggle: darkMode, onToggle: setDarkMode },
    { id: 'language', label: 'Язык', icon: 'language', action: () => {} },
    { id: 'privacy', label: 'Конфиденциальность', icon: 'lock', action: () => {} },
    { id: 'about', label: 'О приложении', icon: 'info', action: () => {} },
    { id: 'help', label: 'Помощь и поддержка', icon: 'help', action: () => {} }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden"
    >
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/profile')}
          className="flex size-12 shrink-0 items-center justify-start text-text-light dark:text-text-dark"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </motion.button>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Настройки
        </h1>
        <div className="w-12"></div>
      </div>

      <main className="flex flex-col gap-2 p-4">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="flex items-center justify-between p-4 rounded-lg bg-card-light dark:bg-card-dark shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                {item.icon}
              </span>
              <span className="text-base font-medium text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.label}
              </span>
            </div>
            {item.toggle !== undefined ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onToggle?.(!item.toggle);
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  item.toggle ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: item.toggle ? 24 : 0 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </motion.button>
            ) : (
              <span className="material-symbols-outlined text-text-light/50 dark:text-text-dark/50">
                chevron_right
              </span>
            )}
          </motion.div>
        ))}
      </main>
    </motion.div>
  );
};

export default SettingsScreen;

