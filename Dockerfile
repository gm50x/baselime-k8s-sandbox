FROM node:20-alpine3.17 AS builder
ARG target
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build ${target}

FROM node:20-alpine3.17 AS runtime
ARG target
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist/apps/${target} ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]