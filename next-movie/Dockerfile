FROM node:19.5.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm upgrade

RUN npm install

COPY . .

RUN npm run build

FROM node:19.5.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]
