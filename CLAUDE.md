# Enes Cilingir Portfolio — Project Context

## Project overview

Static HTML/CSS portfolio website for Enes Cilingir, UX Designer.
Rebuilt 1:1 from Figma (file ID: `E0tG4aZ8I6mK95VxQSRnBM`).
Figma PAT: `[redacted]`

**Stack:** Vanilla HTML + CSS only. No framework, no JS build step.
**Philosophy:** Design tokens everywhere. Zero hardcoded values in components. Think in reusable components.

**Live URL:** https://enes-cilingir.vercel.app
**Deploy:** `vercel --prod` from `/Users/enesclngr/Downloads/Enes/` (already linked, Vercel logged in as `clngrenes`)

---

## File structure

```
/Users/enesclngr/Downloads/Enes/
│
├── index.html                   ← Home (3 work cards) ✅ done
├── about.html                   ← About page ✅ done
├── gallery.html                 ← Gallery page ✅ done
├── project-pulse.html           ← Pulse project page ✅ done
├── project-mykorrizha.html      ← Phase 3 (not started)
├── project-neckband.html        ← Phase 3 (not started)
│
├── css/
│   ├── tokens.css               ← ALL design tokens (source of truth)
│   ├── reset.css                ← Modern CSS reset
│   ├── base.css                 ← @font-face, body defaults, .page, typography utils
│   ├── components/
│   │   ├── nav.css              ← glassmorphism nav, scroll progress bar, dark/light toggle
│   │   ├── footer.css
│   │   ├── button.css           ← .btn, .btn--active, .btn--inactive, .btn--icon
│   │   ├── tag.css              ← square corners, border, uppercase
│   │   ├── work-card.css
│   │   ├── text-block.css
│   │   ├── section.css          ← .section, .columns-equal-height, .columns-three
│   │   ├── cv-entry.css
│   │   ├── project-collage.css  ← hero image collage (2 rows, narrow/wide)
│   │   ├── project-visual.css   ← full-height image slot for two-column layouts
│   │   └── feature-card.css     ← expandable hover card (dark bg, title always visible)
│   └── pages/
│       ├── home.css
│       ├── about.css
│       ├── gallery.css
│       ├── pulse.css            ← research strip, process/phone visual heights
│       └── neckband.css
│
├── assets/
│   ├── fonts/
│   │   ├── Gambarino-Regular.woff2
│   │   ├── Geist-Regular.woff2
│   │   └── Geist-SemiBold.woff2
│   ├── js/
│   │   ├── theme.js             ← dark/light mode toggle with fade, moon/sun SVG swap
│   │   └── scroll-progress.js  ← updates nav__progress-fill width + label on scroll
│   └── images/
│       ├── about-portrait.jpg
│       ├── neckband-cover.jpg   ← still at root (not in COVERS/)
│       ├── COVERS/
│       │   ├── pulse-cover.jpg
│       │   ├── mykorrizha-cover.jpg
│       │   ├── aidea-cover.jpg
│       │   ├── reach-cover.jpg
│       │   └── retarget-cover.jpg
│       ├── PULSE/               ← all Pulse project images
│       │   ├── posters.jpg, shadowing.jpg, moodboard.jpg, problem.jpg
│       │   ├── sketches.jpg, wireframes.jpg, faq.jpg, user-journey.jpg
│       │   ├── screens.jpg, zukunft.jpg
│       │   ├── appicon.jpg, appicon-2.jpg, logo.jpg, spendi.jpg
│       │   ├── spendeverlauf.jpg, spendeverlauf-2.jpg
│       │   ├── streak.jpg, notification.jpg, color-palette.jpg
│       │   ├── challenge.jpg, challenge-2.jpg, 124.jpg
│       │   ├── termine.jpg, termine-verlauf.jpg
│       │   ├── ui-challenge.jpg, ui-fragebogen.png, ui-gruppenansicht.jpg
│       │   ├── ui-spendi.jpg, ui-terminauswahl.jpg, ui-termine.jpg, ui-verlauf.jpg
│       │   └── ... (more UI screenshots)
│       ├── RETARGET/            ← Retarget branding project images
│       │   ├── mac-mockup.jpg, letterhead.jpg, mockups-primary.jpg
│       │   ├── logo-combination.png, logo-primary.png, moodboard.png
│       │   └── ... (more)
│       ├── AIDEA/               ← Aidea project images
│       │   ├── logo.jpg, canvas.jpg, ai-section.jpg, target-group.jpg
│       │   └── ... (more)
│       ├── REACH/               ← Reach project images
│       │   ├── user-interface.jpg, contacts.jpg, header.jpg
│       │   └── ... (more)
│       ├── MYKORRIZHA/
│       ├── INSIGHTS/
│       ├── SVG/
│       ├── LOGO/
│       └── FAVICON/
│
└── .claude/
    └── launch.json              ← preview server: npx serve -l 3000
```

