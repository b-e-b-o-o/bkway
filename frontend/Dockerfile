# syntax=docker/dockerfile:1

# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# https://docs.docker.com/language/nodejs/develop/#update-your-dockerfile-for-development

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS base
USER node
WORKDIR /usr/app

FROM base AS development
ENV NODE_ENV=development
EXPOSE 5173
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/home/node/.npm,uid=1000 \
    npm ci --include=dev
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/home/node/.npm,uid=1000 \
    npm ci --include=dev
COPY . .
RUN ["npm", "run", "build"]

FROM base AS production
ENV NODE_ENV=production
EXPOSE 4173
RUN --mount=type=cache,target=/home/node/.npm,uid=1000 \
    npm i vite
COPY .env ./
COPY --from=build /usr/app/dist/ ./dist/
CMD ["npx", "vite", "preview", "--host"]
