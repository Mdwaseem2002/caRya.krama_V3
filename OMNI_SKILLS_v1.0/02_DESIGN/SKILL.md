---
name: omni-design-engine
description: "UI/UX design system, responsive across all viewports (320px–2560px), mobile-native patterns, accessibility, component architecture. Use when building any interface — web, mobile, dashboard, landing page, app."
triggers: ["ui", "ux", "design", "component", "layout", "responsive", "mobile", "accessibility", "dark mode", "theme", "color", "font", "typography", "landing page", "dashboard", "card", "form"]
---

# OMNI DESIGN Engine
### Every pixel intentional. Every viewport covered. Every user included.

---

## PHASE 0 — Design Direction (before code)

| Question | Answer before coding |
|----------|---------------------|
| Purpose? | What problem does this UI solve? |
| Tone? | Pick ONE: minimal / bold / glassmorphic / editorial / brutalist / organic / luxury |
| Differentiator? | What's the one thing users remember? |
| Platform? | Web / mobile / both? Primary viewport? |

**GATE: No component code without a clear aesthetic direction.**

---

## DESIGN REFERENCE TABLES

### Top 10 Styles

| Style | Primary Colors | Best For | Avoid For |
|-------|---------------|----------|-----------|
| Minimalism | `#000` `#FFF` `#808080` | SaaS, dashboards, docs | Creative portfolios |
| Glassmorphism | `rgba(255,255,255,0.1)` + blur | Modern SaaS, fintech | Low-contrast, a11y-critical |
| Brutalism | `#FF0000` `#0000FF` `#FFFF00` | Portfolios, editorial | Corporate, conservative |
| Neo-brutalism | `#000` + bright accent + hard shadows | Tech blogs, indie SaaS | Enterprise, healthcare |
| Editorial | Serif + generous whitespace | Blogs, magazines, content | Dense data apps |
| Luxury | `#0A1628` `#C9A84C` dark bg | Premium brands, fintech | Budget tools, kids |
| Soft/Organic | Pastels, rounded, warm | Wellness, education | Tech-heavy, enterprise |
| Retro-futuristic | Neon + dark + monospace | Gaming, dev tools | Traditional business |
| Flat Material | System colors + elevation | Mobile apps, Android | Artistic, luxury |
| Skeuomorphic | Textures, gradients, depth | Specialty apps, nostalgia | Modern SaaS |

### Top 10 Font Pairings

| Display | Body | Vibe |
|---------|------|------|
| Cormorant Garamond | DM Sans | Luxury editorial |
| Space Grotesk | Inter | Modern tech |
| Playfair Display | Source Sans 3 | Classic editorial |
| Syne | DM Sans | Bold creative |
| Clash Display | Satoshi | Contemporary startup |
| Cabinet Grotesk | General Sans | Clean SaaS |
| Fraunces | Work Sans | Warm personality |
| JetBrains Mono | IBM Plex Sans | Developer tools |
| Unbounded | Outfit | Playful bold |
| Instrument Serif | Instrument Sans | Refined minimal |

---

## RESPONSIVE DOCTRINE (mandatory)

### Fluid System — Not Just Breakpoints

```css
/* Fluid typography — scales smoothly, no jumps */
font-size: clamp(1rem, 0.5rem + 1.5vw, 1.25rem);

/* Fluid spacing */
padding: clamp(1rem, 3vw, 3rem);

/* Container — readable max-width, always centered */
max-width: min(90vw, 1200px);
margin-inline: auto;
```

### Four-Tier Breakpoints

| Tier | Range | Strategy |
|------|-------|----------|
| Mobile | 320–480px | Single column, 44px touch, bottom CTAs, no hover |
| Tablet | 481–768px | Fluid grid, stacked nav, thumb-reachable actions |
| Laptop | 769–1280px | Multi-column, sidebar, hover states active |
| Desktop | 1281px+ | Full layout, max-width container, generous whitespace |

### Container Queries (modern responsive)

```css
/* Component responds to its container, not viewport */
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

### Mobile-First Laws

- Touch targets: **44×44px minimum**, 8px gap between interactive elements.
- Never disable zoom. `user-scalable=no` is **FORBIDDEN**.
- Images: `srcset` + `sizes` + `loading="lazy"` on every `<img>`.
- Test at 320px. If it breaks there, it's broken.

---

## COMPONENT ARCHITECTURE

```
src/
  features/{name}/
    components/   ← feature-scoped
    hooks/        ← custom hooks
    types/        ← colocated types
    api/          ← data fetching
    index.ts      ← public exports only
  components/     ← shared primitives only
  styles/globals.css ← all tokens here
```

**Rules:**
- All colors, spacing, fonts → CSS custom properties in `globals.css`. No hardcoded hex in components.
- Component file order: Types → Hooks → Derived → Handlers → Render → Export.
- Cross-feature imports **FORBIDDEN**. Use shared `components/` or lift up.
- Max 1 responsibility per component. Split if doing 2 things.

---

## ACCESSIBILITY (non-negotiable)

| Rule | Requirement |
|------|-------------|
| Color contrast | 4.5:1 text, 3:1 UI components |
| Focus indicators | Visible on ALL interactive elements |
| Keyboard | Full tab navigation, no traps |
| ARIA | Label all custom interactions |
| Images | `alt` on meaningful, `alt=""` on decorative |
| Forms | Visible `<label>`, not just placeholder |
| Motion | `prefers-reduced-motion` respected everywhere |
| Screen reader | Test with VoiceOver/NVDA before shipping |

---

## STATE MANAGEMENT

| Complexity | Tool | When |
|-----------|------|------|
| Local component | `useState` / `useReducer` | Single component state |
| Shared (small) | React Context | Theme, auth, locale |
| Shared (complex) | Zustand | Multi-component, frequent updates |
| Server state | TanStack Query | API data, caching, revalidation |
| URL state | `useSearchParams` | Filters, pagination, shareable state |

---

## DARK MODE

```css
:root { --bg: #ffffff; --text: #111111; --surface: #f5f5f5; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #0a0a0a; --text: #e5e5e5; --surface: #1a1a1a; }
}
```

**Rule:** Every color uses a CSS variable. Test: if bg were near-black, is every text readable?

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Using `px` for font-size | Switch to `clamp()` or `rem` |
| Hardcoding a color hex in a component | Move to CSS variable |
| Skipping mobile viewport test | Test at 320px now |
| Building without design direction | Return to Phase 0 |
| Using `any` in TypeScript | Define the type explicitly |

---

## HORIZON

After DESIGN → route to:
- Animated UI → MOTION engine
- Data-driven UI → BUILD + DATA engines
- Content-heavy → CONTENT engine for SEO structure
