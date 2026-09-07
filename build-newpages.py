#!/usr/bin/env python3
"""
Builds the two NEW pages in the Easy Fit mockup:
  /accessories/easy-fit/     - curated, indexable landing page (approved item 2)
  /dealers/easy-fit-range/   - reseller sales collateral, noindex (approved item 4)

Both are built INSIDE the real site shell: the production <head>, the real
Elementor header/mega-menu and the real footer are lifted verbatim from the
saved Kenworth K200 page, so the navigation, typography, brand colours and
button styling are the site's own, not an approximation.

Page content is plain semantic markup styled by assets/easy-fit.css, apart
from .elementor-button, which is kept so CTAs inherit the theme's own button
style. Elementor CONTAINER classes are deliberately avoided: their layout is
driven by per-element custom properties the editor generates, so hand-written
markup wearing them collapses to display:inline.

Content is generated from assets/easy-fit-data.js, the same dataset that drives
the filter and the badges, so nothing can drift out of sync.
"""
import pathlib
import re
import json

ROOT = pathlib.Path(__file__).parent
SHELL_SRC = ROOT / "vehicle" / "kenworth-k200" / "index.html"
SHELL_ASSETS = "../../vehicle/kenworth-k200/AG - Kenworth K200_files/"
ACC_ASSETS = "../../accessories/AG - Accessories_files/"

# ---- read the shared dataset -------------------------------------------------
raw = (ROOT / "assets" / "easy-fit-data.js").read_text(encoding="utf-8")
body = raw[raw.index("{", raw.index("EASY_FIT_DATA")):raw.rindex("}") + 1]
body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
body = re.sub(r"(\w+):", r'"\1":', body)
body = re.sub(r",\s*}", "}", body)
DATA = json.loads(body)

LABELS = {
    "aircleaner-panels": ("Air Cleaner Panels", "AIRCLEANER-PANELS-300x225.png"),
    "mirrorbacks": ("Mirror Backs &amp; Mirror Panels", "Mirrorback-300x200.jpg"),
    "red-dot-cover": ("Red Dot Cover", "DJI_0871-e1781090018910-300x215.jpg"),
    "tool-box-door-pocket": ("Toolbox Door Pocket", "toolbox-door-pocket-300x184.png"),
    "bonnet-latch-covers": ("Bonnet Latch Covers", "bonnet-latch-covers-300x200.png"),
    "hinge-covers": ("Hinge Covers", "HINGE-COVERS-300x225.png"),
    "kick-panels": ("Kick Panels", "kick-panel-with-lights-410-min-300x169.png"),
    "scuff-panels": ("Scuff Panels", "SCUFF-PANELS-300x225.png"),
    "wing-decals": ("Wing Decals", "WING-DECALS-300x225.png"),
    "gear-stick-surround": ("Gear Stick Surround", "gear-stick-surround-t610-300x169.png"),
    "air-vent-cover": ("Air Vent Cover", "air-VENT-COVER.pdf-300x217.png"),
    "battery-box-cover": ("Battery Box Cover", "BATTERY-BOX-COVER-300x225.png"),
    "beacon-bracket": ("Beacon Bracket", "beacon-bracket-side-mounted-300x169.png"),
    "driving-light-mount": ("Driving Light Mount", "Driving-light-brackets-300x196.png"),
    "grill-bar-mesh": ("Grill Bar &amp; Mesh", "GRILL-BAR-MESH-300x225.png"),
    "headlight-surrounds": ("Headlight Surrounds", "20240412_085303-300x268.jpg"),
    "droopy-headlight-visor": ("Droopy Headlight Visor", "Headlight-Visor-300x200.jpg"),
    "bug-deflectors": ("Bug Deflectors", "BDS909-300x189.png"),
    "interior-double-watermelon-light-kit": ("Interior Double Watermelon Light Kit", "Interior-Double-Watermelon-Light-Kit.jpeg"),
    "mack-bunk-wing-decal": ("Mack Bunk Wing Decal", "Bunk-Wing-Decal-300x200.png"),
    "mack-alloy-deck-plate": ("Mack Alloy Deck Plate", "Alloy-Deck-Plate-300x200.jpg"),
    "mack-precleaner-shroud": ("Mack Precleaner Shroud", "Precleaner-panel-300x200.jpg"),
}

