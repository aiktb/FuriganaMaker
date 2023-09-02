## Git Commit Message Convention

> This is adapted from [VitePress's commit convention](https://github.com/vuejs/vitepress/blob/main/.github/commit-convention.md).

#### Commit Message Header

Messages must be matched by the following regex:

```regex
/^(feat|fix|website|style|refactor|perf|test|workflow|build|ci|chore|types)(\(.+\))?: .{1,50}/
```

#### Examples

Appears under "Features" header, `style` subheader:

```
feat(style): add home page feature
```

Appears under "Bug Fixes" header, `style` subheader, with a link to issue #28:

```
fix(style): remove underline on sidebar hover style

close #28
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf: improve store getters performance by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.
```

```
<type>(<scope>): <subject>
```

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope

The scope could be anything specifying the place of the commit change. For example `style`, `compiler`, `ssr`, etc...

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
