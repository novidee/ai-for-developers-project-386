# Agent Instructions

## Verification

Run the relevant build commands and `npm run test:e2e` before completing changes that affect the application or its integration tests.

## Commits

Every commit created by an agent must follow Conventional Commits 1.0.0:

```text
type(optional-scope): imperative summary
```

Use `feat` for a user-facing feature, `fix` for a bug fix, and `!` or a `BREAKING CHANGE:` footer for an incompatible change. Other allowed types include `docs`, `test`, `ci`, `build`, `refactor`, `perf`, `style`, `chore`, and `revert`.