---

## Design tokens (css/tokens.css) — complete reference

### Colors — Mocha palette
```
--color-mocha-6: #3D2614   (darkest)
--color-mocha-5: #645142
--color-mocha-4: #8B7C70
--color-mocha-3: #B1A79E
--color-mocha-2: #D8D2CC
--color-mocha-1: #ECE7E3   (lightest)

--color-bg-primary:  #FFFCFA
--color-bg-secondary:#FFFEFD

Semantic aliases:
--color-text-primary:   var(--color-mocha-6)
--color-text-secondary: var(--color-mocha-5)
--color-text-body:      var(--color-mocha-4)
--color-text-inverse:   var(--color-mocha-1)
--color-surface-primary: var(--color-mocha-1)
--color-surface-dark:    var(--color-mocha-5)
--color-surface-mid:     var(--color-mocha-4)
--color-border:          var(--color-mocha-2)

/* Glassmorphism nav tokens */
--color-nav-bg:     rgba(236, 231, 227, 0.72)   (light)
--color-nav-border: rgba(177, 167, 158, 0.4)    (light)

[data-theme="dark"]:
--color-nav-bg:     rgba(61, 38, 20, 0.78)
--color-nav-border: rgba(139, 124, 112, 0.3)
```

### Typography
```
--font-display: 'Gambarino', serif    ← headings, pronunciation ONLY
--font-body:    'Geist', sans-serif   ← everything else

Font scale:
--text-xl:      3rem     (48px)   ← h1 headings
--text-lg:      2.5rem   (40px)   ← h2 subheadings
--text-md:      2.25rem  (36px)   ← section headings
--text-work:    1.5rem   (24px)   ← work card titles (Gambarino) ← was 1.875rem, reduced
--text-body-lg: 2rem     (32px)
--text-body:    1.5rem   (24px)
--text-sm:      1.25rem  (20px)
--text-xs:      1rem     (16px)
--text-xxs:     0.875rem (14px)

--leading-tight:  1.2
--leading-normal: 1.5
--weight-regular: 400
--weight-semibold:600
--tracking: -0.04em   ← -4% applied EVERYWHERE, no exceptions
```

### Spacing (fluid with clamp)
```
--space-1: 0.375rem  (6px)   ← fixed
--space-2: 0.75rem   (12px)  ← fixed
--space-3: clamp(1rem, 2.5vw, 1.5rem)    ← fluid 16→24px
--space-4: clamp(2rem, 4.5vw, 3rem)      ← fluid 32→48px
--space-5: clamp(3rem, 5.5vw, 4.5rem)    ← fluid 48→72px
--space-6: 6rem      (96px)  ← fixed
```

### Layout
```
--max-width:     90rem    (1440px)
--content-width: 78rem    (1248px)
--page-padding:  var(--space-6)   → space-4 at 1024px → space-3 at 768px
```

### Responsive token overrides
```
@media (max-width: 1024px):
  --text-xl: 2.5rem, --text-lg: 2rem, --text-md: 1.75rem
  --text-work: 1.25rem, --text-body: 1.25rem

@media (max-width: 768px):
  --text-xl: 2rem, --text-lg: 1.75rem, --text-md: 1.5rem
  --text-work: 1.125rem, --text-body: 1.125rem
```

