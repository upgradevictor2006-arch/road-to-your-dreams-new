import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AIAssistant from '../components/AIAssistant';

const CreateGoalAIPlanning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [goalData, setGoalData] = useState<any>(null);
  
  // Вопросы для ИИ ассистента
  const [currentResources, setCurrentResources] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [motivation, setMotivation] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');

  useEffect(() => {
    if (location.state) {
      setGoalData(location.state);
    } else {
      navigate('/create-goal/basic');
    }
  }, [location, navigate]);

  const handleNext = () => {
    const aiData = {
      currentResources: currentResources.trim(),
      successCriteria: successCriteria.trim(),
      motivation: motivation.trim(),
      obstacles: obstacles.trim(),
      supportNeeded: supportNeeded.trim()
    };

    navigate('/create-goal/deadline', {
      state: { ...goalData, aiPlanning: aiData }
    });
  };

  const handleBack = () => {
    navigate('/create-goal/basic', { state: goalData });
  };

  const questions = [
    {
      id: 'resources',
      title: 'Что ты уже имеешь на путь к своей цели?',
      placeholder: 'Например: базовые знания, инструменты, время, поддержка близких...',
      value: currentResources,
      onChange: setCurrentResources,
      required: false
    },
    {
      id: 'criteria',
      title: 'Как ты узнаешь, что цель выполнена?',
      placeholder: 'Опиши конкретные признаки успеха. Например: пробежал 5 км без остановки, создал 10 проектов...',
      value: successCriteria,
      onChange: setSuccessCriteria,
      required: true
    },
    {
      id: 'motivation',
      title: 'Почему эта цель важна для тебя?',
      placeholder: 'Что тебя мотивирует? Какие эмоции ты хочешь испытать?',
      value: motivation,
      onChange: setMotivation,
      required: false
    },
    {
      id: 'obstacles',
      title: 'Какие препятствия могут возникнуть?',
      placeholder: 'Что может помешать? Как ты планируешь с этим справиться?',
      value: obstacles,
      onChange: setObstacles,
      required: false
    },
    {
      id: 'support',
      title: 'Какая поддержка тебе нужна?',
      placeholder: 'Что поможет тебе достичь цели? Ресурсы, люди, знания...',
      value: supportNeeded,
      onChange: setSupportNeeded,
      required: false
    }
  ];

  const canProceed = successCriteria.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden text-text-light dark:text-text-dark"
    >
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-start text-[#343A40] dark:text-white"
        >
          <span className="material-symbols-outlined !text-2xl">arrow_back</span>
        </motion.button>
        <h2 className="text-[#343A40] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          Планирование цели
        </h2>
        <div className="size-12 shrink-0"></div>
      </div>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <div className="flex gap-6 justify-between">
          <p className="text-[#343A40] dark:text-gray-300 text-sm font-medium leading-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
            Шаг 2 из 5
          </p>
        </div>
        <div className="rounded-full bg-[#CED4DA]/50 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            className="h-2 rounded-full bg-primary"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold leading-tight tracking-tight text-left pb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Расскажи о своей цели
        </motion.h1>
        <p className="text-base text-text-light/70 dark:text-text-dark/70 pb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Эти вопросы помогут ИИ ассистенту лучше понять твою цель и предложить персональный план действий.
        </p>

        <div className="mb-6">
          <AIAssistant
            context={{
              goalTitle: goalData?.goalTitle || '',
              description: goalData?.description || '',
              aiPlanning: {
                currentResources,
                successCriteria,
                motivation,
                obstacles,
                supportNeeded,
              },
            }}
            currentStep="planning"
            onSuggestionClick={(suggestion) => {
              if (suggestion.type === 'tip') {
                if (suggestion.title.includes('критерии')) {
                  setSuccessCriteria(suggestion.message);
                } else if (suggestion.title.includes('ресурсы')) {
                  setCurrentResources(suggestion.message);
                } else if (suggestion.title.includes('препятствия')) {
                  setObstacles(suggestion.message);
                }
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-6 pb-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <textarea
                  value={question.value}
                  onChange={(e) => question.onChange(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary min-h-24 placeholder:text-placeholder p-4 text-base font-normal leading-normal"
                  placeholder={question.placeholder}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  rows={3}
                />
              </label>
            </motion.div>
          ))}
        </div>

        <div className="flex-grow"></div>

        <div className="flex px-0 py-6">
          <motion.button
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            onClick={handleNext}
            disabled={!canProceed}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 flex-1 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="truncate">Далее</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateGoalAIPlanning;

