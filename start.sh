#!/bin/sh

echo "Running Prisma migrations..."
npx prisma db push --accept-data-loss 2>&1

echo "Running Prisma seed..."
npx tsx prisma/seed.ts 2>&1 || echo "Seed skipped (optional)"

echo "Starting Next.js..."
exec npm start