### Border radius
**ALL corners are square (cornerRadius=0 confirmed from Figma).** `border-radius: 0` everywhere.

---

## Typography utility classes (base.css)

All include `letter-spacing: var(--tracking)`.

| Class | Font | Size token | Weight |
|---|---|---|---|
| `.heading-xl` | Gambarino | `--text-xl` | 400 |
| `.heading-lg` | Gambarino | `--text-lg` | 400 |
| `.heading-md` | Gambarino | `--text-md` | 400 |
| `.body-lg` | Geist | `--text-body-lg` | 400 |
| `.body` | Geist | `--text-body` | 400 |
| `.body-sm` | Geist | `--text-sm` | 400 |

---

## Component inventory

### nav.css
- `.nav` — glassmorphism: `background-color: var(--color-nav-bg)`, `backdrop-filter: blur(16px)`, `border: 1px solid var(--color-nav-border)`, `position: sticky`, `top: var(--page-padding-y)`, `z-index: 100`
- `.nav__left` / `.nav__right` — flex row, gap space-3 (space-1 on mobile)
- `.nav__logo` — SVG E-mark, `fill="currentColor"`, color `var(--color-text-secondary)`, height matches button height mathematically: `calc(var(--space-2) * 2 + var(--text-sm) * var(--leading-normal))`
- `.nav__linkedin` hidden at ≤1024px via `.nav__right .nav__linkedin { display: none }` (2-class specificity beats `.btn`)
- `.nav__progress` — scroll progress bar (project pages only): boxed with `border: 1px solid var(--color-border)`, `padding: var(--space-2) var(--space-3)`, `flex: 1`. Contains `.nav__progress-track` (1px line) + `.nav__progress-fill` (animated width) + `.nav__progress-label` (% text). Hidden on mobile.

**Scroll progress HTML structure (project pages):**
```html
<div class="nav__progress" aria-hidden="true">
  <div class="nav__progress-track">
    <div class="nav__progress-fill" id="scroll-fill"></div>
  </div>
  <span class="nav__progress-label" id="scroll-label">0%</span>
</div>
```
Requires `<script src="assets/js/scroll-progress.js"></script>` at bottom of body.

### button.css
- `.btn` — base: Geist, `--text-sm`, `padding: var(--space-2) var(--space-3)`, `border-radius: 0`, `letter-spacing: var(--tracking)`
- `.btn--active` — bg `var(--color-surface-dark)`, text inverse, no border
- `.btn--inactive` — transparent bg, `border: 1px solid var(--color-border)`
- `.btn--icon` — square, `padding: var(--space-2)`, transparent bg, border, icon sized to match text button height

### tag.css
- `.tag` — `border: 1px solid var(--color-border)`, `border-radius: 0`, transparent bg, uppercase, `--text-xxs`, `--weight-semibold`, `letter-spacing: 0.06em`

### text-block.css — 4 variants
```
.text-block                              ← base: padding space-3, border-radius 0
.text-block--secondary                   ← bg: mocha-1, text: mocha-4
.text-block--secondary.text-block--big   ← same + font-size: text-body-lg (32px)
.text-block--primary                     ← bg: mocha-4 (surface-mid), text: mocha-1 (inverse)
.text-block--primary.text-block--big     ← same + font-size: text-body-lg (32px)
```

### section.css — layout utilities
```
.section            ← flex col, gap space-3
.section--tight     ← gap space-2
.section--loose     ← gap space-4

/* Two-column equal-height — use on ALL project pages */
.columns-equal-height               ← grid 1fr 1fr, align-items: stretch
.columns-equal-height--6-4          ← grid 6fr 4fr
.columns-equal-height--4-6          ← grid 4fr 6fr
.columns-equal-height__col          ← flex col, gap space-2; direct .text-block children get flex:1
.columns-equal-height__col--natural ← flex col, gap space-2, no flex stretch on children
.columns-equal-height__col--sticky  ← sticky top, align-self: start

/* Three-column grid */
.columns-three                      ← repeat(3, 1fr), gap space-3
  @media (max-width: 1024px): 2 columns (overridden in pulse.css)
  @media (max-width: 768px): 1 column

@media (max-width: 768px): all equal-height collapses to 1 col, sticky becomes static
```

