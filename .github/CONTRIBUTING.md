# Furigana Maker Contributing Guide

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

You will need [pnpm](https://pnpm.io):

```bash
npm install -g pnpm
```

After cloning the repo, run:

```bash
# install the dependencies of the project
# This will automatically set up git hooks with prettier and lint for you.
$ pnpm install
```

### Setup Dev Environment

```bash
$ pnpm dev
```

After executing the above command, visit [chrome extensions page](chrome://extensions/), and click `Load unpacked` button, then select the `build/chrome-mv3-dev` folder in the project root directory, and try modifying the source code. You'll get live update.
