#
# Dockerfile based on:
# - https://turborepo.com/posts/turbo-0-4-0
# - https://github.com/vercel/turborepo/issues/215#issuecomment-991976190
#

# Base image with globally installed turbo:
FROM node:16.13.2-alpine3.14 AS base

  RUN apk update \
    && apk add git \
    && yarn global add turbo@1.1.2

# Prune the workspace for the `"@neweb/api"` package:
FROM base AS pruner

  WORKDIR /app

  COPY . .

  # Deterministically generating a sparse/partial monorepo with a pruned lockfile for a target package:
  RUN turbo prune --scope="@neweb/api" --docker

  # The output of turbo prune is a folder `out` with the following inside of it:
  #   1. A folder `json` with the pruned workspace's package.json files
  #   2. A folder `full` with the pruned workspace's full source code, but only including the internal packages that are needed to build the target
  #   3. A new pruned lockfile that only contains the pruned subset of the original root lockfile with the dependencies that are actually used by the packages in the pruned workspace.

# Install only the deps needed to build the target package:
FROM pruner AS installer

  WORKDIR /app

  # Add pruned lockfile and package.json's of the pruned subworkspace:
  COPY --from=pruner /app/out/json/ .
  COPY --from=pruner /app/out/yarn.lock ./yarn.lock
  RUN yarn install --frozen-lockfile

# Setting up the image entrypoint:
FROM installer AS development

  ENTRYPOINT ["yarn", "--cwd", "apps/neweb/backend/api", "dev"]

# Copy source code of pruned subworkspace and build
FROM installer AS builder

  WORKDIR /app

  COPY --from=installer /app/ .
  COPY --from=pruner /app/out/full/ .

  # Prune the dev dependencies after build step:c
  RUN \
    yarn turbo run build --scope="@neweb/api" && \
    yarn install --production

# Setting up the image entrypoint:
FROM builder AS production

  ENTRYPOINT ["yarn", "--cwd", "apps/neweb/backend/api", "start"]