### feature-card.css ← NEW
Expandable hover card for project Final Designs sections.
```
.feature-card              ← bg: var(--color-surface-mid) (mocha-4), padding space-3
.feature-card__title       ← always visible: Geist semibold, text-body, inverse color
.feature-card__body-wrap   ← grid trick: grid-template-rows: 0fr → 1fr on hover (0.35s ease)
.feature-card__body-inner  ← overflow: hidden, min-height: 0
.feature-card__body        ← opacity: 0 → 1 on hover (0.25s ease, 0.08s delay), regular weight
```
HTML structure:
```html
<div class="feature-card">
  <span class="feature-card__title">Title</span>
  <div class="feature-card__body-wrap">
    <div class="feature-card__body-inner">
      <p class="feature-card__body">Description text.</p>
    </div>
  </div>
</div>
```

### project-collage.css
Two-row hero image grid. Rows are `clamp(14rem, 27vw, 25rem)` tall.
```
.project-collage              ← flex col, gap space-3
.project-collage__row         ← grid, explicit height
.project-collage__row--narrow-wide  ← 4fr 6fr
.project-collage__row--wide-narrow  ← 6fr 4fr
.project-collage__item        ← overflow hidden
.project-collage__image       ← object-fit: cover
@media ≤768px: stacks to 1 col, aspect-ratio: 16/10
```

### project-visual.css
Full-height image slot that stretches inside a `.columns-equal-height__col`.
```
.project-visual        ← flex: 1, min-height: 20rem, overflow: hidden
.project-visual__image ← object-fit: cover
```

### cv-entry.css
```
.cv-entry               ← flex row: role / company / type / date
.cv-entry--expandable   ← Vodafone entry with hover skill-tag reveal

Grid-row expand trick + blur-fade (same pattern as feature-card):
.cv-entry__skills-wrapper { grid-template-rows: 0fr → 1fr on hover }
.cv-entry__skills { opacity: 0; filter: blur(8px); transform: translateY(-4px) → all clear on hover }

.cv-download            ← full-width dark row at bottom of CV list
```

---

## Page structure reference

### HTML load order (every page)
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components/nav.css">
<link rel="stylesheet" href="css/components/footer.css">
<link rel="stylesheet" href="css/components/button.css">
<!-- page-specific components then page CSS -->
<link rel="stylesheet" href="css/pages/[page].css">
```

### index.html ✅
- Hero: `<h1 class="heading-xl">` — "I design what a product should be, not just what it looks like."
- 3 `.work-card` elements (PULSE, MYKORRIZHA, NECKBAND)

| Project | Image | Tags | Title |
|---|---|---|---|
| PULSE | `COVERS/pulse-cover.jpg` | Application / 2024 | How Might We Encourage The Youth For Blood Donation? |
| MYKORRIZHA | `COVERS/mykorrizha-cover.jpg` | Application / 2024 | Mykrozziha ─ The new age of education |
| NECKBAND | `neckband-cover.jpg` | Tangible Design / 2026 | Orientation should not be a privilege. |

### about.html ✅
```
.about__description
  .about__header
    h1.heading-xl "About Enes Çilingir"
    span.about__pronunciation  ← Gambarino 48px, /eˈnes tʃilinɟiɾ/ with audio-lines SVG icon

  h2.heading-lg "I discovered design at twelve..."

  .columns-equal-height
    .columns-equal-height__col           ← LEFT: 3× .text-block--secondary
    .columns-equal-height__col--sticky   ← RIGHT: about-portrait.jpg + .text-block--primary.--big

.about__journey
  h2.heading-md "Design Journey"
  .about__cv-list (10 cv-entries + cv-download)
