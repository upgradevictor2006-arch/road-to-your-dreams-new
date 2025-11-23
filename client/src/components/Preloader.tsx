import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [stage, setStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Принудительно вызываем onComplete через максимум 4 секунды
    const forceComplete = setTimeout(() => {
      console.warn('Preloader force complete after timeout');
      onComplete();
    }, 4000);

    const timeline = [
      { delay: 150, stage: 1 },   // ROAD вылетает слева
      { delay: 400, stage: 2 },  // TO вылетает справа (после того как ROAD продвинулся)
      { delay: 400, stage: 3 },  // YOUR вылетает слева
      { delay: 400, stage: 4 },  // DREAM вылетает справа
      { delay: 600, stage: 5 },  // Все слова доехали до центра, останавливаются
      { delay: 200, stage: 7 },  // Пауза (уменьшена)
      { delay: 150, stage: 8 },   // Все пропадает
      { delay: 100, stage: 9 },   // Появляется логотип
      { delay: 800, stage: 10 },  // Пауза перед переходом (увеличено для логотипа)
    ];

    let currentIndex = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let completed = false;

    const runTimeline = () => {
      if (currentIndex < timeline.length) {
        const { delay, stage: nextStage } = timeline[currentIndex];
        const timer = setTimeout(() => {
          setStage(nextStage);
          currentIndex++;
          if (currentIndex < timeline.length) {
            runTimeline();
          } else {
            // Последняя пауза перед завершением
            setTimeout(() => {
              if (!completed) {
                completed = true;
                clearTimeout(forceComplete);
                onComplete();
              }
            }, 300);
          }
        }, delay);
        timers.push(timer);
      }
    };

    runTimeline();

    return () => {
      clearTimeout(forceComplete);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  // Непрерывное движение вверх
  useEffect(() => {
    if (stage >= 1 && stage < 5) {
      const interval = setInterval(() => {
        setScrollY((prev) => {
          // Финальная позиция: 0 (фраза по центру, без смещения)
          const finalY = 0;
          const newY = prev - 0.4; // Плавное движение вверх
          // Останавливаемся когда достигли финальной позиции
          if (newY <= finalY) {
            return finalY;
          }
          return newY;
        });
      }, 16); // ~60fps

      return () => clearInterval(interval);
    } else if (stage >= 5) {
      setScrollY(0); // Финальная позиция - центр экрана
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 bg-background-dark z-50 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Контейнер для всех слов - центрируется */}
        <AnimatePresence mode="wait">
          {stage >= 1 && stage < 8 && (
            <motion.div
              key="words"
              initial={{ opacity: 0, y: 0 }}
              animate={{ 
                opacity: stage >= 8 ? 0 : 1,
                y: scrollY
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                y: {
                  duration: 0,
                  ease: 'linear'
                }
              }}
              className="flex flex-col items-center justify-center gap-0"
            >
              {/* Слово ROAD - вылетает слева, затем движется вверх */}
              <AnimatePresence>
                {stage >= 1 && (
                  <motion.div
                    key="road"
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-off-white text-6xl font-extrabold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    ROAD
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Слово TO - вылетает справа, затем движется вверх */}
              <AnimatePresence>
                {stage >= 2 && (
                  <motion.div
                    key="to"
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-off-white text-6xl font-extrabold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    TO
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Слово YOUR - вылетает слева, затем движется вверх */}
              <AnimatePresence>
                {stage >= 3 && (
                  <motion.div
                    key="your"
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-off-white text-6xl font-extrabold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    YOUR
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Слово DREAM - вылетает справа, затем движется вверх */}
              <AnimatePresence>
                {stage >= 4 && (
                  <motion.div
                    key="dream"
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-off-white text-6xl font-extrabold"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    DREAM
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Логотип - появляется после всех слов */}
          {stage >= 9 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.1, 0.25, 1] 
              }}
              className="flex items-center justify-center"
            >
              <img
                src="/ico.png"
                alt="Logo"
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Preloader;

