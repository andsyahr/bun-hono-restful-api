FROM oven/bun:1.2.2 AS base

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY prisma ./prisma/

# Development
FROM base AS development

ENV NODE_ENV=development

RUN bun install

COPY . .

RUN chown -R appuser:appgroup /app

USER appuser

CMD bun run db:deploy && bun run dev

# Production
FROM base AS production

ENV NODE_ENV=production

RUN bun install --frozen-lockfile --production

COPY . .

RUN bun db:generate

RUN bun run build

RUN chown -R appuser:appgroup /app

USER appuser

CMD bun run db:deploy && bun run start
