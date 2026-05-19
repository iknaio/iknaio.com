# Iknaio Corporate Website

Static site for [Iknaio Cryptoasset Analytics](https://iknaio.com). Hugo + plain CSS + minimal vanilla JS. Deploys automatically on push to `main` via GitHub Pages.

## Run locally

Requires Hugo 0.147.4 extended (installed at `~/bin/hugo`):

```sh
~/bin/hugo server           # http://localhost:1313/ with live reload
~/bin/hugo server -D        # include drafts (`draft: true` in front matter)
~/bin/hugo                  # production build into ./public/
```

## Add a blog post

Posts live in `content/insights/` as Markdown. The filename slug becomes the URL (`/insights/<slug>/`).

1. **Create** `content/insights/<slug>.md`:

   ```yaml
   ---
   title: "Your Post Title"
   date: 2026-04-22
   description: "One-sentence summary — used for SEO, OG preview, and post-card subtitle."
   tags: ["tag1", "tag2"]
   image: "images/insights/<slug>/cover.png"
   posttype: "insight"
   aliases: ["/blog/<slug>/"]
   ---
   ```

   - `posttype`: `"insight"` (editorial, default), `"news"` (announcement), or `"case-study"`. Sets the card label.
   - `aliases`: preserve legacy `/blog/<slug>/` URLs as redirects.

2. **Add images** under `static/images/insights/<slug>/`:

   | File | Use | Recommended size |
   |---|---|---|
   | `cover.png` / `cover.jpg` | Card thumbnail + OG/social preview + article hero | **1200 × 630** (1.91:1) — matches the hardcoded `og:image` meta in `layouts/partials/head.html`. 16:9 (e.g. 1600×900) also renders fine. |
   | `figure-1.png`, `figure-2.png`, … | Inline figures | **1200–1600 px wide**, height as needed. Article column is 720 px, so ~1440 px gives crisp 2× retina. |

   Keep covers under ~500 KB and figures under ~300 KB where possible. PNG for screenshots and diagrams; JPG for photos.

3. **Reference inline figures** with a leading slash:

   ```markdown
   ![](/images/insights/<slug>/figure-1.png)
   ```

   The `layouts/_default/_markup/render-image.html` render hook normalises the path through `relURL` so it works under any `baseURL`.

4. **Preview** with `~/bin/hugo server -D` and open `/insights/`.

## Where to edit common content

- **Home page**: front matter of `content/_index.md` (hero, products, why, trust, case_study, press, cta).
- **Team / partners / press / packages / use cases**: YAML in `data/`.
- **Navigation**: `[[menus.main]]` in `hugo.toml`.
- **Design tokens** (colors, spacing, fonts): CSS custom properties at the top of `assets/css/main.css`. Dark mode is `[data-theme="dark"]` on `<html>`.
- **Analytics**: `assets/js/cookie-banner.js` loads Plausible, Google Analytics (`G-TPJK719TS4`), and the Lottie player on every page view. No consent banner; legal basis is Art. 6(1)(f) GDPR (legitimate interest) per `content/privacy.md` Section 3.3.

## QA

Visual checks run through the Playwright MCP server (`browser_*` tools in Claude Code). Start `~/bin/hugo server` and have the assistant navigate the site to capture screenshots and verify links + responsive behavior. Screenshots and the MCP working dir are gitignored (`.playwright-mcp/`, root-level `*.png`).
