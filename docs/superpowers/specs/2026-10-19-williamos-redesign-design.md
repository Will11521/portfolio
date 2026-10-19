# WilliamOS: redesign of williamdev.is-a.dev

Date: 2026-10-19 · Status: ready for William's approval (builder check done; his answers folded in) · Branch: `williamos` (worktree at `~/Code/web/portfolio/williamos`)

## 1. Intent

William Jeet Singh hates the current site, both the design and the way it works. It's a React + Vite "cinematic 3D" scroll site with a letter-by-letter hero, skill clouds, counters and a scroll timeline. It also sends an empty HTML shell, so search engines and LinkedIn previews see nothing.

What he wants, in his words:

- "the best practices used"
- "immediate excitement when someone opens it"
- "be recognized with it"
- "make it rate well"
- "just be the best in the business"

The site has to do two jobs at once:

1. **Be memorable.** Someone who opens it should remember it and send it to a friend.
2. **Be useful.** A recruiter scanning it for 30 seconds should get his name, current title, proof of work and a way to reach him without learning anything.

**Who he is, so the builder makes the small calls the way he would:**
- Interactive Media Design graduate (Algonquin College, 2026).
- Business Systems Analyst at The Kara Consultancy since Sep 2026: ERPNext, Walmart Marketplace, and the POS ↔ ERP ↔ marketplace integration, with Python automation.
- Side projects:
  - an AI chatbot about himself (NERVE, 2025; shelved by William, the site does not revive it);
  - a 3D-printed ESP32 desk-pet owl robot with a Claude brain (Mikey);
  - an authorization layer for AI agents (AgentAuth, a concept).
- Brand line: **"I build things that think."**

## 2. What "best in the business" means here: measurable targets

| Area | Target |
|---|---|
| Lighthouse (mobile, simulated 4G) | 100 for Accessibility, Best Practices and SEO; Performance at least 95 |
| Core Web Vitals | LCP < 1.5 s, CLS < 0.05, INP < 200 ms |
| JavaScript on first load | < 80 KB gzipped for the desktop shell. the Ask Mikey assistant, the terminal, the Mikey sprite and the 3D viewer load only when opened or when the browser is idle |
| Works without JS | Every window is a real page at a real URL. With JS off you get readable, linked pages in the same paper style |
| Accessibility | WCAG 2.2 AA. Windows can be opened, focused, moved (arrow keys), closed (Esc) and cycled with the keyboard. Screen-reader landmarks. `prefers-reduced-motion` turns off all motion |
| SEO / sharing | Every page has a title, description, canonical URL and its own Open Graph image. Also JSON-LD `Person` + `ProfilePage`, sitemap.xml, robots.txt and llms.txt |
| Recognition | Good enough to submit to Awwwards, CSS Design Awards, godly.website, siteinspire and One Page Love |

## 3. Goals, non-goals, anti-goals

**Goals**
- Excitement within the first second, without making anyone wait.
- His current title and proof of work visible on the first screen, on every device.
- A signature feature people remember him by (Mikey on the desktop, §6).
- Real case studies, not tag clouds.
- An assistant that feels alive (Mikey, §7), but is optional: it is never the only way to reach content.

**Non-goals**
- A blog engine or CMS. Writing lives as plain Markdown files in the repo.
- Any backend. Phase 1 and Phase 2 are fully static; a live model is Phase 3 and William's call (§7).
- 3D or WebGL as the main experience.

**Anti-goals: if any of these happen, the redesign has failed even if it technically works**
- A preloader, intro sequence or anything that blocks content.
- Scroll-jacking, or letters split into separate elements in headings (hostile to screen readers).
- Skill clouds, fake counters, "years of experience" widgets.
- Windows that trap keyboard focus, or a desktop that's unusable on a phone.
- Anything that reveals confidential information about his employer's client (§9).

## 4. The look, as William chose it

The site is **WilliamOS**, a small desktop operating system that runs in the browser. Two mockups led to it:
- From the four first directions, he picked **Editorial** and **WilliamOS**.
- From three hybrids, he picked **Front Page OS** and **Ink OS**.
- The final call: Ink OS windows on the Sunset wallpaper.

