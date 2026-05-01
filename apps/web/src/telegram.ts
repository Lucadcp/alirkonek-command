declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe?: { user?: { id: number; first_name?: string; username?: string } };
        colorScheme?: 'light' | 'dark';
        MainButton?: { setText: (text: string) => void; show: () => void; hide: () => void; onClick: (fn: () => void) => void };
        HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void };
      };
    };
  }
}

export const tg = window.Telegram?.WebApp;

export function bootTelegram() {
  tg?.ready();
  tg?.expand();
}

export function getTelegramUserName() {
  const user = tg?.initDataUnsafe?.user;
  return user?.first_name || user?.username || 'Team member';
}
