# Cost Planner - AI Agent Instructions

## 🏗️ Monorepo Architecture

Full-stack wedding cost planner with separate backend/frontend:
- **backend/**: Django + Django Ninja REST API (Python 3.13, SQLite)
- **frontend/**: Next.js App Router UI (TypeScript, React 18)
- Shared `.github/workflows/` for CI/CD

## Backend Architecture (Django + Django Ninja)

Django app structure in `backend/app/cost_plans/`:
- **Models** (`models.py`): Django ORM models with `@property` computed fields (`total_estimated_cost`, `remaining_budget`)
- **Schemas** (`schemas.py`): Django Ninja schemas for validation (Create/Update/Response/Summary variants)
- **API** (`api.py`): Django Ninja endpoint handlers with Django ORM queries
- **Admin** (`admin.py`): Django Admin interface with inline editing

### Data Flow Pattern
1. Request → Schema validation (e.g., `CostPlanCreate`)
2. API view uses Django ORM to create/query models with UUIDs
3. Model saved to SQLite database via `model.save()` or `Model.objects.create()`
4. Response via `model_to_response()` helper (Model → Response schema)

See [backend/app/cost_plans/api.py](backend/app/cost_plans/api.py) for full pattern.

### Backend Conventions
- **Status**: `PlanStatus` TextChoices (draft/active/completed/cancelled)
- **Costs**: `estimated_cost` (DecimalField, >0), `actual_cost` (DecimalField, optional, ≥0)
- **Computed properties**: `@property` methods on models (not stored in DB)
- **Schema naming**: `*Create` (POST), `*Update` (PUT/PATCH), `*Response` (API output), `*Summary` (list views)
- **Admin**: Full CRUD operations available at `/admin/` after creating superuser

### Database
Uses Django ORM with SQLite by default. Migrations in `app/cost_plans/migrations/`. Data persists across restarts. Easy to switch to PostgreSQL/MySQL.

## Frontend Architecture (Next.js)

- **App Router** with TypeScript in `frontend/src/app/`
- **Environment**: `NEXT_PUBLIC_API_URL` for backend communication
- **Docker**: Multi-stage build with standalone output for production

API calls use `process.env.NEXT_PUBLIC_API_URL` (defaults to http://localhost:8000). See [frontend/src/app/page.tsx](frontend/src/app/page.tsx) for fetch pattern.

## Development Workflow

### Local Development
```bash
# Backend
cd backend
python manage.py migrate              # Run migrations
python manage.py createsuperuser      # Create admin user
python manage.py runserver            # :8000

# Frontend
cd frontend && npm install && npm run dev    # :3000

# Or use Docker Compose
docker-compose up
```

### Docker Builds
```bash
# Backend
docker build -t cost-planner-backend ./backend

# Frontend  
docker build -t cost-planner-frontend ./frontend
```

## CI/CD Pipeline

`.github/workflows/ci-cd.yml` runs two parallel jobs:

**Backend Job**:
1. Python setup → pip install → tests
2. Docker build → push to `DOCKERHUB_USERNAME/cost-planner-backend`
3. Trigger `BACKEND_DEPLOY_WEBHOOK_URL` on main branch

**Frontend Job**:
1. Node setup → npm ci → lint → build
2. Docker build with `NEXT_PUBLIC_API_URL` build arg
3. Push to `DOCKERHUB_USERNAME/cost-planner-frontend`  
4. Trigger `FRONTEND_DEPLOY_WEBHOOK_URL` on main branch

### Required GitHub Secrets
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- `BACKEND_DEPLOY_WEBHOOK_URL`, `FRONTEND_DEPLOY_WEBHOOK_URL`
- `NEXT_PUBLIC_API_URL` (production API endpoint)

## Adding Features

### Backend Endpoint
1. Define model in `backend/app/cost_plans/models.py` with `@property` for computed fields
2. Create schemas in `backend/app/cost_plans/schemas.py` (Create, Update, Response variants)
3. Add route in `backend/app/cost_plans/api.py` using `model_to_response()` pattern
4. Register model in `backend/app/cost_plans/admin.py` for Django Admin access

### Frontend Page
1. Create route in `frontend/src/app/[route]/page.tsx`
2. Use `'use client'` for state/effects
3. Fetch from `${process.env.NEXT_PUBLIC_API_URL}/api/v1/...`
4. Handle loading/error states

See [backend/app/cost_plans/api.py](backend/app/cost_plans/api.py) for nested resource pattern (items within plans).

## Configuration

- **Backend**: `backend/app/settings.py` for Django settings, supports env vars for `CORS_ORIGINS`, `DEBUG`, `SECRET_KEY`
- **Frontend**: `next.config.js` for build config, `.env.local` for runtime vars
- **Docker Compose**: `docker-compose.yml` orchestrates both services with networking
