---
name: omni-data-engine
description: "Database technology selection, schema design, query optimization, indexing, RLS, migrations. Evidence-first — EXPLAIN ANALYZE before any optimization. Use when designing, querying, or optimizing any data layer."
triggers: ["database", "schema", "query", "sql", "postgres", "supabase", "prisma", "drizzle", "index", "migration", "RLS", "N+1", "slow query", "EXPLAIN"]
---

# OMNI DATA Engine
### Schema is a contract. Every query has a cost. Measure before optimizing.

---

## DATABASE SELECTION

| Database | Use When |
|----------|----------|
| **PostgreSQL** | Default. Relational, JSONB, RLS, full-text search |
| **Supabase** | Postgres + auth + storage + realtime out of box |
| **SQLite / Turso** | Edge, local-first, single-user |
| **Redis** | Cache, sessions, pub/sub — never primary storage |

| ORM | Use When |
|-----|----------|
| **Prisma** | Type-safe, rapid dev, schema-first |
| **Drizzle** | Lightweight, SQL-like, edge-compatible |
| **Raw SQL** | Complex analytics, EXPLAIN tuning |

---

## SCHEMA DESIGN

```sql
-- UUID primary keys (v7 preferred for index performance)
CREATE TABLE users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Data Type Rules

| Need | Use | Never |
|------|-----|-------|
| Text | `TEXT` or `VARCHAR(n)` | `CHAR(n)` (pads spaces) |
| Money | `NUMERIC(19,4)` | `FLOAT` (precision loss) |
| Time | `TIMESTAMPTZ` | `TIMESTAMP` (no timezone) |
| Flexible | `JSONB` (indexable) | `JSON` (not indexable) |
| Enum | `TEXT CHECK(...)` | Magic strings without constraint |
| Boolean | `BOOLEAN NOT NULL DEFAULT` | Nullable booleans |

### Naming: lowercase `snake_case` always. No quoted `"PascalCase"`.

### Foreign Keys — ALWAYS index them

```sql
ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_orders_user_id ON orders(user_id); -- Postgres does NOT auto-create this
```

---

## INDEXING STRATEGY

| Index Type | When |
|-----------|------|
| B-Tree (default) | Equality, range, ORDER BY |
| Partial | Only rows you actually query: `WHERE is_active = TRUE` |
| Composite | Multi-column filter (most selective column first) |
| Covering | `INCLUDE(columns)` to avoid heap fetch |
| GIN | JSONB queries, full-text search |

```sql
-- Partial index: smaller, faster
CREATE INDEX idx_active_products ON products(category)
  WHERE deleted_at IS NULL AND is_active = TRUE;
```

---

## QUERY OPTIMIZATION

### Step 1: EXPLAIN ANALYZE — always first

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT ...;
```

| Red flag | Meaning | Fix |
|----------|---------|-----|
| `Seq Scan` on large table | Missing index | Add index |
| `Nested Loop` + high rows | Missing join index | Index join column |
| Estimate ≠ actual rows | Stale statistics | `ANALYZE tablename` |

### Step 2: Fix N+1

```sql
-- WRONG: 1 query + N queries per row
-- RIGHT: single JOIN
SELECT o.*, json_agg(oi.*) as items
FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = $1 GROUP BY o.id;
```

### Step 3: Keyset pagination (not OFFSET)

```sql
-- OFFSET degrades at scale. Keyset is always O(log n).
SELECT * FROM products WHERE created_at < $1
ORDER BY created_at DESC LIMIT 20;
```

---

## CONNECTION MANAGEMENT

```ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000,
});
// ALWAYS release in finally block
const client = await pool.connect();
try { /* query */ } finally { client.release(); }
```

**Transactions: keep SHORT. No HTTP calls inside transactions.**

---

## ROW-LEVEL SECURITY (Supabase)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own" ON products FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

**Rule:** RLS policies must hit indexes. Direct column comparison only — no function calls.

---

## MIGRATION SAFETY

| Safe | Dangerous |
|------|-----------|
| `ADD COLUMN text` | `ALTER COLUMN TYPE` (full rewrite) |
| `ADD COLUMN ... DEFAULT` | `ADD COLUMN NOT NULL` without default |
| `CREATE INDEX CONCURRENTLY` | `CREATE INDEX` (locks table) |

Safe NOT NULL: add nullable → backfill → add constraint.

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Optimizing without EXPLAIN ANALYZE | Measure first |
| Using OFFSET pagination on large data | Switch to keyset |
| Skipping index on foreign key | Add it now |
| Using `FLOAT` for money | Use `NUMERIC(19,4)` |
| Long transaction with external calls | Restructure outside txn |

---

## HORIZON

After DATA → route to:
- API layer consuming this data → BUILD engine
- Performance issue in queries → GUARD engine
