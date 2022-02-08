#
# Dockerfile based on:
# - https://turborepo.com/posts/turbo-0-4-0
# - https://github.com/vercel/turborepo/issues/215#issuecomment-991976190
#

#
# TODO:
# - The `scope` value (web) should be an ENV value.
#

# Base image with globally installed turbo:
FROM node:16.13.2-alpine3.14 AS base

  RUN apk update \
    && apk add git \
    && yarn global add turbo@1.1.2

# Prune the workspace for the `web` API:
FROM base AS pruner

  # With the WORKDIR command, we are setting the context.
  # Basically, all the further commands will execute in this context.
  WORKDIR /app

  COPY . .

  # Deterministically generating a sparse/partial monorepo with a pruned lockfile for a target package:
  RUN turbo prune --scope=web --docker

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
  RUN yarn install

# Copy source code of pruned subworkspace and build
FROM installer AS builder

  WORKDIR /app

  COPY --from=installer /app/ .
  COPY --from=pruner /app/out/full/ .
  COPY .gitignore .gitignore

  RUN yarn turbo run build --scope=web

# Start the API:
FROM builder AS runner
  # Exposing Next.js app port and
  # Webpack default hot reload port respectively:
  EXPOSE 3000
  EXPOSE 49153
  CMD ["yarn", "--cwd", "apps/web", "dev"]
