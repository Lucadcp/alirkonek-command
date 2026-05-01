# AlirKonek Command

Telegram Mini App + bot for workforce operations.

## Local dev

```bash
npm install
npm run dev
```

- API: http://localhost:3000
- Mini App: http://localhost:5173

## Bot

Use `/start` or `/app` in Telegram. Local mode uses polling by default.

## Production

1. Deploy `apps/web` to Vercel/Cloudflare Pages.
2. Deploy `apps/api` to Railway/Fly/Render.
3. Add environment variables from `.env.example`.
4. Set `BOT_MODE=webhook`.
5. Run `npm run build && npm run bot:set-webhook` with production env.
6. In BotFather: `/setmenubutton` to frontend URL, or `/newapp` and set app URL.
