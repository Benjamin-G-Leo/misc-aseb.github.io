# Microsoft Ignite Students Club (MISC) Website

Website of the **Microsoft Ignite Students Club**, Amrita Vishwa Vidyapeetham, Bengaluru.

**Live site:** https://ignitestudents.club/ (also reachable at https://misc-aseb.github.io/)
**Repository:** https://github.com/MISC-ASEB/misc-aseb.github.io

---

## 1. How the website works

It is a **single-page site** built with React 18 and Vite 6. There is no backend and no database. Everything is static files that are built once and served from GitHub Pages.

### Page flow

`src/main.jsx` mounts `<App />`. `src/App.jsx` stacks the sections in this order:

| Order | Section | File | What it shows |
|---|---|---|---|
| 1 | Header | `Header.jsx` | Floating navigation pill, scroll-progress bar, light/dark toggle |
| 2 | Hero | `Hero.jsx` | Big headline and a moving strip of event photos |
| 3 | Statement | `Statement.jsx` | Club manifesto that fills in word by word on scroll |
| 4 | About | `About.jsx` | Bento grid of cards with live stats (events, members, teams) |
| 5 | Features | `Features.jsx` | "What we do": pinned scroll section with tabs and a deck of photo cards (a simple list on phones) |
| 6 | Team | `Team.jsx` | Members grouped by team, with photo, role and social links |
| 7 | Past events | `PastEvents.jsx` | Horizontal scrolling gallery of past events |
| 8 | Upcoming events | `UpcomingEvents.jsx` | Poster cards for upcoming events |
| 9 | Join CTA | `JoinCta.jsx` | Two rows of the tagline "Ignite / Innovate / Elevate" (sized to always fit the screen), a headline and social buttons |
| 10 | Footer | `Footer.jsx` | Map, links, socials, large wordmark |

`ScrollToTop.jsx` (floating button) sits on top of the page. The mouse cursor is the normal system cursor.

### Data-driven content

Text-heavy lists are not hard-coded in the components. They come from files in `src/assets/`:

- **Team page** reads `teams.json`. Each key is a group, shown in file order (Core, Projects, Codes, Events, Outreach, Design). Leads are listed first in their own group.
- **Past and upcoming events and the Hero photo strip** read `events.json`.
- **Features ("What we do")** has its own list at the top of `Features.jsx` (titles, text and which `public/events/` photo each card uses). Edit it there.
- **About stats** (number of members, teams, events) are counted from those same files, so they update automatically.
- **Social links** (Instagram, LinkedIn, YouTube, Facebook, email) come from `socials.js` and are shared by the CTA band and the footer.

### Look and feel

All of this lives in `src/index.css` unless noted.

- **Themes.** Tailwind CSS 3 with a class-based dark mode. The visitor's choice is saved in `localStorage` under `theme`.
  - **Light mode:** warm off-white beige page (`#f4efe6`) with warm white cards.
  - **Dark mode:** charcoal black page (`#141414`) with neutral grey cards.
  - The dark colours are two variables, `--misc-darker` (the page) and `--misc-night` (the always-dark bands such as Past Events, What We Do, the tagline section and the footer; navy in light mode, near-black in dark mode). Change those two numbers to shift the whole dark theme.
- **Brand colours** (`misc-blue`, `misc-purple` and others) are in `tailwind.config.js`.
- **Scroll-driven gradient text.** Words with the class `text-gradient` use a looping blue-to-purple gradient that slides right to left as the page scrolls. `App.jsx` writes the scroll distance into the CSS variable `--scroll-y`, and `.text-gradient` shifts its background by `-0.4px` for every pixel scrolled. Change that number to speed it up or slow it down.
- **Animated section backgrounds.** `ui/SectionBackdrop.jsx` adds drifting colour glows, a circuit-board line that grows and lights up as you scroll (with side branches, glowing nodes and a bright head), and a faint grain texture. It is used by Statement, About, Team and Upcoming Events.
  - The parent `<section>` needs the classes `relative isolate`, and `<SectionBackdrop />` must be its first child. It sits behind the content, ignores the mouse and clips itself.
  - The art repeats in tiles, and the number of tiles is measured from the section, so tall sections (Team) look the same as short ones.
  - **Keep-clear zones:** put the attribute `data-clear-backdrop` on any element (the outlined Team titles do) and the backdrop fades out of the area behind it, so no node, line or glow sits behind that text.
  - On phones the glows are smaller and sparser, and the circuit is fainter and has no side branches, so it does not cut across the text.
- **Hollow (outlined) text.** The class `text-outline` draws outlined letters: a stroke that scales with the font size, slightly extra letter-spacing and a fill set by the variable `--outline-fill`. On sections with a backdrop the fill is set to the exact page colour so nothing shows through the letters (see `Team.jsx`, `Hero.jsx`, `JoinCta.jsx`).
- **Fonts** (Inter and Archivo) are self-hosted through `@fontsource-variable`, so the page makes no font requests to other sites.
- **Motion.** Animation uses `framer-motion`. Visitors who prefer reduced motion get the static gradient, a fully drawn circuit and no drifting glows.

