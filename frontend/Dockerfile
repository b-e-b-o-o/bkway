
# syntax=docker/dockerfile:1

# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# https://docs.docker.com/language/nodejs/develop/#update-your-dockerfile-for-development

ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=development
USER node
WORKDIR /usr/app
EXPOSE 5173
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/home/node/.npm,uid=1000 \
    npm ci --include=dev
COPY . .
CMD ["npm", "run", "dev"]
