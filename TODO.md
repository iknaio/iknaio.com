# TODO

What still needs to happen before the new site replaces iknaio.com. Grouped by blocker → recommended → nice-to-have. Each item needs a human decision, an external account, DNS access, real content, or a real secret.

## Blockers (must ship)

- [ ] **Custom domain on GitHub Pages.**
  Current baseURL is `https://iknaio.github.io/iknaio.com/`. For production at `iknaio.com`:
  1. In the GitHub repo, Settings → Pages → set custom domain to `iknaio.com`.
  2. At the DNS provider, add the four `A` records GitHub documents, plus a `CNAME` for `www` pointing at `iknaio.github.io`.
  3. Wait for "DNS check successful", then enable **Enforce HTTPS**.
  4. Edit `hugo.toml`: change `baseURL` to `https://iknaio.com/`.
  5. Push — robots.txt, OG URLs, canonical links, JSON-LD, image render hook, CTAs, sitemap all auto-pick up the new baseURL.

- [ ] **Verify the Odoo contact form delivery.**
  `layouts/contact/list.html` now embeds an Odoo form via `<iframe src="{{ .Site.Params.odoo_form }}">`; `hugo.toml` sets `odoo_form = "https://iknaio.odoo.com/free"`.
  1. Submit a test entry from the live page.
  2. Confirm it lands in the Odoo inbox / CRM with the expected fields.
  3. Check that GDPR consent (the Odoo form's own checkbox) is captured.
  Note: the iframe is cross-origin, so the form's *visual* theme is owned by Odoo — dark mode of the surrounding page does not affect the form's colors. If the white-form-on-dark-page contrast is jarring, configure a theme inside Odoo or wrap the iframe in a light-bg container.

- [ ] **Create the Plausible account for `iknaio.com`.**
  The Plausible script is loaded by `assets/js/cookie-banner.js` only after the user accepts via the cookie banner. Without an active Plausible account, the script just 404s silently — no tracking. Add the site at plausible.io to make data flow.

- [ ] **Replace placeholder content & images.**
  - `content/insights/operation-alice.md` body is lorem-ipsum — fill with real case-study writeup.
  - `static/images/screenshots/screenshot-caseconnect.png` is a labelled placeholder.
  - `static/images/screenshots/screenshot-tailored-reports.png` and `screenshot-learning.png` are labelled placeholders for the two new service cards on the homepage.

## Recommended (do before announcing)

- [ ] **Validate structured data.**
  After deploy, run the live URLs through Google's [Rich Results Test](https://search.google.com/test/rich-results):
  - `https://iknaio.com/insights/change-detection/` → Article schema should parse cleanly.
  - `https://iknaio.com/pricing/` → FAQPage schema with 5 questions should parse cleanly.
  - `https://iknaio.com/` → Organization schema.

- [ ] **Validate OG previews.**
  Paste a post URL into LinkedIn Post Inspector and Twitter/X Card Validator. Confirm the hero image renders, title/description look right.

- [ ] **Submit sitemap to search engines.**
  `https://iknaio.com/sitemap.xml` (auto-generated; 22 URLs).
  - Google Search Console → add property → Sitemaps → submit URL.
  - Bing Webmaster Tools → same flow.

- [ ] **Run the Playwright QA against production.**
  ```sh
  # Edit qa-check.mjs BASE to https://iknaio.com, then:
  node qa-check.mjs
  ```
  Expect all green (excluding the documented lazy-load false positives on press logos / team / blog cover images, which serve HTTP 200 in real browsers).

- [ ] **Cross-browser + mobile smoke test.**
  Open home, /insights/, a post, /pricing/, /contact/ on Safari iOS, Chrome Android, desktop Firefox. Check the nav toggle, dark-mode toggle persistence, cookie banner Accept/Reject, contact-form submit.

- [ ] **Social link sanity check.**
  `hugo.toml` has `linkedin`, `github`, `youtube`, `email` under `[params]`. The `github` value points at the GraphSense org (`https://github.com/graphsense`) — confirm that's still the right destination. Open each URL and confirm.

## Nice-to-have (can wait)

- [ ] **German translation.**
  `hugo.toml` has no language config yet. If wanted, add `[languages.en]` + `[languages.de]` + duplicate the content tree under `content/de/`. Non-trivial; schedule separately.

- [ ] **Custom 404 polish.**
  `layouts/404.html` renders correctly but is minimal. If you want a nicer graphic or a search box, swap it in later.

- [ ] **Real product screenshots for new cards.**
  Beyond the must-ship placeholder swap (above): if Pathfinder / QuickLock get fresher UI imagery, drop replacements at `static/images/screenshots/screenshot-<name>.png` to update home + solutions cards.

- [ ] **Old iknaio.com redirects.**
  If Framer iknaio.com goes offline, any external backlinks pointing at Framer URLs die. All insight posts already carry `aliases:` for the legacy `/blog/<slug>/` paths — but if Search Console reveals other high-traffic backlinks (e.g. specific anchored URLs), add them.

- [ ] **Email-domain consolidation review.**
  Site uses `@iknaio.com` consistently — 8× `contact@iknaio.com`, 1× `office@iknaio.com` in the imprint. If `office@iknaio.com` doesn't have a real mailbox, consolidate to `contact@iknaio.com` everywhere.

## Sanity command before each push

```sh
~/bin/hugo                                                   # clean build
export FNM_DIR="$HOME/.local/share/fnm" && \
  export PATH="$FNM_DIR:$PATH" && eval "$(fnm env)" && \
  node qa-check.mjs                                          # Playwright QA
```
