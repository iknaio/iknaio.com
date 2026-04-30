# Iknaio Corporate Website

Static site for [Iknaio Cryptoasset Analytics](https://iknaio.com). Built with [Hugo](https://gohugo.io), plain CSS, and minimal vanilla JS. Currently published at https://iknaio.github.io/iknaio.com/ via GitHub Pages; final domain will be https://iknaio.com/ once DNS is flipped (see [`TODO.md`](TODO.md)).

## Run locally

Requires Hugo 0.147.4 extended (installed at `~/bin/hugo`):

```sh
~/bin/hugo server           # dev server with live reload at http://localhost:1313/
~/bin/hugo                  # production build into ./public/
```

Drafts (`draft: true` in front matter) don't render unless you pass `-D`:

```sh
~/bin/hugo server -D
```

Deployment is automatic: every push to `main` triggers the GitHub Actions workflow that builds and publishes to Pages.

## Add a blog post

Posts live in `content/insights/` as Markdown files. The slug becomes the URL (`/insights/<slug>/`).

1. **Create the post file** at `content/insights/<slug>.md` with this front matter:

   ```yaml
   ---
   title: "Your Post Title"
   date: 2026-04-22
   description: "One-sentence summary — used for SEO, OG preview, and insight-card subtitle."
   tags: ["tag1", "tag2"]
   image: "images/insights/<slug>/cover.png"
   posttype: "insight"
   aliases: ["/blog/<slug>/"]
   ---
   ```

   - `posttype` accepts `"insight"` (default editorial), `"news"` (announcements), or `"case-study"` (e.g. Operation Alice). The post-card label is set from this value.
   - `image` is the card thumbnail and the OG preview image; use `cover.png` or `cover.jpg`.
   - `aliases` preserve old `/blog/<slug>/` URLs as redirects to the new `/insights/<slug>/` path.

2. **Add images** under `static/images/insights/<slug>/`:
   - `cover.png` (or `.jpg`) — required; used for card + social preview.
   - `figure-1.png`, `figure-2.png`, … — optional inline figures.

3. **Reference inline figures** in the body as:

   ```markdown
   ![](/images/insights/<slug>/figure-1.png)
   ```

   The leading slash is fine — `layouts/_default/_markup/render-image.html` is a Hugo image render hook that strips the leading slash and pipes the path through `relURL` so it works under any baseURL (localhost or `/iknaio.com/` on GitHub Pages).

4. **Preview:** `~/bin/hugo server -D` and open `/insights/`.

## Project layout

```
content/             Markdown content
  _index.md            Home (front-matter-driven; edit hero/products/why/trust/case-study/etc. here)
  insights/            Blog posts + /insights/ landing
  about/, pricing/, solutions/, contact/  …
  imprint.md, privacy.md, tcs.md
data/                YAML data files consumed by templates
  pricing.yaml         Tiers, feature matrix, FAQ
  team.yaml            Founders + team + advisors
  partners.yaml        Customers, research, resellers, funding
  press.yaml           Press logos
  use_cases.yaml       Solutions page (Investigate / Comply / Advise)
layouts/             Hugo templates
  _default/            baseof.html, single.html, _markup/render-image.html
  partials/            head, nav, footer, cookie-banner, pricing/comparison-cell
  index.html           Home (all home sections inlined — single readable template)
  <section>/           Section-specific layouts (about, contact, pricing, solutions, insights)
  robots.txt           Custom robots.txt with explicit AI-bot allowlist
assets/              Pipeline-processed (minified + fingerprinted)
  css/main.css         Full design system (tokens, components, dark mode, responsive)
  js/main.js           Mobile nav, dark-mode toggle, scroll behaviour
  js/cookie-banner.js  Consent banner + Plausible gate
static/              Files served as-is at site root
  images/              Photos, product screenshots, logos, icons, insights/<slug>/ folders for post covers + figures
  fonts/               woff2 (Brawler / General Sans / Roboto)
  favicon/
```

## Editing conventions

- **Home page copy** lives in `content/_index.md` front matter (hero, products, secondary_audience, why, trust, case_study, press, cta). Don't hunt through templates.
- **Team / partners / press / pricing / use_cases** are YAML in `data/`. Changes there propagate automatically.
- **Navigation** is defined in `hugo.toml` under `[[menus.main]]`.
- **Design tokens** (colors, spacing, fonts) are CSS custom properties at the top of `assets/css/main.css`.
- **Dark mode** is a `[data-theme="dark"]` attribute on `<html>`; toggled in `assets/js/main.js`, respects `prefers-color-scheme`.
- **Cookie banner** is rendered from `layouts/partials/cookie-banner.html` + `assets/js/cookie-banner.js`. Persists choice in `localStorage` (`iknaio-cookie-consent`), gates loading of Plausible analytics until consent is given. The footer "Cookie Settings" link reopens the banner.

## QA

Playwright check (screenshots + broken images/links + responsive + dark mode):

```sh
export FNM_DIR="$HOME/.local/share/fnm" && export PATH="$FNM_DIR:$PATH" && eval "$(fnm env)"
node qa-check.mjs
```

Screenshots land in `qa-screenshots/`. Known false positive: lazy-loaded press logos / team photos / blog covers may be reported as "broken images" — spot-check via `curl -sI <url> | head -1` confirms they serve HTTP 200.

Optional SEO/GEO audit (requires `seo-geo` skill from the `opc-skills` plugin):

```sh
python3 ~/.claude/plugins/cache/opc-skills/seo-geo/1.0.0/scripts/seo_audit.py "http://localhost:1313/"
```

## Pre-launch TODO

See [`TODO.md`](TODO.md) for the remaining checklist (custom domain DNS, Formspree form ID, Plausible account, real content for placeholder pages).