```
Vodafone entry is `.cv-entry--expandable` with skills: Implement AI Agent / Accessibility Guidelines / Design System

### gallery.html ✅
Uses CSS grid layout (`.gallery__grid`, 7 items with specific grid placement via `.gallery__item--1` through `--7`).

Image paths:
- Item 1: `RETARGET/mac-mockup.jpg`
- Item 2: `AIDEA/logo.jpg`
- Item 3: `AIDEA/canvas.jpg`
- Item 4: `REACH/user-interface.jpg`
- Item 5: `RETARGET/letterhead.jpg`
- Item 6: `RETARGET/mockups-primary.jpg`
- Item 7: `RETARGET/logo-combination.png`

### project-pulse.html ✅
CSS links: tokens → reset → base → nav → footer → button → text-block → section → project-collage → project-visual → **feature-card** → pulse.css
JS: theme.js + scroll-progress.js

**6 sections:**

**1. Hero** — `.project-collage` (4 images: posters, shadowing, moodboard, problem) + h1 + `.project-meta` (4 text-block--secondary)

**2. "2.5 million..."** — h2 + `.columns-equal-height--6-4`: left col (3 text-blocks), right col (`.project-visual` → `PULSE/problem.jpg`)

**3. "Finding the Root Cause"** — h2 + `.pulse__research-strip` (5 images: posters, shadowing, sketches, wireframes, faq) + two-column text grid + synthesis text-block + 3 persona text-blocks (`.columns-three`)

**4. "Framing the Action"** — h2 + intro text-block + 3 HMW `.text-block--primary.--big` (`.columns-three`) + process visual (wireframes.jpg) + `.columns-equal-height--4-6` (touchpoints text left, user-journey.jpg right)

**5. "Final Designs"** — h2 + `.columns-equal-height--4-6`: LEFT = `.project-visual.pulse__phone-visual` (screens.jpg, object-position: top center), RIGHT = 6× `.feature-card` (Collective Challenges / Giving Made Simple / Smart Eligibility Check / Appointment Finder / Personal Schedule / Donation History)

**6. "Takeaways"** — h2 + `.columns-equal-height--6-4`: left (3 text-blocks), right (`.project-visual` → `PULSE/zukunft.jpg`)

### project-mykorrizha.html ← Phase 3 (not started)
### project-neckband.html ← Phase 3 (not started)

---

## Key decisions / rules (non-negotiable)

1. **No hardcoded values** — only CSS custom properties from tokens.css
2. **Square corners everywhere** — `border-radius: 0`
3. **`--tracking: -0.04em`** — applied to every text element, no exceptions
4. **Gambarino** = display font for headings and pronunciation ONLY
5. **Geist** = body font for everything else
6. **CSS transitions only** — no JS animations. Interactive states: hover, focus.
7. **Mobile-first** — 375px base, responsive up to 1280px+
8. **`.columns-equal-height`** — always use for two-column layouts with equal-height rows
9. **Think in components** — reusable patterns go in component files, never page-specific one-offs
10. **Specificity rule** — nav.css loads before button.css, so overriding `.btn` inside nav requires 2-class selectors (e.g. `.nav__right .nav__linkedin`)
11. **Grid-row expand trick** — `grid-template-rows: 0fr → 1fr` for height animations (feature-card, cv-entry). Always pair with `overflow: hidden` + `min-height: 0` on inner wrapper.

---

## JS files

### assets/js/theme.js
- Reads/writes `localStorage.theme` (`'dark'` or `'light'`)
- Toggles `data-theme="dark"` on `<html>`
- Swaps button icon between moon SVG (light mode) and sun SVG (dark mode)
- Page fade on toggle: adds `.page--fading` class → 220ms timeout → swap theme → double rAF → remove class
- Init script in `<head>`: `if(localStorage.getItem('theme')==='dark') document.documentElement.setAttribute('data-theme','dark');`

### assets/js/scroll-progress.js
- Updates `#scroll-fill` width and `#scroll-label` text on scroll
- Formula: `scrollY / (scrollHeight - clientHeight) * 100`
- Required on all project pages that have `.nav__progress`

---

## Local dev server

```bash
npx serve /Users/enesclngr/Downloads/Enes
# open: http://localhost:3000
```

Preview server config: `.claude/launch.json` → name: `"serve"`, port: 3000
