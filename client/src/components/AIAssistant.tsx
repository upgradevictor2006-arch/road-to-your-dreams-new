import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../services/api';

interface AISuggestion {
  type: 'checkpoint' | 'daily_task' | 'motivation' | 'tip' | 'warning';
  title: string;
  message: string;
  action?: {
    label: string;
    data?: any;
  };
}

interface AIAssistantProps {
  context: any;
  currentStep: 'planning' | 'checkpoints' | 'daily_task' | 'progress';
  onSuggestionClick?: (suggestion: AISuggestion) => void;
}

const AIAssistant = ({ context, currentStep, onSuggestionClick }: AIAssistantProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, [context, currentStep]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      if (API_URL) {
        const response = await aiAPI.getContextualHelp(context, currentStep);
        setSuggestions(response.data.suggestions || []);
      } else {
        // Fallback: генерируем базовые предложения локально
        setSuggestions(generateLocalSuggestions());
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      setSuggestions(generateLocalSuggestions());
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalSuggestions = (): AISuggestion[] => {
    const localSuggestions: AISuggestion[] = [];
    
    if (currentStep === 'checkpoints' && context.goalTitle) {
      const title = context.goalTitle.toLowerCase();
      if (title.includes('бег') || title.includes('пробежать')) {
        localSuggestions.push({
          type: 'checkpoint',
          title: 'Первый километр',
          message: 'Начни с малого - пробеги свой первый километр без остановки',
        });
      }
    }
    
    if (currentStep === 'daily_task' && context.goalTitle) {
      const title = context.goalTitle.toLowerCase();
      if (title.includes('бег') || title.includes('пробежать')) {
        localSuggestions.push({
          type: 'daily_task',
          title: 'Ежедневная пробежка',
          message: 'Пробеги минимум 1 км каждый день',
        });
      }
    }
    
    if (currentStep === 'planning' && context.aiPlanning) {
      if (!context.aiPlanning.successCriteria || context.aiPlanning.successCriteria.length < 20) {
        localSuggestions.push({
          type: 'tip',
          title: 'Сделай критерии успеха более конкретными',
          message: 'Чем конкретнее твои критерии успеха, тем легче будет отслеживать прогресс.',
        });
      }
    }
    
    return localSuggestions;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return 'flag';
      case 'daily_task':
        return 'task_alt';
      case 'motivation':
        return 'favorite';
      case 'tip':
        return 'lightbulb';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return 'bg-blue-500';
      case 'daily_task':
        return 'bg-yellow-500';
      case 'motivation':
        return 'bg-pink-500';
      case 'tip':
        return 'bg-green-500';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return 'rgba(59, 130, 246, 0.3)';
      case 'daily_task':
        return 'rgba(234, 179, 8, 0.3)';
      case 'motivation':
        return 'rgba(236, 72, 153, 0.3)';
      case 'tip':
        return 'rgba(34, 197, 94, 0.3)';
      case 'warning':
        return 'rgba(249, 115, 22, 0.3)';
      default:
        return 'rgba(107, 114, 128, 0.3)';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'checkpoint':
        return 'rgba(59, 130, 246, 0.1)';
      case 'daily_task':
        return 'rgba(234, 179, 8, 0.1)';
      case 'motivation':
        return 'rgba(236, 72, 153, 0.1)';
      case 'tip':
        return 'rgba(34, 197, 94, 0.1)';
      case 'warning':
        return 'rgba(249, 115, 22, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="w-full">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent-green/10 dark:from-primary/20 dark:to-accent-green/20 border border-primary/20 dark:border-primary/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">psychology</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-light dark:text-text-dark">
              ИИ Ассистент
            </p>
            <p className="text-xs text-text-light/70 dark:text-text-dark/70">
              {suggestions.length} {suggestions.length === 1 ? 'предложение' : 'предложений'}
            </p>
          </div>
        </div>
        <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2"
          >
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="p-4 text-center text-text-light/70 dark:text-text-dark/70">
                  Загрузка предложений...
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border"
                    style={{
                      borderColor: getBorderColor(suggestion.type),
                      backgroundColor: getBackgroundColor(suggestion.type),
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${getColorClass(suggestion.type)} flex items-center justify-center flex-shrink-0`}>
                        <span className="material-symbols-outlined text-white text-sm">
                          {getIcon(suggestion.type)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-text-light/80 dark:text-text-dark/80 mb-2">
                          {suggestion.message}
                        </p>
                        {suggestion.action && onSuggestionClick && (
                          <button
                            onClick={() => onSuggestionClick(suggestion)}
                            className="text-xs text-primary hover:underline"
                          >
                            {suggestion.action.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;

