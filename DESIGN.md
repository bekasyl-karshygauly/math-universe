# Math Universe — Mathematical Laboratory

The design system of the whole application. Reference: the approved
"Mathematical Laboratory" concept (desktop 1440 px and mobile 390 px screenshots).

## Identity

A professional digital mathematics laboratory where a formula, its explanation
and an experiment form one unit. Calm, intellectual, precise, editorial, and
comfortable for long reading and problem solving.

What it is **not**: cosmic/neon, glassmorphism, gradient SaaS dashboard,
poster-style geometry.

## Palette

All colors live as CSS custom properties in `src/app/globals.css` (the single
runtime source). Components use the semantic names, never raw hex. Canvas,
JSXGraph and Three.js read the same variables through `src/lib/labPalette.ts`.

| Role | Token | Light | Dark |
|---|---|---|---|
| canvas | `--bg` | `#F5F7F7` | `#101819` |
| surface (instruments) | `--surface` | `#FFFFFF` | `#162123` |
| surface-secondary | `--surface-secondary` | `#F5F7F7` | `#1B282A` |
| soft / offset shadow | `--surface-soft` | `#E5EBEC` | `#0B1213` |
| text-primary | `--text-primary` | `#243C40` | `#E2EBEB` |
| text-secondary | `--text-secondary` | `#536B6F` | `#A8BBBD` |
| text-muted | `--text-muted` | `#536B6F` | `#94A9AB` |
| border | `--border` | `#C7D3D5` | `#2F4346` |
| border (rules, grid) | `--border-hover` / `--border-light` | `#B9C9CC` / `#DCE3E5` | `#3B5154` / `#22312F` |
| accent / primary action | `--primary` | `#176668` | `#6CC2BD` |
| on-accent text | `--on-primary` | `#FFFFFF` | `#0D1A1B` |
| focus ring | `--focus` | `#176668` | `#6CC2BD` |
| success | `--accent-emerald` | `#2E7350` | `#7CC79A` |
| warning | `--accent-amber` | `#8A5A00` | `#E0B45A` |
| danger | `--accent-rose` | `#B0302A` | `#EE8A82` |
| chart series 1–6 | `--chart-1…6` | teal, rust, slate blue, ochre, plum, green | lighter equivalents |

Legacy names (`--primary-gradient`, `--accent-cyan`, `--accent-violet`,
`--shadow-glow`, `--border-glow`) are kept for compatibility but resolve to flat
laboratory values: no gradients, no glow.

All text/background pairs above meet WCAG 2.2 AA (≥ 4.5:1 for body text).

## Typography

| Role | Stack | Size |
|---|---|---|
| Display (hero, page titles) | Georgia, "Times New Roman", serif — `--font-display` | 64–80 px desktop, 42–53 px phone |
| Accent phrase | display, *italic*, `--primary` | — |
| Section headings | Arial/Helvetica bold — `--font-ui` | 24–40 px |
| UI and body | Arial, Helvetica, sans-serif — `--font-ui` | 16–18 px body, 14 px controls |
| Eyebrow / captions | `--font-ui`, 11–12 px, uppercase, letter-spacing .14em | 11–14 px |
| Numbers, short math notes | Geist Mono → ui-monospace — `--font-mono` | 12–14 px |
| Mathematics | KaTeX | scaled by context |

Cyrillic, Kazakh (ә ғ қ ң ө ұ ү һ і) and Latin are covered by the system serif
and sans stacks; no web font is required for the main text.

## Space and layout

- Content width: max 1280 px (`--content-max`), side gutters 20–24 px on phones,
  `clamp(20px, 5vw, 72px)` on large screens.
- Rhythm: 4 px base; common steps 8 / 12 / 16 / 24 / 32 / 48 / 72.
- Corners: nearly square (`--radius-*` 2–4 px). Circles only for real circular
  marks (avatars, plot points).
- Rules: 1 px `--border`; strong editorial rules 1 px `--text-primary`.
- Instrument panels: white surface, 1 px border, offset shadow
  `9px 9px 0 var(--surface-soft)` (`--shadow-instrument`). No blur shadows.

## Components (`src/components/ui/`)

- `Button` — `primary` (filled accent), `secondary` (outlined), `ghost`
  (text), `danger`; sizes `sm` / `md`; min touch target 40–44 px.
- `PageHeader` — eyebrow + serif title + optional lead.
- `SegmentedTabs` — `role="tablist"`, arrow-key navigation, active = filled accent.
- `Field` — label bound to input, help and error text.
- `Dialog` — `role="dialog"`, `aria-modal`, labelled title, Escape, focus trap,
  focus return, scroll lock without layout jump.
- CSS classes in `globals.css`: `.panel`, `.panel--instrument`, `.eyebrow`,
  `.display`, `.rule-link`, `.field-*`, `.btn*`, `.result-panel`, `.status-*`,
  `.chip`, `.data-table`.

## States

- Hover: border or underline change, never glow.
- Focus: 2 px `--focus` outline with 2 px offset on every interactive element.
- Pressed/selected: filled accent with `--on-primary` text, plus `aria-pressed`
  / `aria-selected` / `aria-current`.
- Disabled: 45 % opacity, `not-allowed` cursor.
- Success / warning / danger: text color + icon or word, never color alone.
- Loading: plain text status in `--text-muted`; empty: one sentence + next action.

### University course reading and search

Lecture content uses the existing reading column, KaTeX, instrument surfaces
and teal accent. A compact contents list links to theory sections, deeper
explanations and practice. Derivations and worked applications live in
independently expandable panels, with keyboard controls and reduced-motion
support. Essential theory remains visible.