### Image paths (important)

The site is served from the root of its address, and the base path is set in `vite.config.js` (`base: "/"`). Image paths in code are still built with `import.meta.env.BASE_URL`, for example `` `${import.meta.env.BASE_URL}events/${name}` ``, so everything keeps working if the base path ever changes. Do not write plain `/events/...` paths in code.

---

## 2. Folder guide

```
misc-aseb.github.io/
├── .github/workflows/deploy.yml   Deploys the site to GitHub Pages on every push to main
├── .idx/                          Settings for Google's Project IDX online editor
├── public/                        Files copied as-is into the built site
│   ├── events/                    Event photos and posters
│   ├── teams/                     Member photos (cropped to a portrait, see section 3)
│   └── logo.png                   Club logo (header, hero, footer, browser tab icon)
├── src/                           All application source code
│   ├── assets/                    Data files that drive the content
│   │   ├── events.json            Past and upcoming events
│   │   ├── teams.json             Team members
│   │   └── socials.js             Club social links
│   ├── components/                One file per page section
│   │   └── ui/                    Small reusable effects and building blocks
│   ├── App.jsx                    Page layout, dark-mode state, scroll variable
│   ├── main.jsx                   Entry point, loads fonts and CSS
│   └── index.css                  Themes, buttons, gradient and outline text, backgrounds
├── index.html                     HTML shell: title, meta tags, favicon
├── package.json                   Scripts and dependencies
├── vite.config.js                 Build config, including the base path ("/")
├── tailwind.config.js             Brand colours, fonts, animations
├── postcss.config.js              PostCSS plugins used by Tailwind
├── eslint.config.js               Lint rules
├── firebase.json, .firebaserc     Firebase hosting config (not used by the current deploy)
└── misc-redesign.patch            Old patch file from the redesign, kept for reference
```

Folders created locally that are **not** committed: `node_modules/` (installed packages) and `dist/` (build output). `graphify-out/` (an optional code knowledge graph) may also exist locally.

### `src/components/ui/` building blocks

| File | Purpose |
|---|---|
| `Counter.jsx` | Number that counts up when scrolled into view |
| `EventDialog.jsx` | Full-screen viewer for a past event: photo carousel (arrows, thumbnails, keyboard) and the full write-up. Closes with Escape or a click outside |
| `FadeUp.jsx` | Fade and rise on scroll |
| `Magnetic.jsx` | Wrapper that pulls a button slightly toward the cursor |
| `Marquee.jsx` | Seamless endless horizontal scroller (used by the hero photo strip) |
| `RevealText.jsx` | Headline whose words slide up one by one; passes extra props such as `data-clear-backdrop` to the heading |
| `SectionBackdrop.jsx` | Animated section background: glows, flowing circuit, grain |
| `SectionHeading.jsx` | Eyebrow label, large headline and subtitle used by most sections |
| `SpotlightCard.jsx` | Plain card surface |
| `TiltCard.jsx` | Card that tilts in 3D with the cursor |

---

## 3. Everyday tasks

### Run it locally

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173/).

### Build and check

```bash
npm run build     # production build into dist/
npm run preview   # serve the build locally
npm run lint      # check code style
```

### Update the team

1. Prepare each new photo (see "Photo tips" below) and put it in `public/teams/`.
2. Edit `src/assets/teams.json`. The file is an object whose keys are groups. Each group is a list of members:

   ```json
   {
     "name": "Full Name",
     "role": "Member",
     "team": "Events",
     "id": "BL.SC.U4AIE00000",
     "image": "teams/photo-file-name.jpg",
     "social": {
       "linkedin": "https://www.linkedin.com/in/...",
       "github": "https://github.com/..."
     }
   }
   ```

3. **Roles.** The Core group holds only the office bearers: `President`, `Vice President` and `Treasurer`. Each team lead sits at the top of their own team group with the role `Lead | <team>` (for example `Lead | Projects` first in the Projects group). Everyone else has the role `Member` in their team group.
4. `image` is relative to `public/`. Links must start with `https://` (use the plain profile address, without tracking text such as `?utm_...`). The `social` keys the site understands are `instagram`, `facebook`, `github`, `linkedin`, `whatsapp` (all links) and `email`. `email` is an **email address, not a link**: it shows a Gmail icon and an Outlook icon that each open a new message to that address (in the browser on a laptop, in the Gmail or Outlook app on a phone). A missing key simply hides that icon.
5. **No photo yet?** Leave `image` as an empty string `""` and the card shows the member's initials on a brand-coloured background. `id` is optional.
6. Keep the club's private member sheet up to date too. It is **not stored in this public repository** (see section 5).

