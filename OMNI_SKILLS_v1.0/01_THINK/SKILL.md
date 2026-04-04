---
name: omni-think-engine
description: "Structured ideation, product scoping, brand strategy, and mode switching. Use BEFORE any new project, feature, creative direction, or architectural decision. Blocks implementation until design is validated. Transforms vague ideas into actionable specs."
triggers: ["brainstorm", "idea", "plan", "scope", "brand", "strategy", "product", "feature request", "what should we build", "new project", "redesign", "pivot"]
---

# OMNI THINK Engine
### Ideation → Validation → Specification

**RULE: Implementation is FORBIDDEN while this engine is active. No code. No files. Think first.**

---

## MODE DETECTION

Before anything, identify your operating mode:

| Signal | Mode | Behavior |
|--------|------|----------|
| "Build me..." / "Create..." / clear spec given | **BUILD** | Skip THINK. Go directly to relevant engine. |
| "I have an idea..." / vague goal / "help me plan" | **IDEATE** | Full THINK protocol below. |
| "Should we use X or Y?" / tradeoff question | **EVALUATE** | Pros/cons matrix. Recommend. Move on. |
| "What's wrong with..." / critique request | **REVIEW** | Audit → findings → prioritized fixes. |
| "Explain..." / learning context | **TEACH** | Concept → example → analogy. No implementation. |

---

## IDEATION PROTOCOL (when mode = IDEATE)

### Phase 1 — Understand (GATE: do not design yet)

Ask ONE question at a time. Prefer multiple-choice. Cover:

1. **What** — What problem does this solve? One sentence.
2. **Who** — Who is the primary user? Be specific.
3. **Why** — Why now? What triggered this?
4. **Constraints** — Budget, timeline, tech stack, platform?
5. **Not-goals** — What is explicitly OUT of scope?

### Phase 2 — Understanding Lock (HARD GATE)

Before ANY design, summarize in 5–7 bullets:
- Problem, user, goal, constraints, non-goals.

**Ask: "Is this accurate, or should I adjust?"**
**Do NOT proceed without confirmation.**

### Phase 3 — Design Options

Generate **3 distinct approaches**. For each:

| Dimension | Approach A | Approach B | Approach C |
|-----------|-----------|-----------|-----------|
| Core idea | | | |
| Tradeoff | | | |
| Best when | | | |
| Risk | | | |

**Ask user to pick one or combine. Do NOT pick for them.**

### Phase 4 — Specification

Convert chosen approach into actionable spec:

```
PROBLEM: [one sentence]
SOLUTION: [one sentence]
USER: [who]
SCOPE: [what's in]
NON-GOALS: [what's out]
ACCEPTANCE CRITERIA:
  - Given [context], when [action], then [outcome]
  - [measurable metric]
TECHNICAL NOTES: [stack, constraints, dependencies]
```

**Only after spec is confirmed → release to relevant engine(s).**

---

## BRAND THINKING (when project needs identity)

| Question | Purpose |
|----------|---------|
| What 3 words describe this brand? | Personality anchor |
| Who is the anti-audience? (Who is this NOT for?) | Sharpens positioning |
| What's the one thing a user remembers after leaving? | Differentiation |
| Name 2 brands this should FEEL like (not copy) | Aesthetic direction |
| What emotion should the first 5 seconds trigger? | Tone calibration |

Output: Brand Brief (personality, tone, visual direction, anti-patterns).

---

## PRODUCT SCOPING (when feature needs sizing)

| Size | Signal | Action |
|------|--------|--------|
| **S** | Single file, < 1hr, no dependencies | Just build. No spec needed. |
| **M** | 2–5 files, < 1 day, clear scope | Lightweight spec. 3 acceptance criteria. |
| **L** | Multi-file, multi-domain, > 1 day | Full THINK protocol. Spec required. |
| **XL** | New system, new architecture | THINK + DESIGN + BUILD planning. Break into L-sized chunks. |

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Writing code while THINK is active | Delete it. Return to current phase. |
| Designing without Phase 2 confirmation | Go back. Get confirmation. |
| Offering only 1 approach | Generate 2 more. User needs options. |
| Assuming technical constraints | Ask. Don't guess. |
| Skipping non-goals | Ask "What is NOT part of this?" |

---

## HORIZON (anticipate next)

After THINK completes, proactively route:
- Visual project → "Ready for DESIGN engine"
- Data-heavy → "Let's define schema with DATA engine first"
- Content site → "CONTENT engine should define SEO structure before build"
- Rebuild/migration → "GUARD engine should audit existing system first"
