---
name: omni-motion-engine
description: "Animation, scroll narratives, 3D scenes, micro-interactions. 60fps minimum. GPU-only properties. Use when adding any movement, transition, parallax, or WebGL to any interface."
triggers: ["animation", "animate", "scroll", "parallax", "GSAP", "framer motion", "three.js", "3D", "hover effect", "micro-interaction", "transition", "lenis", "scroll trigger"]
---

# OMNI MOTION Engine
### 60fps is the floor. Motion is narrative. Performance is non-negotiable.

---

## LIBRARY SELECTION

| Task | Library | Why |
|------|---------|-----|
| Scroll narratives, scrubbing, timelines | **GSAP + ScrollTrigger** | Unmatched scroll control |
| Smooth inertial scroll | **Lenis** | Minimal, pairs with GSAP |
| React declarative animations | **Framer Motion** | Variants, layout animations, gestures |
| SVG path, multi-stage orchestration | **Anime.js** | Lightweight, stagger mastery |
| Simple reveals | **CSS scroll-timeline** | Zero JS |
| React 3D scenes | **React Three Fiber** | Declarative Three.js |
| Max control / non-React 3D | **Three.js vanilla** | Full performance control |

**Rule:** Never mix GSAP and Framer Motion on the same element.

---

## GPU-ONLY LAW (violating this is a bug)

```css
/* ALLOWED — compositor only */
transform: translate3d() scale() rotate();
opacity;

/* FORBIDDEN — triggers layout every frame */
width, height, top, left, margin, padding, box-shadow (in loops)
```

```css
/* Declare BEFORE animation, remove AFTER */
.animated { will-change: transform, opacity; }
.done { will-change: auto; }
```

---

## REDUCED MOTION (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## CORE PATTERNS

### Scroll-Triggered Reveal (GSAP)

```js
gsap.from('.card', {
  scrollTrigger: { trigger: '.section', start: 'top 80%',
    toggleActions: 'play none none reverse' },
  y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
});
```

### Parallax (GSAP)

```js
gsap.to('.bg', {
  scrollTrigger: { trigger: '.section', start: 'top bottom',
    end: 'bottom top', scrub: true },
  y: '30%',
});
```

### Framer Motion Entrance (React)

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

### Magnetic Hover

```js
el.addEventListener('mousemove', (e) => {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left - r.width / 2) * 0.3;
  const y = (e.clientY - r.top - r.height / 2) * 0.3;
  gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
});
el.addEventListener('mouseleave', () => {
  gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
});
```

---

## EASING HIERARCHY

| Feel | Value |
|------|-------|
| Premium | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Natural | `spring({ stiffness: 120, damping: 14 })` |
| Dramatic | `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Never** | `linear` for anything visible |

---

## THREE.JS / R3F

```tsx
<Canvas dpr={[1, 2]} performance={{ min: 0.5 }}
  gl={{ antialias: true, alpha: true }}>
  <PerspectiveCamera makeDefault fov={60} position={[0,0,5]} />
  <Environment preset="studio" />
  <YourScene />
</Canvas>
```

**Rules:**
- `useMemo` for geometry/material. Dispose on unmount.
- Pixel ratio capped: `Math.min(devicePixelRatio, 2)`.
- Instancing for >100 identical meshes. LOD for distance objects.
- Max 2M triangles without LOD.

---

## PERFORMANCE AUDIT (when animation stutters)

1. **Measure** — Chrome DevTools → Performance → Record → look for Long Tasks >50ms
2. **Layout thrash?** — Read all, then write all. Never interleave.
3. **GPU promote** — `transform: translateZ(0)` on animated elements
4. **Cleanup** — Kill ScrollTriggers on unmount. `ScrollTrigger.refresh()` after dynamic content.

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Animating `width` or `height` | Use `transform: scale()` |
| No `prefers-reduced-motion` check | Add it now |
| Continuous `box-shadow` animation | Replace with `opacity` overlay |
| Stagger > 200ms per item | Reduce. 60–150ms is the range. |
| 3D scene with no disposal | Add `useEffect` cleanup |

---

## HORIZON

After MOTION → check:
- Is the animated component accessible? → DESIGN engine a11y section
- Performance regression? → GUARD engine