FITS = {
    "aircleaner-panels": "T610, T620, T659, T909, C509, Legend SAR",
    "mirrorbacks": "K200, K220, T409, T659, T909, C509, Mack",
    "red-dot-cover": "All Kenworth models",
    "tool-box-door-pocket": "K200, K220, T410, T610, T659, T909, C509, T409",
    "bonnet-latch-covers": "T410, T610, T659, T909, C509, T409, Legend SAR",
    "hinge-covers": "K200, K220, T360, T410, T610, T659, T909",
    "kick-panels": "T410, T610, T909, Volvo",
    "scuff-panels": "K200, K220, T360, T410, T610, T659",
    "wing-decals": "K200",
    "gear-stick-surround": "T610",
    "air-vent-cover": "T360, T410, T610, T620",
    "battery-box-cover": "K200, K220, T610, T909, T620",
    "beacon-bracket": "T360, T410, T610, T659, T909, C509, T620",
    "driving-light-mount": "T610, T909, T620",
    "grill-bar-mesh": "K200, K220, T410, T610, T659, T909, C509",
    "headlight-surrounds": "T410, T610, T659, T909, C509, T620, Legend SAR",
    "droopy-headlight-visor": "T909, T409, T620",
    "bug-deflectors": "T360, T410, T610, T659, T909, C509, Legend SAR",
    "interior-double-watermelon-light-kit": "T409",
    "mack-bunk-wing-decal": "Mack",
    "mack-alloy-deck-plate": "Mack",
    "mack-precleaner-shroud": "Mack",
}

# Installed-on-truck photography for the hero carousel.
GALLERY = [
    (SHELL_ASSETS + "showroom-1.jpg", "Armoury stainless accessories fitted, on the road"),
    (SHELL_ASSETS + "showroom-2.jpg", "Kenworth fitted with Armoury stainless"),
    (SHELL_ASSETS + "showroom-3.jpg", "Stainless air cleaner panels and sunvisor fitted"),
    (SHELL_ASSETS + "showroom-4.jpg", "Armoury stainless on a working rig"),
    (SHELL_ASSETS + "showroom-5.jpg", "Bolt-on stainless accessories fitted by the owner"),
    (SHELL_ASSETS + "showroom-6.jpg", "Kenworth detailed with Armoury stainless"),
    (SHELL_ASSETS + "DJI_0871-e1781090018910.jpg", "Easy Fit accessories fitted in the yard"),
    (SHELL_ASSETS + "Icrop-MG_7017-300x239.jpg", "Stainless trim fitted to a Kenworth"),
]

EASY = [(s, m) for s, m in DATA.items() if m.get("easyFit")]
EASY.sort(key=lambda kv: LABELS.get(kv[0], (kv[0],))[0])

LOCAL_PRODUCTS = {"aircleaner-panels"}


def product_href(slug, root="../../"):
    if slug in LOCAL_PRODUCTS:
        return f"{root}products/{slug}/index.html"
    return f"https://armourygroup.com.au/products/{slug}/"


BOLT = ('<svg viewBox="0 0 24 24" aria-hidden="true">'
        '<path d="M13.5 2 4 13.2h6.1L9.4 22 20 10.4h-6.3L13.5 2z"/></svg>')


# =============================================================================
# Shell extraction
# =============================================================================
def load_shell():
    h = SHELL_SRC.read_text(encoding="utf-8", errors="replace")
    a = h.find('<div data-elementor-type="product-archive"')
    b = h.find('<footer data-elementor-type="footer"')
    if a < 0 or b < 0:
        raise SystemExit("Could not locate the archive/footer boundaries in the shell page.")
    top, bottom = h[:a], h[b:]

    # Strip the Easy Fit layer the shell page carries; these pages declare their own.
    top = re.sub(
        r"\n?<!-- ==== DIGILARI EASY FIT MOCKUP :: START.*?MOCKUP :: END ================================ -->\n?",
        "", top, flags=re.S)

    # Re-point every relative asset reference at the shell page's own asset folder.
    for part in ("./AG - Kenworth K200_files/", "AG - Kenworth K200_files/"):
        top = top.replace('="' + part, '="' + SHELL_ASSETS)
        bottom = bottom.replace('="' + part, '="' + SHELL_ASSETS)

    # The shell page's own local links were rewritten for its depth; redo for ours.
    top = top.replace('href="../../vehicle/kenworth-k200/index.html"',
                      'href="../../vehicle/kenworth-k200/index.html"')
    top = top.replace('href="../accessories/index.html"', 'href="../../accessories/index.html"')
    return top, bottom