### Photo tips

- Use a **JPG or PNG**. A PDF will not display.
- The Team card is a **portrait, 4:5**, and the photo is anchored at the top and centred sideways. Crop the file itself so that the face is in the middle and the head sits near the top (about a tenth of the way down), with shoulders in view. A landscape photo will otherwise be cut off at the sides.
- Keep the head a similar size to the others in the same row.
- Keep each file small: about 1400 px on the long side and under roughly 500 KB (save as a JPG at quality ~80). Phone cameras produce 3 to 5 MB photos, which slow the page down a lot.
- Anything inside `public/` is published and can be opened by anyone who knows its address, so do not put photos of people who are not on the site anywhere in this repository (the `unused-photos/` folder is git-ignored for that reason).
- When you replace a photo, **save it under a new file name** (for example add `_v2`). Browsers keep old images for about 10 minutes, and a new name avoids anyone seeing the old picture.
- Delete the old file and update `teams.json`.

### Add an event

1. Put the poster or photo in `public/events/`.
2. Add an entry to `past_events` or `upcoming_events` in `src/assets/events.json`. Upcoming events also take `date`, `description` and `event_url`.
3. A past event is a simple card by default (`image`, `title`, `description`). Add these optional fields to make the card clickable and open the photo viewer (`EventDialog`):
   - `images`: list of photo file names in `public/events/` (the first one is the cover)
   - `details`: list of paragraphs, shown in full in the viewer
   - `subtitle`: a second line under the title
   - `date`: shown on the card and in the viewer, for example `"6 October 2026"`
   - `image_position`: where to focus the cover photo inside the card, for example `"64% 50%"` (horizontal, vertical)

   See the "Beyond Brute Force" entry for an example.
4. Photos taken with a "GPS Map Camera" style app have a location stamp (address and coordinates) across the bottom. Crop it off before adding the photo, because everything in `public/` is published.

### Change social links

Edit `src/assets/socials.js`. The club email address is `CLUB_EMAIL` at the top of that file. It appears in the footer and in the "Ready to ignite" buttons as three icons: **Gmail** and **Outlook** (both open a new message in the browser, or in the phone app if installed) and **Email app** (a plain `mailto:` link for people who use Apple Mail or another desktop app). A plain `mailto:` link alone does nothing on a laptop with no mail app set up, which is why the web options are there.

### Add a decorative backdrop to another section

Give the section `relative isolate`, import `SectionBackdrop` from `./ui/SectionBackdrop` and render `<SectionBackdrop />` as its first child. Add `flip` to start the glow layout on the other side. Add `data-clear-backdrop` to any heading that should have nothing behind it.

---

## 4. Deployment

- Hosting is **GitHub Pages**, set to build from **GitHub Actions** in the repo's Settings, Pages.
- Every push to `main` runs `.github/workflows/deploy.yml`, which does `npm ci`, `npm run build`, then publishes `dist/`. It normally takes about a minute.
- Progress and errors are on the repo's **Actions** tab.
- The site address is `https://ignitestudents.club/` (the same site is also at `https://misc-aseb.github.io/`, which redirects to it).

### Custom domain

The custom domain `ignitestudents.club` is already set up. It is configured in the repository's **Settings, Pages** (the DNS records point at GitHub Pages), not through a `CNAME` file, because the site is deployed with GitHub Actions. Do not remove the domain in those settings, and do not change `base` in `vite.config.js` away from `"/"`.

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| Deploy fails at "Get Pages site failed" | Pages is not enabled. Set Source to GitHub Actions in repo Settings, Pages |
| Page loads blank or images are missing | Asset path missing `import.meta.env.BASE_URL`, or `base` in `vite.config.js` does not match the URL |
| A member shows a grey avatar | The photo file name in `teams.json` does not match the file in `public/teams/` (names are case sensitive) |
| A member shows only initials | `image` is empty in `teams.json` |
| A photo is off-centre or cut off | Crop the file itself (see "Photo tips"); CSS cannot move a face that is near the edge of the picture |
| An updated photo still shows the old picture | Browser cache. Do a hard refresh (Cmd+Shift+R) or save the photo under a new file name |
| A social icon opens a 404 | The link is missing `https://` |
| Text is hard to read over a section background | Add `data-clear-backdrop` to that heading, or lower the colours in `SectionBackdrop.jsx` |

---

## 5. Privacy note

This repository is **public**. Files with personal data are therefore kept out of it on purpose and must not be added:

- the member sheet with **dates of birth** and college emails,
- the member roster spreadsheet,
- photos of people who are not on the team page (`unused-photos/`),
- internal status and change reports.

`.gitignore` blocks the first and third of these. Keep them in a private place instead (for example a private repository or a shared drive with named people). Photos and details that appear on the team page are public, so only add a member after they have agreed.
