# ImariWise — Phase 1

A fresh React + Vite, Express and Supabase starter for personal finance management.

## Requirements
- Node.js 20+
- A Supabase project
- npm

## 1. Supabase setup
1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. In Authentication > URL Configuration, set the local Site URL to `http://localhost:5173`.
5. Add `http://localhost:5173/**` to allowed redirect URLs if needed.

## 2. Backend setup
Open a terminal in `server`:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Edit `server/.env` and set:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PORT=5000`
- `CLIENT_ORIGIN=http://localhost:5173`

Do not put a Supabase service-role key in this project. The API uses the user's access token and RLS.

## 3. Frontend setup
Open another terminal in `client`:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `client/.env`.
Set `VITE_API_URL=http://localhost:5000/api`.

Open http://localhost:5173.

## 4. Test Phase 1
1. Register a new account.
2. If email confirmation is enabled, confirm the email before signing in.
3. Sign in.
4. Add income and expenses from the dashboard.
5. Check Supabase Table Editor > `transactions`.
6. Verify that a user can only access their own rows.

## Authentication and security
- Supabase Auth issues the JWT.
- Express validates each bearer token using Supabase Auth `getUser(token)`.
- API database requests use the public anon key plus the user's JWT.
- PostgreSQL RLS policies enforce ownership.
- Never expose service-role keys in browser code or commit `.env` files.

## Current scope
Phase 1 includes registration/login, protected dashboard, persistent income/expense CRUD and live summary totals. Budgets, savings goals, AI insights, reports, language expansion and deployment are subsequent phases.
