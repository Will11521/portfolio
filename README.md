# Williamjeet Singh - Portfolio

Portfolio site powered by Vite + React, Motion, and a custom "Nerve" AI assistant trained on my resume and project data.

## Local development

- `npm install` - install dependencies
- `npm run dev` - launch the Vite dev server at http://localhost:3000
- `npm run build` - generate the production bundle in `build/`
- `npm run preview` - run a local preview of the production build (http://localhost:4173)

The repo includes `public/CNAME` and `public/Williamjeet Singh.pdf`; both are copied into the production bundle automatically.

## Deployment (GitHub Pages)

This repo ships with `.github/workflows/deploy.yml`, which builds the site and deploys the contents of `build/` to GitHub Pages:

1. In the repository settings, set **Pages -> Build and deployment -> Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the Actions tab). The workflow runs `npm ci`, `npm run build`, uploads the `build/` artifact, and publishes it via `actions/deploy-pages`.
3. GitHub Pages serves the generated bundle with the `CNAME`, keeping the custom domain `williamdev.is-a.dev` active.

With this setup, the published Pages branch stays auto-managed and always reflects the latest production build.
