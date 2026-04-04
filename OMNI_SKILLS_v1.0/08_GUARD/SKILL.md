---
name: omni-guard-engine
description: "Evidence-based debugging, governance, safety gates. 5-phase protocol where code edits are BLOCKED until root cause is confirmed. Use when debugging any bug, when fixes aren't sticking, when AI guesses without evidence, or when changes need safe verification."
triggers: ["bug", "debug", "error", "fix", "broken", "not working", "regression", "crash", "wrong output", "intermittent", "performance issue", "root cause", "stuck"]
---

# OMNI GUARD Engine
### Evidence is law. Assumption is failure waiting to happen.

**RULE: Code edits are BLOCKED in Phases 1–3. This is not optional.**

---

## BANNED PHRASES (until you have evidence)

`probably` · `might be` · `should be` · `I think` · `seems like` · `likely` · `definitely` · `must be`

---

## THE 5-PHASE PROTOCOL

### Phase 1 — REPRODUCE

Run the failing command/test. Capture the EXACT error. Run 2–3 times.

**DO NOT:** read source, hypothesize, edit files.
**EXIT:** You can reliably reproduce the failure.

### Phase 2 — ISOLATE

Read code. Add `// DEBUG` diagnostic logging only. Re-run. Binary search.

**DO NOT:** fix the bug even if you see it. No edits except `// DEBUG` lines.
**EXIT:** You know the file, function, and line.

### Phase 3 — ROOT CAUSE

Apply "5 Whys." State explicitly:

> "Root cause: [WHY it fails, not just WHERE]. Agree, or investigate further?"

**WAIT for user confirmation. Do NOT proceed without it.**

### Phase 4 — FIX

Remove ALL `// DEBUG` lines. Apply minimal change to confirmed root cause only.

**DO NOT:** refactor unrelated code. Fix only what's broken.

### Phase 5 — VERIFY

Run original failing test → must pass. Run related tests. Intermittent bugs: 5+ runs.

**If verification fails:** root cause was wrong. Return to Phase 2. Do NOT tweak the fix.

---

## BUG-TYPE STRATEGIES

| Type | Technique |
|------|-----------|
| Crash | Stack trace bottom-up. First frame in YOUR code. Trace bad value to origin. |
| Wrong output | Binary search. Log midpoint. Halve search space each iteration. |
| Intermittent | Two runs (pass + fail). Compare logs. Find the divergence. |
| Regression | `git bisect`. Find exact commit. Read only that diff. |
| Performance | Add timing at stage boundaries. Find bottleneck before any code change. |
| UI layout | Inspect computed styles, not source. Computed value is truth. |

---

## ESCALATION PROTOCOL

| Failures | Action |
|----------|--------|
| **2** | Stop current approach. Next attempt must be fundamentally different. |
| **3** | Five-step audit: ① Read error word-by-word ② Web search exact error ③ Read 50 lines context ④ Verify every assumption ⑤ Invert hypothesis |
| **4** | Minimal reproduction. Strip everything until exact trigger found. |
| **5+** | Structured handoff: what tried, what ruled out, where boundary is, what to try next. |

---

## SAFETY GATES

### Before modifying any config/env/package file:

```bash
cp file.yaml file.yaml.bak-$(date +%Y%m%d-%H%M%S)
```

### Before any code change — Blast Radius Check:

1. **Who uses this?** → `grep -r "functionName" src/`
2. **What depends on it?** → Check downstream services, routes, configs
3. **Can I undo this?** → If not, backup first

### Before any deployment:

- [ ] No uncommitted changes on server
- [ ] All containers healthy
- [ ] Only deploying files related to this task

---

## SELF-CORRECTION TABLE

| If you catch yourself... | Immediately... |
|--------------------------|----------------|
| Saying "probably" or "might be" | Get evidence first. Run the command. |
| Saying "please check your environment" | YOU check it. You have bash. |
| Same approach 3+ times | Full stop. Fundamentally different approach. |
| Fixed the bug, stopped | Ripple check: same pattern elsewhere? Upstream affected? Edge cases? |
| "Done, you can test it" | No. YOU test it. Show the output. |
| Could search/read/run but guessed | Use the tool. Memory is not documentation. |
| "This API doesn't support that" | Read the actual docs. Show where it says that. |

---

## RIPPLE CHECK (after every fix, before "done")

- [ ] Same bug pattern exists elsewhere? (`grep` for it)
- [ ] Callers or dependents affected by this change?
- [ ] Handles null/empty/edge cases?
- [ ] YOU ran it and it works? (show output)

**"It seems to work" is not closure.** Closure = verify + document + learn.

---

## WHEN TO STOP (with dignity)

If escalation level 5 reached and isolation didn't resolve:

1. Verified facts with evidence
2. Eliminated causes with reasons
3. Narrowed scope to specific area
4. Recommended next steps
5. Full handoff context

This is professional, not failure.

---

## HORIZON

After GUARD fix → return to the engine where the bug originated:
- UI bug → DESIGN engine
- API bug → BUILD engine
- Query bug → DATA engine
- Animation stutter → MOTION engine
