/**
 * AI Assistant Service
 * Интеграция с ИИ для помощи пользователю на каждом этапе
 */

import Groq from 'groq-sdk';

// Инициализация Groq клиента
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

interface GoalContext {
  goalTitle: string;
  description?: string;
  aiPlanning?: {
    currentResources?: string;
    successCriteria?: string;
    motivation?: string;
    obstacles?: string;
    supportNeeded?: string;
  };
  checkpoints?: Array<{ label: string; description?: string }>;
  dailyTask?: string;
  progress?: number;
  deadlineType?: string;
  selectedPeriod?: string;
  selectedDate?: string;
}

interface AISuggestion {
  type: 'checkpoint' | 'daily_task' | 'motivation' | 'tip' | 'warning';
  title: string;
  message: string;
  action?: {
    label: string;
    data?: any;
  };
}

/**
 * Генерирует предложения с помощью ИИ
 */
async function generateWithAI(prompt: string, systemPrompt: string = ''): Promise<string> {
  if (!groq) {
    return '';
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile', // Быстрая и мощная модель от Groq
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'Ты помощник для достижения целей. Помогай пользователям планировать и достигать своих целей. Отвечай кратко и конкретно.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    return '';
  }
}

/**
 * Генерирует предложения для чекпоинтов на основе контекста цели
 */
