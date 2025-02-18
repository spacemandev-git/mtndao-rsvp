FROM oven/bun:latest

WORKDIR /app

COPY . /app

RUN bun install
RUN bun build

EXPOSE 4173

CMD ["bun", "run", "preview"]