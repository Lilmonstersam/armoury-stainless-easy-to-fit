#!/usr/bin/env python3
"""
Armoury Group | Easy Fit mockup builder
--------------------------------------------------------------------------
Takes the three saved production pages that were copied into this folder and
applies the four approved changes:

  1. "Easy Fit" product attribute + filter (accessories hub, vehicle pages,
     product category pages)
  2. Cross-links to the curated /accessories/easy-fit/ landing page
  3. Easy Fit badge + fitting section on the product page
  4. Cross-link to the dealer-only /dealers/easy-fit-range/ page

It is idempotent: re-running it re-applies cleanly because every injected
node carries an ef- prefix and is removed first.
"""
import hashlib
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).parent


def asset_version(*names: str) -> str:
    """Short content hash of the shared assets.

    Appended to the CSS and JS URLs so a browser or the Pages CDN can never
    serve a stale stylesheet after a redeploy, which otherwise shows up as
    half-applied layout that is impossible to reproduce locally.
    """
    h = hashlib.sha256()
    for n in names:
        f = ROOT / "assets" / n
        if f.exists():
            h.update(f.read_bytes())
    return h.hexdigest()[:8]


VER = asset_version("easy-fit.css", "easy-fit.js", "easy-fit-data.js")

PAGES = {
    "accessories/index.html": {
        "root": "../",
        "page": "accessories",
        "product": None,
        "title": "Kenworth Truck Accessories | Armoury Group",
    },
    "vehicle/kenworth-k200/index.html": {
        "root": "../../",
        "page": "vehicle",
        "product": None,
        "title": "Kenworth K200 Stainless Accessories | Armoury Group",
    },
    "products/aircleaner-panels/index.html": {
        "root": "../../",
        "page": "product",
        "product": "aircleaner-panels",
        "title": "Kenworth Air Cleaner Panels | Bolt-On, No Drilling | Armoury Stainless",
    },
}

# Live URL -> local mockup path (relative to each page's own root)
LOCAL_ROUTES = {
    "https://armourygroup.com.au/accessories/": "accessories/index.html",
    "https://armourygroup.com.au/vehicle/kenworth-k200/": "vehicle/kenworth-k200/index.html",
    "https://armourygroup.com.au/vehicle/kenworth-k200-220/": "vehicle/kenworth-k200/index.html",
    "https://armourygroup.com.au/products/aircleaner-panels/": "products/aircleaner-panels/index.html",
}

# The K200 "OUR RANGE" grid in the saved snapshot had captured the Mack
# listing rather than the K200 one. Replaced with the real K200 categories
# so the Easy Fit filter demo is meaningful on that page.
K200_CATEGORIES = [
    ("battery-box-cover", "Battery Box Cover", "BATTERY-BOX-COVER-300x225.png"),
    ("bunk-wings", "Bunk Wings", "New-Project-9-300x202.jpg"),
    ("flares", "Flares", "quarter-guard.png"),
    ("grill-bar-mesh", "Grill Bar &amp; Mesh", "Mirror-Backs.png"),
    ("hinge-covers", "Hinge Covers", "HINGE-COVERS-300x225.png"),
    ("low-mount-guard-brackets", "Low Mount Guard Brackets", "Driving-light-brackets-300x196.png"),
    ("mirrorbacks", "Mirror Backs &amp; Mirror Panels", "Mirror-Backs.png"),
    ("old-school-steps", "Retro Fit Old-School Steps", "Retro-fit-step.png"),
    ("red-dot-cover", "Red Dot Cover", "air-VENT-COVER.pdf.png"),
    ("scuff-panels", "Scuff Panels", "scuff-panel-610-min-300x148.png"),
    ("steps-tank-skirts", "Steps &amp; Tank Skirts", "tank-skirt-300x225.jpg"),
    ("sunvisors", "Sunvisors", "sunvisor.webp"),
    ("tool-box-door-pocket", "Tool Box Door Pocket", "toolbox-door-poxket-black-300x169.png"),
    ("underdoor-panel", "Underdoor Panel", "Under-door-panel-scaled.jpg"),
    ("wing-decals", "Wing Decals", "kick-panels-610-min-300x169.png"),
]

LOOP_ITEM = """<div data-elementor-type="loop-item" data-elementor-id="2030" class="elementor elementor-2030 e-loop-item e-loop-item-{n} " data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
\t\t\t<div class="elementor-element elementor-element-9fe0b36 e-flex e-con-boxed e-con e-parent" data-id="9fe0b36" data-element_type="container" data-e-type="container">
\t\t\t\t\t<div class="e-con-inner">
\t\t\t\t<div class="elementor-element elementor-element-a62c4a9 elementor-widget__width-inherit elementor-widget elementor-widget-image" data-id="a62c4a9" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
\t\t\t\t<div class="elementor-widget-container">
\t\t\t\t\t<a href="{href}">
\t\t\t\t\t\t<img loading="lazy" width="1200" height="900" src="{img}" class="attachment-full size-full" alt="{alt}">\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="elementor-element elementor-element-a010225 elementor-widget__width-inherit heading-text elementor-widget elementor-widget-heading" data-id="a010225" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
\t\t\t\t<div class="elementor-widget-container">
\t\t\t\t\t<h2 class="elementor-heading-title elementor-size-default"><a href="{href}">{label}</a></h2>\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t</div>
"""

