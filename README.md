# Noé Soulama - portfolio

A bilingual (English / French) portfolio with a **Django REST Framework** backend and a **Next.js 14** frontend, kept in two separate folders.

```
portfolio/
  backend/    Django REST API: content, bilingual fields, contact form, admin
  frontend/   Next.js 14 (App Router, TypeScript): the website
```

The content lives in `backend/data/*.json` (single source of truth). `manage.py seed_portfolio` loads it into the database, the API serves it, the frontend renders it.

## Run it (two terminals)

### 1. Backend (http://127.0.0.1:8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt      # macOS/Linux: .venv/bin/pip
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py seed_portfolio
.venv\Scripts\python manage.py runserver
```

Tests: `.venv\Scripts\python manage.py test` (17 tests).
Admin (optional): `manage.py createsuperuser`, then http://127.0.0.1:8000/admin/ to read contact messages.

### 2. Frontend (http://localhost:3000)

```bash
cd frontend
npm install
copy .env.example .env.local        # macOS/Linux: cp .env.example .env.local
npm run dev                         # or: npm run build && npm start
```

## API

| Endpoint | Description |
|---|---|
| `GET /api/v1/health/` | liveness |
| `GET /api/v1/profile/` | identity, headline, bio, stats, interests, languages |
| `GET /api/v1/projects/` | all projects ordered by priority. Filters: `?kind=research\|system\|learning`, `?featured=1` |
| `GET /api/v1/projects/<slug>/` | one project with its metrics |
| `GET /api/v1/experience/` | experience |
| `GET /api/v1/achievements/` | awards, academic results, certificates |
| `GET /api/v1/skills/` | skill groups with the projects that prove them |
| `POST /api/v1/contact/` | contact form (5 per hour per client, honeypot field `website`) |

Every visitor-facing text is returned as `{ "en": "...", "fr": "..." }`.

## Editing the content

1. Edit the JSON in `backend/data/` (`projects.json` is the one you will touch most).
2. Run `python manage.py seed_portfolio` again. It is idempotent and removes records you deleted from the files.
3. The frontend refreshes its cache every 60 seconds.

Rules the tests enforce: every project has an English and a French summary, **every project states its limits**, a project whose code is private never has a repository link, and priorities are unique.

## Structure

```
backend/
  config/                      settings (env-driven), urls, wsgi
  apps/portfolio/
    models.py                  Profile, Project, Experience, Achievement, SkillGroup, ContactMessage
    serializers.py             BilingualSerializer folds *_en / *_fr into {en, fr}
    views.py  urls.py          read-only endpoints + throttled contact endpoint
    management/commands/seed_portfolio.py
    tests/test_api.py
  data/*.json                  the content
frontend/
  app/                         routes: /, /projects, /projects/[slug], /research,
                               /experience, /achievements, /about, /contact, 404, sitemap
  components/                  NoiseTrace (hero), ProjectCard, MetricBars, Nav, Footer, ...
  components/views/            one view per page (pages only fetch, views only render)
  lib/                         api client, i18n provider, UI strings, types
```

## Environment variables

Backend: `DJANGO_DEBUG` (default 1), `DJANGO_SECRET_KEY` (required when debug is off), `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (the frontend's address).
Frontend: see `frontend/.env.example`.

## Deploying

Deploy the two folders separately (for example the frontend on Vercel and the backend on any Python host with `gunicorn config.wsgi`). Set `CORS_ALLOWED_ORIGINS` on the backend to the frontend's public address, and `API_URL` / `NEXT_PUBLIC_API_URL` on the frontend to the backend's public address. For production use a persistent database instead of SQLite and set `DJANGO_DEBUG=0`.

## Honesty rules for the content

Nothing is published here that cannot be checked: results come from the public repositories, statuses say "not launched" when a project is not, and private code is never linked. Keep it that way when you add projects.

## Putting it online for the long run (recommended): frontend only

The frontend can run **without any backend**: when `API_URL` / `NEXT_PUBLIC_API_URL` are not set, it reads `frontend/data/snapshot.json`, a copy of the content generated from the Django API. Nothing paid has to keep running, so the site cannot go down because a server stopped.

1. Push the repository to GitHub.
2. Vercel: import the repository, *Root Directory* = `frontend`, set only `NEXT_PUBLIC_SITE_URL` to the public address. Do **not** set the API variables.
3. The contact form then opens the visitor's mail app with the message ready (no server needed).

Updating the content later:

```bash
cd backend
.venv\Scripts\python manage.py seed_portfolio       # load backend/data/*.json
.venv\Scripts\python manage.py export_snapshot      # rewrite frontend/data/snapshot.json
```

Then commit and push: Vercel rebuilds. A test checks that the snapshot is identical to what the API returns.

To keep the site up for years: register the domain for several years, keep the repository on GitHub, and renew nothing else. The Django API stays in the repository as the editing tool and as proof of the backend work.

## Alternative: also run the live API (frontend on Vercel, backend on Railway)

1. Push this folder to a GitHub repository (the `backend/` and `frontend/` folders stay as they are).
2. **Backend on Railway**: New project, Deploy from GitHub repo, set *Root Directory* to `backend`. Add a PostgreSQL database to the project and copy its `DATABASE_URL` reference into the backend service. Set the variables from `backend/.env.example`. The `Procfile` migrates, loads the content, collects static files and starts gunicorn. Generate a public domain for the service.
3. **Frontend on Vercel**: Import the same repository, set *Root Directory* to `frontend`. Set `API_URL` and `NEXT_PUBLIC_API_URL` to `https://<your-railway-domain>/api/v1`, and `NEXT_PUBLIC_SITE_URL` to the Vercel address.
4. Go back to Railway and set `CORS_ALLOWED_ORIGINS` to the Vercel address (no trailing slash) and `DJANGO_ALLOWED_HOSTS` to the Railway domain. Redeploy.
5. Check `https://<railway-domain>/api/v1/health/`, then open the Vercel address.

Changing content later: edit `backend/data/*.json`, push, Railway redeploys and reseeds.
