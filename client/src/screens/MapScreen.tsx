import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleRoadMap from '../components/SimpleRoadMap';

const MapScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(12);
  const [currentGoal, setCurrentGoal] = useState<any>(null);
  const [dailyTaskCompleted, setDailyTaskCompleted] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showNewDailyTaskModal, setShowNewDailyTaskModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mapOffset, setMapOffset] = useState(0);
  const [completedDailyTasks, setCompletedDailyTasks] = useState<Array<{ task: string; completed: boolean }>>([]);
  const [showSadAnimation, setShowSadAnimation] = useState(false);
  const [showCheckpointModal, setShowCheckpointModal] = useState(false);
  const [pendingCheckpoint, setPendingCheckpoint] = useState<any>(null);
  const [shouldShowNewTaskModal, setShouldShowNewTaskModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [kilometers, setKilometers] = useState(0);
  const [caravanMembers, setCaravanMembers] = useState<any[]>([]);
  const [taskTimer, setTaskTimer] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [canSkipTask, setCanSkipTask] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Загружаем стрик из localStorage
    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
    
    // Загружаем километры из localStorage
    const savedKilometers = localStorage.getItem('kilometers');
    if (savedKilometers) {
      setKilometers(parseInt(savedKilometers, 10));
    } else {
      setKilometers(0);
      localStorage.setItem('kilometers', '0');
    }
    
    // Получаем данные о цели из location.state, query параметров или localStorage
    let goal: any = null;
    const goalId = location.state?.goalId || new URLSearchParams(location.search).get('goal');
    if (goalId) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      goal = goals.find((g: any) => g.id === goalId);
    }
    
    // Если цель не найдена, берем первую из списка
    if (!goal) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      if (goals.length > 0) {
        goal = goals[0];
      }
    }
    
    if (goal) {
      // Для челленджей проверяем, нужно ли сбросить флаг выполнения задачи (если прошёл новый день)
      if (goal.isChallenge && goal.dailyTaskCompleted) {
        const lastCompletedDate = goal.lastTaskCompletedDate;
        const today = new Date().toISOString().split('T')[0];
        
        // Если задача была выполнена не сегодня, сбрасываем флаг
        if (lastCompletedDate !== today) {
          goal.dailyTaskCompleted = false;
          const goals = JSON.parse(localStorage.getItem('goals') || '[]');
          const updatedGoals = goals.map((g: any) => 
            g.id === goal.id 
              ? { ...g, dailyTaskCompleted: false }
              : g
          );
          localStorage.setItem('goals', JSON.stringify(updatedGoals));
        }
      }
      
      setCurrentGoal(goal);
      setProgress(goal.progress || 0);
      setDailyTaskCompleted(goal.dailyTaskCompleted || false);
      
      // Загружаем историю выполненных задач для этой цели
      const savedCompletedTasks = localStorage.getItem(`completedTasks_${goal.id}`);
      if (savedCompletedTasks) {
        setCompletedDailyTasks(JSON.parse(savedCompletedTasks));
      }
      
      // Инициализируем таймер для текущей задачи, если она не выполнена
      if (goal.dailyTask && !goal.dailyTaskCompleted && goal.dailyTaskStartTime) {
        const startTime = new Date(goal.dailyTaskStartTime).getTime();
        const endTime = startTime + 24 * 60 * 60 * 1000; // 24 часа
        const now = Date.now();
        
        if (now < endTime) {
          // Задача еще активна
          const remaining = endTime - now;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTaskTimer({ hours, minutes, seconds });
          
          // Проверяем, можно ли отменить задачу (осталось меньше 5 минут)
          const fiveMinutes = 5 * 60 * 1000;
          setCanSkipTask(remaining <= fiveMinutes);
          
          // Проверяем, нужно ли отправить уведомление (осталось 5 минут или меньше)
          if (remaining <= fiveMinutes && !goal.notificationSent) {
            sendNotification(goal.id, goal.dailyTask);
            // Помечаем, что уведомление отправлено
            const goals = JSON.parse(localStorage.getItem('goals') || '[]');
            const updatedGoals = goals.map((g: any) => 
              g.id === goal.id ? { ...g, notificationSent: true } : g
            );
            localStorage.setItem('goals', JSON.stringify(updatedGoals));
            setNotificationSent(true);
          }
        } else {
          // Время истекло
          setTaskTimer({ hours: 0, minutes: 0, seconds: 0 });
          setCanSkipTask(true);
        }
      } else if (goal.dailyTask && !goal.dailyTaskCompleted && !goal.dailyTaskStartTime) {
      // Если задача есть, но нет времени начала - устанавливаем его
      const startTime = new Date().toISOString();
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const updatedGoals = goals.map((g: any) => 
        g.id === goal.id ? { ...g, dailyTaskStartTime: startTime } : g
      );
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      setCurrentGoal({ ...goal, dailyTaskStartTime: startTime });
      
      // Устанавливаем таймер на 24 часа
      setTaskTimer({ hours: 24, minutes: 0, seconds: 0 });
      setCanSkipTask(false);
      
      // Планируем уведомление на сервере
      if (goal.dailyTask) {
        const tg = (window as any).Telegram?.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id;
        if (userId) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          fetch(`${API_URL}/notifications/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              goalId: goal.id,
              taskText: goal.dailyTask,
              taskStartTime: startTime,
            }),
          }).catch(err => console.error('Error scheduling notification:', err));
        }
      }
      }
      
      // Загружаем выполненные чекпоинты
      if (!goal.completedCheckpoints && goal.checkpoints) {
        goal.completedCheckpoints = new Array(goal.checkpoints.length).fill(false);
        // Сохраняем обновленную цель
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const updatedGoals = goals.map((g: any) => 
          g.id === goal.id ? goal : g
        );
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
      }
      
      // Устанавливаем дату начала цели, если она не установлена
      if (!goal.startDate) {
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const updatedGoals = goals.map((g: any) => 
          g.id === goal.id 
            ? { ...g, startDate: new Date().toISOString() }
            : g
        );
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        goal.startDate = new Date().toISOString();
      }
      
      // Загружаем данные каравана, если цель связана с караваном
      if (goal.caravanId || goal.isCaravan) {
        const caravans = JSON.parse(localStorage.getItem('caravans') || '[]');
        const foundCaravan = caravans.find((c: any) => c.id === goal.caravanId || c.goalId === goal.id);
        if (foundCaravan) {
          // Загружаем участников каравана
          if (foundCaravan.avatars && foundCaravan.avatars.length > 0) {
            setCaravanMembers(foundCaravan.avatars.map((avatar: string, idx: number) => ({
              id: foundCaravan.memberIds?.[idx] || `member-${idx}`,
              avatar: avatar,
              name: `Участник ${idx + 1}`
            })));
          } else {
            setCaravanMembers([]);
          }
        } else {
          setCaravanMembers([]);
        }
      } else {
        setCaravanMembers([]);
      }
    }
  }, [location.state]);

  // Обновляем прогресс при загрузке цели на основе выполненных чекпоинтов
  useEffect(() => {
    if (currentGoal && checkpoints.length > 0 && !currentGoal.completed) {
      const completedCheckpoints = currentGoal.completedCheckpoints || [];
      const completedCount = completedCheckpoints.filter((cp: boolean) => cp === true).length;
      const totalSegments = checkpoints.length + 1; // Чекпоинты + финальная цель
      const calculatedProgress = Math.min(Math.round((completedCount / totalSegments) * 100), 99);
      
      if (calculatedProgress !== progress) {
        setProgress(calculatedProgress);
        // Обновляем в localStorage
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const updatedGoals = goals.map((g: any) => 
          g.id === currentGoal.id 
            ? { ...g, progress: calculatedProgress }
            : g
        );
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
      }
      
      // Небольшая задержка, чтобы состояние успело обновиться
      const timer = setTimeout(() => {
        checkCheckpointCompletion();
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGoal?.id, currentGoal?.startDate, currentGoal?.completed]);

  // Проверяем чекпоинты каждый день (при изменении даты)
  useEffect(() => {
    if (currentGoal && !currentGoal.completed) {
      const interval = setInterval(() => {
        checkCheckpointCompletion();
      }, 60000); // Проверяем каждую минуту (можно изменить на нужный интервал)
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGoal?.id, currentGoal?.completed]);

  const checkpoints = currentGoal?.checkpoints || [];
  const goalTitle = currentGoal?.goalTitle || 'Моя цель';
  const dailyTask = currentGoal?.dailyTask || '';
  const selectedPeriod = currentGoal?.selectedPeriod || '';
  const deadlineType = currentGoal?.deadlineType || 'period';
  
  // Проверяем, нужно ли показывать чекпоинт вместо ежедневной задачи
  const shouldShowCheckpointInsteadOfDailyTask = () => {
    if (!currentGoal || checkpoints.length === 0) return false;
    
    if (deadlineType === 'period') {
      // Неделя с чекпоинтами на каждый день
      if (selectedPeriod === '1 неделя' && checkpoints.length === 7) {
        return true;
      }
    } else if (deadlineType === 'date' && currentGoal.selectedDate) {
      const endDate = new Date(currentGoal.selectedDate);
      const startDate = getGoalStartDate();
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Если цель на неделю или меньше и чекпоинты по дням
      if (daysDiff <= 7 && checkpoints.length === daysDiff) {
        return true;
      }
    }
    
    return false;
  };
  
  const isWeeklyWithDailyCheckpoints = shouldShowCheckpointInsteadOfDailyTask();
  
  // Получаем текущий чекпоинт для недельной цели
  const getCurrentCheckpoint = () => {
    if (!isWeeklyWithDailyCheckpoints || !currentGoal) return null;
    try {
      const completedCheckpoints = currentGoal.completedCheckpoints || [];
      
      // Находим первый невыполненный чекпоинт - показываем его всегда
      for (let i = 0; i < checkpoints.length; i++) {
        if (!completedCheckpoints[i]) {
          return { index: i, checkpoint: checkpoints[i] };
        }
      }
      return null; // Все чекпоинты выполнены
    } catch {
      return null;
    }
  };
  
  const currentCheckpoint = isWeeklyWithDailyCheckpoints && currentGoal ? getCurrentCheckpoint() : null;

  // Функция для определения количества дней, необходимых для чекпоинта
  const getDaysNeededForCheckpoint = (checkpointIndex: number): number => {
    if (deadlineType === 'period') {
      switch (selectedPeriod) {
        case '1 неделя':
          return checkpointIndex + 1; // Каждый день
        case '1 месяц':
          return (checkpointIndex + 1) * 7; // Каждая неделя = 7 дней
        case '3 месяца':
          return (checkpointIndex + 1) * 30; // Каждый месяц = ~30 дней
        case '6 месяцев':
          return (checkpointIndex + 1) * 30; // Каждый месяц = ~30 дней
        case '1 год':
          return (checkpointIndex + 1) * 90; // Каждый квартал = ~90 дней
        case '5 лет':
          return (checkpointIndex + 1) * 180; // Каждые 6 месяцев = ~180 дней
        default:
          return (checkpointIndex + 1) * 7; // По умолчанию неделя
      }
    } else {
      // Для конкретной даты используем простую логику
      const totalCheckpoints = checkpoints.length;
      const totalDays = 30; // Примерно
      return Math.ceil((checkpointIndex + 1) * (totalDays / totalCheckpoints));
    }
  };

  // Получаем дату начала цели
  const getGoalStartDate = (): Date => {
    if (currentGoal?.startDate) {
      return new Date(currentGoal.startDate);
    }
    // Если дата начала не установлена, используем дату создания первой задачи
    const savedCompletedTasks = localStorage.getItem(`completedTasks_${currentGoal?.id || 'default'}`);
    if (savedCompletedTasks) {
      const tasks = JSON.parse(savedCompletedTasks);
      if (tasks.length > 0) {
        // Используем текущую дату минус количество дней с первой задачи
        return new Date();
      }
    }
    return new Date(); // По умолчанию текущая дата
  };

  // Вычисляем количество дней с начала цели
  const getDaysSinceStart = (): number => {
    const startDate = getGoalStartDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };


  // Проверка, достигнут ли чекпоинт (по количеству дней или выполненным задачам)
  const checkCheckpointCompletion = () => {
    // Если цель завершена, не проверяем ничего
    if (currentGoal?.completed || progress >= 100) {
      return;
    }

    if (!currentGoal || checkpoints.length === 0) {
      // Если это не цель с чекпоинтами по дням и не челлендж, проверяем ежедневную задачу
      // Для челленджей ежедневная задача всегда одна и та же
      if (!isWeeklyWithDailyCheckpoints && !currentGoal?.isChallenge) {
        setShouldShowNewTaskModal(true);
      }
      return;
    }

    // Устанавливаем дату начала цели, если она не установлена
    if (!currentGoal.startDate) {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const updatedGoals = goals.map((g: any) => 
        g.id === currentGoal.id 
          ? { ...g, startDate: new Date().toISOString() }
          : g
      );
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      setCurrentGoal({ ...currentGoal, startDate: new Date().toISOString() });
      return; // Выходим, чтобы дата успела установиться
    }

    const daysSinceStart = getDaysSinceStart();
    const completedCheckpoints = currentGoal.completedCheckpoints || [];
    
    // Для месячной цели проверяем по количеству выполненных задач
    // Если выполнено 7 задач (1 неделя), проверяем первый чекпоинт
    if (selectedPeriod === '1 месяц' && !isWeeklyWithDailyCheckpoints) {
      const completedTasksCount = completedDailyTasks.filter(t => t.completed).length;
      const firstCheckpointDays = getDaysNeededForCheckpoint(0); // 7 дней для первой недели
      
      if (completedTasksCount >= firstCheckpointDays && !completedCheckpoints[0]) {
        // Показываем модальное окно для первого чекпоинта
        setPendingCheckpoint({ index: 0, checkpoint: checkpoints[0] });
        setShowCheckpointModal(true);
        setShouldShowNewTaskModal(false);
        return;
      }
    }
    
    // Проверяем, завершена ли цель (все чекпоинты выполнены)
    const allCheckpointsCompleted = completedCheckpoints.length === checkpoints.length && completedCheckpoints.every((cp: boolean) => cp === true);
    
    // Если все чекпоинты выполнены, показываем модальное окно финальной цели
    if (allCheckpointsCompleted && progress < 100 && !currentGoal.completed) {
      // Показываем модальное окно для подтверждения завершения цели
      setPendingCheckpoint({ index: -1, checkpoint: { label: 'Финальная цель', description: goalTitle } });
      setShowCheckpointModal(true);
      return;
    }

    // Находим все невыполненные чекпоинты и проверяем, достигнуты ли они по дням
    // Проверяем все чекпоинты, которые достигли нужного количества дней
    for (let i = 0; i < checkpoints.length; i++) {
      if (!completedCheckpoints[i]) {
        const daysNeeded = getDaysNeededForCheckpoint(i);
        // Если прошло достаточно дней, показываем модальное окно
        if (daysSinceStart >= daysNeeded) {
          setPendingCheckpoint({ index: i, checkpoint: checkpoints[i] });
          setShowCheckpointModal(true);
          setShouldShowNewTaskModal(false);
          return;
        }
        // Если этот чекпоинт еще не достигнут по дням, прекращаем проверку
        // (так как следующие чекпоинты тоже еще не достигнуты)
        break;
      }
    }
    
    // Если это не цель с чекпоинтами по дням и не челлендж, разрешаем показывать модальное окно новой задачи
    // Для челленджей ежедневная задача всегда одна и та же, поэтому не показываем модальное окно
    if (!isWeeklyWithDailyCheckpoints && dailyTask && !currentGoal?.isChallenge) {
      setShouldShowNewTaskModal(true);
    }
  };

  // Фокус на input при открытии модального окна
  useEffect(() => {
    if (showNewDailyTaskModal && newTaskInputRef.current) {
      setTimeout(() => {
        newTaskInputRef.current?.focus();
      }, 100);
    }
  }, [showNewDailyTaskModal]);

  // Открываем модальное окно новой задачи, когда разрешено
  useEffect(() => {
    // Для челленджей не открываем модальное окно новой задачи - задача всегда одна и та же
    if (currentGoal?.isChallenge) {
      setShouldShowNewTaskModal(false);
      return;
    }
    
    // Не открываем модальное окно, если уже есть незавершенная ежедневная задача
    // И не открываем, если модальное окно уже открыто или открывается чекпоинт
    if (shouldShowNewTaskModal && !showCheckpointModal && !showNewDailyTaskModal && (!dailyTask || dailyTaskCompleted)) {
      const timer = setTimeout(() => {
        // Дополнительная проверка перед открытием
        if (!showNewDailyTaskModal && !showCheckpointModal) {
          setShowNewDailyTaskModal(true);
          setShouldShowNewTaskModal(false); // Сбрасываем флаг после открытия
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (dailyTask && !dailyTaskCompleted) {
      // Если появилась незавершенная задача, сбрасываем флаг
      setShouldShowNewTaskModal(false);
    }
  }, [shouldShowNewTaskModal, showCheckpointModal, showNewDailyTaskModal, dailyTask, dailyTaskCompleted, currentGoal?.isChallenge]);

  // Функция планирования уведомления
  const scheduleNotification = useCallback(async (goalId: string, taskText: string, taskStartTime: string) => {
    try {
      // Получаем данные пользователя из Telegram WebApp
      const tg = (window as any).Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id;
      
      if (userId) {
        // Планируем уведомление на сервере
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await fetch(`${API_URL}/notifications/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            goalId,
            taskText,
            taskStartTime,
          }),
        });
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }, []);

  // Функция отмены уведомления
  const cancelNotification = useCallback(async (goalId: string) => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id;
      
      if (userId) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        await fetch(`${API_URL}/notifications/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            goalId,
          }),
        });
      }
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }, []);

  // Обновление таймера каждую секунду
  useEffect(() => {
    if (!currentGoal?.dailyTask || currentGoal.dailyTaskCompleted || !currentGoal.dailyTaskStartTime) {
      return;
    }

    const interval = setInterval(() => {
      const startTime = new Date(currentGoal.dailyTaskStartTime).getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000; // 24 часа
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTaskTimer({ hours, minutes, seconds });

        // Проверяем, можно ли отменить задачу (осталось меньше 5 минут)
        const fiveMinutes = 5 * 60 * 1000;
        setCanSkipTask(remaining <= fiveMinutes);

        // Планируем уведомление при создании задачи (если еще не запланировано)
        if (!notificationSent && currentGoal.dailyTaskStartTime) {
          scheduleNotification(currentGoal.id, currentGoal.dailyTask, currentGoal.dailyTaskStartTime);
          setNotificationSent(true);
          
          // Сохраняем флаг планирования уведомления
          const goals = JSON.parse(localStorage.getItem('goals') || '[]');
          const updatedGoals = goals.map((g: any) => 
            g.id === currentGoal.id ? { ...g, notificationSent: true } : g
          );
          localStorage.setItem('goals', JSON.stringify(updatedGoals));
        }
      } else {
        // Время истекло
        setTaskTimer({ hours: 0, minutes: 0, seconds: 0 });
        setCanSkipTask(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentGoal?.dailyTask, currentGoal?.dailyTaskCompleted, currentGoal?.dailyTaskStartTime, currentGoal?.id, notificationSent, scheduleNotification]);

  const handleSaveNewTask = (newTask: string) => {
    if (!newTask.trim() || !currentGoal) return;
    
    // Получаем номер следующей задачи
    const savedCompletedTasks = localStorage.getItem(`completedTasks_${currentGoal.id}`);
    const completedTasks = savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
    const taskNumber = completedTasks.length + 1;
    const taskDate = new Date().toISOString().split('T')[0];
    const taskStartTime = new Date().toISOString();
    
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) => 
      g.id === currentGoal.id 
        ? { 
            ...g, 
            dailyTask: newTask.trim(), 
            dailyTaskCompleted: false,
            dailyTaskStartTime: taskStartTime,
            dailyTaskNumber: taskNumber,
            dailyTaskDate: taskDate,
            notificationSent: false
          }
        : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setCurrentGoal({ 
      ...currentGoal, 
      dailyTask: newTask.trim(), 
      dailyTaskCompleted: false,
      dailyTaskStartTime: taskStartTime,
      dailyTaskNumber: taskNumber,
      dailyTaskDate: taskDate,
      notificationSent: false
    });
    setDailyTaskCompleted(false);
    setMapOffset(0);
    setShowNewDailyTaskModal(false);
    setShouldShowNewTaskModal(false);
    setTaskTimer({ hours: 24, minutes: 0, seconds: 0 });
    setCanSkipTask(false);
    setNotificationSent(false);
    
    // Планируем уведомление на сервере
    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    if (userId) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      fetch(`${API_URL}/notifications/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goalId: currentGoal.id,
          taskText: newTask.trim(),
          taskStartTime,
        }),
      }).catch(err => console.error('Error scheduling notification:', err));
    }
    
    if (newTaskInputRef.current) {
      newTaskInputRef.current.value = '';
    }
  };

  const handleCompleteCheckpoint = () => {
    if (!currentGoal || !pendingCheckpoint) return;
    
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    
    // Если это завершение цели (index === -1)
    if (pendingCheckpoint.index === -1) {
      // Добавляем большую награду за завершение цели
      const goalReward = 500; // 500 километров за завершение цели
      const newKilometers = kilometers + goalReward;
      setKilometers(newKilometers);
      localStorage.setItem('kilometers', newKilometers.toString());
      
      // Устанавливаем прогресс на 100%
      const newProgress = 100;
      setProgress(newProgress);
      
      const updatedGoals = goals.map((g: any) => 
        g.id === currentGoal.id 
          ? { ...g, progress: newProgress, completed: true }
          : g
      );
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      setCurrentGoal({ ...currentGoal, progress: newProgress, completed: true });
      setShowCheckpointModal(false);
      setPendingCheckpoint(null);
      
      // Показываем поздравление
      setTimeout(() => {
        setShowCongratulationsModal(true);
      }, 500);
      return;
    }
    
    // Обычный чекпоинт
    const completedCheckpoints = [...(currentGoal.completedCheckpoints || new Array(checkpoints.length).fill(false))];
    completedCheckpoints[pendingCheckpoint.index] = true;
    
    // Добавляем километры за выполнение чекпоинта
    const checkpointReward = 50; // 50 километров за чекпоинт
    const newKilometers = kilometers + checkpointReward;
    setKilometers(newKilometers);
    localStorage.setItem('kilometers', newKilometers.toString());
    
    // Обновляем прогресс при выполнении чекпоинта
    // Прогресс = (количество выполненных чекпоинтов) / (общее количество чекпоинтов + 1) * 100
    // +1 - это финальная цель
    const completedCount = completedCheckpoints.filter((cp: boolean) => cp === true).length;
    const totalSegments = checkpoints.length + 1; // Чекпоинты + финальная цель (старт не считается)
    const newProgress = Math.min(Math.round((completedCount / totalSegments) * 100), 99); // Максимум 99%, чтобы не завершать автоматически
    setProgress(newProgress);
    
    const updatedGoals = goals.map((g: any) => 
      g.id === currentGoal.id 
        ? { ...g, completedCheckpoints, progress: newProgress }
        : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setCurrentGoal({ ...currentGoal, completedCheckpoints, progress: newProgress });
    setShowCheckpointModal(false);
    setPendingCheckpoint(null);
    
    // Проверяем, нужно ли показать следующий чекпоинт или завершить цель
    // Если все чекпоинты выполнены, показываем модальное окно финальной цели
    const allCompleted = completedCheckpoints.every((cp: boolean) => cp === true);
    if (allCompleted && !currentGoal.completed) {
      setTimeout(() => {
        setPendingCheckpoint({ index: -1, checkpoint: { label: 'Финальная цель', description: goalTitle } });
        setShowCheckpointModal(true);
      }, 500);
    } else {
      // Проверяем следующий чекпоинт с задержкой, чтобы состояние успело обновиться
      setTimeout(() => {
        checkCheckpointCompletion();
      }, 500);
      
      // Если это не недельная цель с чекпоинтами, открываем модальное окно новой задачи
      // Делаем это с задержкой, чтобы карта успела обновиться и показать выполненный чекпоинт
      // И только если следующий чекпоинт еще не достигнут по дням
      if (!isWeeklyWithDailyCheckpoints) {
        setTimeout(() => {
          // Проверяем, есть ли следующий чекпоинт, который уже достигнут по дням
          const nextCheckpointIndex = completedCheckpoints.findIndex((cp: boolean) => !cp);
          if (nextCheckpointIndex === -1 || nextCheckpointIndex >= checkpoints.length) {
            // Все чекпоинты выполнены или их нет - открываем модальное окно новой задачи (если не челлендж)
            if (!currentGoal?.isChallenge) {
              setShouldShowNewTaskModal(true);
            }
          } else {
            const daysNeeded = getDaysNeededForCheckpoint(nextCheckpointIndex);
            const daysSinceStart = getDaysSinceStart();
            // Если следующий чекпоинт еще не достигнут по дням, открываем модальное окно новой задачи (если не челлендж)
            if (daysSinceStart < daysNeeded && !currentGoal?.isChallenge) {
              setShouldShowNewTaskModal(true);
            }
            // Если следующий чекпоинт уже достигнут, он будет показан через checkCheckpointCompletion
          }
        }, 1000); // Задержка, чтобы чекпоинт успел отобразиться на карте
      }
    }
  };

  const handleSkipCheckpoint = () => {
    if (!currentGoal || !pendingCheckpoint) return;
    
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const completedCheckpoints = [...(currentGoal.completedCheckpoints || new Array(checkpoints.length).fill(false))];
    completedCheckpoints[pendingCheckpoint.index] = false; // Помечаем как пропущенный
    
    const updatedGoals = goals.map((g: any) => 
      g.id === currentGoal.id 
        ? { ...g, completedCheckpoints }
        : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setCurrentGoal({ ...currentGoal, completedCheckpoints });
    setShowCheckpointModal(false);
    setPendingCheckpoint(null);
    
    // После закрытия модального окна чекпоинта
    // Если это не недельная цель с чекпоинтами и не челлендж, открываем модальное окно новой задачи
    if (!isWeeklyWithDailyCheckpoints && !currentGoal?.isChallenge) {
      setShouldShowNewTaskModal(true);
    }
    // Модальное окно новой задачи откроется через useEffect
  };

  const handleCompleteDailyTask = () => {
    if (!currentGoal || dailyTaskCompleted || isAnimating) return;
    
    setIsAnimating(true);
    
    // Анимация выполнения задачи
    setTimeout(() => {
      setDailyTaskCompleted(true);
      
      // Отменяем запланированное уведомление, так как задача выполнена
      cancelNotification(currentGoal.id);
      
      // Добавляем задачу в историю выполненных
      if (dailyTask) {
        const taskData = {
          task: dailyTask,
          completed: true,
          number: currentGoal.dailyTaskNumber || completedDailyTasks.length + 1,
          date: currentGoal.dailyTaskDate || new Date().toISOString().split('T')[0],
          startTime: currentGoal.dailyTaskStartTime || new Date().toISOString(),
          completedTime: new Date().toISOString()
        };
        const newCompletedTasks = [...completedDailyTasks, taskData];
        setCompletedDailyTasks(newCompletedTasks);
        localStorage.setItem(`completedTasks_${currentGoal.id}`, JSON.stringify(newCompletedTasks));
        
        // Добавляем километры за выполнение задачи
        const taskReward = 10; // 10 километров за задачу
        const newKilometers = kilometers + taskReward;
        setKilometers(newKilometers);
        localStorage.setItem('kilometers', newKilometers.toString());
        
        // Проверяем, достигнут ли чекпоинт (по дням)
        checkCheckpointCompletion();
      }
    }, 1000);
    
    // 3. Увеличиваем стрик
    setTimeout(() => {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak.toString());
    }, 1800);
    
    // 4. НЕ обновляем прогресс при выполнении ежедневной задачи
    // Прогресс обновляется только при выполнении чекпоинтов
    setTimeout(() => {
      // Обновляем только флаг выполнения задачи
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');
      const updatedGoals = goals.map((g: any) => 
        g.id === currentGoal.id 
          ? { ...g, dailyTaskCompleted: true }
          : g
      );
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      setCurrentGoal({ ...currentGoal, dailyTaskCompleted: true });
    }, 2000);
    
    // 5. Анимация движения карты вниз
    setTimeout(() => {
      setMapOffset(200); // Сдвигаем карту вниз
      setIsAnimating(false);
      
      // Для челленджей не открываем модальное окно новой задачи - задача всегда одна и та же
      // Задача будет доступна снова на следующий день (сброс происходит при загрузке страницы)
      if (currentGoal?.isChallenge) {
        // Сохраняем дату выполнения задачи для челленджа
        const today = new Date().toISOString().split('T')[0];
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        const updatedGoals = goals.map((g: any) => 
          g.id === currentGoal.id 
            ? { ...g, dailyTaskCompleted: true, lastTaskCompletedDate: today }
            : g
        );
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        setCurrentGoal({ ...currentGoal, dailyTaskCompleted: true, lastTaskCompletedDate: today });
        setDailyTaskCompleted(true);
      } else {
        // Для обычных целей модальное окно новой задачи откроется через useEffect, если разрешено
        setShouldShowNewTaskModal(true);
      }
    }, 2500);
  };

  const handleSkipDailyTask = () => {
    if (!currentGoal || dailyTaskCompleted || isAnimating || !canSkipTask) return;
    
    setIsAnimating(true);
    setShowSadAnimation(true);
    
      // Добавляем задачу в историю как невыполненную
      if (dailyTask) {
        const taskData = {
          task: dailyTask,
          completed: false,
          number: currentGoal.dailyTaskNumber || completedDailyTasks.length + 1,
          date: currentGoal.dailyTaskDate || new Date().toISOString().split('T')[0],
          startTime: currentGoal.dailyTaskStartTime || new Date().toISOString()
        };
        const newCompletedTasks = [...completedDailyTasks, taskData];
        setCompletedDailyTasks(newCompletedTasks);
        localStorage.setItem(`completedTasks_${currentGoal.id}`, JSON.stringify(newCompletedTasks));
      }
    
    // Обновляем цель в localStorage
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    const updatedGoals = goals.map((g: any) => 
      g.id === currentGoal.id 
        ? { ...g, dailyTaskCompleted: true }
        : g
    );
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setCurrentGoal({ ...currentGoal, dailyTaskCompleted: true });
    setDailyTaskCompleted(true);
    
    // Грустная анимация
    setTimeout(() => {
      setShowSadAnimation(false);
      
      // Анимация движения карты вниз
      setMapOffset(200);
      
      // Для челленджей не открываем модальное окно новой задачи
      setTimeout(() => {
        setIsAnimating(false);
        
        if (currentGoal?.isChallenge) {
          // Для челленджа задача остается той же, но будет доступна снова на следующий день
          // Сброс происходит при загрузке страницы (проверка по дате)
          const today = new Date().toISOString().split('T')[0];
          const goals = JSON.parse(localStorage.getItem('goals') || '[]');
          const updatedGoals = goals.map((g: any) => 
            g.id === currentGoal.id 
              ? { ...g, dailyTaskCompleted: true, lastTaskCompletedDate: today }
              : g
          );
          localStorage.setItem('goals', JSON.stringify(updatedGoals));
          setCurrentGoal({ ...currentGoal, dailyTaskCompleted: true, lastTaskCompletedDate: today });
          setDailyTaskCompleted(true);
        } else {
          // Для обычных целей открываем модальное окно новой задачи
          setShouldShowNewTaskModal(true);
        }
      }, 500);
    }, 2000);
  };

  if (!currentGoal) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden items-center justify-center">
        <p className="text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
          Загрузка...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <header className="flex items-center p-4 pt-6 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-text-light dark:text-text-dark text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {currentGoal?.isCaravan ? 'Общая цель' : 'Твоя цель'}
              </p>
              {currentGoal?.isCaravan && (
                <span className="material-symbols-outlined text-sm text-blue-500">groups</span>
              )}
          </div>
            <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {goalTitle}
            </h1>
            {/* Участники каравана */}
            {currentGoal?.isCaravan && caravanMembers.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                  {caravanMembers.slice(0, 5).map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className="w-6 h-6 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-200 dark:bg-gray-700 overflow-hidden"
                      title={member.name}
                    >
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                  {caravanMembers.length > 5 && (
                    <div className="w-6 h-6 rounded-full border-2 border-background-light dark:border-background-dark bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      +{caravanMembers.length - 5}
                    </div>
                  )}
                </div>
                <span className="text-xs text-text-light/70 dark:text-text-dark/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {caravanMembers.length} {caravanMembers.length === 1 ? 'участник' : caravanMembers.length < 5 ? 'участника' : 'участников'}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          {/* Отображение километров */}
          <div className="flex items-center gap-1 rounded-full bg-card-light/50 dark:bg-card-dark/50 px-3 py-1.5">
            <span className="material-symbols-outlined text-primary">route</span>
            <span className="font-bold text-primary">{kilometers}</span>
            <span className="text-xs text-text-light/70 dark:text-text-dark/70">км</span>
          </div>
          <motion.div 
            className="flex items-center gap-1 rounded-full bg-card-light/50 dark:bg-card-dark/50 px-3 py-1.5"
            animate={isAnimating ? {
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.span 
              className="material-symbols-outlined fill-icon text-accent-orange"
              animate={isAnimating ? {
                scale: [1, 1.5, 1],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
              } : {}}
              transition={{ duration: 0.6 }}
            >
              local_fire_department
            </motion.span>
            <motion.span 
              className="font-bold text-accent-orange"
              key={streak}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {streak}
            </motion.span>
          </motion.div>
        </div>
      </header>

      <div className="w-full px-4 z-20 space-y-3 mt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-light/90 dark:bg-card-dark/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-text-light dark:text-text-dark text-base" style={{ fontFamily: 'Inter, sans-serif' }}>Прогресс пути</h2>
            <span className="font-bold text-primary text-base">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="bg-primary h-2.5 rounded-full"
            />
          </div>
        </motion.div>

        {/* Чекпоинт для недельной цели или ежедневная задача */}
        {!currentGoal?.completed && isWeeklyWithDailyCheckpoints && currentCheckpoint ? (
          <motion.div
            key={`checkpoint-${currentCheckpoint.index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            transition={{ 
              delay: 0.1, 
              duration: 0.5
            }}
            className="backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-transparent bg-card-light/90 dark:bg-card-dark/90"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-sm font-bold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {currentCheckpoint.checkpoint.label}
                </p>
                {currentCheckpoint.checkpoint.description && (
                  <p className="text-text-light/80 dark:text-text-dark/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {currentCheckpoint.checkpoint.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Всегда показываем модальное окно для пропуска чекпоинта
                    if (currentCheckpoint) {
                      setPendingCheckpoint({ index: currentCheckpoint.index, checkpoint: currentCheckpoint.checkpoint });
                      setShowCheckpointModal(true);
                    }
                  }}
                  disabled={isAnimating || currentGoal?.completed || !currentCheckpoint}
                  className={`flex items-center justify-center size-10 rounded-full ${
                    isAnimating || currentGoal?.completed || !currentCheckpoint
                      ? 'bg-gray-300/20 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-2xl">close</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Всегда показываем модальное окно для выполнения чекпоинта
                    if (currentCheckpoint) {
                      setPendingCheckpoint({ index: currentCheckpoint.index, checkpoint: currentCheckpoint.checkpoint });
                      setShowCheckpointModal(true);
                    }
                  }}
                  disabled={isAnimating || currentGoal?.completed || !currentCheckpoint}
                  className={`flex items-center justify-center size-10 rounded-full ${
                    isAnimating || currentGoal?.completed || !currentCheckpoint
                      ? 'bg-gray-300/20 text-gray-400 cursor-not-allowed'
                      : 'bg-accent-green/20 text-accent-green'
                  }`}
                >
                  <span className="material-symbols-outlined !text-2xl">check</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : !currentGoal?.completed && dailyTask && !isWeeklyWithDailyCheckpoints ? (
          <motion.div
            key={dailyTaskCompleted ? 'completed' : 'not-completed'}
            initial={dailyTaskCompleted ? { scale: 0.95 } : { opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            transition={{ 
              delay: dailyTaskCompleted ? 0 : 0.1, 
              duration: 0.5,
              scale: { duration: 0.3 }
            }}
            className={`backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 transition-all duration-500 ${
              dailyTaskCompleted 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-400' 
                : 'bg-card-light/90 dark:bg-card-dark/90 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Ежедневная задача #{currentGoal?.dailyTaskNumber || completedDailyTasks.length + 1}
                  </p>
                  {currentGoal?.dailyTaskDate && (
                    <span className="text-xs text-text-light/60 dark:text-text-dark/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {new Date(currentGoal.dailyTaskDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                <p className="text-text-light/80 dark:text-text-dark/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {dailyTask}
                </p>
                {taskTimer && !dailyTaskCompleted && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                    <span className={`text-xs font-mono font-bold ${
                      taskTimer.hours === 0 && taskTimer.minutes < 5 
                        ? 'text-red-500' 
                        : 'text-primary'
                    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {String(taskTimer.hours).padStart(2, '0')}:{String(taskTimer.minutes).padStart(2, '0')}:{String(taskTimer.seconds).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={canSkipTask ? { scale: 1.1 } : {}}
                  whileTap={canSkipTask ? { scale: 0.9 } : {}}
                  onClick={handleSkipDailyTask}
                  disabled={dailyTaskCompleted || isAnimating || currentGoal?.completed || !canSkipTask}
                  className={`flex items-center justify-center size-10 rounded-full ${
                    dailyTaskCompleted || isAnimating || !canSkipTask
                      ? 'bg-gray-300/20 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                  title={!canSkipTask ? 'Отмена доступна только за 5 минут до окончания времени' : 'Отменить задачу'}
                >
                  <span className="material-symbols-outlined !text-2xl">close</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCompleteDailyTask}
                  disabled={dailyTaskCompleted || currentGoal?.completed}
                  className={`flex items-center justify-center size-10 rounded-full ${
                    dailyTaskCompleted 
                      ? 'bg-accent-green/40 text-accent-green cursor-not-allowed' 
                      : 'bg-accent-green/20 text-accent-green'
                  }`}
                >
                  <span className="material-symbols-outlined !text-2xl">
                    {dailyTaskCompleted ? 'check_circle' : 'check'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <main className="flex-grow w-full overflow-y-auto overflow-x-hidden">
        <motion.div 
          className="w-full relative flex flex-col justify-start"
          animate={{ y: mapOffset }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Простая карта дороги */}
          <div className="w-full px-4" style={{ paddingTop: '10px', paddingBottom: '80px' }}>
            <SimpleRoadMap
              progress={Math.round(progress)}
              checkpoints={checkpoints.map((cp: any, index: number) => ({
                label: cp.label || '',
                description: cp.description || '',
                completed: currentGoal?.completedCheckpoints?.[index] || false
              }))}
              goalTitle={goalTitle}
              dailyTask={dailyTask}
              dailyTaskNumber={currentGoal?.dailyTaskNumber}
              completedDailyTasks={completedDailyTasks}
            />
          </div>
        </motion.div>
      </main>


      {/* Кнопка выбора цели (слева) - показывает все цели */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowGoalsModal(true)}
        className="absolute z-40 left-6 bottom-28 h-14 w-14 rounded-full bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700"
      >
        <span className="material-symbols-outlined !text-3xl">checklist</span>
      </motion.button>

      {/* Кнопка добавления новой цели (справа) - создание новой цели */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/create-goal/basic')}
        className="absolute z-40 right-6 bottom-28 h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
      >
        <span className="material-symbols-outlined !text-3xl">add</span>
      </motion.button>

      {/* Модальное окно подтверждения выполнения чекпоинта */}
      <AnimatePresence>
        {showCheckpointModal && pendingCheckpoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowCheckpointModal(false);
              setPendingCheckpoint(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {pendingCheckpoint.index === -1 ? 'Цель завершена!' : 'Чекпоинт достигнут!'}
              </h2>
              <p className="text-text-light/70 dark:text-text-dark/70 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {pendingCheckpoint.checkpoint.label}
              </p>
              {pendingCheckpoint.checkpoint.description && (
                <p className="text-text-light dark:text-text-dark mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {pendingCheckpoint.checkpoint.description}
                </p>
              )}
              <p className="text-text-light/70 dark:text-text-dark/70 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {pendingCheckpoint.index === -1 
                  ? 'Выполнил ли ты свою цель?' 
                  : 'Выполнил ли ты этот этап цели?'}
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkipCheckpoint}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 text-red-500 font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Пропустить
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCompleteCheckpoint}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Выполнено
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Грустная анимация при пропуске задачи */}
      <AnimatePresence>
        {showSadAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card-light dark:bg-card-dark rounded-3xl p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6, repeat: 1 }}
                className="text-6xl mb-4"
              >
                😢
              </motion.div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Задача пропущена
              </h3>
              <p className="text-text-light/70 dark:text-text-dark/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Не расстраивайся! Завтра новый день и новая возможность!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно создания новой ежедневной задачи */}
      <AnimatePresence>
        {showNewDailyTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setMapOffset(0);
              setShowNewDailyTaskModal(false);
              setShouldShowNewTaskModal(false); // Сбрасываем флаг при закрытии
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Новая ежедневная задача
              </h2>
              <input
                ref={newTaskInputRef}
                type="text"
                placeholder="Введите задачу..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark mb-4 focus:outline-none focus:border-primary"
                style={{ fontFamily: 'Inter, sans-serif' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSaveNewTask(e.currentTarget.value.trim());
                  }
                }}
              />
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMapOffset(0);
                    setShowNewDailyTaskModal(false);
                    setShouldShowNewTaskModal(false); // Сбрасываем флаг при отмене
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (newTaskInputRef.current?.value.trim()) {
                      handleSaveNewTask(newTaskInputRef.current.value.trim());
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Сохранить
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно выбора цели */}
      <AnimatePresence>
        {showGoalsModal && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
          onClick={() => setShowGoalsModal(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full bg-card-light dark:bg-card-dark rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                Выберите цель
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowGoalsModal(false)}
                className="flex items-center justify-center size-10 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark"
              >
                <span className="material-symbols-outlined">close</span>
              </motion.button>
            </div>
            <div className="space-y-3">
              {(() => {
                const goals = JSON.parse(localStorage.getItem('goals') || '[]');
                if (goals.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-text-light/70 dark:text-text-dark/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                        У вас пока нет целей
                      </p>
                    </div>
                  );
                }
                return goals.map((goal: any) => (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentGoal(goal);
                      setProgress(goal.progress || 0);
                      setDailyTaskCompleted(goal.dailyTaskCompleted || false);
                      // Загружаем историю выполненных задач для выбранной цели
                      const savedCompletedTasks = localStorage.getItem(`completedTasks_${goal.id}`);
                      if (savedCompletedTasks) {
                        setCompletedDailyTasks(JSON.parse(savedCompletedTasks));
                      } else {
                        setCompletedDailyTasks([]);
                      }
                      setShowGoalsModal(false);
                      // Обновляем URL для выбранной цели
                      navigate(`/map?goal=${goal.id}`, { 
                        replace: true 
                      });
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      currentGoal?.id === goal.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-light dark:text-text-dark mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {goal.goalTitle}
                        </h3>
                        <p className="text-sm text-text-light/70 dark:text-text-dark/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Прогресс: {goal.progress || 0}%
                        </p>
                      </div>
                      {currentGoal?.id === goal.id && (
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                      )}
                    </div>
                  </motion.button>
                ));
              })()}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно поздравления при завершении цели */}
      <AnimatePresence>
        {showCongratulationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCongratulationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 dark:from-yellow-500 dark:via-orange-500 dark:to-red-600 rounded-3xl p-8 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-3" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Поздравляем!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white mb-2" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Ты лучший! 🌟
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90 mb-4" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Ты успешно достиг своей цели: <strong>{goalTitle}</strong>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/20 rounded-xl p-4 mb-6"
              >
                <p className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  🎁 Награда: +500 км
                </p>
                <p className="text-white/90 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Ты получил огромную награду за завершение цели!
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCongratulationsModal(false)}
                className="w-full px-6 py-4 rounded-xl bg-white text-orange-500 font-bold text-lg shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Отлично!
              </motion.button>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

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
          <div className="flex flex-col items-center justify-center gap-1 text-primary dark:text-primary">
            <span className="material-symbols-outlined fill-icon">map</span>
            <span className="text-xs font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>Карта</span>
          </div>
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

export default MapScreen;

