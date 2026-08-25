# syntax=docker/dockerfile:1

FROM node:22-alpine AS ui-build
WORKDIR /app/ui

COPY ui/package.json ui/package-lock.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build

FROM node:22-alpine AS backend-build
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=ui-build /app/ui/dist ./public

USER node

EXPOSE 4010

CMD ["node", "dist/server.js"]
