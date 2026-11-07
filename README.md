# Arghya Biswas — Human / System

The portfolio and its owner dashboard run in one Next.js app. Use Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

- Portfolio at [localhost:3000](http://localhost:3000/)
- Owner dashboard at [localhost:3000/dashboard](http://localhost:3000/dashboard/)

For dashboard sign-in, set `PORTFOLIO_ADMIN_PASSWORD` to a strong password of at least 16 characters in your local `.env.local` file or server environment. The local setup for this workspace already has a generated password in `.env.local`. Keep that file private and restart the server after changing it.

Choose Client Work or Personal Project when publishing from the dashboard. Each entry appears in its homepage section, newest first. The most recently published entry across both categories also appears in Featured Work. Earlier dashboard entries keep their place in Client Work and can be reclassified from the editor.

Local entries, skills, and screenshots are stored in `.data/portfolio.sqlite`. Set `PORTFOLIO_DB_PATH` to use a different local file.

On Vercel, use the Next.js framework preset and Node.js 22. Connect a dedicated Turso libSQL database and set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and `PORTFOLIO_ADMIN_PASSWORD` in the project's environment variables. Use a password of at least 16 characters. Redeploy after configuring the variables. The app creates its tables on first use. Use a separate database for previews if preview publishing is enabled.
