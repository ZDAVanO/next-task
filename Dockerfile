# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://nexttask:password@db:5432/nexttask
RUN pnpm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable pnpm
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma
# Ensure Prisma runtime config is available inside the image (JS fallback)
COPY --from=builder /app/prisma.config.js ./prisma.config.js
EXPOSE 3000
CMD ["node", "server.js"]