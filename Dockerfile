# -------------------------
# 1. Build Stage
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# -------------------------
# 2. Production Runtime
# -------------------------
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
