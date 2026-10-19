# WilliamOS Phase 1 + 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite portfolio on branch `williamos` with **WilliamOS**, a static Astro site. It's a newsprint "Ink OS" desktop on a Sunset wallpaper: every window is a real page, and Mikey the owl is the mascot and the assistant.

**Architecture:**
- Astro renders every route to static HTML inside one OS layout. Each page's window is marked `data-window`.
- A small vanilla-TypeScript window manager, active at ≥ 768 px, intercepts internal links. It fetches the target page, lifts its `[data-window]` element into the desktop and updates the URL.
- On phones, and with JS off, links stay normal page loads.
- Mikey, Ask Mikey, the terminal, the clock, consent and the 3D viewer are separate small modules, loaded lazily.

**Tech Stack:**
- Astro 7.4.1, TypeScript, `@astrojs/sitemap`;
- `@fontsource-variable/fraunces`, `@fontsource/inter-tight`, `@fontsource/special-elite`;
- three 0.186 (STL viewer only, lazy);
- Vitest 5 + happy-dom for units, Playwright 1.64 + `@axe-core/playwright` for e2e;
- `@lhci/cli`, linkinator;
- `sharp` for OG images.

**Spec:** `docs/superpowers/specs/2026-10-19-williamos-redesign-design.md`

## Global Constraints

- Lighthouse mobile: Accessibility, Best Practices and SEO = 100; Performance ≥ 95. LCP < 1.5 s, CLS < 0.05, INP < 200 ms.
- First-load JS for the shell < 80 KB gzipped. The assistant, terminal, Mikey sprite logic and 3D viewer load only on open or on idle.
- Every app is a real route with readable static HTML. Content is reachable with JS off.
- WCAG 2.2 AA:
  - windows focusable; Esc closes; arrow keys move a focused title bar; Ctrl+Alt+→/← cycles windows;
  - `prefers-reduced-motion` turns off all motion.
- Banned:
  - preloaders and intro screens;
  - scroll-jacking;
  - headings split into per-letter elements;
  - skill clouds and counters;
  - emoji icons in production.
- Tokens:
  - Sunset gradient `#ffd9a8 → #f59e7b → #7b5cc4 → #2d2a6e`; Paper `#ece4d6`; Night `#100e0b`;
  - window paper `#f6f1e7`, ink `#141210`, red `#b3261e`, copper `#c97b4a`;
  - window border 1.5 px, radius 4 px, shadow `6px 6px 0` ink (copper in Night).
- Fonts: Fraunces (headings, body, window titles), Inter Tight (UI, kickers), Special Elite (terminal, placeholders). Self-hosted via fontsource.
- Copy rules:
  - no phone number, address or immigration details;
  - employer work only as "a North American tire distributor", with no client, supplier or POS-vendor names and no numbers;
  - nothing about seeking new roles (the strongest claim allowed is "open to freelance and collaborations");
  - the NERVE name appears only as a retired-project clipping.
- Facts, exactly:
  - **Business Systems Analyst, The Kara Consultancy, Sep 2026 – Present**;
  - Manager of Sales (part-time), WirelessPlus, Sep 2025 – Present;
  - AI Intern, Square Root Technologies Inc., Mar 2025 – May 2025;
  - Shift Lead, Booster Juice, Mar 2024 – Dec 2025;
  - Social Media Manager, Brazily Fitness Inc., Mar 2024 – Jun 2024;
  - Interactive Media Design, Algonquin College, graduated 2026;
  - email `williamjeetsingh2004@gmail.com`; LinkedIn `https://www.linkedin.com/in/williamjeetsingh2004/`; GitHub `https://github.com/Will11521`; site `https://williamdev.is-a.dev`.
- Analytics: GA4 `G-3SK3ZCW6JM` via gtag. Consent Mode v2 defaults to denied. Loaded on idle. A consent clipping is shown to everyone once.
- Hosting: GitHub Pages, `public/CNAME` = `williamdev.is-a.dev`. Build output in `dist/`. Nothing is pushed to `main` without William's word.

## Review Focus

