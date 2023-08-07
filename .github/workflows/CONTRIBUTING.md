# FuriganaMaker Contributing Guide

Hi! We're Really excited that you are interested in contributing to FuriganaMaker. Before submitting your contribution, please make sure to take a moment and Read through the following guidelines:

- [Code of Conduct](<[./CODE_OF_CONDUCT.md](https://www.contributor-covenant.org/version/1/4/code-of-conduct/)>)
- [Pull Request Guidelines](#pull-request-guidelines)

## Pull Request Guidelines

- Checkout a topic branch from the relevant branch, e.g. `main`, and merge back against that branch.

- If adding a new feature:

  - Provide a convincing Reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Commit messages must follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated.

## Development Setup

You will need [pnpm](https://pnpm.io)

After cloning the repo, run:

```bash
# install the dependencies of the project
# This will automatically set up git hooks with prettier and lint for you.
$ pnpm install
```

### Setup Dev Environment

The easiest way to start testing out FuriganaMaker is to tweak the FuriganaMaker blog. You may run `pnpm run docs` to boot up FuriganaMaker blog site locally, with live reloading of the source code.

```bash
$ pnpm docs:dev
```

After executing the above command, visit http://localhost:5173 and try modifying the source code. You'll get live update.
