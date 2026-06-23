# TODO

## Dependency security pass

`npm audit` currently reports 2 vulnerabilities:

- `next`: high severity
- `postcss`: moderate severity

Do a dedicated dependency/security pass later to review the advisories, choose a safe Next.js/PostCSS upgrade path, and re-run build/lint checks. This hygiene pass intentionally does not upgrade production dependencies.
