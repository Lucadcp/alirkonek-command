# AlirKonek Command Build Plan

## Goal
Telegram-native workforce OS: rosters, tasks, attendance, chat intelligence, shift handovers, and manager radar.

## MVP slice
1. Bot `/start` opens Mini App.
2. Mini App shows Today, Tasks, Roster, Ops Radar.
3. Backend validates Telegram Mini App initData.
4. Database schema supports businesses, users, shifts, tasks, attendance.
5. Deploy frontend to Vercel/Cloudflare Pages.
6. Deploy backend to Railway/Fly/Render.

## Production setup
- Create Telegram bot via BotFather.
- Create Mini App via `/newapp` or set bot menu button via `/setmenubutton`.
- Host frontend at HTTPS URL.
- Set `PUBLIC_WEBAPP_URL` to frontend URL.
- Host backend at HTTPS URL.
- Set `API_BASE_URL` to backend URL.
- Set Telegram webhook: `npm run bot:set-webhook`.

## Updating
Push to GitHub. Hosting provider auto-deploys. Telegram loads latest frontend automatically.
