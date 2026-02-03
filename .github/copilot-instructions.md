# WedBeLoving - AI Agent Instructions

## 🏗️ Architecture

Full-stack Next.js 14 wedding planner - **single application, no separate backend**.

```
app/                         # Full-stack Next.js application
├── prisma/                  # Database schema (PostgreSQL)
├── src/
│   ├── app/                 # Pages & API routes
│   ├── components/          # React components (Shadcn UI)
│   ├── lib/                 # Prisma client, Auth config
│   ├── server/actions/      # 🔧 BACKEND LOGIC (Server Actions)
│   └── types/               # TypeScript definitions
├── Dockerfile               # Production (standalone)
└── Dockerfile.dev           # Development
```

## Backend Logic (Server Actions)

All backend code is in `app/src/server/actions/`:
- **plans.ts**: CRUD for wedding plans
- **categories.ts**: Budget categories within plans
- **items.ts**: Individual items/tasks

### Data Flow Pattern
```typescript
// app/src/server/actions/plans.ts
"use server";  // Runs on SERVER only

import prisma from "@/lib/prisma";

export async function createPlan(input: CreatePlanInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const plan = await prisma.plan.create({
    data: { userId: session.user.id, ...input }
  });
  
  revalidatePath("/dashboard");
  return { id: plan.id };
}
```

### Conventions
- **Auth**: Always verify `session.user.id` before database operations
- **Validation**: Ownership checked via `userId` relation
- **Revalidation**: Call `revalidatePath()` after mutations
- **Types**: Use types from `@/types` (CreatePlanInput, UpdatePlanInput, etc.)

## Database (Prisma + PostgreSQL)

Schema in `app/prisma/schema.prisma`:
- **User**: NextAuth.js compatible (accounts, sessions)
- **Plan**: Generalized (WEDDING, PARTY, etc.) with budget
- **Category**: Budget categories with color coding
- **Item**: Tasks with cost tracking, status, vendor links
- **Vendor**: Directory with affiliate marketing support

### Enums
- **PlanType**: WEDDING, PARTY, CORPORATE_EVENT, HOUSE_RENOVATION, TRAVEL, OTHER
- **PlanStatus**: DRAFT, ACTIVE, COMPLETED, ARCHIVED
- **ItemStatus**: PENDING, IN_PROGRESS, BOOKED, PAID, COMPLETED, CANCELLED
- **Currency**: USD, EUR, GBP, etc.

## Development Workflow

```bash
# Local development
cd app
cp .env.example .env.local
npm install
npm run db:push
npm run dev                    # :3000

# Or use Docker Compose (from project root)
docker-compose up -d
```

## Docker

Single container deployment with runtime environment variables:

```bash
# Build
docker build -t wedbeloving ./app

# Run (all env vars injected at runtime)
docker run -e DATABASE_URL=... -e NEXTAUTH_SECRET=... wedbeloving
```

## CI/CD Pipeline

`.github/workflows/ci-cd.yml`:
1. Install dependencies → Generate Prisma → Lint → Build
2. Docker build & push to DockerHub
3. Trigger deploy webhook on main branch

### Required Secrets
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- `DEPLOY_HOOK_URL` (optional)

## Adding Features

### New Server Action
1. Add function in `app/src/server/actions/`
2. Use `"use server"` directive
3. Verify auth with `await auth()`
4. Use Prisma for database operations
5. Call `revalidatePath()` after mutations

### New Page
1. Create route in `app/src/app/[route]/page.tsx`
2. Use `await auth()` for protected pages
3. Import Server Actions directly
4. Use Shadcn UI components from `@/components/ui`

### New Database Model
1. Add model in `app/prisma/schema.prisma`
2. Run `npm run db:push` or `npm run db:migrate`
3. Add types in `app/src/types/index.ts`
4. Create Server Actions in `app/src/server/actions/`
