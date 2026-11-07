# Vantar — studio website

A dark, responsive marketing site for a fictional digital product studio. Plain HTML, CSS, and JavaScript — no build step, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, services, selected work, process, about, contact form |
| `services.html` | Detailed capabilities, engagement models, FAQ |
| `work.html` | Three case studies with outcomes and project details |
| `about.html` | Studio story, values, team, stats |

## Preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8123
```

Then visit `http://127.0.0.1:8123/`.

## Structure

```
index.html      services.html      work.html      about.html
styles.css      script.js
```

- `styles.css` — design tokens in `:root`, shared components, then inner-page styles
- `script.js` — mobile menu, scroll reveals, counters, active nav, card spotlight, form validation

## Customizing

- **Brand/name:** search for `Vantar` and `vantar` across the HTML files; the logo mark is an inline SVG.
- **Colors:** edit `--accent`, `--accent-2`, `--bg`, and the other tokens at the top of `styles.css`.
- **Contact form:** posts to **Netlify Forms** (`contact`) with validation and a honeypot. In Netlify, open **Forms → contact** to view submissions or **Forms → Notifications** to change the notification email. The form must be present in the deployed HTML for Netlify to detect it; form detection is enabled in the project's processing settings.
- **Content:** each section is plain HTML; the case-study mockups are built with divs, so swap them for `<img>` screenshots when you have real assets.
- **Fonts:** loaded from Google Fonts (Space Grotesk + Inter) with system fallbacks.

## Deployment

**Live:** https://vantar-studio.netlify.app

- Netlify project: `vantar-studio` (site ID `285636c7-fbb2-47b0-961b-2adf7bf62b3c`)
- Contact form: Netlify Forms (`contact`), with email notifications enabled for new submissions.
- `netlify.toml` sets the publish directory and security/caching headers.
- `.github/workflows/deploy.yml` deploys to Netlify on every push to `main`, using the repository secrets `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.
- Manual deploy: `netlify deploy --prod --dir=.`

## Notes

- Accessible: skip link, focus styles, semantic landmarks, `aria-expanded` on the menu, reduced-motion support, and a no-JS fallback that keeps content visible.
- The contact form validates name, email, and project brief, submits to Netlify Forms, and shows an inline error if the network request fails.
