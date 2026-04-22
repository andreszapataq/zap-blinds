# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

No build step — the site is a single `index.html` file. Open it directly in a browser or serve it locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Everything lives in `index.html`: all CSS is in an inline `<style>` block, and all JavaScript is in an inline `<script>` at the bottom of `<body>`. There are no external JS dependencies or frameworks.

**Assets:**
- `assets/zap-logo.png` — used in nav and footer
- `uploads/` — uploaded placeholder images (not referenced in HTML yet)

**Fonts (Google Fonts CDN):**
- `Archivo Black` — headings and display text (`.display` class)
- `Space Grotesk` — body text (default)
- `JetBrains Mono` — labels, tags, monospace details (`.mono` class)

## Design System

CSS custom properties defined in `:root`:

| Variable | Value | Usage |
|---|---|---|
| `--red` | `#E8211C` | Brand accent, CTAs, highlights |
| `--red-dark` | `#B7140F` | Hover states |
| `--ink` | `#0A0A0A` | Dark backgrounds |
| `--ink-2` | `#141414` | Slightly lighter dark bg |
| `--paper` | `#F5F3EE` | Light section background |
| `--paper-2` | `#EEEAE1` | Slightly darker light bg |
| `--line` | `rgba(255,255,255,.12)` | Borders on dark backgrounds |
| `--line-dark` | `rgba(0,0,0,.12)` | Borders on light backgrounds |

## Page Sections

The page flows in order:
1. **Marquee** — animated ticker strip (CSS `@keyframes marq`, `aria-hidden`)
2. **Nav** — sticky, scroll-blurred, links to `#products`, `#work`, `#control`, `#contact`
3. **Hero** — two-column: copy left, interactive blind demo right
4. **Products** (`#products`) — 5-column grid of product cards
5. **Work** (`#work`) — reels row (9:16 aspect ratio cards) + photo tile grid
6. **Control** (`#control`) — split: feature list left, channel status panel right
7. **CTA/Contact** (`#contact`) — split: quick-contact links left, quote form right
8. **Footer** — 4-column grid

**Responsive breakpoint:** `max-width:960px` collapses multi-column layouts to single-column.

## Interactive JavaScript

Three independent pieces of JS at the bottom of `<body>`:

1. **Remote control widget** (`#remote`) — buttons (up/down/stop/P1/P2/P3) drive `pct` (0–100) which updates the `.remote-bar i` position, the `#blind` CSS variable `--blind-h`, and the `#lightCast` variable `--light` in real time via `setInterval`.

2. **Quote form** (`#quote`) — `submit` is prevented; button text changes to a confirmation message on submit.

3. **Channel strip animation** — a `setInterval` every 2.4 s randomly nudges 25% of the `.chan-bar i` bars and updates their sibling `.pct` text.

## Gallery Placeholders

Photo/reel tiles use `.ph` divs with CSS gradient backgrounds (classes `.ph.a` through `.ph.h`) as placeholders — there are no actual image files loaded in these tiles. When adding real images, replace the `.ph` div with an `<img>` element inside the `.reel` or `.tile` container.

## Business Info

- **Owner:** Ruben Zapata
- **Phone:** 954 470 4851
- **Website:** zapblindsusa.com
- **Instagram:** @zapblinds
- **Service area:** South Carolina (Charleston, Columbia, Greenville, Myrtle Beach)
