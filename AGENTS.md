# AGENTS.md

## Deployment
- The site deploys **only via GitHub Pages** (push to `master` triggers `pages build and deployment`).
- Publishing remote: `nueva` → `git@github.com:Malasailcharters/malasailcharters.github.io.git` (SSH, branch `master`).
- URL: https://malasailcharters.com/ (custom domain via `CNAME`; `malasailcharters.github.io` redirects to it).
- `origin` (`aramil13/web-alex-hasi`, HTTPS) is a **stale backup**; pushes to it hang on Git Credential Manager. Do not use it.
- **Cloudflare has nothing to do with this project.** Do not use wrangler/Cloudflare Pages for this site. Ignore the `.wrangler/` folder (gitignored, leftover from an unrelated setup).

## Site
- Static site: `index.html` + `styles.css` + `app.js` + `images/`.
- All site text must be in English.
- Brand: **Mālā Sail Charters**. The navbar wordmark stacks `MĀLĀ` with `SAIL CHARTERS` tracked wide beneath it (mirroring the og-card); the full name also lives in the footer.
- Logo: inline SVG of an anchor with a flower offering — three copies in `index.html` (navbar, footer, newsletter).
- Fonts: DM Sans (body), Cormorant Garamond (display), Questrial (nav links), Montserrat 700 (wordmark).
- No emoji icons. `★` is rating data, `→` is typography.

## Email & forms
- Published contact address: **info@malasailcharters.com** — it appears in the JSON-LD in `index.html`, in `terms.html`, `privacy.html`, `maintenance.html`, both compliance documents, and in the shared `CONTACT_EMAIL` constant in `app.js`. **Never reintroduce the old Gmail address in published files.**
- It is a **forwarding-only** address: DNS is at Porkbun (`fwd1`/`fwd2.porkbun.com` MX, SPF `include:_spf.porkbun.com`) and forwards to `malasailcharters@gmail.com`. Receiving works; **sending *as* info@ is not set up**, so replies leave from Gmail.
- `travala.txt` keeps the Gmail address on purpose: that is a platform login, not a public contact.
- All three forms (contact, newsletter, review) post to **Web3Forms** with access key `bd819dd0-a73c-4949-8143-c3093b98d150`. The key is **public by design** — Web3Forms treats it as an alias to the destination inbox. The destination is configured **in the Web3Forms account, not in the code** (the API has no recipient field; `ccemail` is a paid feature).
- Operator legal identity, required in customer-facing documents: **Alejandro Alonso Perez**, trading as Mālā Sail Charters, NIF 71727434W, Calle Galicia 9A, La Oliva, Las Palmas, Spain.

## Workflow
- Always commit and push to `master` at the end of every task (do not ask first).