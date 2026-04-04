---
name: omni-build-engine
description: "Full-stack application code — frontend and backend. APIs, auth, payments, caching, realtime, microservices. Framework patterns for Next.js, NestJS, Hono, FastAPI. Use when writing any application logic."
triggers: ["api", "endpoint", "route", "controller", "service", "auth", "jwt", "oauth", "payment", "stripe", "webhook", "cache", "redis", "websocket", "realtime", "middleware", "nest", "hono", "fastapi", "next.js", "backend", "frontend", "fullstack"]
---

# OMNI BUILD Engine
### Request → Route → Controller → Service → Repository → Database

---

## FRAMEWORK SELECTION

| Framework | Use When |
|-----------|----------|
| **Next.js (App Router)** | Full-stack React, SSR/SSG, edge |
| **Hono** | Edge APIs, Cloudflare Workers, Bun, ultra-fast BFF |
| **NestJS** | Enterprise, large teams, DI, structured modules |
| **FastAPI** | ML/AI backends, async Python, OpenAPI-first |

---

## ARCHITECTURE LAW

```
Request → Routes → Controllers → Services → Repositories → Database
```

| Layer | ALLOWED | FORBIDDEN |
|-------|---------|-----------|
| Controller | Orchestrate, validate, delegate | Business logic, DB calls |
| Service | ALL business logic | HTTP knowledge, direct DB |
| Repository | ALL database access | Business logic, HTTP |

**Crossing layers is a bug, not a shortcut.**

---

## API DESIGN

```
GET    /api/v1/users          List
GET    /api/v1/users/:id      Single
POST   /api/v1/users          Create → 201
PATCH  /api/v1/users/:id      Update → 200
DELETE /api/v1/users/:id      Delete → 204
```

### Response Envelope (every response, no exceptions)

```ts
{ success: true, data: T, meta?: { page, limit, total } }
{ success: false, error: { code: string, message: string } }
```

### Status Codes

| Code | When |
|------|------|
| 200 | Success | 201 | Created | 204 | No content |
| 400 | Validation | 401 | Not authenticated | 403 | Not authorized |
| 404 | Not found | 409 | Conflict | 429 | Rate limited | 500 | Server error |

---

## INPUT VALIDATION (Zod — the standard)

```ts
const CreateUserSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z.string().email(),
});
const result = CreateUserSchema.safeParse(req.body);
if (!result.success) return res.status(400).json({ error: result.error.flatten() });
```

**Rule:** Validate BEFORE any business logic. Always.

---

## AUTH PATTERNS

| Strategy | Use When |
|----------|----------|
| JWT (stateless) | Microservices, mobile, external APIs |
| Session (stateful) | Web apps, instant revocation needed |
| OAuth 2.0 / OIDC | Social login, third-party |
| API Keys | Machine-to-machine |

```ts
// Access token: 15min. Refresh token: 7d, httpOnly cookie.
// NEVER store tokens in localStorage.
const token = jwt.sign({ sub: user.id, roles: user.roles },
  process.env.JWT_SECRET!, { expiresIn: '15m' });
```

### RBAC Middleware

```ts
const requireRole = (...roles: string[]) => (req, res, next) => {
  if (!roles.some(r => req.user?.roles?.includes(r)))
    return res.status(403).json({ error: 'FORBIDDEN' });
  next();
};
```

---

## FRAMEWORK MICRO-PATTERNS

### NestJS — Module Pattern

```ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
// Execution order: Middleware → Guards → Interceptors → Pipes → Handler
```

### Hono — Edge API

```ts
const app = new Hono();
app.post('/users', zValidator('json', CreateUserSchema), async (c) => {
  const data = c.req.valid('json');
  return c.json({ success: true, user: data }, 201);
});
```

### FastAPI — Async Endpoint

```python
@app.post("/users", status_code=201)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar(): raise HTTPException(409, "Email exists")
    db.add(User(**user.model_dump()))
    await db.commit()
    return {"success": True}
```

---

## CACHING

| Layer | Tool | Pattern |
|-------|------|---------|
| HTTP | `Cache-Control` headers | `max-age=3600, stale-while-revalidate=86400` |
| Application | Redis | Cache-aside: check cache → miss → DB → write cache |
| API client | TanStack Query | `staleTime: 5 * 60 * 1000` for 5min cache |

```ts
// Redis cache-aside
const cached = await redis.get(`user:${id}`);
if (cached) return JSON.parse(cached);
const user = await repo.findById(id);
await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
```

---

## REALTIME

| Need | Tool |
|------|------|
| Simple push to client | Server-Sent Events (SSE) |
| Bidirectional | WebSocket |
| Presence + sync | Supabase Realtime / Socket.io |

```ts
// SSE endpoint
app.get('/events', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
});
```

---

## PAYMENTS (Stripe)

```ts
// Always smallest currency unit. Always idempotency key.
const intent = await stripe.paymentIntents.create(
  { amount: 4999, currency: 'usd', metadata: { orderId: order.id } },
  { idempotencyKey: `order-${order.id}` }
);
```

```ts
// Webhook: verify signature FIRST, idempotent handling
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body,
    req.headers['stripe-signature']!, process.env.STRIPE_WEBHOOK_SECRET!);
  // Check if event.id already processed before handling
});
```

---

## SECURITY INVARIANTS

- Rate limit ALL public endpoints. Stricter on auth routes.
- Helmet for security headers. CORS explicitly configured.
- Bcrypt 12+ rounds or Argon2 for passwords. Never plaintext.
- Never log passwords, tokens, or PII.
- Error handler: never expose stack traces in production.

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Writing DB queries in a controller | Move to repository layer |
| Business logic in a route handler | Move to service layer |
| Storing JWT in localStorage | Use httpOnly cookie |
| Missing input validation | Add Zod schema before logic |
| No rate limiting on public endpoint | Add it now |

---

## HORIZON

After BUILD → check:
- Need schema design? → DATA engine
- Need SEO for content pages? → CONTENT engine
- Ready to deploy? → SHIP engine
