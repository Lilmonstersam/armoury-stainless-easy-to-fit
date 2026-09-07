/* Armoury Easy Fit - build notes & sign-off document
   Run from the sandbox:  node build-notes-docx.js
   Requires easyfit.json (product data extracted from assets/easy-fit-data.js). */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  LevelFormat, PageBreak, Footer, PageNumber,
} = require("docx");

const EASY = JSON.parse(fs.readFileSync(process.env.EF_JSON || "/tmp/efdoc/easyfit.json", "utf8"));

const ORANGE = "F58220";
const INK = "262626";
const GREY = "6B6B6B";
const LINE = "D8D8D8";
const HEADBG = "1A1A1A";
const CONTENT_W = 9360; // Letter 12240 - 2x1440 margins

/* ---------- helpers ---------- */
const P = (text, o = {}) =>
  new Paragraph({
    spacing: { before: o.before ?? 0, after: o.after ?? 140, line: o.line ?? 280 },
    alignment: o.align,
    children: [
      new TextRun({
        text, size: o.size ?? 20, bold: o.bold, italics: o.italics,
        color: o.color ?? INK, font: "Calibri",
      }),
    ],
  });

const rich = (runs, o = {}) =>
  new Paragraph({
    spacing: { before: o.before ?? 0, after: o.after ?? 140, line: 280 },
    children: runs.map((r) => new TextRun({
      text: r.t, bold: r.b, italics: r.i, size: r.size ?? 20,
      color: r.c ?? INK, font: r.mono ? "Consolas" : "Calibri",
    })),
  });

const H1 = (t) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ORANGE, space: 6 } },
    children: [new TextRun({ text: t, size: 32, bold: true, color: INK, font: "Calibri" })],
  });

const H2 = (t) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text: t, size: 24, bold: true, color: INK, font: "Calibri" })],
  });

const H3 = (t) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text: t, size: 21, bold: true, color: ORANGE, font: "Calibri" })],
  });

const bullet = (text, lvl = 0) =>
  new Paragraph({
    numbering: { reference: "bullets", level: lvl },
    spacing: { after: 90, line: 280 },
    children: [new TextRun({ text, size: 20, color: INK, font: "Calibri" })],
  });

const bulletRich = (runs, lvl = 0) =>
  new Paragraph({
    numbering: { reference: "bullets", level: lvl },
    spacing: { after: 90, line: 280 },
    children: runs.map((r) => new TextRun({
      text: r.t, bold: r.b, italics: r.i, size: 20,
      color: r.c ?? INK, font: r.mono ? "Consolas" : "Calibri",
    })),
  });

const checkbox = (text) =>
  new Paragraph({
    spacing: { after: 110, line: 280 },
    indent: { left: 360, hanging: 360 },
    children: [
      new TextRun({ text: "☐   ", size: 22, color: ORANGE, font: "Calibri" }),
      new TextRun({ text, size: 20, color: INK, font: "Calibri" }),
    ],
  });

const cell = (text, o = {}) =>
  new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.bg ? { type: ShadingType.CLEAR, fill: o.bg, color: "auto" } : undefined,
    margins: { top: 90, bottom: 90, left: 130, right: 130 },
    verticalAlign: "center",
    children: [new Paragraph({
      spacing: { after: 0, line: 250 },
      children: [new TextRun({ text, size: o.size ?? 18, bold: o.b, color: o.c ?? INK, font: "Calibri" })],
    })],
  });

const table = (widths, header, rows, o = {}) =>
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: LINE },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((t, i) => cell(t, { w: widths[i], bg: HEADBG, c: "FFFFFF", b: true, size: 16 })),
      }),
      ...rows.map((r, ri) => new TableRow({
        children: r.map((t, i) => cell(t, {
          w: widths[i], bg: ri % 2 ? "F7F7F7" : undefined,
          b: o.boldFirst && i === 0, size: o.size ?? 18,
        })),
      })),
    ],
  });