| Element | Spec |
|---|---|
| Wallpaper (default) | **Sunset**: soft radial gradient, `#ffd9a8 → #f59e7b → #7b5cc4 → #2d2a6e`, a very slow drift (on hold under reduced motion) |
| Wallpaper switch | Three dots in the menu bar: **Sunset**, **Paper** (`#ece4d6` with a faint dot grid) and **Night** (`#100e0b`, with ink and paper inverted and copper `#c97b4a` shadows). Night also serves as dark mode and follows `prefers-color-scheme` the first time. The choice is remembered in localStorage |
| Windows | Cream paper `#f6f1e7`, 1.5 px ink border `#141210`, radius 4 px, **hard offset shadow** 6 px 6 px of solid ink, no blur. The title bar has ruled lines and a serif title centred on a paper patch. The close control is a square ink box |
| Type | **Fraunces** (masthead, headings, window titles, body of stories); **Inter Tight** (UI, kickers, metadata in small caps with letter-spacing); **Special Elite** (terminal, input placeholders). Self-hosted and subset |
| Accent | Newsprint red `#b3261e` for kickers, links and the terminal prompt. Copper `#c97b4a` belongs to Mikey |
| Menu bar | Paper strip with an ink rule: `WilliamOS · File · Edition · Apps`, then on the right **live Ottawa time** and `Vol. N · Ottawa · <today's date>` |
| Dock | A paper tray with an ink border and hard shadow. App icons are ink-outlined tiles. Open apps get a dot |
| Icons | Line-drawn ink icons in one consistent set. No emoji in production (the mockups used emoji as placeholders) |

The mockups are reference only, not pixel specs. They are in the brainstorm session folder: `directions-v4.html`, `hybrids-v3.html` and `wallpapers.html`.

## 5. The first three seconds

1. **0 ms, from HTML and CSS alone:**
   - the wallpaper, the menu bar and the **Front Page** window are already painted, fully readable, with no JS;
   - this is the LCP element.
2. **≈100–900 ms, once JS has loaded:**
   - the Front Page "prints". A press-roller wipe runs across it, and today's date stamps into the masthead with a small ink-stamp scale.
   - **Mikey** pops up from behind the dock, blinks, looks at the cursor and says one line in a speech bubble ("Hi, I'm Mikey. Ask me about William."), with four question chips under it.
   - Total choreography: ≤ 900 ms. Nothing waits on it: content is clickable from 0 ms.
3. **Under reduced motion:** everything is simply there.

Default desktop state on arrival: Front Page open and focused, Mikey on the dock edge with his greeting bubble showing. Desktop icons on the side: Front Page, Projects, Mikey, Résumé, Terminal, Contact.

## 6. Apps (windows), each also a real page

**Architecture rule:** every app is a real route rendered to static HTML. The OS shell is progressive enhancement:
- it intercepts internal navigation and opens the route as a window, using the View Transitions API where available;
- the address bar always shows the window's URL, so every window can be deep-linked and shared.

| App | Route | Content |
|---|---|---|
| **Front Page** | `/` | The newspaper. Masthead "The William", the date line, and a lead story about the current work (Business Systems Analyst, The Kara Consultancy). A **Now** box with title, employer and since-date. "In this issue" lists projects, linking to their windows. A short "Opinion" teaser: the AgentAuth argument from his own LinkedIn post of 2026-05-21 (*"A prompt is a suggestion, not a constraint."*). The post is reused in his own words, with a link to it |
| **Projects** | `/projects` and `/projects/<slug>` | A folder window of case studies. Each one: the problem → what I built → result → stack → links. It opens in its own window and reads like a feature article (Fraunces body, pull quotes, figures) |
| **Ask Mikey** | `/ask` | Chat window with Mikey, the site's assistant. See §7 |
| **Mikey** | `/mikey` | The real robot's build log and status, and an interactive 3D view of the owl body. The existing three.js viewer in `~/Code/products/Mikey/body/preview.py` produces the model; reuse its STL/GLB, lazy-loaded |
| **Résumé** | `/resume` | An HTML résumé (print stylesheet gives a clean one- or two-page PDF), plus a download of the generated PDF |
| **Terminal** | `/terminal` (JS only; without JS it links to the other pages) | Real commands: `help`, `whoami`, `ls`, `cd`, `open <app>`, `cat resume`, `contact`, `ask "<question>"` (routes to Ask Mikey), `theme sunset\|paper\|night`, `mikey` and a few easter eggs. Autocomplete with Tab. Command history |
| **Now** | `/now` | A dated "what I'm doing now" page. Updated by hand in a Markdown file |
| **Back Issues** | `/back-issues` | Earlier versions of the site shown as **captioned screenshots, not live builds**: the 2025 "Accidental Therapist" site and the 2026 "cinematic" site. The old builds expose his phone number, load analytics without consent, name a vendor and call `localhost`, so they are not republished. Fits the newspaper idea and shows growth |
| **Contact** | `/contact` | Email (mailto), LinkedIn and GitHub, plus local time in Ottawa. No form, no backend |

