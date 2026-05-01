import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { z } from 'zod';

const rootEnv = resolve(process.cwd(), '../../.env');
config({ path: existsSync(rootEnv) ? rootEnv : resolve(process.cwd(), '.env') });

const Env = z.object({
  BOT_TOKEN: z.string().min(20),
  PUBLIC_WEBAPP_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  WEBHOOK_SECRET: z.string().min(8),
  OPENAI_API_KEY: z.string().optional().default(''),
  PORT: z.coerce.number().default(3000),
  BOT_MODE: z.enum(['polling', 'webhook']).default('polling')
});

export const env = Env.parse(process.env);
