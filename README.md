# Armoury Group | Easy Fit range mockup

Prepared by Digilari Media, September 2026. Implements the four approved items on top of
the real armourygroup.com.au page source.

**Open `index.html` in a browser and click through from there.** Everything works from
`file://`, no server needed, and identically from GitHub Pages.

> **This site must never be indexed.** It reproduces large parts of armourygroup.com.au, so an
> indexed copy would compete with the client's own site for their own terms. Every page carries
> `noindex, nofollow`, `robots.txt` disallows everything, and CI fails the build if any page loses
> its noindex tag. The robots values each page should carry in *production* are recorded separately
> as `ef-production-robots` and documented in the build-notes document.

---

## Deployment

Hosted on GitHub Pages from
[`Lilmonstersam/armoury-stainless-easy-to-fit`](https://github.com/Lilmonstersam/armoury-stainless-easy-to-fit).

Pushing to `main` runs `.github/workflows/deploy.yml`, which:

1. **Verifies**: resolves every local link and asset across the six pages
   (`tools/check-links.py`), then fails the build if any HTML page is missing its `noindex` tag.
2. **Deploys**: uploads the repository as-is and publishes it to Pages.

There is no build step in CI. The HTML in the repo is what gets served, so what you see locally is
exactly what the client sees.

### One-time setup on GitHub

In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**. Nothing
else is needed; the workflow supplies its own permissions.

### First push

```bash
cd easy-fit-mockup
git init -b main
git remote add origin https://github.com/Lilmonstersam/armoury-stainless-easy-to-fit.git
git add .
git commit -m "Armoury Easy Fit mockup"
git push -u origin main
```

The repo is roughly 106 MB across 690 files, almost all of it the saved production imagery. That is
well inside GitHub's limits (100 MB per file, 1 GB soft repo limit), but the first push will take a
few minutes. If it ever needs slimming, the four largest files are unoptimised source photos of
5-8 MB each in `accessories/AG - Accessories_files/` and
`products/aircleaner-panels/AG - Air Cleaner Panels_files/`.

### Running the checks locally

```bash
python3 tools/check-links.py
```

---

## Routes

| # | Path | Source | What it shows |
|---|---|---|---|
| 1 | `accessories/index.html` | Live page source | Easy Fit filter + badges + promo strip |
| 2 | `vehicle/kenworth-k200/index.html` | Live page source | Same filter + badges on a model page |
| 3 | `products/aircleaner-panels/index.html` | Live page source | Badge above H1 + Fitting panel |
| 4 | `accessories/easy-fit/index.html` | New, built in the real shell | Curated landing page, 22 products |
| 5 | `dealers/easy-fit-range/index.html` | New, built in the real shell | Dealer collateral, `noindex, follow` |

All five are reachable from page 1 via the promo strip and the route index.

**The site's own header, mega menu, footer and button styling are used throughout.** The two new
pages lift the production `<head>`, the real Elementor header and the real footer verbatim from the
saved K200 page, so nothing about the navigation is an approximation. The primary menu is left
untouched on every page: in production, "Easy Fit" would be added to it as a normal menu item.

Buttons follow the site's global kit style (transparent, white text, 2px orange bottom border,
no side padding). Page backgrounds are the site's black and near-black, not white.

Section gutters use the theme's own `10.5vw` left and right padding (the value the Elementor kit
sets on its containers), so every injected section lines up with the rest of the site and stays
clear of the fixed social rail down the left edge.

**Injected sections are plain semantic markup, not Elementor containers.** Elementor's `.e-con`
layout is driven by per-element custom properties (`--display`, `--padding-left`, and so on) that
only exist for containers the editor generated. Hand-written markup wearing those classes resolves
`display: var(--display)` to an invalid value, which computes to `display: inline` and collapses the
layout. Only `.elementor-button` is borrowed, so CTAs inherit the site's own button style.

---

## Approved items, and where each one lands

### 1. Easy Fit as a product filter

Implemented as a **product attribute**, not a truck type. A single boolean on each product,
surfaced as:

- a sticky filter bar above the grids on `/accessories/` and `/vehicle/kenworth-k200/`
- an orange badge on every qualifying product card, in every truck-model section
- `?fit=easy` written to the URL, matching how the production facet would behave

On `/accessories/` this tags 210 product listings, 111 of which are Easy Fit. Nothing is
duplicated and nothing moves out of the truck-model section it already sits in. Sections with
no Easy Fit products collapse when the filter is on.

**Not applied to `/products/aircleaner-panels/`, deliberately.** That page lists part-number
variants, not product categories, so there is nothing for a filter to act on. The badge and the
Fitting panel go there instead.

**Crawl control for production** (not visible in a static mockup, but required):

- filter state must be a query parameter (`?fit=easy`), never a path segment
- `rel=canonical` on every filtered view points at the unfiltered parent
- multi-facet combinations get `noindex, follow`
- filter URLs stay out of the XML sitemap

### 2. Curated landing page at `/accessories/easy-fit/`

- URL is under `/accessories/`, **not** `/vehicle/`. The path segment signals "a view of
  accessories", not a truck model, so it does not compete with the `/vehicle/` pages that
  already rank.
