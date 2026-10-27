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

Re-checked on 2026-10-27 against the Observatory source
([mdn/mdn-http-observatory](https://github.com/mdn/mdn-http-observatory), `src/retriever/utils.js`
and `src/analyzer/tests/`): only CSP (`http-equiv`) and Referrer-Policy
(`name="referrer"`) are read from meta tags. `frame-ancestors` in a meta CSP is
explicitly ignored. X-Content-Type-Options and X-Frame-Options are read from real
headers only. HSTS passes without the header only if the domain is on the browser
preload list, and getting listed requires serving the header first. GitHub Pages
still has no way to set custom headers ([community discussion, June 2026](https://github.com/orgs/community/discussions/199121)).
So there is no remaining fix on plain GitHub Pages.

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

Both options need the iknaio.com nameservers moved to Cloudflare: Cloudflare can
only serve or proxy the bare domain if it runs the DNS for it. See
[DNS migration](#dns-migration-easyname--cloudflare) below.

Option 1 needs no repo changes. Option 2 keeps the headers in the repo and adds
preview deploys per branch. Repo-side work for option 2 is about an hour:
`static/_headers`, plus either Cloudflare's Git integration (build command
`hugo --minify`, env `HUGO_VERSION=0.162.1`) or our workflow with the deploy
step swapped for `wrangler pages deploy public` (needs a Cloudflare API token
as a repo secret).

### Rejected: only www.iknaio.com on Cloudflare

A Cloudflare Pages custom domain on a subdomain needs only a CNAME
(`www` → `<project>.pages.dev`), so DNS could stay at easyname. Not recommended:

- The bare domain still has to redirect to `www`, and nothing can serve that
  cleanly. GitHub Pages only redirects apex → www when `www` also points to GitHub
  (unsupported setup, certificate issuance unreliable). easyname URL forwarding,
  if offered, often doesn't do HTTPS properly.
- The canonical site moves to `www`: `baseURL`, canonical URLs, sitemap, OG
  images. In SEO terms this is a domain move.
- A scan of `iknaio.com` first hits the bare-domain redirect, which sends no HSTS.
  The grade likely only improves for a scan of `www.iknaio.com`, and the
  redirection test may lose points if `http://iknaio.com` goes straight to
  `https://www`.
- HSTS covers only `www`, not the bare domain or the other subdomains.

Caveats for the headers:

- `includeSubDomains` commits **every** subdomain (app., www., etc.) to HTTPS for
  two years. Confirm they all serve valid HTTPS first, or drop that token.
  Start with a short `max-age` (e.g. 300) and raise it after checking.
- Don't add `preload` unless we intend to submit to the HSTS preload list. It is
  hard to undo.
- `X-Frame-Options: DENY` stops anyone from framing iknaio.com. That's fine
  unless we embed our own pages somewhere.

## DNS migration (easyname → Cloudflare)

The domain stays registered at easyname. Only the nameservers change.

### What is on the domain

These are the public records seen on 2026-10-27. This is **not** a complete
list: DKIM selectors and other subdomains can't be listed from outside.

| Name | Type | Value | Notes |
|---|---|---|---|
| `iknaio.com` | A | 185.199.108–111.153 | GitHub Pages |
| `www` | CNAME | `iknaio.github.io` | GitHub Pages (redirects to the bare domain) |
| `iknaio.com` | MX | `0 mc04.x-net.at` | Email |
| `iknaio.com` | TXT | `v=spf1 include:spf.x-net.at -all` | SPF |
| `iknaio.com` | TXT | `brevo-code:…`, `google-site-verification=…` | Service verification |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | DMARC |
| `app` | A | 62.99.143.170 | Pathfinder: **client-facing** |
| `api` | A | 62.99.143.170 | API: **client-facing** |

No DNSSEC (no DS record), so there is no DS/DNSKEY to coordinate.

### Impact on clients

None if done right:

- **`app` and `api` stay "DNS only" (grey cloud).** Clients keep connecting
  directly to 62.99.143.170 with the same IP and certificate, so customer IP
  allowlists keep working. Do **not** proxy them (orange cloud): that adds
  Cloudflare's upload size limits, ~100 s request timeouts, bot checks and
  changed client IPs, any of which can break API clients.
- **No downtime if the records match exactly.** While the NS change spreads
  (up to ~48 h), resolvers ask either easyname or Cloudflare. Identical answers
  mean nobody notices which they got.

### Risks

1. **A missing record.** Cloudflare's auto-import only guesses common names.
   Email is the most likely to break (e.g. a missing DKIM key means mail lands
   in spam). Work from a full zone export or screenshot from easyname, not from the import.
2. **Accidentally proxying `app`/`api`.** See above.
3. **Website certificate.** Behind the Cloudflare proxy, GitHub Pages may fail
   to renew its own Let's Encrypt certificate. Use Cloudflare SSL mode "Full" (not
   "Full (strict)") or move to Cloudflare Pages, which issues its own certificate.

### Steps

1. Export the full zone from easyname (needs the easyname login).
2. Add the iknaio.com zone in Cloudflare (free plan) and recreate **every** record
   by hand from the export. Set all records to DNS only, including the website
   records for now. Don't enable extras (Bot Fight Mode, "Always Use HTTPS", etc.) yet.
3. Before switching, compare the answers from Cloudflare's assigned nameservers
   with the live ones, record by record (see the check below). Fix every difference.
4. Switch the nameservers at easyname to the two Cloudflare ones, ideally early
   in a working week. Lower TTLs at easyname a day beforehand if possible.
5. Wait for Cloudflare to report the zone as active, and test email delivery and
   `app`/`api` from outside.
6. Only then change the website (proxy option 1 or Pages option 2) and add the
   headers. Keeping this separate from the DNS move keeps each step small and
   easy to roll back.

Rollback: set the nameservers back to `ns1/ns2.easyname.eu`. The easyname zone
stays intact as long as nobody deletes it.

### Pre-switch check

Compares each name/type on the current live nameservers with Cloudflare's.
Put `CF_NS` to one of the nameservers Cloudflare assigns, and extend
`NAMES` with everything from the easyname export (DKIM selectors etc.).
Needs `dig` (package `bind-utils` / `dnsutils`).

```sh
CF_NS=xxx.ns.cloudflare.com
OLD_NS=ns1.easyname.eu
NAMES="iknaio.com www.iknaio.com app.iknaio.com api.iknaio.com _dmarc.iknaio.com"
for n in $NAMES; do
  for t in A AAAA CNAME MX TXT CAA SRV; do
    old=$(dig +short @"$OLD_NS" "$n" "$t" | sort)
    new=$(dig +short @"$CF_NS" "$n" "$t" | sort)
    [ "$old" = "$new" ] || printf 'DIFF %s %s\n  easyname:   %s\n  cloudflare: %s\n' "$n" "$t" "$old" "$new"
  done
done
```

No output means the zones match for the listed names.
