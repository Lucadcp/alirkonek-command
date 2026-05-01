import crypto from 'node:crypto';

export type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export function validateTelegramInitData(rawInitData: string, botToken: string, maxAgeSeconds = 86400): TelegramUser {
  const params = new URLSearchParams(rawInitData);
  const hash = params.get('hash');
  if (!hash) throw new Error('Missing Telegram hash');

  const authDateRaw = params.get('auth_date');
  if (!authDateRaw) throw new Error('Missing auth_date');
  const authDate = Number(authDateRaw);
  if (!Number.isFinite(authDate)) throw new Error('Invalid auth_date');
  if (Math.floor(Date.now() / 1000) - authDate > maxAgeSeconds) throw new Error('Telegram auth expired');

  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const left = Buffer.from(computed, 'hex');
  const right = Buffer.from(hash, 'hex');
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    throw new Error('Invalid Telegram signature');
  }

  const userRaw = params.get('user');
  if (!userRaw) throw new Error('Missing Telegram user');
  return JSON.parse(userRaw) as TelegramUser;
}
