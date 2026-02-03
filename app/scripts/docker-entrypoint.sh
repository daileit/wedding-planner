#!/bin/sh
set -e

# ==========================================
# WedBeLoving - Docker Entrypoint Script
# Handles runtime environment variable injection
# ==========================================

echo "🚀 Starting WedBeLoving..."

# Validate required environment variables
check_required_env() {
  var_name="$1"
  var_value="$2"
  if [ -z "$var_value" ]; then
    echo "❌ ERROR: Required environment variable $var_name is not set"
    exit 1
  fi
  echo "✅ $var_name is configured"
}

echo ""
echo "📋 Validating environment configuration..."

# Required for database
check_required_env "DATABASE_URL" "$DATABASE_URL"

# Required for authentication
check_required_env "NEXTAUTH_URL" "$NEXTAUTH_URL"
check_required_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
check_required_env "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID"
check_required_env "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET"

echo ""
echo "🔧 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-production}"
echo "   PORT: ${PORT:-3000}"
echo "   HOSTNAME: ${HOSTNAME:-0.0.0.0}"
echo "   NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""

# Run Prisma migrations if AUTO_MIGRATE is set
if [ "$AUTO_MIGRATE" = "true" ]; then
  echo "📦 Running database migrations..."
  npx prisma migrate deploy
  echo "✅ Migrations complete"
  echo ""
fi

# Generate Prisma client if needed (for fresh containers)
if [ ! -d "node_modules/.prisma" ]; then
  echo "📦 Generating Prisma client..."
  npx prisma generate
  echo "✅ Prisma client generated"
  echo ""
fi

echo "🎉 Starting Next.js server..."
exec "$@"
