# AGENTS.md

## Deployment
- The site deploys **only via GitHub Pages** (push to `master` triggers `pages build and deployment`).
- Publishing remote: `nueva` → `git@github.com:Malasailcharters/malasailcharters.github.io.git` (SSH, branch `master`).
- URL: https://malasailcharters.github.io/
- `origin` (`aramil13/web-alex-hasi`, HTTPS) is a **stale backup**; pushes to it hang on Git Credential Manager. Do not use it.
- **Cloudflare has nothing to do with this project.** Do not use wrangler/Cloudflare Pages for this site. Ignore the `.wrangler/` folder (gitignored, leftover from an unrelated setup).

## Site
- Static site: `index.html` + `styles.css` + `app.js` + `images/`.
- All site text must be in English.
- Brand: **Mālā Sail Charters**. The navbar wordmark stacks `MĀLĀ` with `SAIL CHARTERS` tracked wide beneath it (mirroring the og-card); the full name also lives in the footer.
- Logo: inline SVG of an anchor with a flower offering — three copies in `index.html` (navbar, footer, newsletter).
- Fonts: DM Sans (body), Cormorant Garamond (display), Questrial (nav links), Montserrat 700 (wordmark).
- No emoji icons. `★` is rating data, `→` is typography.

## Workflow
- Always commit and push to `master` at the end of every task (do not ask first).