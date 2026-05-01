import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { z } from 'zod';

const rootEnv = resolve(process.cwd(), '../../.env');
config({ path: existsSync(rootEnv) ? rootEnv : resolve(process.cwd(), '.env') });

const Env = z.object({
  BOT_TOKEN: z.string().min(20),
  PUBLIC_WEBAPP_URL: z.string().url().default('https://alirkonek-command.vercel.app'),
  API_BASE_URL: z.string().url().default('https://alirkonek-command-api.vercel.app/api'),
  DATABASE_URL: z.string().min(1).default('postgresql://placeholder:placeholder@localhost:5432/alirkonek_command'),
  WEBHOOK_SECRET: z.string().min(8).default('alirkonek-webhook-2026'),
  OPENAI_API_KEY: z.string().optional().default(''),
  PORT: z.coerce.number().default(3000),
  BOT_MODE: z.enum(['polling', 'webhook']).default('webhook')
});

export const env = Env.parse(process.env);