def head_swap(top, title, desc, canonical=None, robots=None, root="../../", page="easyfit"):
    top = re.sub(r"<title>.*?</title>", "<title>%s</title>" % title, top, count=1, flags=re.S)
    top = re.sub(r'<meta name="description" content="[^"]*"\s*/?>',
                 '<meta name="description" content="%s">' % desc, top, count=1)
    if '<meta name="description"' not in top:
        top = top.replace("</title>", "</title>\n<meta name=\"description\" content=\"%s\">" % desc, 1)
    top = re.sub(r'<link rel="canonical" href="[^"]*"\s*/?>', "", top, count=1)
    # Remove the shell page's own robots directive so ours is the only one.
    top = re.sub(r'<meta name="robots" content="[^"]*"\s*/?>', "", top)
    extra = ""
    # Hosting guard: this mockup reproduces armourygroup.com.au, so the hosted
    # copy must never be indexed. The robots value each page should carry in
    # PRODUCTION is recorded as ef-production-robots and documented in
    # Armoury-Easy-Fit-Build-Notes.docx.
    extra += '<meta name="ef-production-robots" content="%s">\n' % (
        robots or "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1")
    extra += '<meta name="robots" content="noindex, nofollow">\n'
    if canonical:
        extra += '<link rel="canonical" href="%s">\n' % canonical
    extra += '<link rel="stylesheet" href="%sassets/easy-fit.css">\n' % root
    extra += '<script src="%sassets/easy-fit-data.js"></script>\n' % root
    extra += '<script src="%sassets/easy-fit.js" defer></script>\n' % root
    top = top.replace("</head>", extra + "</head>", 1)
    top = re.sub(r"<html([^>]*)>",
                 lambda m: "<html%s data-ef-root=\"%s\" data-ef-page=\"%s\">" % (
                     re.sub(r'\s+data-ef-\w+="[^"]*"', "", m.group(1)), root, page),
                 top, count=1)
    return top


# =============================================================================
# Content builders (native Elementor markup)
# =============================================================================
def sec(inner, classes="", style=""):
    """A plain section.

    Deliberately NOT an Elementor container. Elementor's .e-con rules are
    driven by per-element custom properties (--display, --padding-left, ...)
    that only exist for containers the editor generated. Hand-written markup
    wearing those classes resolves display:var(--display) to an invalid value,
    which computes to display:inline and destroys the layout.
    """
    return (f'<section class="ef-sec {classes}" style="{style}">'
            f'<div class="ef-sec__inner">{inner}</div></section>')


def h2(text, cls="ef-h2"):
    return (f'<h2 class="elementor-heading-title elementor-size-default {cls}">{text}</h2>')


def btn(text, href, extra=""):
    return (f'<a class="elementor-button elementor-button-link elementor-size-sm {extra}" href="{href}">'
            '<span class="elementor-button-content-wrapper">'
            f'<span class="elementor-button-text">{text}</span></span></a>')


def product_card(slug, m):
    label, img = LABELS.get(slug, (slug.replace("-", " ").title(), ""))
    return f"""<div class="e-loop-item ef-card-item" data-ef="1" data-ef-slug="{slug}">
  <div class="ef-card-inner">
      <a class="ef-card-img" href="{product_href(slug)}">
        <img loading="lazy" src="{ACC_ASSETS}{img}" alt="{re.sub('&amp;','and',label)}">
        <span class="ef-badge">{BOLT}Easy Fit</span>
      </a>
      <h3 class="elementor-heading-title elementor-size-default">
        <a href="{product_href(slug)}">{label}</a></h3>
      <dl class="ef-card-specs">
        <div><dt>Drilling</dt><dd class="ef-nodrill">Not required</dd></div>
        <div><dt>Tools</dt><dd>{m['tools']}</dd></div>
        <div><dt>In the box</dt><dd>{m.get('box','Product, fasteners')}</dd></div>
        <div><dt>Fits</dt><dd>{FITS.get(slug,'Multiple models')}</dd></div>
      </dl>
  </div>
</div>"""


