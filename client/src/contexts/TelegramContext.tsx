import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface TelegramContextType {
  user: any;
  theme: any;
  viewport: any;
  initData: any;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<any>(null);
  const [viewportState, setViewportState] = useState<any>(null);
  const [initDataState, setInitDataState] = useState<any>(null);

  useEffect(() => {
    // Initialize Telegram SDK
    const initTelegram = () => {
      try {
        // Check if we're in Telegram WebApp environment
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
          const tg = (window as any).Telegram.WebApp;
          
          // Initialize WebApp
          tg.ready();
          tg.expand();

          // Get user data
          const userData = tg.initDataUnsafe?.user || null;
          
          // Get theme
          const themeData = {
            bg_color: tg.themeParams?.bg_color || '#ffffff',
            text_color: tg.themeParams?.text_color || '#000000',
            hint_color: tg.themeParams?.hint_color,
            link_color: tg.themeParams?.link_color,
            button_color: tg.themeParams?.button_color,
            button_text_color: tg.themeParams?.button_text_color,
          };

          // Get viewport
          const viewportData = {
            height: tg.viewportHeight || window.innerHeight,
            width: tg.viewportWidth || window.innerWidth,
            isExpanded: tg.isExpanded,
            stableHeight: tg.viewportStableHeight,
          };

          // Get init data
          const initDataValue = tg.initDataUnsafe || null;

          setUser(userData);
          setTheme(themeData);
          setViewportState(viewportData);
          setInitDataState(initDataValue);

          // Listen to theme changes
          tg.onEvent('themeChanged', () => {
            const newTheme = {
              bg_color: tg.themeParams?.bg_color || '#ffffff',
              text_color: tg.themeParams?.text_color || '#000000',
            };
            setTheme(newTheme);
          });

          // Listen to viewport changes
          tg.onEvent('viewportChanged', () => {
            const newViewport = {
              height: tg.viewportHeight || window.innerHeight,
              width: tg.viewportWidth || window.innerWidth,
              isExpanded: tg.isExpanded,
              stableHeight: tg.viewportStableHeight,
            };
            setViewportState(newViewport);
          });
        } else {
          // Fallback for development
          setUser({ id: 1, first_name: 'Test', username: 'testuser' });
          setTheme({ bg_color: '#ffffff', text_color: '#000000' });
          setViewportState({ height: window.innerHeight, width: window.innerWidth });
        }
      } catch (error) {
        console.error('Error initializing Telegram SDK:', error);
        // Fallback for development
        setUser({ id: 1, first_name: 'Test', username: 'testuser' });
        setTheme({ bg_color: '#ffffff', text_color: '#000000' });
        setViewportState({ height: window.innerHeight, width: window.innerWidth });
      }
    };

    // Wait for Telegram script to load
    if (typeof window !== 'undefined') {
      if ((window as any).Telegram?.WebApp) {
        initTelegram();
      } else {
        // Wait a bit for script to load
        const timer = setTimeout(() => {
          initTelegram();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, theme, viewport: viewportState, initData: initDataState }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};

