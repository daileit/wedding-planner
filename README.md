# WedBeLoving - Wedding Planning Application

A modern, full-stack wedding planning application built with Next.js 14, TypeScript, and PostgreSQL.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js v5 (Google Provider)
- **Containerization:** Docker

## 📁 Project Structure

```
frontend/
├── prisma/              # Database schema and migrations
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes (NextAuth)
│   │   ├── auth/        # Auth pages (signin, error)
│   │   └── dashboard/   # Protected dashboard pages
│   ├── components/      # Shared UI components
│   │   ├── layout/      # Layout components (Sidebar, Header)
│   │   └── ui/          # Shadcn UI components
│   ├── lib/             # Utilities (Prisma client, Auth config)
│   ├── server/          # Server Actions (Backend Logic)
│   │   └── actions/     # CRUD operations for Plans, Categories, Items
│   └── types/           # Global TypeScript definitions
├── Dockerfile           # Production multi-stage build
├── Dockerfile.dev       # Development Dockerfile
└── docker-compose.yml   # Local development setup
```

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)
- PostgreSQL (if not using Docker)

### Local Development (with Docker)

1. **Clone and setup environment:**
   ```bash
   cd frontend
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
   cd frontend
   npm run db:push
   ```

4. **Access the app:**
   - Application: http://localhost:3000
   - pgAdmin (optional): http://localhost:5050

### Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   cd frontend
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
docker-compose logs -f app              # View app logs

# Production
docker-compose -f docker-compose.prod.yml up -d

# Database
docker-compose exec postgres psql -U wedbeloving -d wedbeloving

# Enable pgAdmin
docker-compose --profile tools up -d
```

## 📝 NPM Scripts

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

1. **Generalized Schema:** Database models are designed to support multiple planning types (Wedding, Party, House Renovation) without schema changes.

2. **Server Actions:** All CRUD operations are implemented as Next.js Server Actions, eliminating the need for a separate backend.

3. **Standalone Docker:** Production build uses Next.js standalone output for minimal container size (~200MB).

4. **Type Safety:** Strict TypeScript with no `any` types. All database models have corresponding frontend types.

## 📄 License

MIT