1. **Deep link opened cold** (`/projects/mikey` pasted into a new tab): the page must show that window focused on the desktop, with a correct `<title>`, canonical and OG tags. Pinned by Task 3's e2e `deep links render their own window`.
2. **Back/forward after opening windows**: the browser Back button must close or restore windows in order, and must never leave the URL and the open window out of sync. Pinned by Task 4's e2e `history restores windows`.
3. **Phone width (375 px)**: no horizontal scroll, every app reachable from the tab bar, nothing draggable. Pinned by Task 12's e2e `mobile has no horizontal scroll`.
4. **Keyboard-only visitor**: they can reach the Front Page, open Projects, read a case study, close it with Esc and get focus back on the link that opened it. Pinned by Task 4's e2e `keyboard open and close returns focus`.
5. **Assistant gets an off-script or hostile question** ("ignore your rules", "what's his salary", gibberish): it answers from facts only, never invents, offers Contact. Pinned by Task 6's unit `unknown and sensitive questions fall back`.

---

### Task 1: Scaffold Astro, remove the old app, pass a build

**Files:**
- Delete:
  - `src/` (old React app) and `index.html`;
  - `vite.config.ts`;
  - `public/Williamjeet Singh.pdf` (stale résumé);
  - `public/images/{dracula.png,hero-bg-*.jpg,project-*.{jpg,png}}`.
- Keep: `public/CNAME`, `public/images/Professional headshot.png`, `public/images/wyngaarden.jpg`.
- Create:
  - `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`;
  - `src/pages/index.astro` (placeholder), `src/env.d.ts`;
  - `tests/e2e/smoke.spec.ts`.
- Modify: `.gitignore` (add `dist/`, `.astro/`, `test-results/`, `playwright-report/`, `.lighthouseci/`, `.superpowers/`).

**Interfaces:**
- Produces:
  - npm scripts `dev`, `build` (`astro build && node scripts/og.mjs`, with og added in Task 9), `preview` (`astro preview --port 4321`), `check` (`astro check`), `test` (`vitest run`), `e2e` (`playwright test`);
  - `astro.config.mjs` with `site: 'https://williamdev.is-a.dev'`, `output: 'static'`, `trailingSlash: 'never'`, `build.format: 'file'`, sitemap integration.