def gallery(items):
    slides = "".join(
        f'<figure class="ef-gal__slide"><img loading="lazy" src="{src}" alt="{alt}">'
        f'<figcaption>{alt}</figcaption></figure>' for src, alt in items)
    dots = "".join(f'<button type="button" class="ef-gal__dot" data-i="{i}"'
                   f' aria-label="Slide {i+1}"></button>' for i in range(len(items)))
    return f"""<div class="ef-gal" data-ef-gallery>
  <button type="button" class="ef-gal__nav ef-gal__nav--prev" aria-label="Previous">&#8249;</button>
  <div class="ef-gal__track">{slides}</div>
  <button type="button" class="ef-gal__nav ef-gal__nav--next" aria-label="Next">&#8250;</button>
  <div class="ef-gal__dots">{dots}</div>
</div>"""


def crumbs(items):
    li = "".join(
        (f'<li aria-current="page">{lbl}</li>' if href is None
         else f'<li><a href="{href}">{lbl}</a></li>')
        for lbl, href in items)
    return f'<nav class="ef-crumbs" aria-label="Breadcrumb"><ol>{li}</ol></nav>'


# =============================================================================
# 1. /accessories/easy-fit/
# =============================================================================
top, bottom = load_shell()

faq = [
    ("What does &ldquo;Easy Fit&rdquo; actually mean?",
     "Every product in the Easy Fit range bolts to the truck&rsquo;s existing factory mounting points. "
     "There is no drilling, no cutting and no fabrication. If a product needs a hole made in the truck, "
     "it is not in this range."),
    ("Which truck accessories can I fit myself?",
     f"The {len(EASY)} stainless accessories listed on this page. They range from a 10 minute gear stick "
     "surround to a 40 minute grill bar and mesh. Everything else in the Armoury range is a workshop fit "
     "and is better done by your dealer."),
    ("What tools do I need?",
     "For most items a socket set and a Phillips driver. A handful need a trim tool or an allen key. "
     "The card for each product lists the tools. Nothing in the range needs specialist tooling, a hoist "
     "or a welder."),
    ("Are the fasteners included?",
     "Yes. Every Easy Fit product ships with the stainless fasteners, clips or brackets it needs. The "
     "&ldquo;In the box&rdquo; line on each card lists exactly what arrives."),
    ("Will it fit my truck?",
     "Check the &ldquo;Fits&rdquo; line on each card, or browse by your model from All Products. Every "
     "product is made for a specific Kenworth, Volvo or Mack model, so there is no universal-fit guesswork."),
    ("Can my dealer fit it instead?",
     "Of course. Ask any Kenworth dealer for Armoury accessories. Easy Fit simply means you have the option "
     "of doing it yourself in the yard rather than booking the truck in."),
]

faq_ld = json.dumps({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [{"@type": "Question",
                    "name": re.sub("<[^>]+>", "", q).replace("&ldquo;", "“").replace("&rdquo;", "”").replace("&rsquo;", "’"),
                    "acceptedAnswer": {"@type": "Answer", "text": re.sub("<[^>]+>", "", a).replace("&rsquo;", "’").replace("&ldquo;", "“").replace("&rdquo;", "”")}}
                   for q, a in faq]}, indent=2)

itemlist_ld = json.dumps({
    "@context": "https://schema.org", "@type": "ItemList",
    "name": "Easy-Fit Stainless Truck Accessories", "numberOfItems": len(EASY),
    "itemListElement": [{"@type": "ListItem", "position": i + 1,
                         "name": re.sub("&amp;", "&", LABELS.get(s, (s,))[0]),
                         "url": "https://armourygroup.com.au/products/%s/" % s}
                        for i, (s, m) in enumerate(EASY)]}, indent=2)

hero = sec(
    '<div class="ef-hero-grid">'
    '<div class="ef-hero-copy">'
    f'<p class="ef-kicker">{BOLT} The Easy Fit range</p>'
    '<h1 class="elementor-heading-title elementor-size-default">Easy-Fit Stainless Truck Accessories</h1>'
    '<h4 class="ef-hero-sub">Bolt-on. No drilling. Fit it yourself in under an hour.</h4>'
    '<p class="ef-hero-body">Every product on this page mounts to your truck&rsquo;s existing factory points. '
    'No drilling, no cutting, no fabrication and no workshop booking. The same Australian-made stainless we have '
    f'been building since 1972, designed so you can fit it in the yard with a socket set. {len(EASY)} products, '
    'every fitting time and tool list published.</p>'
    '<div class="ef-btnrow">'
    + btn(f"See the {len(EASY)} products", "#range")
    + btn("Filter the full catalogue", "../../accessories/index.html?fit=easy")
    + '</div></div>'
    '<div class="ef-hero-gal">' + gallery(GALLERY) + '</div>'
    '</div>', "ef-sec--hero")

