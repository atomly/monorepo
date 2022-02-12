# Monorepo

This is based on an official Turborepo Yarn v1 starter.

## Getting Started

Requirements:

- A Node.js stable version
- [Yarn](https://classic.yarnpkg.com/lang/en/) `v1.22.17`

After installing the requirements, run:

```sh
$ yarn install
yarn install v1.22.
[1/5] Validating package.json...
[2/5] Resolving packages...
[3/5] Fetching packages...
[4/5] Linking dependencies...
```

This will allow correct linting and running unit tests.

### What's inside?

This monorepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager.

### Git Submodules

Submodules allow us to keep a Git repository as a subdirectory of another Git repository. Submodules are being used in this monorepo as a tool to implement monorepo workspaces and achieve a certain level of independency between submodules, while keeping the monorepo as an aggregate of these submodules managing the entire repository and as well as common configuration.

### To run in a development environment

Start the respective docker-compose file at root level, for example:

```sh
$ docker-compose -f .dev.docker-compose.yaml up --force-recreate --build
Building...
```

Note that docker-compose in a development environment should reference development Dockerfile images, **not deployment images** (e.g. QA, staging, production, et al.). Dockerfiles with multi-stage builds can be used to achieve this.

## Useful Links

- **[Docker Anti Patterns](https://codefresh.io/containers/docker-anti-patterns/)**
- [Pipelines](https://monorepo.org/docs/features/pipelines)
- [Caching](https://monorepo.org/docs/features/caching)
- [Remote Caching (Beta)](https://monorepo.org/docs/features/remote-caching)
- [Scoped Tasks](https://monorepo.org/docs/features/scopes)
- [Configuration Options](https://monorepo.org/docs/reference/configuration)
- [CLI Usage](https://monorepo.org/docs/reference/command-line-reference)

## Utilities

This monorepo has some additional tools already setup:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Commands

Following are commands that can be executed at root level with the help of the `Turborepo` API. These commands are configured inside the `turbo.json` file and serve as the monorepo pipeline.

### Build

To build all apps and packages, run the following command:

```sh
$ yarn build
Building...
```

### Develop

To develop all apps and packages, run the following command:

```sh
$ yarn dev
Running...
```

### Test

To test all apps and packages, run the following command:

```sh
$ yarn test
Running...
```

## Turborepo

### Remote Caching

> From Turborepo:

Turborepo can use a technique known as [Remote Caching (Beta)](https://monorepo.org/docs/features/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching (Beta) you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```sh
yarn turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your monorepo:

```sh
yarn turbo link
```
