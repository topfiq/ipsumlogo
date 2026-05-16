FROM node:20-alpine AS builder
WORKDIR /app

RUN npm config set fetch-retries 5 && npm config set fetch-timeout 120000

COPY package.json package-lock.json ./
RUN npm ci --include=dev --prefer-offline 2>&1 || npm install --include=dev 2>&1 || npm install --include=dev --registry https://registry.npmmirror.com

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["npm", "start"]
