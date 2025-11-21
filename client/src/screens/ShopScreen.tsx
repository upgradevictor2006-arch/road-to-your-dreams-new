import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: 'car' | 'color' | 'wheel' | 'accessory';
  image?: string;
  icon?: string;
  color?: string;
}

const ShopScreen = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'car' | 'color' | 'wheel' | 'accessory'>('all');
  const [kilometers] = useState(() => {
    const saved = localStorage.getItem('kilometers');
    return saved ? parseInt(saved, 10) : 0;
  });

  const shopItems: ShopItem[] = [
    // Автомобили
    { id: '1', name: 'Спортивный автомобиль', price: 2000, category: 'car', icon: 'directions_car' },
    { id: '2', name: 'Роскошный седан', price: 3000, category: 'car', icon: 'directions_car' },
    { id: '3', name: 'Внедорожник', price: 2500, category: 'car', icon: 'airport_shuttle' },
    { id: '4', name: 'Спортивный купе', price: 3500, category: 'car', icon: 'sports_motorsports' },
    { id: '5', name: 'Электромобиль', price: 4000, category: 'car', icon: 'electric_car' },
    { id: '6', name: 'Ретро автомобиль', price: 4500, category: 'car', icon: 'time_to_leave' },
    
    // Цвета
    { id: '7', name: 'Классический белый', price: 0, category: 'color', color: '#FFFFFF' },
    { id: '8', name: 'Элегантный черный', price: 0, category: 'color', color: '#1F2937' },
    { id: '9', name: 'Страстный красный', price: 500, category: 'color', color: '#EF4444' },
    { id: '10', name: 'Солнечный оранжевый', price: 500, category: 'color', color: '#F97316' },
    { id: '11', name: 'Золотой желтый', price: 500, category: 'color', color: '#EAB308' },
    { id: '12', name: 'Свежий зеленый', price: 500, category: 'color', color: '#22C55E' },
    { id: '13', name: 'Небесный синий', price: 500, category: 'color', color: '#3B82F6' },
    { id: '14', name: 'Королевский фиолетовый', price: 500, category: 'color', color: '#8B5CF6' },
    { id: '15', name: 'Розовый', price: 750, category: 'color', color: '#EC4899' },
    { id: '16', name: 'Бирюзовый', price: 750, category: 'color', color: '#14B8A6' },
    { id: '17', name: 'Металлик серебро', price: 1000, category: 'color', color: '#94A3B8' },
    { id: '18', name: 'Металлик золото', price: 1500, category: 'color', color: '#FCD34D' },
    
    // Колеса
    { id: '19', name: 'Стандартные колеса', price: 0, category: 'wheel', icon: 'settings' },
    { id: '20', name: 'Хромированные колеса', price: 1000, category: 'wheel', icon: 'settings' },
    { id: '21', name: 'Гоночные колеса', price: 1500, category: 'wheel', icon: 'settings' },
    { id: '22', name: 'Спортивные диски', price: 2000, category: 'wheel', icon: 'settings' },
    { id: '23', name: 'Премиум диски', price: 3000, category: 'wheel', icon: 'settings' },
    
    // Аксессуары
    { id: '24', name: 'Спойлер', price: 800, category: 'accessory', icon: 'speed' },
    { id: '25', name: 'Неоновая подсветка', price: 1200, category: 'accessory', icon: 'light_mode' },
    { id: '26', name: 'Тонировка стекол', price: 1000, category: 'accessory', icon: 'filter_vintage' },
    { id: '27', name: 'Декали', price: 600, category: 'accessory', icon: 'style' },
    { id: '28', name: 'Антенна', price: 400, category: 'accessory', icon: 'signal_cellular_alt' },
    { id: '29', name: 'Багажник на крышу', price: 1500, category: 'accessory', icon: 'luggage' },
    { id: '30', name: 'Защита бампера', price: 900, category: 'accessory', icon: 'shield' }
  ];

  const categories = [
    { id: 'all' as const, label: 'Все' },
    { id: 'car' as const, label: 'Автомобили' },
    { id: 'color' as const, label: 'Цвета' },
    { id: 'wheel' as const, label: 'Колеса' },
    { id: 'accessory' as const, label: 'Аксессуары' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (kilometers >= item.price) {
      const newKilometers = kilometers - item.price;
      localStorage.setItem('kilometers', newKilometers.toString());
      alert(`Куплено: ${item.name}!`);
      window.location.reload(); // Обновляем страницу для обновления баланса
    } else {
      alert('Недостаточно километров!');
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
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
          Магазин
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-primary text-base font-bold">{kilometers.toLocaleString()}</p>
          <span className="material-symbols-outlined text-primary">route</span>
          <span className="text-xs text-text-light/70 dark:text-text-dark/70">км</span>
        </div>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark'
            }`}
          >
            <span style={{ fontFamily: 'Inter, sans-serif' }}>{category.label}</span>
          </motion.button>
        ))}
      </div>

      <main className="grid grid-cols-2 gap-4 p-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col gap-3 rounded-lg bg-card-light dark:bg-card-dark p-4 shadow-sm"
          >
            <div className="aspect-square rounded-lg bg-background-light dark:bg-background-dark flex items-center justify-center">
              {item.color ? (
                <div className="w-full h-full rounded-lg" style={{ backgroundColor: item.color }} />
              ) : (
                <span className="material-symbols-outlined text-6xl text-primary">
                  {item.icon || 'shopping_bag'}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.name}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <p className="text-primary font-bold">{item.price}</p>
                  <span className="material-symbols-outlined text-primary text-sm">toll</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePurchase(item)}
                  disabled={kilometers < item.price}
                  className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Купить
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default ShopScreen;

