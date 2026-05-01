import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env.js';
import { bot, registerTelegramWebhook } from './bot.js';
import { validateTelegramInitData } from './telegramAuth.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  credentials: true
});

app.get('/health', async () => ({ ok: true, service: 'alirkonek-command-api' }));

app.post('/api/auth/telegram', async (request, reply) => {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('tma ')) return reply.code(401).send({ error: 'Missing Telegram init data' });
  try {
    const user = validateTelegramInitData(auth.slice(4), env.BOT_TOKEN);
    return { user, businesses: [], needsOnboarding: true };
  } catch (error) {
    request.log.warn(error);
    return reply.code(401).send({ error: 'Invalid Telegram init data' });
  }
});

app.get('/api/demo/me', async () => ({
  user: { name: 'Luca', role: 'Owner' },
  today: {
    shift: '9:00 AM – 5:00 PM',
    location: 'Main Site',
    team: ['Maria', 'John', 'Adit'],
    urgent: 'Stock count by 11:00 AM'
  },
  tasks: [
    { id: 't1', title: 'Clean cold room', assignee: 'John', due: 'Today 3:00 PM', status: 'todo', priority: 'high' },
    { id: 't2', title: 'Stock count', assignee: 'Maria', due: 'Today 11:00 AM', status: 'doing', priority: 'urgent' },
    { id: 't3', title: 'End shift handover', assignee: 'Luca', due: 'Today 5:00 PM', status: 'todo', priority: 'normal' }
  ],
  roster: [
    { id: 's1', date: 'Today', time: '9:00–17:00', role: 'Supervisor', location: 'Main Site', confirmed: true },
    { id: 's2', date: 'Tomorrow', time: '8:00–14:00', role: 'Supervisor', location: 'Main Site', confirmed: false }
  ],
  radar: [
    'John has not confirmed tomorrow shift',
    'Cold room task needs photo proof',
    'Sunday roster has no supervisor'
  ]
}));

await registerTelegramWebhook(app);

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(async () => {
  if (env.BOT_MODE === 'polling') {
    app.log.info('Starting Telegram bot polling');
    void bot.start();
  }
});