**Mikey, the signature.** A small animated ink-and-copper owl (SVG/CSS sprite, not 3D) lives on the desktop:
- it perches on window edges and on the dock;
- its eyes follow the cursor;
- if left alone it naps;
- it reacts when a window is dragged near it.

Mikey is also the site's assistant: clicking him opens his speech bubble with the question chips, and "Ask me anything" opens the **Ask Mikey** window. A double-click shows a random fact. It's the "recognized by" detail, and it ties straight to the real robot he's building. Under reduced motion it sits still. It never covers content and never moves on its own while someone is typing.

**Phones (< 768 px):** no free-floating windows.
- The menu bar becomes a compact top strip and the dock becomes a bottom tab bar.
- Each app opens as a full-screen "page" in the same paper style, with a back gesture.
- The Front Page is the home screen. Mikey sits in the tab bar.
- There is still no horizontal scroll.

**Recruiter fast path:** a menu bar item **"Read the paper"** (and `?read`) collapses the OS into one plain, scrolling, print-friendly article: Front Page → selected projects → résumé → contact.

## 7. Ask Mikey: the assistant

William shelved NERVE on 2026-10-19 (and in August said *"stop with nerve we dont want it back"*). On 2026-10-19 he chose **Mikey as the site's assistant** instead. The NERVE name doesn't appear on the new site, except as a past project clipping.

- **Optional, never the only route to anything.**
- **Opening state:** Mikey's speech bubble with one greeting and four chips: *What does he do now? · Show me his best project · What are you? · How do I contact him?*
- **It drives the OS.** When an answer involves a project, it offers a button that opens that window. This is the "assistant that operates the site" idea, used by ryOS.
- **Engine at launch: scripted, fully static.**
  - It uses intent matching over a curated public knowledge file in the repo (`content/assistant/knowledge.md`, compiled at build time). It holds the same facts as the site.
  - There is no backend, no API key and no cost.
  - When it doesn't know, Mikey says so in character and offers the Contact window.
  - Nothing from William's private vault, his personal logs or work records goes in.
