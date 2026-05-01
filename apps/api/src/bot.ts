import { Bot, InlineKeyboard, webhookCallback } from 'grammy';
import type { FastifyInstance } from 'fastify';
import { env } from './env.js';

export const bot = new Bot(env.BOT_TOKEN);

const appKeyboard = () =>
  new InlineKeyboard()
    .webApp('Open AlirKonek Command', env.PUBLIC_WEBAPP_URL)
    .row()
    .text('Today', 'today')
    .text('Tasks', 'tasks')
    .text('Help', 'help');

bot.command('start', async (ctx) => {
  await ctx.reply(
    'Welcome to AlirKonek Command.\n\nYour roster, tasks, attendance, and team operations live here. Open the Mini App to continue.',
    { reply_markup: appKeyboard() }
  );
});

bot.command('app', async (ctx) => {
  await ctx.reply('Open your workforce command centre:', { reply_markup: appKeyboard() });
});

bot.command('help', async (ctx) => {
  await ctx.reply('Try:\n• /app — open Mini App\n• “John clean freezer by 3pm” — task detection soon\n• “I am sick today” — absence flow soon');
});

bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;
  await ctx.answerCallbackQuery();
  if (data === 'today') {
    await ctx.reply('Today briefing is coming. For now open the Mini App.', { reply_markup: appKeyboard() });
  } else if (data === 'tasks') {
    await ctx.reply('Task board is in the Mini App.', { reply_markup: appKeyboard() });
  } else {
    await ctx.reply('AlirKonek Command help: use /app to open dashboard.');
  }
});

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return;
  await ctx.reply(`I heard: “${text}”\n\nSoon I’ll turn messages like this into tasks, roster changes, shift swaps, or handovers.`, {
    reply_markup: appKeyboard()
  });
});

export async function registerTelegramWebhook(app: FastifyInstance) {
  app.post(`/telegram/${env.WEBHOOK_SECRET}`, async (request, reply) => {
    const cb = webhookCallback(bot, 'fastify');
    return cb(request, reply);
  });
}
