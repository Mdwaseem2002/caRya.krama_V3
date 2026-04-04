---
name: omni-content-engine
description: "SEO, E-E-A-T, content strategy, brand voice, meta optimization, technical SEO, AI-SEO. Use when writing content, planning content strategy, optimizing for search, building topical authority, or auditing SEO."
triggers: ["seo", "content", "blog", "article", "meta tag", "title tag", "keyword", "E-E-A-T", "search ranking", "organic", "sitemap", "schema markup", "structured data", "brand voice", "copywriting", "content strategy", "topic cluster"]
---

# OMNI CONTENT Engine
### Content that ranks, converts, and builds authority.

---

## E-E-A-T (how search engines evaluate quality)

| Dimension | What it means | Signals |
|-----------|--------------|---------|
| **Experience** | First-hand involvement | Original examples, real data, screenshots |
| **Expertise** | Subject competence | Depth, accuracy, credentials |
| **Authoritativeness** | Recognition by others | Backlinks, citations, mentions |
| **Trustworthiness** | Reliability | HTTPS, transparency, accuracy, author info |

**E-E-A-T is not a ranking factor — it's an evaluation framework.** Pages competing in the same space are differentiated by trust and experience, not keywords.

---

## TECHNICAL SEO CHECKLIST

| Element | Requirement |
|---------|-------------|
| Title tag | Primary keyword + intent, 50–60 chars |
| Meta description | Compelling CTA, 150–160 chars, not a ranking factor but affects CTR |
| H1 | One per page, matches search intent |
| URL | Short, descriptive, lowercase, hyphens: `/topic-name` |
| Canonical | Self-referencing on every page |
| XML Sitemap | Only canonical, indexable URLs. Submitted to GSC. |
| robots.txt | Not blocking important paths. References sitemap. |
| HTTPS | Required. No mixed content. |
| Core Web Vitals | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| Mobile-friendly | Responsive. No horizontal scroll. Readable text. |
| Structured data | `Organization`, `Article`, `FAQ`, `BreadcrumbList` as relevant |

### Structured Data Template

```html
<script type="application/ld+json">{
  "@context": "https://schema.org", "@type": "Article",
  "headline": "Title", "author": { "@type": "Person", "name": "Author" },
  "datePublished": "2026-01-01", "dateModified": "2026-04-01",
  "image": "https://example.com/image.jpg"
}</script>
```

---

## CONTENT STRATEGY

### Searchable vs. Shareable

| Type | Goal | Optimize for |
|------|------|-------------|
| **Searchable** | Capture existing demand | Keyword, intent match, comprehensive answers |
| **Shareable** | Create demand | Novel insight, original data, emotional hook |

**Prioritize searchable first — it's the foundation. Shareable amplifies.**

### Topic Clusters

```
Pillar page: /interview-questions (broad, 2000+ words)
  └── Cluster: /javascript-interview-questions (specific, targets long-tail)
  └── Cluster: /react-interview-questions
  └── Cluster: /system-design-interview-questions
  └── Internal links: every cluster links to pillar + sibling clusters
```

### Content Quality Signals

| Signal | What search engines look for |
|--------|------------------------------|
| Depth | Fully answers the query — no thin pages |
| Originality | Adds unique value, not rewritten from competitors |
| Accuracy | Factually correct, cites sources |
| Freshness | Updated dates, current info, no stale data |
| Usefulness | Satisfies intent — user doesn't need to go back to search |

---

## ON-PAGE OPTIMIZATION

| Element | Rule |
|---------|------|
| Keyword in title | First 60 chars, natural placement |
| Keyword in H1 | Exact or close variant |
| Keyword in first 100 words | Natural, not forced |
| Keyword in 2–3 H2s | Supports topic coverage |
| Internal links | 3–5 per article to related content |
| External links | 1–3 to authoritative sources |
| Images | `alt` text with context, WebP format, lazy loaded |
| Word count | Match competitor depth — not a magic number |

---

## BRAND VOICE

### Define Once, Apply Everywhere

| Attribute | Options (pick 3–5) |
|-----------|-------------------|
| Tone | Authoritative / Friendly / Playful / Professional / Bold / Warm |
| Complexity | Simple / Technical / Mixed (explain jargon) |
| Perspective | First person / Third person / Direct (you) |
| Energy | Calm / Energetic / Urgent / Measured |

### Voice Application Rules

- **Headlines**: bold + clear. No clickbait. Deliver on the promise.
- **Body**: short paragraphs (3–4 sentences max). One idea per paragraph.
- **CTAs**: action verb + benefit. "Get your free audit" not "Click here."
- **Consistency**: same voice across site, social, docs, emails.

---

## AI-SEO (optimizing for LLM citations)

| Signal | Action |
|--------|--------|
| Clear entity definitions | Define what your product/brand IS in first paragraph |
| Structured content | Headers, lists, tables — LLMs extract structured data |
| Consistent brand mentions | Same name/description across all web properties |
| Authoritative linking | Be cited by and cite trusted sources |
| FAQ sections | Direct question → direct answer format |

---

## SEO AUDIT FRAMEWORK (priority order)

1. **Crawlability** — Can search engines access and index the site?
2. **Technical foundations** — Fast, stable, mobile-friendly?
3. **On-page optimization** — Each page clearly optimized for intent?
4. **Content quality** — Does it deserve to rank?
5. **Authority** — Does the site demonstrate trust?

---

## TRAPS

| If you catch yourself... | Stop and... |
|--------------------------|-------------|
| Writing thin content (< 300 words) for ranking | Add depth or merge with related page |
| Keyword stuffing | Write naturally. 1–2% density max. |
| Missing meta description | Write one. It affects CTR. |
| No internal links in an article | Add 3–5 to related content |
| Ignoring search intent | Check: is this informational, transactional, or navigational? |
| Duplicate title tags across pages | Make each unique |

---

## HORIZON

After CONTENT → route to:
- Building the content pages → BUILD + DESIGN engines
- Technical SEO fixes needed → BUILD engine
- Ready to launch → SHIP engine