- **Voice:** short and friendly, a little owlish. It never invents facts.
- **On open-to-work questions** (William's call, 2026-10-19), the site says **nothing about new roles**. The answer is the current role, plus *"open to freelance and collaborations"*.
- **Phase 3 (optional, William's call):**
  - a live model (Claude) behind the same window, through a small proxy on a second host;
  - it needs his account, an API key he creates, a hard spending cap, rate limits and a privacy note;
  - the scripted engine stays as the fallback.
  - This mirrors the real Mikey robot getting its Claude brain.

## 8. Technical approach (builder's freedom inside these walls)

- **Framework:** Astro (static output) with TypeScript. Interactive pieces are islands: the shell/window manager, Ask Mikey, the terminal and the Mikey sprite.
  - The island framework is the builder's call. React is fine because William knows it; Preact or Solid if it saves bytes.
  - Content is Markdown/MDX in content collections.
- **Hosting:** stays on GitHub Pages under `williamdev.is-a.dev`, using the existing CNAME and the existing Actions deploy workflow, adapted to Astro's `dist/`.
  - Work happens on branch `williamos`.
  - `main` keeps serving the current site until William approves the launch.
- **His uncommitted edits** in `~/Code/web/portfolio/portolio/portfolio-1` are left untouched.
- **Review before launch:**
  - local preview, plus CI on the `williamos` branch (build, Lighthouse CI, axe, links) against a local server;
  - no public preview host and no new accounts;
  - launch means merging into `main`, and only on William's word.
- **Phases:**
  1. **Phase 1, launchable on its own:** the shell, the three wallpapers, Front Page, Projects (with case studies), Résumé, Contact, "Read the paper", the Mikey sprite, and every item in §2.
  2. **Phase 2:** the Terminal, the Mikey 3D viewer, Now and Back Issues.
  3. **Phase 3, optional:** a live model behind the assistant (§7).
- **Images:** AVIF/WebP with `srcset`, explicit width/height, lazy below the fold. The existing assets in `public/images/` can be reused: headshot, Wyngaarden screenshots.
- **Analytics:** keep the existing GA4 property `G-3SK3ZCW6JM`, so the history carries over.
  - Load it with gtag (no GTM container exists), using Consent Mode v2 with **default denied**.
  - It loads on idle, so it costs nothing at load.
  - GitHub Pages can't tell where a visitor is, so a small consent "clipping" is shown to **everyone** once. That covers Quebec's Law 25 and the GDPR. The choice is remembered.
- **Quality gates in CI:**
  - Lighthouse CI against the §2 budgets;
  - an axe accessibility check;
  - an HTML validity check;
  - a link checker.

  A failing budget fails the build.

## 9. Content and confidentiality rules

- **Employer work** is described at architecture and approach level only, as "a North American tire distributor", the wording already public on his LinkedIn.
  - No client, supplier or customer names.
  - No prices, volumes, revenue or margins.
  - No screenshots of client systems or data.

  His employment agreement (§3, confidentiality, five years) applies.
  - **The POS vendor isn't named** on the new site. Naming the POS, ERPNext, Walmart and the tire trade together narrows down who the client is.
  - **Results are qualitative** ("orders no longer retyped by hand") unless William supplies a figure he has cleared.
  - **The copy is drafted** from his public LinkedIn wording only, never from work records, and William approves it before it goes live. (William, 2026-10-19: "Yes, draft it".)
- **Never on the site:** his phone number, home address or immigration details.
- **Sources for the other copy:** his public LinkedIn; the Mikey repo docs (`~/Code/products/Mikey/docs/`); the wiki product pages (`wiki/products/`).
  - Never health records, personal logs or anything under `work/`.
  - Every piece of copy is shown to William before it is published.
- **Titles and dates match his LinkedIn and contract:**
  - **Business Systems Analyst, The Kara Consultancy, Sep 2026 – Present**;
  - Manager of Sales (part-time), WirelessPlus, Sep 2025 – Present;
  - AI Intern, Square Root Technologies, Mar–May 2025;
  - Shift Lead, Booster Juice, Mar 2024 – Dec 2025;
  - Social Media Manager, Brazily Fitness, Mar–Jun 2024;
  - Interactive Media Design, Algonquin College, graduated 2026.
- **Project list (my call):**
  - Full case studies: POS ↔ ERP ↔ marketplace integration, Mikey, Wyngaarden Pastries (client team project at Algonquin).
  - Short "clippings": AgentAuth (his LinkedIn post of 2026-05-21), NERVE (2025 portfolio chatbot, retired), GA4/GTM/Looker analytics work, DreamSynth (in Back Issues as an earlier experiment).
  - Beast Mode (the trading bot) is left out.

## 10. Launch and recognition (after William approves the build)

1. A final pass against §2.
2. Switch `main` to the new build. Capture the old site's screenshots for `/back-issues/` before it goes.
3. Submit to godly.website, siteinspire, One Page Love and CSS Design Awards (free). Awwwards charges a fee, so that's his call.
4. A LinkedIn post. That's an outward action: drafted, shown, and sent only on his word.

## 11. Decided, and by whom

- **William:**
  - Editorial + WilliamOS, as Ink OS windows on the Sunset default with a switchable wallpaper;
  - best practices, immediate excitement, recognisability, high ratings;
  - current job and title shown accurately (already live on the current site since 2026-10-19);
  - Mikey replaces NERVE as the site's assistant, scripted at launch;
  - the site says nothing about new roles; it shows the current role plus "open to freelance and collaborations";
  - the employer case study gets drafted from his public LinkedIn wording, and he approves it before it goes live.
- **Claude's calls, which William can veto:**
  - every target in §2;
  - Astro on GitHub Pages;
  - every window is a real page;
  - Mikey as the signature;
  - the "Read the paper" fast path;
  - Back Issues;
  - the project list in §9;
  - GA4 with consent loaded on idle;
  - no contact form.
- **Left to the builder:**
  - the island framework;
  - the window-manager internals;
  - animation library (or none);
  - the icon set (in the ink style);
  - exact copy (drafts get shown to William);
  - the case-study page layout inside the editorial style;
  - the test setup.

## 12. Open questions for William

None open. The builder check (2026-10-19) raised seven questions. Three were William's to answer, and he answered them (§7, §9, §11). The other four were settled here as Claude's calls:
- the sources for the copy and its confidentiality limits (§9);
- Back Issues shown as screenshots (§6);
- review done locally and in CI, with launch on his word, in phases (§8);
- analytics on the existing GA4 property, with a consent prompt shown to everyone (§8).

For later, and his call: Phase 3's live model; whether to pay the Awwwards fee.
