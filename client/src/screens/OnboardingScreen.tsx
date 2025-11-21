import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const titleWords = ["ROAD", "TO", "YOUR", "DREAM"];

const onboardingScreens = [
  {
    subtitle: "Ваше путешествие к достижениям начинается сейчас.",
    description: "Маленькие, но постоянные шаги ведут к большим достижениям. Мы будем вашим спутником на пути к успеху.",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE26df2NsD8ABDcVp1EE2vfWTVsUaCL0UDkMw8-qxjqdfFv0QgEAJa43rqA-XPkuUqBBpcMA7HqheRlfclAyVFh-6_SOxpomcylDshcBdPQ-YKy3OtXJMZ_a4oE6Ht7Xg8pk5__WYylBu1FDCZz3y5X4ocKGyUWW8gAnT5O97tlyjhT145RUQOpSWkdwLEwX5IyWyi4w9AIePftHj_WyMbh5zE0GLLHdcPmqsDjWSSK1qU5bpxQ2HvY2ocOyUzhDf7aMlx8pnvRo6V"
  },
  {
    subtitle: "Каждое великое путешествие начинается с цели.",
    description: "Определите, чего вы хотите достичь, и наблюдайте, как ваши мечты становятся реальностью.",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE26df2NsD8ABDcVp1EE2vfWTVsUaCL0UDkMw8-qxjqdfFv0QgEAJa43rqA-XPkuUqBBpcMA7HqheRlfclAyVFh-6_SOxpomcylDshcBdPQ-YKy3OtXJMZ_a4oE6Ht7Xg8pk5__WYylBu1FDCZz3y5X4ocKGyUWW8gAnT5O97tlyjhT145RUQOpSWkdwLEwX5IyWyi4w9AIePftHj_WyMbh5zE0GLLHdcPmqsDjWSSK1qU5bpxQ2HvY2ocOyUzhDf7aMlx8pnvRo6V"
  },
  {
    subtitle: "Следите за своим прогрессом на карте.",
    description: "Каждая выполненная задача приближает вас к цели. Визуализируйте свой прогресс в реальном времени.",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE26df2NsD8ABDcVp1EE2vfWTVsUaCL0UDkMw8-qxjqdfFv0QgEAJa43rqA-XPkuUqBBpcMA7HqheRlfclAyVFh-6_SOxpomcylDshcBdPQ-YKy3OtXJMZ_a4oE6Ht7Xg8pk5__WYylBu1FDCZz3y5X4ocKGyUWW8gAnT5O97tlyjhT145RUQOpSWkdwLEwX5IyWyi4w9AIePftHj_WyMbh5zE0GLLHdcPmqsDjWSSK1qU5bpxQ2HvY2ocOyUzhDf7aMlx8pnvRo6V"
  },
  {
    subtitle: "Путешествуйте вместе с друзьями.",
    description: "Создавайте караваны, участвуйте в челленджах и достигайте целей вместе. Вы никогда не одиноки в этом путешествии.",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE26df2NsD8ABDcVp1EE2vfWTVsUaCL0UDkMw8-qxjqdfFv0QgEAJa43rqA-XPkuUqBBpcMA7HqheRlfclAyVFh-6_SOxpomcylDshcBdPQ-YKy3OtXJMZ_a4oE6Ht7Xg8pk5__WYylBu1FDCZz3y5X4ocKGyUWW8gAnT5O97tlyjhT145RUQOpSWkdwLEwX5IyWyi4w9AIePftHj_WyMbh5zE0GLLHdcPmqsDjWSSK1qU5bpxQ2HvY2ocOyUzhDf7aMlx8pnvRo6V"
  }
];

interface OnboardingScreenProps {
  onComplete?: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Сохраняем, что онбординг пройден
      localStorage.setItem('hasSeenOnboarding', 'true');
      if (onComplete) {
        onComplete();
      }
      navigate('/goals');
    }
  };

  const current = onboardingScreens[currentScreen];
  // Количество активных слов на текущем экране (начиная с 1)
  const activeWordsCount = currentScreen + 1;

  return (
    <div className="relative flex h-screen w-full flex-col font-display overflow-x-hidden">
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${current.backgroundImage})` }}
        />
        {/* Усиленное затемнение для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between flex-grow min-h-screen p-6 text-center text-off-white">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Заголовок с постепенным подсвечиванием слов */}
                <h1 className="tracking-tight text-[36px] font-extrabold leading-tight px-4 pb-12 flex flex-wrap justify-center gap-2">
                  {titleWords.map((word, index) => {
                    const isActive = index < activeWordsCount;
                    return (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0.3 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.3
                        }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={isActive ? 'text-off-white' : 'text-off-white/30'}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </h1>
                <h2 className="text-off-white text-xl font-semibold leading-relaxed tracking-tight px-4 pb-5" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', fontWeight: 600 }}>
                  {current.subtitle}
                </h2>
                <p className="text-off-white/95 text-[17px] font-light leading-[1.75] px-4" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.015em', fontWeight: 300 }}>
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full max-w-md pb-6">
          <div className="flex items-center justify-center space-x-2 py-4">
            {onboardingScreens.map((_, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  width: index === currentScreen ? '1.5rem' : '0.5rem',
                  height: index === currentScreen ? '0.5rem' : '0.5rem',
                  backgroundColor: index === currentScreen ? '#F5F5F5' : 'rgba(245, 245, 245, 0.4)',
                }}
                transition={{ duration: 0.3 }}
                className="rounded-full"
              />
            ))}
          </div>

          <div className="flex px-4 pt-8 pb-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 flex-1 bg-sunset-orange text-off-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-sunset-orange/30"
            >
              <span className="truncate">
                {currentScreen === onboardingScreens.length - 1 ? 'Начать путешествие' : 'Далее'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;