strip = ('<div class="ef-trust"><ul>'
         '<li><b>No drilling</b><span>Bolts to the factory mounting points already on your truck</span></li>'
         '<li><b>Hand tools</b><span>A socket set and a driver. No hoist, welder or specialist tooling</span></li>'
         '<li><b>Fasteners included</b><span>Every product ships with the stainless hardware it needs</span></li>'
         '<li><b>Since 1972</b><span>Australian made in Penrith and Epping, backed by our workshop</span></li>'
         '</ul></div>')

how = sec(
    h2("How Easy Fit works")
    + '<p class="ef-lede">Three things have to be true before a product carries the Easy Fit badge. '
      'If any one of them fails, it stays in the standard range and gets fitted by your dealer.</p>'
      '<div class="ef-steps">'
      '<div class="ef-step"><span>01</span><h3>Factory mounting points only</h3>'
      '<p>The product uses holes and brackets already on the truck. Nothing is drilled, cut, welded or trimmed.</p></div>'
      '<div class="ef-step"><span>02</span><h3>Hand tools only</h3>'
      '<p>A socket set, a driver, occasionally a trim tool. No hoist, no welder, no specialist tooling.</p></div>'
      '<div class="ef-step"><span>03</span><h3>Under an hour, one person</h3>'
      '<p>Every product in the range is a single-person job. The longest is 40 minutes. The shortest is 10.</p></div>'
      '</div>', "ef-sec--dark")

grid = sec(
    h2("The Easy Fit range")
    + f'<p class="ef-lede">All {len(EASY)} products, each with its fitting time, tools, contents and the models '
      'it suits. Same grid as every other category page, with the fitting detail added to the card.</p>'
      '<div class="ef-grid" role="list">'
    + "".join(product_card(s, m) for s, m in EASY)
    + "</div>", "ef-sec--range", "")

faq_html = "".join(
    f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in faq)
faqs = sec(h2("Common questions") + f'<div class="ef-faq">{faq_html}</div>', "ef-sec--dark")

cta = sec(
    h2("Not sure what suits your truck?")
    + '<p class="ef-lede ef-lede--center">Browse the full catalogue by model, or tick the Easy Fit filter to '
      'see only what you can fit yourself.</p>'
      '<div class="ef-btnrow ef-btnrow--center">'
    + btn("Browse by truck model", "../../accessories/index.html?fit=easy")
    + btn("Dealers: stock this range", "../../dealers/easy-fit-range/index.html")
    + "</div>", "ef-sec--cta")


content = ('<div class="ef-page-content">'
           + crumbs([("Home", "../../accessories/index.html"),
                     ("All Products", "../../accessories/index.html"),
                     ("Easy Fit", None)])
           + hero + strip + how + grid + faqs + cta + "</div>")

page_top = head_swap(
    top,
    "Easy-Fit Stainless Truck Accessories | Bolt-On, No Drilling | Armoury",
    f"Australian-made stainless truck accessories that bolt straight to factory mounting points. No drilling, no fabrication. Fitting times, tools and what is in the box for all {len(EASY)} products.",
    canonical="https://armourygroup.com.au/accessories/easy-fit/",
    page="easyfit")
page_top = page_top.replace(
    "</head>",
    f'<script type="application/ld+json">{itemlist_ld}</script>\n'
    f'<script type="application/ld+json">{faq_ld}</script>\n</head>', 1)

(ROOT / "accessories" / "easy-fit" / "index.html").write_text(
    page_top + content + bottom, encoding="utf-8")
print("built: accessories/easy-fit/index.html  (%d products, %d gallery slides)"
      % (len(EASY), len(GALLERY)))


# =============================================================================
# 2. /dealers/easy-fit-range/
# =============================================================================
top2, bottom2 = load_shell()
counter = [(s, m) for s, m in EASY if m["time"] in ("10 min", "15 min", "20 min", "25 min")]

dealer_cards = "".join(product_card(s, m) for s, m in counter)

