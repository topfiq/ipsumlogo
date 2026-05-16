#!/bin/sh

echo "Starting Ipsumlogo..."

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL found. Running migrations..."
  npx prisma db push --accept-data-loss 2>&1 || echo "Migration failed (DB may not be reachable yet)"

  echo "Running seed..."
  npx tsx prisma/seed.ts 2>&1 || echo "Seed skipped"
else
  echo "No DATABASE_URL set — running without database (fallback mode)"
fi

echo "Starting Next.js..."
exec npm start
