# Data Analysis Portal — Frontend (React + Vite)

A standalone React app with just two screens:

1. **Login** (`/auth/login`) — email/password, JWT bearer auth.
2. **Data Analysis Dashboard** (`/data-analysis/dashboard`) — KPIs, charts,
   university leaderboard, growth trends, saved dashboards, recent exports.

Trimmed from a larger multi-portal platform, but functionally complete on
its own — same components, same design system, same API client.

## Setup

```bash
npm install
npm run Build
```

Runs at `http://localhost:5173`. API calls are sent straight to the backend
origin configured in `.env` (`VITE_API_BASE_URL`), which currently points
at the deployed Railway backend — so `npm run dev` works against live data
with no local Laravel server required.

If you'd rather run against a local backend (`php artisan serve` on
`http://localhost:8000`), either set `VITE_API_BASE_URL=` (empty) in a
`.env.local` file so calls fall back to same-origin and go through the
`/api` dev-server proxy in `vite.config.js`, or just set
`VITE_API_BASE_URL=http://localhost:8000` there instead.

## Demo accounts

Use the accounts seeded by the backend:

| Email | Password |
|---|---|
| `analyst@example.com` | `password` |
| `admin@example.com` | `password` |

## Build for production

```bash
npm run build
```

Outputs to `dist/`. `VITE_API_BASE_URL` is baked into the build at this
step, so make sure `.env` (or a `.env.production` override) points at the
right backend before building.

Frontend and backend are on different origins here (Railway backend,
frontend deployed wherever you host `dist/`), so whenever the frontend's
own deployed URL changes, update the backend's `FRONTEND_URL` env var on
Railway to match it — `UipCorsMiddleware` only allows that one origin.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/` and `dist/`. `.env` *is*
committed on purpose — it only holds the public API base URL, not a
secret — so the app is connected to the backend for anyone who clones it.

## What's in here

```
src/pages/Login.jsx                          Login form
src/pages/data-analysis/DataAnalysisDashboard.jsx   Dashboard page
src/layouts/AuthLayout.jsx                   Shared shell for the login screen
src/layouts/DashboardLayout.jsx              Sidebar + topbar + bottom nav shell
src/components/                              Sidebar, Topbar, BottomNav, Icon, Dropdown, AuthClock
src/context/                                 AuthContext (JWT), ThemeContext (dark/light), LanguageContext (en/ar)
src/api/client.js                            Bearer-token API client with automatic refresh-token retry
src/config/                                  navConfig (sidebar items), roleHome
src/i18n/                                    English/Arabic translation dictionaries
src/styles/                                  Full design system (CSS variables, components, themes)
```

Auth uses `sessionStorage` (not cookies), so this app can be hosted on a
completely different origin from the backend — just keep `FRONTEND_URL`
(backend) and the API base URL (here) pointed at each other.