d_hero = sec(
    '<div class="ef-hero-grid">'
    '<div class="ef-hero-copy">'
    '<p class="ef-kicker">Dealer information</p>'
    '<h1 class="elementor-heading-title elementor-size-default">Stock the Easy Fit range</h1>'
    f'<h4 class="ef-hero-sub">{len(EASY)} bolt-on products. No fitting bay required.</h4>'
    '<p class="ef-hero-body">The Easy Fit range is built to sell over the counter. Every product bolts to '
    'factory mounting points, so a driver can walk out with it and fit it in the yard the same afternoon. '
    'No booking, no fitting labour, no lead time on your workshop.</p>'
    '<div class="ef-btnrow">'
    + btn("Request a stocking pack", "mailto:sales@armourygroup.com.au?subject=Easy%20Fit%20range%20enquiry")
    + '</div></div>'
    '<div class="ef-hero-gal">' + gallery(GALLERY[:6]) + '</div>'
    '</div>', "ef-sec--hero")

d_strip = ('<div class="ef-trust"><ul>'
           f'<li><b>{len(EASY)} products</b><span>The full bolt-on range, all of it counter-ready</span></li>'
           f'<li><b>{len(counter)} quick lines</b><span>Under 25 minutes to fit, ideal over the counter</span></li>'
           '<li><b>No bay time</b><span>Sells without consuming a single workshop hour</span></li>'
           '<li><b>Stocked locally</b><span>Australian made, dispatched from Penrith and Epping</span></li>'
           '</ul></div>')

d_prop = sec(
    h2("The counter proposition")
    + '<p class="ef-lede">Traditional stainless accessories need a fitting bay, which turns every sale into a '
      'scheduling conversation. Easy Fit removes that step entirely.</p>'
      '<div class="ef-stats">'
      f'<div><b>{len(EASY)}</b><span>Bolt-on products</span></div>'
      '<div><b>10&ndash;40</b><span>Minutes to fit</span></div>'
      '<div><b>0</b><span>Workshop hours consumed</span></div>'
      '<div><b>100%</b><span>Fasteners included</span></div>'
      '</div>', "ef-sec--dark")

d_grid = sec(
    h2("Best counter lines")
    + '<p class="ef-lede">The quickest-fitting products in the range. These are the ones a driver will buy on '
      'the spot rather than book in for.</p>'
      '<div class="ef-grid" role="list">'
    + dealer_cards + "</div>", "ef-sec--range")

d_sell = sec(
    h2("How to sell it")
    + '<div class="ef-steps">'
      '<div class="ef-step"><span>01</span><h3>Lead with the time</h3>'
      '<p>"Twenty minutes with a socket set, and you can do it in the yard." The fitting time is the whole '
      'pitch. Every product page and the range page publish it.</p></div>'
      '<div class="ef-step"><span>02</span><h3>Point at the badge</h3>'
      '<p>The orange Easy Fit badge appears on every qualifying product across armourygroup.com.au. Send '
      'drivers to the filter and let them shortlist themselves.</p></div>'
      '<div class="ef-step"><span>03</span><h3>Fitting is still an option</h3>'
      '<p>Easy Fit does not take work off you. It converts the customers who would otherwise walk away '
      'because they could not book the truck in.</p></div>'
      '</div>', "ef-sec--dark")

d_cta = sec(
    h2("Request a stocking pack")
    + '<p class="ef-lede ef-lede--center">Counter display, QR code to the range page, and the full Easy Fit '
      'line list with trade pricing.</p><div class="ef-btnrow ef-btnrow--center">'
    + btn("Email sales@armourygroup.com.au",
          "mailto:sales@armourygroup.com.au?subject=Easy%20Fit%20range%20enquiry")
    + "</div>", "ef-sec--cta")


d_content = ('<div class="ef-page-content">'
             + crumbs([("Home", "../../accessories/index.html"),
                       ("Dealers", None), ("Easy Fit range", None)])
             + d_hero + d_strip + d_prop + d_grid + d_sell + d_cta + "</div>")

page2 = head_swap(
    top2, "Easy Fit Range | Dealer Information | Armoury Group",
    "Dealer information for the Armoury Easy Fit range.",
    robots="noindex, follow", page="dealer")

(ROOT / "dealers" / "easy-fit-range" / "index.html").write_text(
    page2 + d_content + bottom2, encoding="utf-8")
