FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY server.cjs ./
COPY server/ ./server/
COPY config/ ./config/
RUN npm install --production
EXPOSE 3000
CMD ["node", "server.cjs"]