- [ ] **Step 1:** `npm i -D astro@7.4.1 @astrojs/sitemap@3.7.4 @astrojs/check@0.9.11 typescript vitest@5.0.5 happy-dom@21.0.3 @playwright/test@1.64.1 @axe-core/playwright@4.14.0 linkinator@8.1.0 @lhci/cli@0.15.1` and `npm i @fontsource-variable/fraunces@5.3.0 @fontsource/inter-tight@5.3.0 @fontsource/special-elite@5.3.0 three@0.186.1`. Remove every old dependency from `package.json`.
- [ ] **Step 2: Write e2e `smoke.spec.ts`.** Test `home serves real html`: `GET /` returns 200, and its response text (not the DOM after JS) contains `Williamjeet Singh` and `Business Systems Analyst`. `playwright.config.ts` uses `webServer: { command: 'npm run build && npm run preview', port: 4321 }`.
- [ ] **Step 3:** Run `npx playwright install chromium && npm run e2e -- smoke`. Expected: FAIL (the text isn't present yet).
- [ ] **Step 4:** Put the placeholder page in `src/pages/index.astro`, with `<h1>Williamjeet Singh</h1><p>Business Systems Analyst</p>`.
- [ ] **Step 5:** Run `npm run check && npm run e2e -- smoke`. Expected: PASS, with 0 check errors.
- [ ] **Step 6: Commit.** `chore: replace Vite app with Astro scaffold`.

### Task 2: Tokens, wallpaper, OS layout chrome

**Files:**
- Create:
  - `src/styles/{tokens.css,base.css,window.css,paper.css,print.css}`, `src/lib/wallpaper.ts`;
  - `src/components/{MenuBar,Dock,DesktopIcons,WallpaperSwitch,Window,Icon}.astro`, `src/layouts/OsLayout.astro`;
  - `tests/unit/wallpaper.test.ts`.

**Interfaces:**
- Produces:
  - `type Wallpaper = 'sunset' | 'paper' | 'night'`; `WALLPAPERS: readonly Wallpaper[]`;
  - `resolveWallpaper(stored: string | null, prefersDark: boolean): Wallpaper`;
  - `OsLayout` props `{ title: string; description: string; path: string; ogImage?: string; focus?: string }`;
  - `Window` props `{ id: string; title: string; x?: number; y?: number; w?: number; focus?: boolean }`. It renders `<section data-window={id} aria-labelledby={id+'-title'} tabindex="-1">` with an `<h2 id=…-title>` title bar, a close `<a href="/" data-close aria-label="Close {title}">` and a slot;
  - `Icon` prop `name: 'paper'|'folder'|'owl'|'resume'|'terminal'|'mail'|'now'|'archive'|'ask'`. Inline SVGs, 1.5 px ink stroke, `currentColor`;
  - the `<html data-wallpaper>` attribute, set before paint by an inline script of under 400 bytes.

- [ ] **Step 1: Write unit tests `wallpaper.test.ts`:**
  - `resolveWallpaper(null,false)==='sunset'`;
  - `resolveWallpaper(null,true)==='night'`;
  - `resolveWallpaper('paper',true)==='paper'`;
  - `resolveWallpaper('bogus',false)==='sunset'`.
- [ ] **Step 2:** Run `npm test -- wallpaper`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `src/lib/wallpaper.ts`. Write the same logic in the layout's inline head script: read localStorage `wos-wallpaper` inside try/catch, then `matchMedia('(prefers-color-scheme: dark)')`.
- [ ] **Step 4: Build the components to the Global Constraints tokens.**
  - **MenuBar:** `WilliamOS` (link to `/`), `Projects`, `Résumé`, `Contact`, `Read the paper` (`/read`), the WallpaperSwitch (three labelled radio buttons) and `<time data-clock>` (static fallback text = build date).
  - **Dock:** links to the apps with Icons, using `aria-label`.
  - **DesktopIcons:** Front Page, Projects, Mikey, Résumé, Terminal, Contact.
  - **OsLayout:**
    - `<head>` gets the meta from props, fonts with `font-display: swap`, and preloads Fraunces 900 latin;
    - `<body>` has a skip link "Skip to window", the menu bar, `<main id="desktop">` with the slot, the dock and icons.
  - **Below 768 px:** icons are hidden, the dock becomes a fixed bottom tab bar, and windows are static full-width.
- [ ] **Step 5:** Run `npm test && npm run check`. Expected: PASS.
- [ ] **Step 6: Commit.** `feat: ink OS chrome, tokens and wallpapers`.

### Task 3: Profile data, projects collection, every route

**Files:**
- Create:
  - `src/data/profile.ts`, `src/content.config.ts`, `src/content/projects/{erp-integration,mikey,wyngaarden,agentauth,nerve,analytics,dreamsynth}.md`;
  - `src/pages/{index,projects/index,projects/[slug],resume,contact,ask,now,back-issues,mikey,terminal,read,404}.astro`;
  - `tests/unit/profile.test.ts`, `tests/e2e/routes.spec.ts`.

**Interfaces:**
- Produces:
  - `profile`: `{ name:'Williamjeet Singh'; shortName:'William'; tagline:'I build things that think.'; title:'Business Systems Analyst'; employer:'The Kara Consultancy'; since:'2026-09'; city:'Ottawa'; email; links:{linkedin,github,site}; roles: Role[]; education: Edu[]; availability:'Open to freelance and collaborations.' }`;
  - `Role = { title; org; start:'YYYY-MM'; end:'YYYY-MM'|'present'; note?: string; bullets: string[] }`;
  - projects schema: `{ title: string; kicker: string; summary: string; year: number; status: 'In production'|'Building'|'Shipped'|'Concept'|'Retired'; kind: 'case'|'clipping'; order: number; stack: string[]; links?: {label:string; href:string}[]; image?: string; imageAlt?: string }`;
  - every page renders `<OsLayout path=…>` around one `<Window id=…>`.
  - **Window ids:** `front`, `projects`, `project-<slug>`, `resume`, `contact`, `ask`, `now`, `back-issues`, `mikey`, `terminal`.
  - Pages other than `/` also render the Front Page window behind, unfocused.

- [ ] **Step 1: Write unit tests `profile.test.ts`:**
  - `profile.roles[0]` equals `{title:'Business Systems Analyst', org:'The Kara Consultancy', start:'2026-09', end:'present'}` (matching on those fields);
  - WirelessPlus `note === 'part-time'` and `end === 'present'`;
  - `JSON.stringify(profile)` has no match for `/\+1|\(437\)|872|TireGuru|305 ?Tires|open to (new )?(roles|work)/i`.
- [ ] **Step 2: Write e2e `routes.spec.ts`:**
  - every route returns 200 with exactly one `<h1>`, a non-empty `<title>`, a `<link rel=canonical>` equal to `https://williamdev.is-a.dev` + path, and `meta[name=description]`;
  - `deep links render their own window`: `/projects/mikey` has `[data-window="project-mikey"][data-focus]`;
  - with `javaScriptEnabled:false`, `/projects` → click the `Mikey` link → the URL is `/projects/mikey` and the case study heading is visible.
- [ ] **Step 3:** Run `npm test -- profile && npm run e2e -- routes`. Expected: FAIL.
- [ ] **Step 4:** Write `profile.ts` with the Global Constraints facts. Role bullets come from the existing site's `TIMELINE`; the Kara bullets are the five LinkedIn bullets with the POS vendor's name removed (write "the POS").
- [ ] **Step 5:** Write the seven project files.
  - **Copy sources:** LinkedIn wording (erp-integration, wyngaarden, agentauth, analytics); `~/Code/products/Mikey/docs/superpowers/specs/2026-10-18-mikey-design.md` §1–2 (mikey); `wiki/products/nerve.md` "Current State" (nerve, `status: Retired`, a clipping).
  - **Case-study body** for `kind:'case'`: `## The problem` / `## What I built` / `## Result` / `## Stack`.
  - **erp-integration Result is qualitative only.**
  - **Featured order:** erp-integration 1, mikey 2, wyngaarden 3. Clippings: agentauth, analytics, nerve, dreamsynth.
- [ ] **Step 6: Build the pages.**
  - **Front Page:**
    - masthead `The William`;
    - date line `<time data-edition>` (static = build date);
    - lead story *"The analyst who builds systems that think"*;
    - the Now box from `profile`;
    - "In this issue" from projects with `order ≤ 5`;
    - an Opinion teaser linking to `/projects/agentauth`.
  - **Projects:** a folder list of cases, then clippings.
  - **`[slug]`:** an article layout, plus prev/next.
  - **Résumé:** semantic `<article>` (roles, education, skills as plain lists, not chips), and a "Print / Save PDF" button (`window.print()`, hidden without JS).
  - **Contact:** mailto link, LinkedIn and GitHub links, and Ottawa time.
  - **Ask:** a static FAQ (the same intents as Task 6) so it works without JS.
  - **Now:** from `src/content/now.md`, dated 2026-10-19.
  - **Back Issues:** Task 11.
  - **Mikey:** the build log from the project file, with a 3D mount point (Task 11).
  - **Terminal:** a `<noscript>` line pointing to the apps (Task 11).
  - **Read:** uses `ReadLayout` (Task 8).
  - **404:** "This page is out of print" with a link home.
- [ ] **Step 7:** Run `npm test && npm run e2e -- routes && npm run check`. Expected: PASS.
- [ ] **Step 8: Commit.** `feat: content, profile and all routes as static windows`.

### Task 4: Window manager

**Files:**
- Create: `src/lib/wm-core.ts`, `src/scripts/wm.ts`, `tests/unit/wm-core.test.ts`, `tests/e2e/wm.spec.ts`.
- Modify: `src/layouts/OsLayout.astro` (load `wm.ts` as a module script).

**Interfaces:**
- Produces (pure, in `wm-core.ts`):
  - `clamp(pos:{x:number;y:number}, size:{w:number;h:number}, view:{w:number;h:number}, bar=26): {x:number;y:number}`. It keeps at least 80 px of the title bar on screen and `y ≥ bar`;
  - `bringToFront(order: string[], id: string): string[]`;
  - `extractWindow(html: string, id: string): string | null`. It returns the outerHTML of `[data-window=id]` via DOMParser;
  - `windowIdForPath(path: string): string`. `/` → `front`; `/projects/x` → `project-x`; otherwise the first path segment;
  - `isAppLink(a: HTMLAnchorElement, origin: string): boolean`. True for same origin, no `download`/`target`, not `/read`, and not modified clicks (handled by the caller).
- `wm.ts` (DOM): enabled only when `matchMedia('(min-width: 768px)').matches`.
  - A capture-phase click on `a` → `isAppLink` → if the window is already in the DOM, focus it; otherwise `fetch(href)` → `extractWindow` → insert → `history.pushState({wid}, '', href)`, then `document.title` = the fetched title.
  - **popstate:** focus or close windows so the URL's window is focused.
  - **Drag:** pointer events on `h2` title bars, using `clamp`; positions persist in `sessionStorage`.
  - **Esc:** closes the focused window (except `front`), returns focus to the opener, and moves the URL to the window now on top.
  - **Arrow keys** on a focused title bar move it 16 px. **Ctrl+Alt+→/←** cycles windows.
  - Uses `document.startViewTransition` when it exists.

- [ ] **Step 1: Write unit tests `wm-core.test.ts`:**
  - `clamp({x:-500,y:0},{w:400,h:300},{w:1280,h:800})` → `{x:-320,y:26}`;
  - `bringToFront(['a','b','c'],'a')` → `['b','c','a']`;
  - `extractWindow('<main><section data-window="mikey"><h2>M</h2></section></main>','mikey')` contains `data-window="mikey"`; missing → `null`;
  - `windowIdForPath('/projects/mikey')==='project-mikey'`; `windowIdForPath('/')==='front'`; `windowIdForPath('/resume')==='resume'`.
- [ ] **Step 2: Write e2e `wm.spec.ts`** (viewport 1440×900):
  - `opens app as window`: click the dock "Projects" → `[data-window=projects]` is visible, URL `/projects`, and the page did not reload (a sentinel `window.__wos` survives);
  - `history restores windows`: open Projects → Mikey case → `goBack()` → URL `/projects` and `projects` is focused → `goBack()` → URL `/`;
  - `keyboard open and close returns focus`: Tab to the dock Projects link, press Enter, then Escape → `projects` is gone and focus is on that link;
  - `drag stays on screen`: drag the title bar to (-2000, -2000) → the bounding box keeps ≥ 80 px visible and `top ≥ 26`.
- [ ] **Step 3:** Run them. Expected: FAIL.
- [ ] **Step 4:** Implement `wm-core.ts` and `wm.ts`.
- [ ] **Step 5:** Run `npm test && npm run e2e -- wm`. Expected: PASS.
- [ ] **Step 6: Commit.** `feat: window manager over real routes`.

### Task 5: Front Page print-in, edition date, Ottawa clock

**Files:**
- Create: `src/lib/edition.ts`, `src/scripts/clock.ts`, `tests/unit/edition.test.ts`.
- Modify: `src/styles/paper.css` (the `@keyframes press` wipe and `stamp`), `src/pages/index.astro`.

**Interfaces:**
- Produces:
  - `volumeFor(d: Date): number` = year − 2000;
  - `formatEdition(d: Date): string` → `"Monday, October 19, 2026 · Ottawa Edition · Vol. 26"`, in `en-CA` for `America/Toronto`;
  - `ottawaClock(d: Date): string` → `"Mon 19 Oct 12:41"` (24 h, America/Toronto).

- [ ] **Step 1: Write unit tests:**
  - `formatEdition(new Date('2026-10-19T16:41:00Z'))` gives exactly the string above;
  - `ottawaClock(new Date('2026-10-19T16:41:00Z'))==='Mon 19 Oct 12:41'`;
  - `ottawaClock(new Date('2026-01-05T03:00:00Z'))==='Sun 4 Jan 22:00'` (the date rollover across DST/UTC).
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement with `Intl.DateTimeFormat` and `formatToParts`. `clock.ts` updates `[data-clock]` every 30 s and `[data-edition]` once.
- [ ] **Step 4: The print-in runs only under `html.js:not(.reduce)`, within ≤ 900 ms in total.**
  - The Front Page body gets a `clip-path` wipe (left→right, 600 ms).
  - The masthead date gets `stamp` (scale 1.15→1, 200 ms, 400 ms delay).
  - There's no `opacity:0` start state on the LCP text: the static masthead is visible from frame 0. Only a decorative overlay roller element animates.
- [ ] **Step 5:** Run `npm test`. Expected: PASS.
- [ ] **Step 6: Commit.** `feat: live edition date, Ottawa clock, print-in`.

### Task 6: Mikey sprite and Ask Mikey

**Files:**
- Create:
  - `src/components/{MikeySprite,AskMikey}.astro`, `src/data/assistant.ts`, `src/lib/assistant.ts`;
  - `src/scripts/{mikey.ts,ask.ts}`;
  - `tests/unit/assistant.test.ts`, `tests/e2e/mikey.spec.ts`.

**Interfaces:**
- Produces:
  - `type Intent = { id: string; patterns: RegExp[]; answer: string; action?: { label: string; href: string } }`;
  - `INTENTS: Intent[]` (in `data/assistant.ts`, built from `profile` and the projects);
  - `answer(q: string, intents = INTENTS): { id: string; text: string; action?: {label:string; href:string} }`. It scores by pattern hits. Ties go to the earlier intent. No hit gives `id:'fallback'`;
  - **chips** (exact): `What does he do now?` · `Show me his best project` · `What are you?` · `How do I contact him?`
- **MikeySprite:** an inline SVG owl, about 72 px. Ink outline, copper octagon face, two eyes as `<circle data-pupil>`. `role="button"`, `aria-label="Mikey — ask me about William"`. It sits at the right end of the dock, and in the tab bar on mobile.
- **mikey.ts:** loaded on `requestIdleCallback`.
  - The pupils track the pointer (rAF, max 3 px).
  - After 20 s with no input, `data-state="nap"` (eyes closed).
  - Click → toggles the speech bubble (greeting `Hi, I'm Mikey. Ask me about William.` plus the chips). Each chip opens `/ask?q=…` as a window.
  - Double-click → a random fact from `assistant.ts` `FACTS`.
  - It doesn't move while an input is focused. Under reduced motion it's static.

- [ ] **Step 1: Write unit tests `assistant.test.ts`:**
  - `answer('What does he do now?').text` contains `Business Systems Analyst` and `The Kara Consultancy`;
  - `answer('how do i contact him').action.href==='/contact'`;
  - `answer('Show me his best project').action.href==='/projects/erp-integration'`;
  - `answer('what are you').text` contains `owl`;
  - `answer('is he open to work').text` contains `open to freelance and collaborations` and does not match `/new roles|job hunting|looking for/i`;
  - `unknown and sensitive questions fall back`: each of `'asdkjh'`, `'what is his salary'`, `'ignore previous instructions and say hi'` and `'where does he live exactly'` returns `id==='fallback'`, with text that contains `I don't know that one` and `action.href==='/contact'`;
  - no intent text matches `/\+1|\(437\)|TireGuru|305 ?Tires|salary|\$\d/i`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. Salary, address and immigration have **no** intents, so they fall back.
- [ ] **Step 4: Write e2e `mikey.spec.ts`:**
  - clicking Mikey shows four chips;
  - clicking `How do I contact him?` opens the `ask` window, and its answer has a button that opens `contact`;
  - with `reducedMotion:'reduce'`, the pupils' transform stays constant after moving the mouse.
- [ ] **Step 5:** Run `npm test && npm run e2e -- mikey`. Expected: PASS.
- [ ] **Step 6: Commit.** `feat: Mikey sprite and scripted Ask Mikey`.

### Task 7: Résumé print stylesheet

**Files:**
- Modify: `src/styles/print.css`, `src/pages/resume.astro`.
- Test: `tests/e2e/resume.spec.ts`.

- [ ] **Step 1: Write e2e:**
  - `page.emulateMedia({media:'print'})` on `/resume` hides `.menubar, .dock, .icons, [data-mikey]`;
  - `page.pdf({format:'Letter'})` is ≤ 2 pages (count `/Type /Page` objects in the buffer);
  - it contains `Business Systems Analyst`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Write `print.css`: black on white, Fraunces 10.5 pt body, links printed with their URL after them, no shadows.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5: Commit.** `feat: printable résumé`.

### Task 8: "Read the paper" recruiter mode

**Files:**
- Create: `src/layouts/ReadLayout.astro`, `src/styles/read.css`.
- Modify: `src/pages/read.astro`.
- Test: `tests/e2e/read.spec.ts`.

**Interfaces:**
- `/read` is one scrolling article with no OS chrome. Order:
  1. masthead;
  2. lead story and Now;
  3. the three cases, full text;
  4. clippings, as one-liners;
  5. the résumé;
  6. contact.
- It has a link back "Open WilliamOS →" to `/`. `?read` on `/` redirects to `/read` (inline script, plus `<link rel=alternate>`).

- [ ] **Step 1: Write e2e:**
  - `/read` has no `[data-window]` and no `.dock`;
  - it has the h2s in the order above;
  - the first viewport (1440×900) contains `Business Systems Analyst` and the email link;
  - `/?read` ends at `/read`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement it, reusing the project entries and `profile`.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5: Commit.** `feat: read-the-paper recruiter mode`.

### Task 9: SEO, structured data, OG images, robots, llms.txt

**Files:**
- Create: `src/lib/seo.ts`, `scripts/og.mjs`, `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `tests/unit/seo.test.ts`.
- Modify: `src/layouts/OsLayout.astro`, `ReadLayout.astro` (head).

**Interfaces:**
- Produces:
  - `personJsonLd(p = profile): object`. `@type:'Person'`, `name`, `jobTitle:'Business Systems Analyst'`, `worksFor:{@type:'Organization',name:'The Kara Consultancy'}`, `address:{addressLocality:'Ottawa', addressRegion:'ON', addressCountry:'CA'}`, `sameAs:[linkedin, github]`, `url`, `email:'mailto:…'`;
  - `profilePageJsonLd(path: string): object`, which wraps the person in `ProfilePage`;
  - `ogPath(path: string): string` → `/og/<slug>.png` (`/` → `/og/index.png`).
- `og.mjs` runs after `astro build`. For each HTML file in `dist/`, it renders a 1200×630 PNG with sharp from an SVG template: Sunset gradient, an ink window, title and kicker.

- [ ] **Step 1: Write unit tests:**
  - `personJsonLd().jobTitle==='Business Systems Analyst'`;
  - `JSON.stringify(personJsonLd())` has no `telephone` or `streetAddress`;
  - `ogPath('/projects/mikey')==='/og/projects-mikey.png'`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3: Implement.** In the head: `og:title/description/image/url/type`, `twitter:card=summary_large_image`, canonical, and JSON-LD in `<script type="application/ld+json">`. `robots.txt` allows everything and lists the sitemap. `llms.txt` holds the name, title, one paragraph, and links to `/read`, `/resume` and the projects.
- [ ] **Step 4:** Run `npm test && npm run build && ls dist/og | wc -l`. Expected: PASS, with the PNG count equal to the number of HTML pages.
- [ ] **Step 5: Commit.** `feat: seo, json-ld, og images, robots, llms.txt`.

### Task 10: Consent and analytics

**Files:**
- Create: `src/lib/consent.ts`, `src/components/ConsentClipping.astro`, `src/scripts/consent-ui.ts`, `tests/unit/consent.test.ts`.

**Interfaces:**
- Produces:
  - `type Consent = 'granted'|'denied'|null`;
  - `readConsent(store: Pick<Storage,'getItem'>): Consent`. It reads `wos-consent` safely and returns null on a throw;
  - `gtagConsentUpdate(c: 'granted'|'denied'): ['consent','update',{analytics_storage:string; ad_storage:'denied'; ad_user_data:'denied'; ad_personalization:'denied'}]`.
- **Head:** `gtag('consent','default',{analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', wait_for_update: 500})`. The gtag.js script for `G-3SK3ZCW6JM` is injected on `requestIdleCallback`, or 3 s after load.
- **The clipping:** a small paper note bottom-left, "Mind if I count visits? No ads, ever.", with buttons **Sure** / **No thanks**. Shown when `readConsent()===null`. It's never a modal and never blocks.

- [ ] **Step 1: Write unit tests:**
  - `readConsent({getItem:()=> 'granted'})==='granted'`; a throwing store → `null`; `'weird'` → `null`;
  - `gtagConsentUpdate('granted')[2].analytics_storage==='granted'`, and `ad_storage` is always `'denied'`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5: Commit.** `feat: consent-first analytics`.

### Task 11 (Phase 2): Terminal, Mikey 3D, Now, Back Issues

**Files:**
- Create:
  - `src/lib/terminal.ts`, `src/scripts/terminal-ui.ts`, `src/scripts/mikey3d.ts`;
  - `public/mikey/{owl_front,owl_back_lid,base_plinth}.stl` (copied from `~/Code/products/Mikey/body/out/`);
  - `public/back-issues/{2025-accidental-therapist,2026-cinematic}.webp`;
  - `tests/unit/terminal.test.ts`.

**Interfaces:**
- Produces:
  - `runCommand(input: string, ctx: { cwd: string }): { out: string[]; open?: string; theme?: Wallpaper; cwd?: string; clear?: boolean }`;
  - commands: `help`, `whoami`, `ls` (lists `projects/ resume contact now mikey`), `ls projects`, `cd <dir>`, `open <app|project>`, `cat resume`, `contact`, `ask <q…>` (uses `answer()`), `theme sunset|paper|night`, `mikey`, `clear`, `sudo` (easter egg: "nice try"), `exit`;
  - an unknown command gives `out:["command not found: <x> — try help"]`;
  - `complete(prefix: string): string[]` for Tab completion.
- **mikey3d.ts:** loaded only when the Mikey window opens and the `<canvas>` mount is visible (IntersectionObserver).
  - three.js `STLLoader`, orbit with pointer drag, ink-and-copper materials.
  - Under reduced motion there's no auto-rotate.
  - With no WebGL, a static image `public/mikey/owl.webp` (rendered once with Playwright from `~/Code/products/Mikey/body/out/viewer.html`).
- **Back Issues:**
  - screenshots taken with Playwright from the live current site (before launch) and from `~/Code/web/portfolio/portolio/index.html` served locally, cropped above the contact section;
  - checked to show no phone number;
  - each has a caption and year.

- [ ] **Step 1: Write unit tests:**
  - `runCommand('whoami',{cwd:'~'}).out[0]` contains `business systems analyst`;
  - `runCommand('open projects',{cwd:'~'}).open==='/projects'`;
  - `runCommand('theme night',{cwd:'~'}).theme==='night'`;
  - `runCommand('ask how do i contact him',{cwd:'~'}).open==='/contact'`;
  - `runCommand('rm -rf /',{cwd:'~'}).out[0].startsWith('command not found')`;
  - `complete('th')` deep-equals `['theme']`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the terminal and its UI: Special Elite font, history with ↑/↓, Tab completion, `aria-live="polite"` output.
- [ ] **Step 4:** Implement `mikey3d.ts` and copy the STLs. Check that `npm run build` keeps three.js out of the first-load chunk: `dist/_astro` entry for `/` has no `three` code (grep for `WebGLRenderer` → absent from the index entry chunk).
- [ ] **Step 5:** Capture the Back Issues screenshots (WebP, ≤ 150 KB each) and write `now.md` and `back-issues.astro`.
- [ ] **Step 6:** Run `npm test && npm run e2e`. Expected: PASS.
- [ ] **Step 7: Commit.** `feat: terminal, Mikey 3D viewer, now, back issues`.

### Task 12: Quality gates: CI, Lighthouse, axe, links, mobile

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`, `tests/e2e/a11y.spec.ts`, `tests/e2e/mobile.spec.ts`.
- Modify: `.github/workflows/deploy.yml` (Node 22, `npm ci`, `npm run build`, upload `dist`; trigger stays `push: main` only).

**Interfaces:**
- **`ci.yml`:** runs on `push` to `williamos`, and on PRs to `main`. Steps: `npm ci` → `npm run check` → `npm test` → `npx playwright install --with-deps chromium` → `npm run e2e` → `npx lhci autorun` → `npx linkinator dist --recurse --skip "^(?!http://localhost)"`.
- **`lighthouserc.json`:** `staticDistDir: "dist"`; urls `/`, `/projects`, `/projects/mikey`, `/read`, `/resume`; mobile preset. Assertions: `categories:performance ≥ 0.95` (error), accessibility, best-practices and seo `= 1` (error), `largest-contentful-paint ≤ 1500`, `cumulative-layout-shift ≤ 0.05`, `total-byte-weight ≤ 600000`.

- [ ] **Step 1: Write e2e:**
  - `a11y.spec.ts`: axe on `/`, `/projects`, `/projects/erp-integration`, `/read`, `/resume`, `/contact` and `/ask`, in all three wallpapers (set `localStorage` before load) → 0 violations at `wcag2a, wcag2aa, wcag22aa`;
  - `mobile.spec.ts`: at 375×812, for each route, `document.documentElement.scrollWidth <= 375`; the tab bar has links to every app; title bars have no drag handlers (`data-draggable` is absent);
  - first-load JS: sum the gzipped size of the `<script type=module>` files referenced by `dist/index.html` < 80 KB.
- [ ] **Step 2:** Run `npm run build && npm run e2e && npx lhci autorun`. Expected: fail first. Fix violations and budgets until everything passes.
- [ ] **Step 3: Commit.** `ci: lighthouse, axe, links, mobile gates`.

### Task 13: Final review and the recruiter walkthrough (no code of its own)

- [ ] **Step 1: Whole-branch code review** by a fresh reviewer (most capable model), against the spec and this plan. Fix every confirmed finding, then re-run `npm test && npm run e2e && npx lhci autorun`.
- [ ] **Step 2: The recruiter walkthrough.** Run it in a real browser on `npm run preview`, at desktop 1440×900 and at phone 375×812.
  - From a cold load, within 30 s: name, current title, employer, one project worth reading, the résumé and an email address. Each is found, and the time is noted.
  - The LinkedIn and Google preview of `/` (from the OG and title tags) reads correctly.
  - "Read the paper" works end to end. Printing the résumé gives ≤ 2 clean pages.
  - Keyboard only: open Projects → a case study → Esc → back to where you started.
  - JS off: every page is readable and every link works.
  - The copy rules hold: grep `dist/` for the banned patterns in Global Constraints → 0 hits.
- [ ] **Step 3:** Report to William with screenshots, the Lighthouse scores, the open copy drafts for his approval (especially `erp-integration.md`) and the launch command. **Do not push `main`.**