On desktop the syllabus and reader scroll independently. At narrow widths
they share the document scroll in a single column. Lecture numbers stay
visible after completion, with a separate checkmark for progress.

Course search indexes the eight available lectures, their theory, deeper
explanations and worked examples in all three languages. Results show the
lecture, section and a short excerpt and open the matching section.
Query state stays local to the course coordinator, matching the existing
single-route navigation. Clearing returns focus to the input.

## Motion

Precise feedback, calm reveal, a clear link between cause and effect.

- Hover/focus: 120–180 ms. Regular transitions: 180–260 ms. Reveal: 220–320 ms.
- Only `opacity` and short `transform` (≤ 12 px). No springs with overshoot,
  no blur, no infinite decorative loops.
- Motion (`motion/react`) for overlays and reveals; CSS for simple states;
  SVG/Canvas for math experiments; Three.js only for existing 3D tools.
- `prefers-reduced-motion`: CSS durations collapse, Motion uses
  `useReducedMotion`, Canvas/3D stop auto-animation but keep manual controls.

### Motion tokens (`src/lib/motion.ts` + CSS `--dur-*`)

| Token | Duration | Use |
|---|---|---|
| press | 100 ms | button/tab press scale 0.98 |
| hover | 160 ms | colour, border, small lift |
| state | 220 ms | tabs, panels, question change |
| reveal | 280 ms | dialogs, lesson levels, sections |
| draw | 550 ms | first plot of a function (time-based, cancellable) |
| ease | `cubic-bezier(0.2, 0, 0, 1)` | everything except the plot draw (`easeOutCubic`) |

The in-app setting **Settings → Animations** (system / on / off) writes
`data-motion` on `<html>`; CSS, Motion (`MotionConfig`), Lenis, canvases, GSAP
tweens and Three.js all read it. "System" follows `prefers-reduced-motion`.

### Motion audit (2026-11-02) → resolution

| Component | Action | Before | Problem | Resolution |
|---|---|---|---|---|
| All | any | Motion/CSS gated by OS setting | Windows "animation effects" off ⇒ fully static | in-app Animations setting |
| PlotterView | build / type / preset | frame-count reveal on every keystroke | duration depends on FPS; typing restarts animation; invalid input = blank | time-based 550 ms draw for build/preset, instant debounced redraw while typing, inline error keeps last valid graph |
| PlotterView | tan x, 1/x | line joined across asymptotes, range squashed | misleading graph | break path at jumps, robust y-range |
| VisualProofInteractive | play buttons | GSAP tweens never killed | stacked tweens fight, setState after unmount | one tween per control, killed on retrigger/manual input/unmount |
| UnitCircleVisualizer | 0°/90°/180° | instant jump | no visible dependency | 300 ms tween along the shortest arc; auto-rotation dt-based with clamp |
| Math3DViewer | rotation / mode | per-frame step | speed depends on FPS | dt-based rotation, clamped delta, short scale-in on mode change |
| FormulaTrainer | flip | 3D flip, instant when reduced | jump | crossfade instead of rotation when reduced |
| QuizView | next question | heading only | options swap abruptly | whole question block transitions |
| StepSolver | re-solve | same DOM nodes | steps do not re-reveal | keyed run, steps cascade 40 ms |
| page.tsx | section change | `scrollTo smooth` + Lenis | two smoothers on one scroll | scroll through Lenis when active |
| Buttons | press | scale 0.97 | also on disabled | 0.98, never on disabled, loading keeps size |

## Visualizations

- Plot background = `--surface`; grid = `--border-light`; axes = `--border-hover`;
  labels = `--text-secondary`.
- Main curve = `--chart-1` (accent). Further series use `--chart-2…6`, and are
  distinguished by dash pattern or label as well as color.
- Points: filled series color with a `--surface` outline.
- 3D scenes use the theme background and the same series colors.

## Coverage

Checked in the browser (2026-11-02): no horizontal overflow at 360 / 390 / 720 / 768 /
1024 / 1440 px on every screen; light and dark; ru, kz (`lang="kk"`), en.

| Screen | Components | Implemented | Verified | Open issues |
|---|---|---|---|---|
| Shell | Header, NavTabs, UserHUD, settings popover, footer, toast | yes | desktop + mobile, Escape/focus | — |
| Home | HomeView, LabExperiment (y = ax², a ∈ [−2, 2]) | yes | desktop + mobile, both themes | — |
| Catalog | page.tsx course list, search with lesson matches, empty state | yes | search, empty state | — |
| Lessons | LessonDetailView (outline + lesson), levels, demos, why-it-works | yes | level change, completion, JSXGraph | — |
| Calculators | CalculatorsView (8 tabs), LaTeXPlayground, UnitCircleVisualizer | yes | all results match baseline | tool copy is Russian-only (pre-existing) |
| Graphs | PlotterView 2D (canvas, DPR, resize), JSXGraph, 3D, sandbox | yes | all four modes render | — |
| Quiz | QuizView, MathSprint, FormulaTrainer | yes | quiz → result → review, sprint, card flip | — |
| Notes & reference | NotesView, HacksView, BonusView, WhyItWorksModal | yes | save/dirty state, why-it-works tabs | — |
| Account | AuthModal, DashboardModal (4 tabs) | yes | sign-in dialog only | dashboard needs a signed-in test account |
| Assistants | AIMathChat (template answers), StepSolver | yes | both dialogs, answers | — |
| Notifications | AchievementToast, toast | yes | toast | achievement toast needs a signed-in account |