print("built: dealers/easy-fit-range/index.html  (%d counter lines)" % len(counter))


# =============================================================================
# 3. Mockup route index (also inside the real shell)
# =============================================================================
top3, bottom3 = load_shell()

ROUTES = [
    ("01", "/accessories/", "./accessories/index.html",
     "Existing page. Adds the <strong>Easy Fit filter bar</strong> above the grids, the orange "
     "<strong>Easy Fit badge</strong> on all qualifying product cards across all 14 truck-model sections, "
     "and a promo strip linking to the landing page and the dealer page. Tick the filter and empty sections "
     "collapse. State is written to the URL as <code>?fit=easy</code>."),
    ("02", "/vehicle/kenworth-k200/", "./vehicle/kenworth-k200/index.html",
     "Existing page. Same filter and badges, proving the attribute works on a model page without adding a "
     "new truck type. The Our Range grid was corrected to the real K200 categories, since the saved snapshot "
     "had captured the Mack listing."),
    ("03", "/products/aircleaner-panels/", "./products/aircleaner-panels/index.html",
     "Existing page. Adds the <strong>Easy Fit badge above the H1</strong> and a <strong>Fitting panel</strong> "
     "with fitting time, drilling, tools required and what is in the box, placed before the spec tabs."),
    ("04", "/accessories/easy-fit/", "./accessories/easy-fit/index.html",
     "New page, built inside the real site shell. Hero gallery of installed work, the range as a product grid "
     "with fitting detail on each card, how-it-works, FAQ, and <code>ItemList</code> + <code>FAQPage</code> JSON-LD."),
    ("05", "/dealers/easy-fit-range/", "./dealers/easy-fit-range/index.html",
     "New page, same shell. Dealer sales collateral, set to <code>noindex, follow</code>. Counter proposition, "
     "best counter lines and how to sell it."),
]

route_html = "".join(
    f'<li><span class="ef-step-n">{n}</span>'
    f'<div class="ef-route-body"><a class="ef-route-link" href="{href}">{label}</a><p>{desc}</p></div></li>'
    for n, label, href, desc in ROUTES)

i_hero = sec(
    '<p class="ef-kicker">Digilari &middot; Armoury Group</p>'
    '<h1 class="elementor-heading-title elementor-size-default">Easy Fit range mockup</h1>'
    '<h4 class="ef-hero-sub">All four approved items, applied to the real site code.</h4>'
    '<p class="ef-hero-body">Start at All Products and click through. The three existing pages are the live '
    'Armoury page source with the Easy Fit layer applied on top. The two new pages are built inside the same '
    'header, footer and theme, so the navigation and styling are the site\'s own.</p>'
    '<div class="ef-btnrow">' + btn("Start here: All Products", "./accessories/index.html") + '</div>',
    "ef-sec--hero")

i_routes = sec('<ol class="ef-routes">' + route_html + '</ol>', "ef-sec--dark")


i_content = ('<div class="ef-page-content">' + i_hero + i_routes + "</div>")

page3 = head_swap(top3, "Armoury Easy Fit Mockup | Digilari",
                  "Route index for the Armoury Easy Fit range mockup.",
                  robots="noindex, nofollow", root="./", page="index")
# shell links were written for a two-deep page; flatten them for the root
page3 = page3.replace('href="../../vehicle/kenworth-k200/index.html"', 'href="./vehicle/kenworth-k200/index.html"')
page3 = page3.replace('href="../../accessories/index.html"', 'href="./accessories/index.html"')
page3 = page3.replace('href="../../products/aircleaner-panels/index.html"', 'href="./products/aircleaner-panels/index.html"')
page3 = page3.replace('"../../vehicle/kenworth-k200/AG - Kenworth K200_files/', '"./vehicle/kenworth-k200/AG - Kenworth K200_files/')
page3 = page3.replace('"../../assets/', '"./assets/')
bottom3 = bottom3.replace('"../../vehicle/kenworth-k200/AG - Kenworth K200_files/', '"./vehicle/kenworth-k200/AG - Kenworth K200_files/')

doc3 = page3 + i_content + bottom3
# flatten every remaining two-deep relative path for the root-level page
doc3 = doc3.replace('"../../', '"./')
(ROOT / "index.html").write_text(doc3, encoding="utf-8")
print("built: index.html (route index)")
