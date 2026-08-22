# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# --- builder: full source + nuxt build, which runs its own prepare/build pipeline ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- runner: Nitro's build output is self-contained, so the final image needs
# nothing but .output and a Node runtime ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -S nuxt && adduser -S nuxt -G nuxt
COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output
USER nuxt

EXPOSE 3000
# NUXT_REST_COUNTRIES_API_KEY must be passed at runtime (docker run -e / compose env), never baked into the image.
CMD ["node", ".output/server/index.mjs"]