export async function generateCheckpointSuggestions(context: GoalContext): Promise<AISuggestion[]> {
  // Пытаемся использовать реальный ИИ
  if (groq && context.goalTitle) {
    try {
      const prompt = `Пользователь создает цель: "${context.goalTitle}"

${context.description ? `Описание: ${context.description}` : ''}
${context.aiPlanning?.successCriteria ? `Критерии успеха: ${context.aiPlanning.successCriteria}` : ''}
${context.aiPlanning?.currentResources ? `Ресурсы: ${context.aiPlanning.currentResources}` : ''}
${context.aiPlanning?.motivation ? `Мотивация: ${context.aiPlanning.motivation}` : ''}
${context.aiPlanning?.obstacles ? `Возможные препятствия: ${context.aiPlanning.obstacles}` : ''}

Предложи 3-5 конкретных чекпоинтов (этапов) для достижения этой цели. 
Каждый чекпоинт должен быть:
- Измеримым и достижимым
- Конкретным и понятным
- Логически следующим шагом

Ответ в формате JSON массива:
[
  {"title": "Название чекпоинта", "message": "Краткое описание что нужно сделать"},
  ...
]

Только JSON, без дополнительного текста.`;

      const systemPrompt = 'Ты эксперт по планированию целей. Помогай разбивать большие цели на конкретные измеримые этапы. Отвечай только валидным JSON массивом.';

      const aiResponse = await generateWithAI(prompt, systemPrompt);
      
      if (aiResponse) {
        try {
          // Пытаемся извлечь JSON из ответа
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
          const parsed = JSON.parse(jsonStr);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({
              type: 'checkpoint' as const,
              title: item.title || 'Чекпоинт',
              message: item.message || item.description || '',
            }));
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  }

  // Fallback на базовые предложения
  const suggestions: AISuggestion[] = [];
  
  if (context.aiPlanning?.successCriteria) {
    // Разбиваем критерии успеха на чекпоинты
    const criteria = context.aiPlanning.successCriteria.toLowerCase();
    
    if (criteria.includes('пробежать') || criteria.includes('бег')) {
      suggestions.push({
        type: 'checkpoint',
        title: 'Первый километр',
        message: 'Начни с малого - пробеги свой первый километр без остановки',
      });
      suggestions.push({
        type: 'checkpoint',
        title: 'Увеличивай дистанцию',
        message: 'Постепенно увеличивай дистанцию на 500 метров каждую неделю',
      });
    }
    
    if (criteria.includes('проект') || criteria.includes('создать')) {
      suggestions.push({
        type: 'checkpoint',
        title: 'Планирование',
        message: 'Создай детальный план проекта с основными этапами',
      });
      suggestions.push({
        type: 'checkpoint',
        title: 'Первый прототип',
        message: 'Создай первый рабочий прототип или MVP',
      });
    }
  }
  
  // Предложения на основе ресурсов
  if (context.aiPlanning?.currentResources) {
    suggestions.push({
      type: 'tip',
      title: 'Используй свои ресурсы',
      message: `Ты упомянул: ${context.aiPlanning.currentResources.substring(0, 100)}... Используй это как основу для первых шагов!`,
    });
  }
  
  // Предупреждения о препятствиях
  if (context.aiPlanning?.obstacles) {
    suggestions.push({
      type: 'warning',
      title: 'Помни о препятствиях',
      message: `Ты предвидел: ${context.aiPlanning.obstacles.substring(0, 100)}... Подготовь план действий на случай их возникновения.`,
    });
  }
  
  return suggestions;
}

/**
 * Генерирует предложения для ежедневных задач
 */
export async function generateDailyTaskSuggestions(context: GoalContext): Promise<AISuggestion[]> {
  // Пытаемся использовать реальный ИИ
  if (groq && context.goalTitle) {
    try {
      const prompt = `Пользователь создает цель: "${context.goalTitle}"

${context.description ? `Описание: ${context.description}` : ''}
${context.aiPlanning?.successCriteria ? `Критерии успеха: ${context.aiPlanning.successCriteria}` : ''}
${context.dailyTask ? `Текущая ежедневная задача: ${context.dailyTask}` : ''}

Предложи 2-3 конкретные ежедневные задачи для достижения этой цели.
Каждая задача должна быть:
- Выполнима за день (15-60 минут)
- Регулярной (можно делать каждый день)
- Конкретной и измеримой

Ответ в формате JSON массива:
[
  {"title": "Название задачи", "message": "Что конкретно нужно делать"},
  ...
]

Только JSON, без дополнительного текста.`;

      const systemPrompt = 'Ты эксперт по планированию ежедневных привычек. Помогай создавать эффективные ежедневные задачи для достижения целей. Отвечай только валидным JSON массивом.';

      const aiResponse = await generateWithAI(prompt, systemPrompt);
      
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
          const parsed = JSON.parse(jsonStr);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({
              type: 'daily_task' as const,
              title: item.title || 'Ежедневная задача',
              message: item.message || item.description || '',
            }));
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  }

  // Fallback на базовые предложения
  const suggestions: AISuggestion[] = [];
  
  if (context.goalTitle) {
    const title = context.goalTitle.toLowerCase();
    
    if (title.includes('бег') || title.includes('пробежать')) {
      suggestions.push({
        type: 'daily_task',
        title: 'Ежедневная пробежка',
        message: 'Пробеги минимум 1 км каждый день',
      });
      suggestions.push({
        type: 'daily_task',
        title: 'Растяжка',
        message: 'Выполни 10-минутную растяжку после пробежки',
      });
    }
    
    if (title.includes('проект') || title.includes('создать')) {
      suggestions.push({
        type: 'daily_task',
        title: 'Работа над проектом',
        message: 'Потрать минимум 30 минут на работу над проектом',
      });
    }
    
    if (title.includes('изучить') || title.includes('курс')) {
      suggestions.push({
        type: 'daily_task',
        title: 'Обучение',
        message: 'Изучи один урок или главу курса',
      });
    }
  }
  
  return suggestions;
}

/**
 * Генерирует мотивационное сообщение на основе прогресса
 */
export async function generateMotivationalMessage(
  context: GoalContext,
  progress: number
): Promise<string> {
  // Пытаемся использовать реальный ИИ
  if (groq && context.goalTitle) {
    try {
      const prompt = `Пользователь работает над целью: "${context.goalTitle}"
Прогресс: ${progress}%

${context.aiPlanning?.motivation ? `Мотивация пользователя: ${context.aiPlanning.motivation}` : ''}

Напиши короткое мотивационное сообщение (1-2 предложения) для поддержки пользователя.
Учитывай его прогресс и мотивацию. Будь вдохновляющим, но реалистичным.`;

      const systemPrompt = 'Ты мотивационный коуч. Помогай людям оставаться мотивированными на пути к целям. Пиши короткие, вдохновляющие сообщения.';

      const aiResponse = await generateWithAI(prompt, systemPrompt);
      
      if (aiResponse && aiResponse.trim().length > 0) {
        return aiResponse.trim();
      }
    } catch (error) {
      console.error('Error generating motivational message:', error);
    }
  }

  // Fallback на базовые сообщения
  if (context.aiPlanning?.motivation) {
    return `Помни, почему это важно для тебя: ${context.aiPlanning.motivation.substring(0, 150)}... Продолжай! 💪`;
  }
  
  if (progress < 25) {
    return 'Ты только начинаешь свой путь! Каждый шаг важен. Продолжай! 🚀';
  } else if (progress < 50) {
    return 'Отличный прогресс! Ты уже прошёл четверть пути. Не останавливайся! 💪';
  } else if (progress < 75) {
    return 'Ты на полпути к цели! Это впечатляющий результат. Продолжай в том же духе! 🌟';
  } else if (progress < 100) {
    return 'Финишная прямая! Ты почти у цели. Осталось совсем немного! 🎯';
  } else {
    return '🎉 Поздравляю! Ты достиг своей цели! Это невероятное достижение! 🏆';
  }
}

/**
 * Анализирует цель и предлагает улучшения
 */
export async function analyzeGoal(context: GoalContext): Promise<AISuggestion[]> {
  // Пытаемся использовать реальный ИИ
  if (groq && context.goalTitle) {
    try {
      const prompt = `Пользователь создает цель: "${context.goalTitle}"

${context.description ? `Описание: ${context.description}` : ''}
${context.aiPlanning?.successCriteria ? `Критерии успеха: ${context.aiPlanning.successCriteria}` : 'Критерии успеха: не указаны'}
${context.aiPlanning?.currentResources ? `Ресурсы: ${context.aiPlanning.currentResources}` : 'Ресурсы: не указаны'}
${context.aiPlanning?.obstacles ? `Препятствия: ${context.aiPlanning.obstacles}` : 'Препятствия: не указаны'}

Проанализируй цель и предложи 2-3 конкретных совета по улучшению планирования.
Укажи что можно улучшить, сделать более конкретным или добавить.

Ответ в формате JSON массива:
[
  {"type": "tip", "title": "Название совета", "message": "Подробное описание"},
  ...
]

Типы: "tip" (совет), "warning" (предупреждение)

Только JSON, без дополнительного текста.`;

      const systemPrompt = 'Ты эксперт по анализу и планированию целей. Помогай улучшать формулировки целей для лучшего результата. Отвечай только валидным JSON массивом.';

      const aiResponse = await generateWithAI(prompt, systemPrompt);
      
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
          const parsed = JSON.parse(jsonStr);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => ({
              type: (item.type || 'tip') as AISuggestion['type'],
              title: item.title || 'Совет',
              message: item.message || item.description || '',
            }));
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error analyzing goal:', error);
    }
  }

  // Fallback на базовые проверки
  const suggestions: AISuggestion[] = [];
  
  // Проверка на конкретность критериев успеха
  if (!context.aiPlanning?.successCriteria || context.aiPlanning.successCriteria.length < 20) {
    suggestions.push({
      type: 'tip',
      title: 'Сделай критерии успеха более конкретными',
      message: 'Чем конкретнее твои критерии успеха, тем легче будет отслеживать прогресс. Добавь измеримые показатели.',
    });
  }
  
  // Проверка на наличие ресурсов
  if (!context.aiPlanning?.currentResources || context.aiPlanning.currentResources.length < 10) {
    suggestions.push({
      type: 'tip',
      title: 'Подумай о своих ресурсах',
      message: 'Оцени, что у тебя уже есть для достижения цели. Это поможет лучше спланировать путь.',
    });
  }
  
  // Проверка на наличие препятствий
  if (!context.aiPlanning?.obstacles || context.aiPlanning.obstacles.length < 10) {
    suggestions.push({
      type: 'tip',
      title: 'Предвидь возможные препятствия',
      message: 'Подумай о том, что может помешать. Заранее подготовленный план поможет справиться с трудностями.',
    });
  }
  
  return suggestions;
}

/**
 * Получает контекстную помощь для пользователя
 */
export async function getContextualHelp(
  context: GoalContext,
  currentStep: 'planning' | 'checkpoints' | 'daily_task' | 'progress'
): Promise<AISuggestion[]> {
  switch (currentStep) {
    case 'planning':
      return analyzeGoal(context);
    case 'checkpoints':
      return generateCheckpointSuggestions(context);
    case 'daily_task':
      return generateDailyTaskSuggestions(context);
    case 'progress':
      return []; // TODO: Генерация советов на основе прогресса
    default:
      return [];
  }
}

// ИИ интегрирован через Groq API
// Используется модель llama-3.1-70b-versatile для быстрых и качественных ответов

