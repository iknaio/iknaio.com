# Security headers and the Mozilla Observatory grade

Status as of 2026-10-27. Check: <https://developer.mozilla.org/en-US/observatory/analyze?host=iknaio.com>

## Where we stand

GitHub Pages does not let us set custom HTTP response headers. Before this work
the site scored **D (30/100)**. Four tests failed, all because headers were missing:

| Test | Penalty | Fixable on GitHub Pages? |
|---|---|---|
| Content-Security-Policy | −25 | Yes, via `<meta http-equiv>` (done) |
| Strict-Transport-Security (HSTS) | −20 | No, header only |
| X-Frame-Options / CSP `frame-ancestors` | −20 | No: X-Frame-Options is header only, and browsers ignore `frame-ancestors` in a meta CSP |
| X-Content-Type-Options | −5 | No, header only |

Observatory adds bonus points (SRI, Referrer-Policy, etc.) only once the base
score is 90 or higher, so the meta-tag fix alone should take us to roughly
**C (≈55/100)**.

## What is in place (meta tags)

In `layouts/partials/head.html`, directly after charset/viewport (a meta CSP
only covers elements after it):

- `Content-Security-Policy`: allows only our own files plus the third parties
  the site uses. `'unsafe-inline'` is allowed only for styles, because posts use
  `style="…"` attributes and Observatory doesn't penalise this.
- `referrer` = `strict-origin-when-cross-origin`.

To make this possible there are **no inline `<script>` blocks** any more.
Theme init, the newsletter loader and the tools tabs live in `assets/js/` and
are loaded with SRI. Keep it that way: a new inline script will be blocked by
the CSP. JSON-LD (`type="application/ld+json"`) is fine, because it isn't executed.

### Adding a new third party

If you add an embed, script, font or form endpoint, extend the matching
directive in the CSP (`script-src`, `frame-src`, `connect-src`, `form-action`, …).
Otherwise it will be silently blocked. Check the browser console for
"Content Security Policy" errors after `hugo server`.

Current allowances:

| Directive | Source | Used by |
|---|---|---|
| script-src | `https://plausible.io/js/` | Analytics (`assets/js/cookie-banner.js`) |
| script-src | `https://unpkg.com/@dotlottie/player-component@2.7.12/` | Hero animation (pinned version: bump both together) |
| script-src, style-src, font-src | `https://sibforms.com` | Brevo newsletter form (`assets/js/newsletter.js`) |
| connect-src, form-action | `https://*.sibforms.com` | Newsletter submit |
| connect-src | `https://plausible.io` | Analytics events |
| frame-src | `https://www.youtube.com`, `https://www.youtube-nocookie.com` | Learning page videos |
| frame-src | `https://iknaio.odoo.com` | Contact / get-access form |
| img-src | `https:`, `data:` | Images |

## Ways out (to reach A / A+)

The three remaining tests need real HTTP headers. Options:

1. **Cloudflare (free plan) in front of GitHub Pages.** Move DNS for iknaio.com
   to Cloudflare, proxy the record, and add the headers with a
   *Transform Rule → Modify Response Header*. Hosting and the deploy workflow
   stay unchanged.
2. **Move hosting to Cloudflare Pages or Netlify.** Both read a `_headers` file
   (put it in `static/` so Hugo copies it to the build root). This needs a new
   deploy workflow in place of `.github/workflows/` → GitHub Pages.

Headers to send:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

Ideally the CSP also moves from the meta tag into a header, with
`frame-ancestors 'none'` added (and the meta tag removed, so there is only one
policy to maintain).

Caveats:

- `includeSubDomains` commits **every** subdomain (app., www., etc.) to HTTPS for
  two years. Confirm they all serve valid HTTPS first, or drop that token.
  Start with a short `max-age` (e.g. 300) and raise it after checking.
- Don't add `preload` unless we intend to submit to the HSTS preload list. It is
  hard to undo.
- `X-Frame-Options: DENY` stops anyone from framing iknaio.com. That's fine
  unless we embed our own pages somewhere.
