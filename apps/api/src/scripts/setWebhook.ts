import 'dotenv/config';
import { Bot } from 'grammy';

const token = process.env.BOT_TOKEN;
const apiBase = process.env.API_BASE_URL;
const secret = process.env.WEBHOOK_SECRET;
if (!token || !apiBase || !secret) throw new Error('BOT_TOKEN, API_BASE_URL, WEBHOOK_SECRET required');

const bot = new Bot(token);
await bot.api.setWebhook(`${apiBase}/telegram/${secret}`);
console.log('Webhook set:', `${apiBase}/telegram/${secret}`);
