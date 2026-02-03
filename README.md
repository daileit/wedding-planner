# WedBeLoving - Wedding Planning Application

A modern, full-stack wedding planning application built with Next.js 14, TypeScript, and PostgreSQL.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) - Full-Stack
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js v5 (Google Provider)
- **Containerization:** Docker (Single Container)

## 📁 Project Structure

This is a **full-stack Next.js application** - no separate backend needed.

```
app/                         # Full-stack Next.js application
├── prisma/                  # Database schema and migrations
├── src/
│   ├── app/                 # Pages & API routes (App Router)
│   │   ├── api/             # API endpoints (Auth, Health)
│   │   ├── auth/            # Auth pages (signin, error)
│   │   └── dashboard/       # Protected dashboard pages
│   ├── components/          # React components
│   │   ├── layout/          # Layout (Sidebar, Header)
│   │   └── ui/              # Shadcn UI components
│   ├── lib/                 # Utilities & configs
│   │   ├── prisma.ts        # Database client
│   │   └── auth.ts          # NextAuth configuration
│   ├── server/              # 🔧 BACKEND LOGIC (Server Actions)
│   │   └── actions/         # CRUD: plans.ts, categories.ts, items.ts
│   └── types/               # TypeScript definitions
├── scripts/                 # Docker entrypoint
├── Dockerfile               # Production build
└── Dockerfile.dev           # Development build
```

### Backend Code Location

Server Actions in `src/server/actions/` ARE the backend - they run exclusively on the server:

```typescript
// src/server/actions/plans.ts
"use server";  // This code runs on SERVER only

export async function createPlan(input) {
  return await prisma.plan.create({ data: input });
}
```

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)
- PostgreSQL (if not using Docker)

### Local Development (with Docker)

1. **Clone and setup environment:**
   ```bash
   cd app
   cp .env.example .env.local
   # Edit .env.local with your Google OAuth credentials
   ```

2. **Start services with Docker Compose:**
   ```bash
   # From project root
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   cd app
   npm run db:push
   ```

4. **Access the app:**
   - Application: http://localhost:3000
   - pgAdmin (optional): http://localhost:5050

### Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   cd app
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit DATABASE_URL to point to your PostgreSQL instance
   ```

3. **Generate Prisma client and push schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env.local`

## 📊 Database Schema

The application uses a generalized schema designed for future expansion:

- **User:** Authentication and profile data
- **Plan:** Main planning entity (Wedding, Party, etc.)
- **Category:** Budget categories within a plan
- **Item:** Individual items/tasks within categories
- **Vendor:** Vendor directory with affiliate links

## 🐳 Docker Commands

```bash
# Development
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f web              # View app logs

# Production
docker-compose -f docker-compose.prod.yml up -d

# Database
docker-compose exec postgres psql -U wedbeloving -d wedbeloving

# Enable pgAdmin
docker-compose --profile tools up -d
```

## 📝 NPM Scripts

Run from the `app/` directory:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## 🏗️ Architecture Decisions

1. **Full-Stack Next.js:** Single application handles both frontend and backend via Server Actions - no separate API server needed.

2. **Generalized Schema:** Database models support multiple planning types (Wedding, Party, House Renovation) without schema changes.

3. **Server Actions:** All CRUD operations in `src/server/actions/` run on the server, providing type-safe database access.

4. **Runtime Environment Variables:** All configuration is injected at container startup - no rebuild needed for config changes.

5. **Standalone Docker:** Production build uses Next.js standalone output for minimal container size (~200MB).

## 📄 License

MIT