- Hero gallery carousel of the accessories installed on real trucks, alongside the headline copy.
- The range is a **product grid in the same layout as every other category page**, with the fitting
  detail (time, drilling, tools, in the box, fits) added to each card.
- How-it-works section, six-question FAQ.
- `ItemList` and `FAQPage` JSON-LD in the head.
- Title tag targets the stainless/chrome cluster, which nothing on the site currently owns.
  "Easy fit" itself has no AU search volume, so it is the positioning, not the ranking target.

### 3. Badge and fitting section on product pages

`/products/aircleaner-panels/` gets an Easy Fit badge above the H1 and a Fitting panel placed
before the spec tabs, showing fitting time, drilling, tools required and box contents.

Two template fixes were made on this page at the same time:

- **Breadcrumbs added.** The production product template has none, which is both a usability and
  an SEO gap. `BreadcrumbList` schema goes with them.
- **Product Specs restructured.** Production puts the whole section in a half-width Elementor
  column, so the variants table (which needs roughly 820px) scrolled sideways and the project photos
  sat in a cramped static grid underneath. The page now runs:

  1. H1 and product renders (production, untouched)
  2. Project photos as a full-width horizontal carousel, no heading, scroll-snapped three across
     with arrow navigation
  3. **Product Specs**, two columns side by side: the description, Key Advantages and Installation
     on the left, the "Sizes, part numbers and models" variants table and View quote on the right,
     so the whole product reads in one screen
  4. The Easy Fit fitting panel, closing the section

Both should be applied to every product page, not just this one.

This is the highest-leverage item in the whole plan. Thirteen product pages already rank for
roughly 1,300 searches a month between them and none of them currently says anything about
fitting. The same panel should go on all of them.

### 4. Dealer page at `/dealers/easy-fit-range/`

Set to `noindex, follow`, linked from the dealer navigation only. Counter proposition, best
counter lines, and how to sell it. The reseller message has no organic demand in Australia, so
this page exists for email, the counter-display QR code and dealer onboarding, not for search.

---

## Internal notes

All build notes, decisions, placeholder-data warnings and sign-off items have been moved out of the
pages and into **`../Armoury-Easy-Fit-Build-Notes.docx`**, one level up in the `mockups` folder.
That is the document to send to Armoury. The mockup pages themselves are now clean and can be shown
to the client as-is.

---

## What is real and what is placeholder

**Real:** all page markup, the Elementor structure, product categories, truck models, and the
URL architecture. Pages 1 to 3 are unmodified production source with the Easy Fit layer added
on top.

**Placeholder, for Armoury to confirm:** which products carry the Easy Fit flag, and every
fitting time, tool list and box contents. All of it lives in one file,
`assets/easy-fit-data.js`, which drives the badges, the filter, the fitting panel and the
landing-page cards simultaneously, so the numbers can never disagree with each other.

One content correction was made: the saved snapshot of the K200 page had captured the Mack
product listing in its "Our Range" grid rather than the K200 one. It was replaced with the real
K200 categories so the filter demo makes sense on that page.

---

## Files

```
.github/workflows/deploy.yml   Verify + deploy to GitHub Pages on push to main.
.nojekyll                      Stops Pages running Jekyll, which would drop the
                               "*_files" asset folders.
robots.txt                     Disallow all. This mockup must not be indexed.
404.html                       Branded not-found page, links back to the routes.
tools/check-links.py           Link and asset checker. Runs locally and in CI.

index.html                     Start here. Route index.
accessories/index.html         Page 1 (modified production source)
accessories/easy-fit/          Page 4 (new)
vehicle/kenworth-k200/         Page 2 (modified production source)
products/aircleaner-panels/    Page 3 (modified production source)
dealers/easy-fit-range/        Page 5 (new)
assets/easy-fit-data.js        THE dataset. Edit fitting times and flags here only.
assets/easy-fit.css            All Easy Fit styling, using the live theme's brand tokens.
assets/easy-fit.js             Filter, badges, fitting panel, breadcrumbs, Product Specs
                               restructure, hero and project-photo carousels.
build-mockup.py                Re-applies the Easy Fit layer to the three production pages.
build-newpages.py              Regenerates the route index, the landing page and the dealer
                               page, each inside the real site shell, from the dataset.
```

To change the data and rebuild:

```bash
# edit assets/easy-fit-data.js, then
python3 build-newpages.py
```

`build-mockup.py` only needs re-running if the production page source is re-saved. It is
idempotent.

---

## Handover notes for the developer

- The attribute should be rendered server-side as a data attribute on each loop item
  (`data-ef="1"`), not matched from the URL slug the way this mockup does it.
- The filter should be a real WooCommerce/Elementor facet reading `?fit=easy`, with the crawl
  controls listed above.
- Add `Product` schema with `additionalProperty` carrying
  `Installation: Bolt-on, no drilling required` on every Easy Fit product page.
- Track filter usage as a GA4 event (`filter_easy_fit`) so the demand assumption can be proved
  or disproved within 90 days.
