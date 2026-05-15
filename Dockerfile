FROM node:20-alpine AS builder
WORKDIR /app

RUN npm config set fetch-retries 5 && npm config set fetch-timeout 120000

COPY package.json package-lock.json ./
RUN npm ci --include=dev --prefer-offline 2>&1 || npm install --include=dev 2>&1 || npm install --include=dev --registry https://registry.npmmirror.com

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
