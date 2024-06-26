# Furigana Maker Contributing Guide

Hi! We're Really excited that you are interested in contributing to Furigana Maker. Before submitting your contribution, please make sure to take a moment and Read through the following guidelines:

- [Code of Conduct](https://www.contributor-covenant.org/version/1/4/code-of-conduct/)
- [Pull Request Guidelines](#pull-request-guidelines)

## Pull Request Guidelines

- Checkout a topic branch from the relevant branch, e.g. `main`, and merge back against that branch.

- If adding a new feature:

  - Provide a convincing Reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Commit messages must be matched by the following regex, see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more information.

```txt
/^(build|chore|ci|website|feat|fix|perf|refactor|revert|style|test)(\(.+\))?: .{1,70}/
```

## Development Setup

> [!IMPORTANT]
> The exact node version used by this project is located in the `.nvmrc` file.
> If you are using [nvm](https://github.com/nvm-sh/nvm), you can run `nvm use` to switch to the correct version.

You will need [pnpm](https://pnpm.io):

```bash
corepack enable pnpm
```

After cloning the repo, run:

```bash
pnpm install
```

### Setup Dev Environment

#### Chrome/Edge

```bash
pnpm run dev
```

After executing the above command, visit **chrome extensions page** `chrome://extensions/`, and click `Load unpacked` button, then select the `.output/chrome-mv3` folder in the project root directory, and try modifying the source code. You'll get live update.

#### Firefox

```bash
pnpm run dev:firefox
```

After executing the above command, visit **firefox debugging page** `about:debugging#/runtime/this-firefox`, and click `Load Temporary Add-on...` button, then select the `.output/firefox-mv2/manifest.json` file in the project root directory, and try modifying the source code. You'll get live update.


### Get build target(.zip)

This `package` command will package the directory generated by the `pnpm run build` command into a zip file suitable for the browser extension store.

#### Chrome/Edge: `.output/chrome-mv3.zip`

```bash
pnpm run zip
```

#### Firefox: `.output/firefox-mv2.zip`

```bash
pnpm run zip:firefox
```