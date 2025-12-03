
FROM oven/bun:latest

ENV NODE_ENV=production

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --production

COPY . .

EXPOSE 3000

# Run the application.
CMD ["bun", "start"]
