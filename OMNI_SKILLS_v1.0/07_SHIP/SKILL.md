---
name: omni-ship-engine
description: "Testing, CI/CD, Docker, git hooks, deployment, monitoring. Use when shipping code to production, setting up quality gates, writing tests, or configuring deployment pipelines."
triggers: ["test", "deploy", "docker", "CI/CD", "git hook", "husky", "lint", "eslint", "prettier", "vitest", "playwright", "jest", "commit", "pipeline", "staging", "production", "monitoring", "health check"]
---

# OMNI SHIP Engine
### Code that isn't tested isn't done. Code that isn't deployed isn't useful.

---

## TESTING DOCTRINE

| Layer | Tool | What to test |
|-------|------|-------------|
| Unit | **Vitest** | Pure functions, services, utilities |
| Component | **Testing Library** | Render, interaction, accessibility |
| Integration | **Vitest + Supertest** | API endpoints end-to-end |
| E2E | **Playwright** | Critical user flows in real browser |

### Test Priority (what to test first)

1. **Revenue paths** — checkout, payment, signup
2. **Auth flows** — login, logout, permissions
3. **Data mutations** — create, update, delete
4. **Edge cases** — empty states, errors, boundaries

### Test File Structure

```
src/features/auth/
  __tests__/
    auth.service.test.ts    ← unit
    login.component.test.ts ← component
tests/e2e/
  auth.spec.ts              ← playwright
```

### Testing Pattern

```ts
describe('UserService.create', () => {
  it('rejects duplicate emails', async () => {
    await createUser({ email: 'a@b.com' });
    await expect(createUser({ email: 'a@b.com' }))
      .rejects.toThrow('Email already registered');
  });
});
```

---

## GIT HOOKS (quality gates on every commit)

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

### Pre-commit: lint + format

```json
{ "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
}}
```

### Commit messages: conventional commits

```
feat(auth): add JWT refresh rotation
fix(cart): resolve rounding error
refactor(api): extract repository pattern
```

### Pre-push: type-check + test

```bash
# .husky/pre-push
npm run type-check && npm run test -- --passWithNoTests
```

---

## DOCKER

### Multi-stage Build (production)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Rules:**
- `.dockerignore`: `node_modules`, `.git`, `.env`, `dist`
- Never run as root in production: `USER node`
- Pin versions: `node:20-alpine`, not `node:latest`

---

## CI/CD PIPELINE (GitHub Actions)

```yaml
on: [push]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## HEALTH CHECK (always present)

```ts
app.get('/health', async (req, res) => {
  const db = await checkDatabase();
  res.status(db ? 200 : 503).json({
    status: db ? 'healthy' : 'degraded',
    version: process.env.APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});
```

---

## DEPLOYMENT CHECKLIST

- [ ] All tests pass
- [ ] Type-check clean
- [ ] Environment variables set for target
- [ ] Health endpoint returns 200
- [ ] No console.log in production code
- [ ] Error handler doesn't expose stack traces
- [ ] HTTPS configured
- [ ] Monitoring/logging active

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Deploying without running tests | Run the full suite first |
| Using `node:latest` in Docker | Pin the version |
| Secrets in code or Docker image | Move to env vars |
| No health check endpoint | Add one before deploying |

---

## HORIZON

After SHIP → check:
- Production bug → GUARD engine
- SEO not indexing → CONTENT engine
- Performance issues → DESIGN (frontend) or DATA (backend) engine
