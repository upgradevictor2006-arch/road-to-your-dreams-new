import crypto from 'crypto';

interface TelegramInitData {
  query_id?: string;
  user?: string;
  auth_date?: string;
  hash?: string;
}

/**
 * Verifies Telegram WebApp initData
 * @param initData - The initData string from Telegram WebApp
 * @param botToken - Your Telegram bot token
 * @returns boolean - true if valid, false otherwise
 */
export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return false;
    }

    // Remove hash from params
    urlParams.delete('hash');
    
    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Compare hashes
    return calculatedHash === hash;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return false;
  }
}

/**
 * Parse Telegram initData to get user info
 */
export function parseTelegramInitData(initData: string): any {
  try {
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    
    if (userStr) {
      return JSON.parse(decodeURIComponent(userStr));
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Telegram data:', error);
    return null;
  }
}

/**
 * Middleware to verify Telegram WebApp authentication
 */
export const verifyTelegramAuth = (req: any, res: any, next: any) => {
  // In development, allow requests without auth
  if (process.env.NODE_ENV === 'development') {
    req.telegramUser = { id: 1, first_name: 'Test', username: 'testuser' };
    return next();
  }

  const initData = req.headers['x-telegram-init-data'] || req.body.initData;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!initData || !botToken) {
    return res.status(401).json({ error: 'Missing Telegram authentication data' });
  }

  if (!verifyTelegramWebAppData(initData, botToken)) {
    return res.status(401).json({ error: 'Invalid Telegram authentication' });
  }

  const user = parseTelegramInitData(initData);
  if (!user) {
    return res.status(401).json({ error: 'Could not parse user data' });
  }

  req.telegramUser = user;
  next();
};

