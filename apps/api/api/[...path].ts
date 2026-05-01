type VercelRequest = {
  method?: string;
  url?: string;
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
};
type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): void;
  end(): void;
};

import { bot } from '../src/bot.js';
import { env } from '../src/env.js';
import { validateTelegramInitData } from '../src/telegramAuth.js';

function cors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const demo = {
  user: { name: 'Luca', role: 'Owner' },
  today: { shift: '9:00 AM – 5:00 PM', location: 'Main Site', team: ['Maria', 'John', 'Adit'], urgent: 'Stock count by 11:00 AM' },
  tasks: [
    { id: 't1', title: 'Clean cold room', assignee: 'John', due: 'Today 3:00 PM', status: 'todo', priority: 'high' },
    { id: 't2', title: 'Stock count', assignee: 'Maria', due: 'Today 11:00 AM', status: 'doing', priority: 'urgent' },
    { id: 't3', title: 'End shift handover', assignee: 'Luca', due: 'Today 5:00 PM', status: 'todo', priority: 'normal' }
  ],
  roster: [
    { id: 's1', date: 'Today', time: '9:00–17:00', role: 'Supervisor', location: 'Main Site', confirmed: true },
    { id: 's2', date: 'Tomorrow', time: '8:00–14:00', role: 'Supervisor', location: 'Main Site', confirmed: false }
  ],
  radar: ['John has not confirmed tomorrow shift', 'Cold room task needs photo proof', 'Sunday roster has no supervisor']
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const parts = Array.isArray(req.query.path) ? req.query.path : [];
  const urlPath = new URL(req.url || '/', 'https://alirkonek-command-api.vercel.app').pathname.replace(/^\/api/, '') || '/';
  const path = parts.length ? '/' + parts.join('/') : urlPath;

  if (req.method === 'GET' && path === '/health') return res.json({ ok: true, service: 'alirkonek-command-api' });
  if (req.method === 'GET' && path === '/demo/me') return res.json(demo);

  if (req.method === 'POST' && path === '/auth/telegram') {
    const auth = req.headers.authorization;
    if (typeof auth !== 'string' || !auth.startsWith('tma ')) return res.status(401).json({ error: 'Missing Telegram init data' });
    try {
      const user = validateTelegramInitData(auth.slice(4), env.BOT_TOKEN);
      return res.json({ user, businesses: [], needsOnboarding: true });
    } catch {
      return res.status(401).json({ error: 'Invalid Telegram init data' });
    }
  }

  if (req.method === 'POST' && path === `/telegram/${env.WEBHOOK_SECRET}`) {
    await bot.handleUpdate(req.body as Parameters<typeof bot.handleUpdate>[0]);
    return res.status(200).json({ ok: true });
  }

  return res.status(404).json({ error: 'Not found', path });
}
