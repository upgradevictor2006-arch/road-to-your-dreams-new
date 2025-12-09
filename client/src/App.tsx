import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider } from './contexts/TelegramContext';
import { AnimatePresence } from 'framer-motion';
import { goalsStorage } from './services/storage';
import Preloader from './components/Preloader';
import OnboardingScreen from './screens/OnboardingScreen';
import GoalsListScreen from './screens/GoalsListScreen';
import CreateDreamIntroScreen from './screens/CreateDreamIntroScreen';
import CreateGoalBasicInfo from './screens/CreateGoalBasicInfo';
import CreateGoalAIPlanning from './screens/CreateGoalAIPlanning';
import CreateGoalDeadline from './screens/CreateGoalDeadline';
import CreateGoalCheckpoints from './screens/CreateGoalCheckpoints';
import CreateGoalDailyTask from './screens/CreateGoalDailyTask';
import MapScreen from './screens/MapScreen';
import GarageScreen from './screens/GarageScreen';
import CaravanListScreen from './screens/CaravanListScreen';
import CaravanDetailsScreen from './screens/CaravanDetailsScreen';
import CaravanTypeSelection from './screens/CaravanTypeSelection';
import CaravanBasicInfo from './screens/CaravanBasicInfo';
import CaravanCreateGoalBasicInfo from './screens/CaravanCreateGoalBasicInfo';
import CaravanCreateChallenge from './screens/CaravanCreateChallenge';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ShopScreen from './screens/ShopScreen';
import './App.css';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [hasGoals, setHasGoals] = useState<boolean>(false);

  useEffect(() => {
    // Принудительно скрываем прелоадер через максимум 5 секунд
    const forceHidePreloader = setTimeout(() => {
      console.warn('Force hiding preloader after timeout');
      setShowPreloader(false);
    }, 5000);

    const initializeApp = async () => {
      try {
        // Проверяем, первый ли это запуск приложения
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        const firstLaunch = hasSeenOnboarding === null;
        setIsFirstLaunch(firstLaunch);
        
        // Проверяем наличие целей - используем синхронную проверку localStorage
        let goalsExist = false;
        try {
          // Проверяем localStorage напрямую (быстро и синхронно)
          const localGoals = localStorage.getItem('goals');
          if (localGoals) {
            try {
              const parsed = JSON.parse(localGoals);
              goalsExist = Array.isArray(parsed) && parsed.length > 0;
            } catch (parseError) {
              console.error('Error parsing goals from localStorage:', parseError);
              goalsExist = false;
            }
          }
        } catch (error) {
          console.error('Error checking goals:', error);
          goalsExist = false;
        }
        
        setHasGoals(goalsExist);
      } catch (error) {
        console.error('Error initializing app:', error);
        // В случае любой ошибки показываем экран создания цели
        setIsFirstLaunch(false);
        setHasGoals(false);
      }
    };

    initializeApp();

    return () => {
      clearTimeout(forceHidePreloader);
    };
  }, []);

  const handlePreloaderComplete = () => {
    console.log('Preloader complete callback called');
    setShowPreloader(false);
  };

  const handleOnboardingComplete = async () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsFirstLaunch(false);
    // После онбординга проверяем наличие целей
    try {
      const goals = await goalsStorage.getAll();
      setHasGoals(Array.isArray(goals) && goals.length > 0);
    } catch (error) {
      console.error('Error loading goals:', error);
      setHasGoals(false);
    }
  };

  // Показываем прелоадер при каждой загрузке
  if (showPreloader) {
    return (
      <TelegramProvider>
        <Preloader onComplete={handlePreloaderComplete} />
      </TelegramProvider>
    );
  }

  // После прелоадера показываем онбординг или основное приложение
  return (
    <TelegramProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                isFirstLaunch ? (
                  <OnboardingScreen onComplete={handleOnboardingComplete} />
                ) : hasGoals ? (
                  <Navigate to="/map" replace />
                ) : (
                  <Navigate to="/create-dream-intro" replace />
                )
              } 
            />
            <Route path="/create-dream-intro" element={<CreateDreamIntroScreen />} />
            <Route path="/goals" element={<GoalsListScreen />} />
            <Route path="/create-goal/basic" element={<CreateGoalBasicInfo />} />
            <Route path="/create-goal/ai-planning" element={<CreateGoalAIPlanning />} />
            <Route path="/create-goal/deadline" element={<CreateGoalDeadline />} />
            <Route path="/create-goal/checkpoints" element={<CreateGoalCheckpoints />} />
            <Route path="/create-goal/daily-task" element={<CreateGoalDailyTask />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/garage" element={<GarageScreen />} />
            <Route path="/caravans" element={<CaravanListScreen />} />
            <Route path="/caravans/:id" element={<CaravanDetailsScreen />} />
            <Route path="/caravans/create/type" element={<CaravanTypeSelection />} />
            <Route path="/caravans/create/basic" element={<CaravanBasicInfo />} />
            <Route path="/caravans/create/challenge" element={<CaravanCreateChallenge />} />
            <Route path="/caravans/create/goal/basic" element={<CaravanCreateGoalBasicInfo />} />
            <Route path="/caravans/create/goal/deadline" element={<CreateGoalDeadline />} />
            <Route path="/caravans/create/goal/checkpoints" element={<CreateGoalCheckpoints />} />
            <Route path="/caravans/create/goal/daily-task" element={<CreateGoalDailyTask />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TelegramProvider>
  );
}

export default App;