HEAD_BLOCK = """
<!-- ==== DIGILARI EASY FIT MOCKUP :: START ============================== -->
<link rel="stylesheet" href="{root}assets/easy-fit.css?v={ver}" id="ef-css">
<script src="{root}assets/easy-fit-data.js?v={ver}" id="ef-data"></script>
<script src="{root}assets/easy-fit.js?v={ver}" id="ef-js" defer></script>
<!-- Recommended production title for this page -->
<meta name="ef-recommended-title" content="{title}">
<!-- Hosting guard. This mockup reproduces armourygroup.com.au, so the hosted
     copy must never be indexed. Production robots directives are documented in
     Armoury-Easy-Fit-Build-Notes.docx, not here. -->
<meta name="robots" content="noindex, nofollow">
<!-- ==== DIGILARI EASY FIT MOCKUP :: END ================================ -->
"""


def strip_previous(html: str) -> str:
    return re.sub(
        r"\n?<!-- ==== DIGILARI EASY FIT MOCKUP :: START.*?"
        r"MOCKUP :: END ================================ -->\n?",
        "",
        html,
        flags=re.S,
    )


def rewrite_links(html: str, root: str) -> str:
    for live, local in LOCAL_ROUTES.items():
        # exact href matches only, so anchors/feeds are left alone
        html = html.replace('href="%s"' % live, 'href="%s%s"' % (root, local))
    return html


def set_html_attrs(html: str, cfg) -> str:
    def repl(m):
        tag = m.group(0)
        tag = re.sub(r'\s+data-ef-(root|page|product)="[^"]*"', "", tag)
        add = ' data-ef-root="%s" data-ef-page="%s"' % (cfg["root"], cfg["page"])
        if cfg["product"]:
            add += ' data-ef-product="%s"' % cfg["product"]
        return tag[:-1] + add + ">"

    return re.sub(r"<html[^>]*>", repl, html, count=1)


def fix_k200_grid(html: str) -> str:
    """Replace the mis-captured Mack listing with the real K200 categories."""
    start = html.find('<div class="elementor-loop-container elementor-grid"')
    if start < 0:
        return html
    # first loop item after that container
    first = html.find("data-elementor-type=\"loop-item\"", start)
    if first < 0:
        return html
    first = html.rfind("<", 0, first)
    # end of the container = the closing of the loop container div, which is
    # immediately followed by the widget's closing markup. Find the marker
    # that ends the grid: the next occurrence of '</div>\n\t\t\t\t</div>' after
    # the final loop item. Simpler and safer: cut at the next
    # 'elementor-widget-container' close that precedes the following widget.
    end_marker = html.find('<div class="elementor-element', first)
    # walk forward through consecutive loop items
    pos = first
    last_end = first
    while True:
        nxt = html.find('data-elementor-type="loop-item"', pos + 10)
        if nxt < 0:
            break
        nxt_tag = html.rfind("<", 0, nxt)
        if nxt_tag > first + 400000:
            break
        # stop once we leave this container
        if html.count('<div class="elementor-loop-container', first, nxt_tag) > 0:
            break
        last_end = nxt_tag
        pos = nxt
    # end of the last loop item: three closing divs after its inner content
    tail = html.find("</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n", last_end)
    if tail < 0:
        return html
    tail += len("</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n")

    items = []
    for i, (slug, label, img) in enumerate(K200_CATEGORIES):
        items.append(
            LOOP_ITEM.format(
                n=900 + i,
                href="https://armourygroup.com.au/products/%s/" % slug,
                img="../../accessories/AG - Accessories_files/%s" % img,
                alt=re.sub("&amp;", "and", label),
                label=label,
            )
        )
    return html[:first] + "".join(items) + html[tail:]


def main():
    for rel, cfg in PAGES.items():
        p = ROOT / rel
        html = p.read_text(encoding="utf-8", errors="replace")
        html = strip_previous(html)

        if rel.startswith("vehicle/"):
            before = html.count("e-loop-item")
            html = fix_k200_grid(html)
            print("  k200 grid: loop items %d -> %d" % (before, html.count("e-loop-item")))

        html = rewrite_links(html, cfg["root"])
        html = set_html_attrs(html, cfg)

        block = HEAD_BLOCK.format(root=cfg["root"], title=cfg["title"], ver=VER)
        if "</head>" not in html:
            print("!! no </head> in", rel, file=sys.stderr)
            continue
        # Remove the saved page's own robots directive so the noindex above wins.
        html = re.sub(r'<meta name="robots" content="[^"]*"\s*/?>', "", html)
        html = html.replace("</head>", block + "</head>", 1)

        p.write_text(html, encoding="utf-8")
        print("built:", rel, "(%.1f KB)" % (len(html) / 1024))


if __name__ == "__main__":
    main()