const callout = (label, text) =>
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 18, color: ORANGE },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "FDF3EA", color: "auto" },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          new Paragraph({
            spacing: { after: 70 },
            children: [new TextRun({ text: label.toUpperCase(), size: 16, bold: true, color: ORANGE, font: "Calibri" })],
          }),
          new Paragraph({
            spacing: { after: 0, line: 280 },
            children: [new TextRun({ text, size: 20, color: INK, font: "Calibri" })],
          }),
        ],
      })],
    })],
  });

const spacer = (h = 200) => new Paragraph({ spacing: { after: h }, children: [] });

/* ---------- document ---------- */
const doc = new Document({
  creator: "Digilari Media",
  title: "Armoury Easy Fit range - build notes and sign-off",
  description: "Implementation notes, decisions and sign-off items for the Easy Fit range",
  numbering: {
    config: [{
      reference: "bullets",
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 200 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 200 } } } },
      ],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Digilari Media  |  Armoury Easy Fit range  |  Page ", size: 16, color: GREY, font: "Calibri" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: "Calibri" }),
          ],
        })],
      }),
    },
    children: [
      /* ---------------- cover ---------------- */
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: "ARMOURY GROUP", size: 18, bold: true, color: ORANGE, font: "Calibri" })],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: "Easy Fit range", size: 52, bold: true, color: INK, font: "Calibri" })],
      }),
      new Paragraph({
        spacing: { after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: ORANGE, space: 8 } },
        children: [new TextRun({ text: "Build notes, decisions and sign-off items", size: 26, color: GREY, font: "Calibri" })],
      }),
      rich([
        { t: "Prepared by  ", c: GREY }, { t: "Digilari Media", b: true },
        { t: "        Date  ", c: GREY }, { t: "September 2026", b: true },
      ], { after: 60 }),
      rich([
        { t: "Accompanies  ", c: GREY }, { t: "the Easy Fit mockup", b: true },
        { t: "  (open ", c: GREY }, { t: "index.html", mono: true },
        { t: " in the easy-fit-mockup folder)", c: GREY },
      ], { after: 260 }),

      callout("What this document is for",
        "The mockup shows how the Easy Fit range will look and work. This document holds everything that " +
        "sits behind it: the decisions we made and why, the things Armoury needs to confirm before a " +
        "developer starts, and the technical requirements the build must meet. Section 5 is the sign-off " +
        "checklist. Nothing should go to development until that section is complete."),
      spacer(240),

      H2("Contents"),
      ...[
        "What was approved, and how it is implemented",
        "Why Easy Fit is an attribute and not a truck type",
        "Page-by-page notes",
        "Placeholder data Armoury needs to confirm",
        "Sign-off checklist",
        "Technical requirements for the developer",
        "How we will measure it",
      ].map((t, i) => new Paragraph({
        spacing: { after: 80, line: 280 },
        indent: { left: 360, hanging: 360 },
        children: [
          new TextRun({ text: `${i + 1}.   `, size: 20, bold: true, color: ORANGE, font: "Calibri" }),
          new TextRun({ text: t, size: 20, color: INK, font: "Calibri" }),
        ],
      })),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 1 ---------------- */
      H1("1.  What was approved, and how it is implemented"),
      P("Four items were approved. Each one is built in the mockup and can be clicked through.", { after: 200 }),
      table([520, 2600, 3300, 2940],
        ["#", "Approved item", "Where it appears", "Notes"],
        [
          ["1", "Easy Fit as a product filter", "Filter bar and product badges on the accessories page and every vehicle page", "Built as a product attribute. Nothing is duplicated or moved."],
          ["2", "Curated landing page", "/accessories/easy-fit/", "Hero gallery, product grid with fitting detail, how-it-works, FAQ."],
          ["3", "Badge and fitting section on product pages", "/products/aircleaner-panels/", "Badge above the H1, fitting panel before the spec tabs."],
          ["4", "Separate reseller page", "/dealers/easy-fit-range/", "Set to noindex. Linked from the dealer navigation only."],
        ], { boldFirst: true }),
      spacer(),
      callout("One thing to note",
        "The filter does not appear on the Air Cleaner Panels page, and that is deliberate. That page lists " +
        "part-number variants rather than product categories, so there is nothing for a filter to act on. It " +
        "gets the badge and the fitting panel instead. The filter belongs on the accessories hub and the " +
        "vehicle pages, where products are listed."),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 2 ---------------- */
      H1("2.  Why Easy Fit is an attribute and not a truck type"),
      P("The original proposal was to add Easy Fit to the truck-type list, alongside K200, T610, Volvo and " +
        "the rest. We recommended against it, and the approved approach makes it a product attribute instead. " +
        "Three reasons.", { after: 200 }),

      H3("It answers a different question"),
      P("The vehicle list answers \"will it fit my truck?\". Easy Fit answers \"how hard is it to fit?\". " +
        "Those are different axes. A driver picking their truck from a list should not find an option in " +
        "there that is not a truck. As an attribute, Easy Fit cuts across every model, which is what it " +
        "actually does."),

      H3("It would compete with pages that already rank"),
      P("Every Easy Fit product already sits under one or more truck types. A new truck type would list the " +
        "same products again, creating a near-duplicate page competing for the same internal links as pages " +
        "that are already earning positions:", { after: 140 }),
      table([3400, 2200, 3760],
        ["Page", "Current position", "Keyword"],
        [
          ["/vehicle/kenworth-t659/", "2", "kenworth t659 accessories"],
          ["/vehicle/kenworth-c509/", "3", "kenworth c509 accessories"],
          ["/vehicle/volvo/", "4", "volvo truck accessories (60/mo)"],
          ["/vehicle/kenworth-legend-sar/", "5", "legend sar accessories"],
          ["/vehicle/kenworth-t409/", "8", "kenworth t409 interior"],
        ]),
      spacer(160),

      H3("The name itself has no search demand"),
      P("Ahrefs returns no Australian volume for any phrasing of it: easy fit truck accessories, bolt on " +
        "truck accessories, no drill truck accessories, DIY truck accessories, universal truck accessories. " +
        "A check of the top 40 Australian keywords containing \"truck accessories\" found no " +
        "installation-ease modifiers at all. Demand is by brand and model, by material, by product type and " +
        "by location.", { after: 140 }),
      callout("What this means in practice",
        "Easy Fit is a positioning and conversion asset, not a keyword target. The landing page will not " +
        "rank for \"easy fit\" because nobody searches it. It earns its place by converting visitors, by " +
        "giving campaigns a destination, and by finally targeting the stainless and chrome keyword cluster " +
        "that nothing on the site currently covers."),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 3 ---------------- */
      H1("3.  Page-by-page notes"),

      H2("/accessories/  (existing page)"),
      bullet("A filter bar sits above the product grids. Ticking it shows only Easy Fit products and " +
        "collapses any truck-model section that has none left."),
      bullet("The orange Easy Fit badge appears on every qualifying product card, across all 14 truck-model " +
        "sections. No card is duplicated or moved out of the section it already sits in."),
      bulletRich([
        { t: "The filter writes " }, { t: "?fit=easy", mono: true },
        { t: " to the address bar, so a filtered view can be linked to, bookmarked and used in campaigns." },
      ]),
      bullet("A promo strip below the filter links to the Easy Fit range page and, separately, to the " +
        "dealer page."),

      H2("/vehicle/kenworth-k200/  (existing page)"),
      bullet("The same filter and badges work here. This is the proof that the approach does not need an " +
        "Easy Fit truck type to exist."),
      bulletRich([
        { t: "One correction was made for the mockup: " },
        { t: "the saved copy of this page had captured the Mack product listing in its Our Range grid rather than the K200 one", b: true },
        { t: ". We replaced it with the real K200 categories so the filter demo makes sense. Worth checking whether the live page has the same problem." },
      ]),

      H2("/products/aircleaner-panels/  (existing page)"),
      bullet("An Easy Fit badge sits above the H1, linking to the range page."),
      bullet("A fitting panel appears before the spec tabs: fitting time, drilling, tools required and what " +
        "is in the box."),
      bulletRich([
        { t: "Breadcrumbs were added. ", b: true },
        { t: "The production product template has none, which is both a usability and an SEO gap. Recommend adding them to all product pages with BreadcrumbList schema." },
      ]),
      bulletRich([
        { t: "The Product Specs layout was restructured. ", b: true },
        { t: "The variants table needs roughly 820px but the template puts it in a half-width column, so it scrolls sideways and part of it is unreadable. It now sits in its own full-width row below, with fluid columns. Recommend the same change on every product page." },
      ]),
      bulletRich([
        { t: "Recommended title tag: " },
        { t: "Kenworth Air Cleaner Panels | Bolt-On, No Drilling | Armoury Stainless", mono: true },
      ]),
      spacer(120),
      callout("Why this page matters most",
        "Thirteen product pages already rank, covering roughly 1,300 searches a month between them, and not " +
        "one of them currently says anything about fitting. Adding the fitting panel to pages that already " +
        "have visibility is worth more than any new page. The full list is in the recommendations document."),

      new Paragraph({ children: [new PageBreak()] }),

      H2("/accessories/easy-fit/  (new page)"),
      bulletRich([
        { t: "The URL is " }, { t: "/accessories/easy-fit/", mono: true },
        { t: ", not " }, { t: "/vehicle/easy-fit/", mono: true },
        { t: ". The path segment signals a view of accessories rather than a truck model, so it does not compete with the vehicle pages." },
      ]),
      bullet("It is a curated commercial page, not a taxonomy node. It links out to products in their real homes."),
      bullet("The range uses the same product grid layout as every other category page, with the fitting " +
        "detail added to each card."),
      bulletRich([
        { t: "Primary organic target is the stainless and chrome cluster: " },
        { t: "chrome and stainless steel truck accessories", i: true }, { t: " (80/mo), " },
        { t: "stainless steel truck accessories", i: true },
        { t: " (40/mo), plus two smaller variants. Nothing on the site currently targets these." },
      ]),
      bulletRich([
        { t: "Carries " }, { t: "ItemList", mono: true }, { t: " and " },
        { t: "FAQPage", mono: true }, { t: " structured data." },
      ]),

      H2("/dealers/easy-fit-range/  (new page)"),
      bulletRich([
        { t: "Set to " }, { t: "noindex, follow", mono: true },
        { t: ". It should be linked from the dealer navigation only and kept out of the XML sitemap." },
      ]),
      bullet("The reseller message has no organic search demand in Australia, so this page is for email, " +
        "the counter-display QR code and dealer onboarding, not for search."),
      bullet("Keeping it separate from the customer page matters: trying to serve a driver and a dealer on " +
        "one page weakens the message for both."),
      bullet("If trade pricing is added, it should sit behind the existing dealer login rather than on the " +
        "open URL."),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 4 ---------------- */
      H1("4.  Placeholder data Armoury needs to confirm"),
      callout("This is the main thing we need back from you",
        "Everything below is our best guess, put in so the mockup looks real. None of it has been checked " +
        "by anyone who has actually fitted these products. Please correct it. All of it lives in one file " +
        "in the build, so changing it is quick."),
      spacer(200),
      P("Two questions for each product. First, does it belong in the Easy Fit range at all? Our rule was " +
        "that it must bolt to existing factory mounting points, need only hand tools, and be a one-person " +
        "job. Second, if it does belong, are the fitting time, tools and box contents right?", { after: 200 }),

      H2("The 22 products we flagged as Easy Fit"),
      table([2500, 1000, 2600, 3260],
        ["Product", "Time", "Tools", "In the box"],
        EASY.map((r) => [
          r[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          r[1], r[2], r[3],
        ]), { size: 16, boldFirst: true }),
      spacer(200),

      H2("Products we did not flag"),
      P("These are currently marked as workshop fit, on the assumption they need drilling, trimming or " +
        "alignment. If any of them are in fact bolt-on, tell us and we will move them.", { after: 140 }),
      P("Flares, steps and tank skirts, low mount guard brackets, mudflap brackets, quarter guards, tail " +
        "light bars and drop sections, monster look exhaust shroud, retro fit old-school steps, bunk wings, " +
        "bunk skirt extensions, underdoor panel, sunvisors, air cleaner shrouds, elephant ears, and the Mack " +
        "under door panel, tank skirt, tail light bar infil, sunvisor and bunk skirt. Plus the Volvo range: " +
        "adblue tank cover, bunk skirts, drop section, EGP cover, exhaust shroud, guard infil, tank skirt, " +
        "tank wrap, tread plate, alloy deck plate and drive guard kit.", { after: 200 }),

      H2("Also needs confirming"),
      bullet("The models each product suits. The mockup lists these on every card and we have inferred them " +
        "from the existing category pages."),
      bullet("Whether \"Easy Fit\" is the right customer-facing name. Search data does not help here because " +
        "every candidate has zero volume, so it is purely a brand decision. Our recommendation is Easy Fit " +
        "as the badge, with \"Bolt-on. No drilling.\" always shown underneath it."),
      bullet("Whether any product needs a caveat, for example a two-person lift, or a model year where the " +
        "mounting points differ."),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 5 ---------------- */
      H1("5.  Sign-off checklist"),
      P("Nothing should go to development until every box below is ticked.", { after: 240 }),

      H2("Armoury to confirm"),
      checkbox("The list of 22 products that carry the Easy Fit badge is correct"),
      checkbox("Fitting times are realistic for a competent owner, not a workshop technician"),
      checkbox("Tool lists are correct and complete"),
      checkbox("Box contents are correct for every product"),
      checkbox("The models listed against each product are correct"),
      checkbox("\"Easy Fit\" is signed off as the range name"),
      checkbox("Any product needing a caveat has been flagged to us"),
      checkbox("Happy for fitting times to be published publicly on the website"),
      checkbox("Dealer page content is approved, including anything about margin or stocking"),
      spacer(160),

      H2("Digilari to deliver once confirmed"),
      checkbox("Final copy for the landing page and the dealer page"),
      checkbox("Developer brief covering the attribute, the filter and the crawl controls"),
      checkbox("Fitting panel copy for all 13 ranking product pages"),
      checkbox("Structured data specification"),
      checkbox("GA4 event tracking specification"),
      spacer(160),

      H2("Developer to build"),
      checkbox("Easy Fit product attribute added in WooCommerce and applied to the confirmed products"),
      checkbox("Filter on the accessories hub and all vehicle pages, with crawl controls"),
      checkbox("Badge rendered on qualifying product cards"),
      checkbox("Fitting panel on Easy Fit product pages"),
      checkbox("Landing page built at /accessories/easy-fit/"),
      checkbox("Dealer page built at /dealers/easy-fit-range/, set to noindex"),
      checkbox("Breadcrumbs added to product pages"),
      checkbox("Product Specs table restructured so it reads without sideways scrolling"),
      checkbox("Structured data added"),
      checkbox("GA4 events firing"),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 6 ---------------- */
      H1("6.  Technical requirements for the developer"),

      H2("The attribute"),
      bulletRich([
        { t: "A single boolean product attribute, plus three short text fields: fitting time, tools required, box contents. Rendered server-side as a data attribute on each product card (" },
        { t: 'data-ef="1"', mono: true },
        { t: "). The mockup infers it from the URL slug, which is a demo shortcut only." },
      ]),
      bullet("It is an attribute, not a taxonomy. Nothing moves, nothing is duplicated, no new term is " +
        "created in the vehicle taxonomy."),

      H2("The filter and its crawl controls"),
      P("This part matters. Faceted filters are one of the most common ways a site accidentally generates " +
        "thousands of thin duplicate pages, so all four of these are required, not optional.", { after: 140 }),
      bulletRich([
        { t: "Filter state must be a query parameter (" }, { t: "?fit=easy", mono: true },
        { t: "), never a path segment." },
      ]),
      bulletRich([
        { t: "Every filtered view needs a " }, { t: "rel=canonical", mono: true },
        { t: " pointing at the unfiltered parent page." },
      ]),
      bulletRich([
        { t: "Multi-facet combinations (filter plus model plus product type) get " },
        { t: "noindex, follow", mono: true }, { t: "." },
      ]),
      bullet("Filter URLs must stay out of the XML sitemap."),

      H2("Structured data"),
      bulletRich([
        { t: "Product schema on every Easy Fit product page, with " },
        { t: "additionalProperty", mono: true }, { t: " carrying " },
        { t: "Installation: Bolt-on, no drilling required", mono: true }, { t: "." },
      ]),
      bulletRich([
        { t: "ItemList", mono: true }, { t: " and " }, { t: "FAQPage", mono: true },
        { t: " on the landing page." },
      ]),
      bulletRich([
        { t: "BreadcrumbList", mono: true },
        { t: " on product pages, alongside the new visible breadcrumbs." },
      ]),

      H2("Meta"),
      bulletRich([
        { t: "Landing page title: " },
        { t: "Easy-Fit Stainless Truck Accessories | Bolt-On, No Drilling | Armoury", mono: true },
      ]),
      bulletRich([
        { t: "Dealer page: " }, { t: "noindex, follow", mono: true },
        { t: ", excluded from the sitemap, linked from dealer navigation only." },
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      /* ---------------- 7 ---------------- */
      H1("7.  How we will measure it"),
      P("Easy Fit is a bet on demand we cannot see in search data, because the language does not exist in " +
        "search yet. That is a reasonable bet, but it should be a measured one rather than an article of " +
        "faith. Here is how we will know within a quarter whether it worked.", { after: 200 }),
      table([3200, 3200, 2960],
        ["What we track", "How", "What it tells us"],
        [
          ["Filter usage", "GA4 event filter_easy_fit", "Whether customers actually want to shop this way"],
          ["Landing page performance", "GA4 landing page report with key events attributed", "Whether the page converts, and whether it draws any organic traffic"],
          ["Stainless keyword cluster", "Ahrefs rank tracker, project 5514637", "Whether the landing page picks up the terms nothing currently targets"],
          ["Product page performance", "GA4 and Ahrefs, the 13 ranking product pages", "Whether the fitting panel improves conversion on pages that already have traffic"],
        ]),
      spacer(200),
      P("Keywords to add to the rank tracker:", { after: 100 }),
      P("stainless steel truck accessories, chrome and stainless steel truck accessories, truck stainless " +
        "steel accessories, stainless truck accessories, truck accessories, truck interior accessories.",
        { after: 200 }),
      callout("The 90-day decision",
        "If the filter sees negligible use and the landing page draws no organic traffic, then Easy Fit is " +
        "a sales-enablement asset rather than an SEO one. That is still a perfectly good outcome, the dealer " +
        "page and the counter proposition stand on their own, but it would mean stopping further SEO " +
        "investment in the range rather than doubling down. We will make that call together at the 90-day " +
        "review."),
    ],
  }],
});

Packer.toBuffer(doc).then((b) => {
  const out = process.env.EF_OUT || "/tmp/efdoc/Armoury-Easy-Fit-Build-Notes.docx";
  fs.writeFileSync(out, b);
  console.log("written", out, b.length, "bytes");
});
