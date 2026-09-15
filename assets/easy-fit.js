/* ==========================================================================
   Armoury Group | Easy Fit range - mockup behaviour
   --------------------------------------------------------------------------
   Demonstrates the approved approach:
     1. "Easy Fit" as a product ATTRIBUTE + filter (not a truck type)
     2. Badge on every qualifying product card
     3. Fitting panel on product pages
     4. Cross-links to the /accessories/easy-fit/ hub and the dealer page

   In production the attribute would be rendered server-side as a data
   attribute on each loop item (e.g. data-ef="1") and the filter would be a
   WooCommerce/Elementor facet using ?fit=easy. This script fakes that by
   matching the product-category slug in each card's link.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.EASY_FIT_DATA || {};
  var ROOT = document.documentElement.getAttribute("data-ef-root") || "../../";
  var PARAM = "fit";
  var VALUE = "easy";

  var BOLT_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.2h6.1L9.4 22 20 10.4h-6.3L13.5 2z"/></svg>';

  function slugFromHref(href) {
    if (!href) return null;
    var m = href.match(/\/products\/([^\/?#"]+)/);
    return m ? m[1] : null;
  }

  function meta(slug) {
    return Object.prototype.hasOwnProperty.call(DATA, slug) ? DATA[slug] : null;
  }

  /* ---------------------------------------------------------------------- */
  /* 1. Tag every product card with its Easy Fit state                       */
  /* ---------------------------------------------------------------------- */
  function tagCards() {
    var cards = document.querySelectorAll(".e-loop-item");
    var total = 0,
      easy = 0;

    Array.prototype.forEach.call(cards, function (card) {
      if (card.hasAttribute("data-ef")) return;
      var link = card.querySelector('a[href*="/products/"]');
      var slug = slugFromHref(link && link.getAttribute("href"));
      var m = slug ? meta(slug) : null;
      if (!m) {
        card.setAttribute("data-ef", "unknown");
        return;
      }
      total++;
      card.setAttribute("data-ef", m.easyFit ? "1" : "0");
      card.setAttribute("data-ef-slug", slug);
      if (m.easyFit) {
        easy++;
        var b = document.createElement("span");
        b.className = "ef-badge";
        b.innerHTML = BOLT_SVG + "Easy Fit";
        b.title = "Bolt-on. No drilling. About " + m.time + " to fit.";
        card.appendChild(b);
      }
    });
    return { total: total, easy: easy };
  }

  /* ---------------------------------------------------------------------- */
  /* 2. Filter bar                                                           */
  /* ---------------------------------------------------------------------- */
  function buildFilterBar(counts) {
    var firstGrid = document.querySelector(".elementor-loop-container");
    if (!firstGrid) return null;

    var bar = document.createElement("div");
    bar.className = "ef-filterbar";
    bar.setAttribute("role", "search");
    bar.innerHTML =
      '<span class="ef-filterbar__label">Filter</span>' +
      '<label class="ef-toggle">' +
      '<input type="checkbox" id="ef-only">' +
      '<span class="ef-toggle__box" aria-hidden="true"></span>' +
      '<span class="ef-toggle__text">Easy Fit only' +
      '<span class="ef-toggle__sub">Bolt-on. No drilling.</span></span>' +
      "</label>" +
      '<button type="button" class="ef-filterbar__clear" id="ef-clear" hidden>Clear filter</button>' +
      '<span class="ef-filterbar__count" id="ef-count">Showing <b>' +
      counts.total +
      "</b> of <b>" +
      counts.total +
      "</b> products</span>";

    // Insert above the first product grid, at the top of its Elementor section.
    var anchor = firstGrid.closest(".e-con") || firstGrid.parentNode;
    anchor.parentNode.insertBefore(bar, anchor);
    return bar;
  }

  function apply(on, counts) {
    var cards = document.querySelectorAll(".e-loop-item[data-ef]");
    Array.prototype.forEach.call(cards, function (card) {
      var isEasy = card.getAttribute("data-ef") === "1";
      card.classList.toggle("ef-hidden", on && !isEasy);
    });

    // Hide any section whose grid is now empty (keeps the page tidy).
    Array.prototype.forEach.call(
      document.querySelectorAll(".elementor-loop-container"),
      function (grid) {
        var visible = grid.querySelectorAll(".e-loop-item:not(.ef-hidden)").length;
        var section = grid.closest(".e-con.e-child") || grid.closest(".e-con");
        if (section) section.classList.toggle("ef-hidden", on && visible === 0);
      }
    );

    var count = document.getElementById("ef-count");
    if (count) {
      count.innerHTML =
        "Showing <b>" +
        (on ? counts.easy : counts.total) +
        "</b> of <b>" +
        counts.total +
        "</b> products" +
        (on ? " &middot; Easy Fit only" : "");
    }
    var clear = document.getElementById("ef-clear");
    if (clear) clear.hidden = !on;

    // Reflect state in the URL exactly as the production facet would.
    try {
      var url = new URL(window.location.href);
      if (on) url.searchParams.set(PARAM, VALUE);
      else url.searchParams.delete(PARAM);
      window.history.replaceState({}, "", url);
    } catch (e) {
      /* file:// - ignore */
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 3a. Breadcrumbs (missing from the production product template)          */
  /* ---------------------------------------------------------------------- */
  function breadcrumbs(items) {
    if (document.querySelector(".ef-crumbs")) return;
    var nav = document.createElement("nav");
    nav.className = "ef-crumbs ef-crumbs--injected";
    nav.setAttribute("aria-label", "Breadcrumb");
    nav.innerHTML =
      "<ol>" +
      items
        .map(function (it) {
          return it[1]
            ? '<li><a href="' + it[1] + '">' + it[0] + "</a></li>"
            : '<li aria-current="page">' + it[0] + "</li>";
        })
        .join("") +
      "</ol>";

    var main = document.querySelector(
      '[data-elementor-type="product-archive"], [data-elementor-type="archive"], .elementor-location-archive'
    );
    if (main && main.parentNode) main.parentNode.insertBefore(nav, main);
    else document.body.insertBefore(nav, document.body.firstChild);

    // BreadcrumbList schema for the same trail.
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map(function (it, i) {
        return { "@type": "ListItem", position: i + 1, name: it[0] };
      }),
    });
    document.head.appendChild(ld);
  }

  /* ---------------------------------------------------------------------- */
  /* 3b. Product Specs layout                                                */
  /*                                                                         */
  /*  Production puts Product Specs in a half-width Elementor column, so the */
  /*  variants table (which needs ~820px) scrolls sideways and the project   */
  /*  photos sit in a cramped static grid underneath.                        */
  /*                                                                         */
  /*  Restructured into one full-width band:                                 */
  /*    Product Specs heading                                                */
  /*    -> project photos as a horizontal carousel                           */
  /*    -> description / key advantages / installation in three columns      */
  /*    -> the variants table at full width, nothing cut off                 */
  /*    -> View quote                                                        */
  /* ---------------------------------------------------------------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* Split the single description blob into intro / advantages / installation */
  function splitDescription(source) {
    var blocks = [{ title: null, nodes: [] }];
    Array.prototype.forEach.call(source.childNodes, function (node) {
      var isHeading =
        node.nodeType === 1 &&
        node.tagName === "P" &&
        node.querySelector('span[style*="bold"], strong, b') &&
        node.textContent.trim().length < 60;
      if (isHeading) blocks.push({ title: node.textContent.trim(), nodes: [] });
      else blocks[blocks.length - 1].nodes.push(node);
    });
    return blocks.filter(function (b) {
      return b.title || b.nodes.some(function (n) { return (n.textContent || "").trim(); });
    });
  }

  function caption(alt) {
    var t = (alt || "").split("|")[0].trim();
    // drop trailing file-name style codes: "- IMG 3209", "- 20240412 085252"
    t = t.replace(/[-–]\s*(IMG|DJI|DSC)?\s*[\d_ ]{4,}$/i, "").trim();
    if (t.length < 12) return "";
    return t;
  }

  function buildShots(container) {
    var imgs = container.querySelectorAll(".elementor-widget-image img");
    if (imgs.length < 2) return null;

    var wrap = el("div", "ef-shots");
    wrap.setAttribute("data-ef-shots", "");
    var track = el("div", "ef-shots__track");

    /* Several photos share the same alt text on the live site. A caption that
       repeats on three tiles adds nothing, so only keep the unique ones. */
    var seen = {};
    Array.prototype.forEach.call(imgs, function (img) {
      var c = caption(img.getAttribute("alt"));
      if (c) seen[c] = (seen[c] || 0) + 1;
    });

    Array.prototype.forEach.call(imgs, function (img) {
      var fig = el("figure", "ef-shots__item");
      var clone = img.cloneNode(true);
      clone.removeAttribute("width");
      clone.removeAttribute("height");
      clone.setAttribute("loading", "lazy");
      fig.appendChild(clone);
      var cap = caption(img.getAttribute("alt"));
      if (cap && seen[cap] === 1) fig.appendChild(el("figcaption", null, cap));
      track.appendChild(fig);
    });

    wrap.appendChild(el("button", "ef-shots__nav ef-shots__nav--prev", "&#8249;"));
    wrap.appendChild(track);
    wrap.appendChild(el("button", "ef-shots__nav ef-shots__nav--next", "&#8250;"));
    wrap.querySelector(".ef-shots__nav--prev").setAttribute("aria-label", "Previous images");
    wrap.querySelector(".ef-shots__nav--next").setAttribute("aria-label", "Next images");
    return wrap;
  }

  function wireShots() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-ef-shots]"), function (w) {
      var track = w.querySelector(".ef-shots__track");
      function step(dir) {
        var item = track.querySelector(".ef-shots__item");
        var by = item ? item.getBoundingClientRect().width + 16 : 320;
        track.scrollBy({ left: dir * by, behavior: "smooth" });
      }
      w.querySelector(".ef-shots__nav--prev").addEventListener("click", function () { step(-1); });
      w.querySelector(".ef-shots__nav--next").addEventListener("click", function () { step(1); });

      function sync() {
        var max = track.scrollWidth - track.clientWidth - 2;
        w.classList.toggle("at-start", track.scrollLeft <= 2);
        w.classList.toggle("at-end", track.scrollLeft >= max);
      }
      track.addEventListener("scroll", sync);
      window.addEventListener("resize", sync);
      sync();
    });
  }

  function specsLayout() {
    var table = document.querySelector(".specs-wrapper, .stainless-spec-table");
    if (!table) return;
    var tableWidget = table.closest(".elementor-widget-shortcode") || table.parentNode;
    var specsCol = tableWidget.closest(".e-con.e-child");
    var topRow = tableWidget.closest(".e-con.e-parent");
    if (!specsCol || !topRow || !topRow.parentNode) return;

    /* The project photos are the sibling container holding plain image
       widgets. Skip the product-render gallery, which is a loop grid. */
    var shotsCol = null,
      best = 0;
    Array.prototype.forEach.call(topRow.children, function (c) {
      if (c === specsCol) return;
      if (c.querySelector(".elementor-widget-loop-grid")) return;
      var n = c.querySelectorAll(":scope > .elementor-widget-image img").length;
      if (n >= 3 && n > best) {
        best = n;
        shotsCol = c;
      }
    });

    /* ---- 1. project photos: own band above Product Specs, no heading ---- */
    var shotsBand = null;
    if (shotsCol) {
      var shots = buildShots(shotsCol);
      if (shots) {
        shotsBand = el("section", "ef-shotsband");
        var sInner = el("div", "ef-shotsband__inner");
        sInner.appendChild(shots);
        shotsBand.appendChild(sInner);
      }
      shotsCol.parentNode.removeChild(shotsCol);
    }

    /* ---- 2. Product Specs: heading, then details | table in two columns ---- */
    var band = el("section", "ef-specs");
    band.id = "product-specs";
    var inner = el("div", "ef-specs__inner");
    band.appendChild(inner);

    var headWidget = specsCol.querySelector(".elementor-widget-heading");
    var headText = (headWidget && headWidget.textContent.trim()) || "Product Specs";
    inner.appendChild(el("h2", "ef-specs__title", headText));
    if (headWidget) headWidget.parentNode.removeChild(headWidget);

    var grid = el("div", "ef-specs__grid");
    var details = el("div", "ef-specs__details");
    var tableCol = el("div", "ef-specs__tablecol");
    grid.appendChild(details);
    grid.appendChild(tableCol);
    inner.appendChild(grid);

    /* left column: description, key advantages, installation */
    var descWidget = specsCol.querySelector(".elementor-widget-heading");
    var descSource = descWidget && descWidget.querySelector(".elementor-heading-title");
    if (descSource) {
      splitDescription(descSource).forEach(function (b, i) {
        var blk = el("div", "ef-specs__block" + (i === 0 ? " ef-specs__block--lead" : ""));
        if (b.title) blk.appendChild(el("h3", null, b.title));
        b.nodes.forEach(function (n) { blk.appendChild(n.cloneNode(true)); });
        details.appendChild(blk);
      });
      descWidget.parentNode.removeChild(descWidget);
    }

    /* right column: the variants table */
    tableCol.appendChild(el("h3", "ef-specs__subtitle", "Sizes, part numbers and models"));
    var tableBox = el("div", "ef-specs__table");
    tableBox.appendChild(tableWidget);
    tableCol.appendChild(tableBox);

    /* anything left over (View quote button, etc.) goes under the table */
    var rest = el("div", "ef-specs__actions");
    while (specsCol.firstChild) rest.appendChild(specsCol.firstChild);
    if (rest.textContent.trim() || rest.querySelector("a,button")) tableCol.appendChild(rest);
    specsCol.parentNode.removeChild(specsCol);

    var after = topRow.nextSibling;
    if (shotsBand) topRow.parentNode.insertBefore(shotsBand, after);
    topRow.parentNode.insertBefore(band, after);
    wireShots();
  }

  /* ---------------------------------------------------------------------- */
  /* 3. Product page: H1 badge + fitting panel                               */
  /* ---------------------------------------------------------------------- */
  function productPage() {
    var slug = document.documentElement.getAttribute("data-ef-product");
    if (!slug) return;
    var m = meta(slug);
    if (!m || !m.easyFit) return;

    breadcrumbs([
      ["Home", ROOT + "accessories/index.html"],
      ["All Products", ROOT + "accessories/index.html"],
      ["Air Cleaner Panels", null],
    ]);
    specsLayout();

    var h1 = document.querySelector("h1.elementor-heading-title");
    if (h1) {
      var a = document.createElement("a");
      a.className = "ef-h1badge";
      a.href = ROOT + "accessories/easy-fit/index.html";
      a.innerHTML = BOLT_SVG + "Easy Fit &middot; Bolt-on, no drilling";
      h1.parentNode.insertBefore(a, h1);
    }

    var panel = document.createElement("section");
    panel.className = "ef-fitting";
    panel.id = "fitting";
    panel.innerHTML =
      '<div class="ef-fitting__head">' +
      '<span class="ef-fitting__tag">' +
      BOLT_SVG +
      "Easy Fit</span>" +
      "<h2>Fitting</h2></div>" +
      '<dl class="ef-fitting__grid">' +
      '<div class="ef-fitting__cell"><dt>Fitting time</dt><dd>' +
      m.time +
      "<small>Per pair, one person</small></dd></div>" +
      '<div class="ef-fitting__cell"><dt>Drilling</dt><dd>Not required<small>Uses factory mounting points</small></dd></div>' +
      '<div class="ef-fitting__cell"><dt>Tools required</dt><dd>' +
      m.tools +
      "<small>No specialist tooling</small></dd></div>" +
      '<div class="ef-fitting__cell"><dt>In the box</dt><dd>' +
      (m.box || "Product, fasteners") +
      "<small>Everything needed to fit</small></dd></div>" +
      "</dl>" +
      '<div class="ef-fitting__foot"><span>Not confident fitting it yourself? Any Kenworth dealer can fit it for you.</span>' +
      '<a href="' +
      ROOT +
      'accessories/easy-fit/index.html">See the full Easy Fit range &rsaquo;</a></div>';

    // Sits under the Product Specs section, so the reader gets the product
    // detail first and the fitting promise as the closing argument.
    var specs = document.querySelector(".ef-specs");
    if (specs && specs.parentNode) {
      specs.parentNode.insertBefore(panel, specs.nextSibling);
      return;
    }
    var h1Section = h1 && (h1.closest(".e-con.e-parent") || h1.closest(".e-con"));
    if (h1Section && h1Section.parentNode) {
      h1Section.parentNode.insertBefore(panel, h1Section.nextSibling);
    } else {
      document.body.appendChild(panel);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 3c. Model rows lifted from the spec / Add to Quote table                 */
  /* ---------------------------------------------------------------------- */
  function specRows() {
    var rows = document.querySelectorAll(
      ".stainless-spec-row:not(.stainless-spec-header)"
    );
    var out = [];
    Array.prototype.forEach.call(rows, function (row) {
      var cells = row.children;
      if (cells.length < 4) return;
      var add = row.querySelector(
        ".product-actions a:not(.brochure-button)"
      );
      if (!add) return;
      out.push({
        desc: (cells[0].textContent || "").trim(),
        sku: (cells[1].textContent || "").trim(),
        vehicle: (cells[2].textContent || "").trim(),
        add: add,
      });
    });
    return out;
  }

  /* ---------------------------------------------------------------------- */
  /* 3d. Persistent add bar                                                  */
  /*                                                                         */
  /*  The whole conversion decision lives in one table roughly a third of    */
  /*  the way down the page. Once it scrolls past, there is nothing to buy   */
  /*  from until the footer. The bar re-attaches that decision to the rest   */
  /*  of the page: it appears only after the table leaves the viewport, and  */
  /*  carries the model picker, the order number and the primary CTA.        */
  /*                                                                         */
  /*  The CTA forwards the click to the matching row in the table rather     */
  /*  than duplicating the cart logic, so the bar can never drift out of     */
  /*  step with whatever the production add-to-quote script does.            */
  /* ---------------------------------------------------------------------- */
  function stickyBar() {
    if (document.querySelector(".ef-sticky")) return;
    var items = specRows();
    if (!items.length) return;

    var h1 = document.querySelector("h1.elementor-heading-title");
    var title = (h1 && h1.textContent.trim()) || "Product";

    var bar = el("div", "ef-sticky");
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML =
      '<div class="ef-sticky__inner">' +
      '<div class="ef-sticky__model">' +
      '<span class="ef-sticky__eyebrow">' +
      title +
      "</span>" +
      '<div class="ef-sticky__pick">' +
      '<div class="ef-sticky__selectwrap">' +
      '<select class="ef-sticky__select" id="ef-sticky-select" aria-label="Choose model"></select>' +
      "</div>" +
      '<span class="ef-sticky__spec" id="ef-sticky-spec"></span>' +
      "</div>" +
      "</div>" +
      '<div class="ef-sticky__actions">' +
      '<span class="ef-sticky__sku">Order no. <b id="ef-sticky-sku"></b></span>' +
      '<button type="button" class="ef-sticky__cta" id="ef-sticky-add">Add to Cart</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(bar);

    var select = bar.querySelector("#ef-sticky-select");
    var spec = bar.querySelector("#ef-sticky-spec");
    var sku = bar.querySelector("#ef-sticky-sku");
    var cta = bar.querySelector("#ef-sticky-add");

    items.forEach(function (it, i) {
      var opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = it.desc;
      select.appendChild(opt);
    });

    var current = 0;
    function paint() {
      var it = items[current];
      select.value = String(current);
      select.title = it.desc;
      spec.textContent = it.vehicle;
      spec.title = it.vehicle;
      sku.textContent = it.sku;
    }
    paint();

    select.addEventListener("change", function () {
      current = parseInt(select.value, 10) || 0;
      paint();
    });

    /* Mirror the table button's own state so the bar never claims an add
       the production script did not actually make. */
    cta.addEventListener("click", function () {
      var source = items[current].add;
      if (!source) return;
      var label = "Add to Cart";
      cta.disabled = true;
      cta.textContent = "Adding…";
      source.click();

      var ticks = 0;
      var poll = setInterval(function () {
        ticks++;
        var state = (source.textContent || "").trim();
        var done = /^added/i.test(state) || /try again/i.test(state);
        if (!done && ticks < 16) return;
        clearInterval(poll);
        cta.textContent = /try again/i.test(state) ? "Try again" : "Added ✓";
        setTimeout(function () {
          cta.textContent = label;
          cta.disabled = false;
        }, 1600);
      }, 250);
    });

    /* Always on: the bar is the page's standing add-to-quote control, not a
       scroll reveal, so it is shown from first paint and never hidden.
       The theme's own .hellochild__body-wrap is the block that scrolls, so the
       spacer keeping the footer clear of the bar goes on it, not on body. */
    var wrap = document.querySelector(".hellochild__body-wrap") || document.body;
    function size() {
      var h = (bar.offsetHeight || 80) + 8;
      document.documentElement.style.setProperty("--ef-sticky-h", h + "px");
      wrap.style.paddingBottom = h + "px";
    }
    bar.classList.add("is-on");
    bar.setAttribute("aria-hidden", "false");
    document.body.classList.add("ef-sticky-on");
    size();
    window.addEventListener("resize", size);
  }

  /* ---------------------------------------------------------------------- */
  /* 3e. "View All" on the Other Products grid                               */
  /* ---------------------------------------------------------------------- */
  function otherProductsViewAll() {
    if (document.querySelector(".ef-viewall")) return;
    var head = null;
    Array.prototype.forEach.call(
      document.querySelectorAll(".elementor-widget-heading .elementor-heading-title"),
      function (h) {
        if (!head && h.textContent.trim().toLowerCase() === "other products") head = h;
      }
    );
    if (!head) return;
    var section = head.closest(".e-con-inner") || head.closest(".e-con");
    if (!section) return;
    var grid = section.querySelector(".elementor-widget-wc-categories, .woocommerce");
    var row = el(
      "div",
      "ef-viewall",
      '<a class="ef-btn" href="https://armourygroup.com.au/accessories/">View All</a>'
    );
    var host = (grid && grid.closest(".elementor-widget")) || grid;
    if (host && host.parentNode) host.parentNode.insertBefore(row, host.nextSibling);
    else section.appendChild(row);
  }

  /* ---------------------------------------------------------------------- */
  /* 3f. Contact CTA in place of the end-of-page enquiry form                */
  /*                                                                         */
  /*  A ten-field form at the bottom of a product page competes with the     */
  /*  add-to-quote path above it and collects the same information twice.    */
  /*  Replaced with a single contact route, so the page ends with one ask.   */
  /* ---------------------------------------------------------------------- */
  function contactCta() {
    if (document.querySelector(".ef-contactcta")) return;
    var widget =
      document.querySelector("#quote.elementor-widget-form") ||
      document.querySelector(".elementor-widget-form");
    if (!widget || !widget.parentNode) return;

    /* The form sits alone on a white Elementor card. Swap the card, not just
       the form, or the CTA is left floating in a block of leftover white. */
    var host = widget;
    var card = widget.closest(".e-con.e-child");
    if (card && card.querySelectorAll(".elementor-widget").length === 1) host = card;

    var cta = el("div", "ef-contactcta");
    cta.id = "quote";
    cta.innerHTML =
      '<p class="ef-contactcta__kicker">Talk to the team</p>' +
      "<p class=\"ef-contactcta__text\">Tell us your truck model and what you are after. " +
      "We will confirm sizes, part numbers and your nearest fitting dealer.</p>" +
      '<div class="ef-contactcta__row">' +
      '<a class="ef-contactcta__btn" href="https://armourygroup.com.au/contact-stainless/">Contact us</a>' +
      '<a class="ef-contactcta__btn ef-contactcta__btn--ghost" href="https://armourygroup.com.au/brochure/" target="_blank" rel="noopener">Download Brochures</a>' +
      "</div>" +
      '<p class="ef-contactcta__meta">' +
      '<a href="tel:1300005576">1300 005 576</a>' +
      '<a href="mailto:sales@armourygroup.com.au">sales@armourygroup.com.au</a>' +
      "</p>";
    host.parentNode.replaceChild(cta, host);
  }

  /* ---------------------------------------------------------------------- */
  /* 3g. Product page extras that do not depend on the Easy Fit attribute    */
  /* ---------------------------------------------------------------------- */
  function productExtras() {
    if (document.documentElement.getAttribute("data-ef-page") !== "product") return;
    stickyBar();
    otherProductsViewAll();
    contactCta();
  }

  /* ---------------------------------------------------------------------- */
  /* 4. Hero gallery carousel (new pages)                                    */
  /* ---------------------------------------------------------------------- */
  function galleries() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-ef-gallery]"),
      function (gal) {
        var track = gal.querySelector(".ef-gal__track");
        var slides = gal.querySelectorAll(".ef-gal__slide");
        var dots = gal.querySelectorAll(".ef-gal__dot");
        if (!track || slides.length < 2) return;
        var i = 0;
        var timer = null;

        function go(n) {
          i = (n + slides.length) % slides.length;
          track.style.transform = "translateX(" + -i * 100 + "%)";
          Array.prototype.forEach.call(dots, function (d, k) {
            d.classList.toggle("is-active", k === i);
          });
        }
        function start() {
          stop();
          timer = setInterval(function () { go(i + 1); }, 5000);
        }
        function stop() { if (timer) clearInterval(timer); timer = null; }

        gal.querySelector(".ef-gal__nav--prev").addEventListener("click", function () { go(i - 1); start(); });
        gal.querySelector(".ef-gal__nav--next").addEventListener("click", function () { go(i + 1); start(); });
        Array.prototype.forEach.call(dots, function (d, k) {
          d.addEventListener("click", function () { go(k); start(); });
        });
        gal.addEventListener("mouseenter", stop);
        gal.addEventListener("mouseleave", start);

        go(0);
        start();
      }
    );
  }

  /* ---------------------------------------------------------------------- */
  /* 5. Promo strip on the accessories hub                                   */
  /* ---------------------------------------------------------------------- */
  function promoStrip() {
    if (document.documentElement.getAttribute("data-ef-page") !== "accessories")
      return;
    var bar = document.querySelector(".ef-filterbar");
    if (!bar) return;
    var promo = document.createElement("aside");
    promo.className = "ef-promo";
    promo.innerHTML =
      '<div class="ef-promo__body">' +
      '<p class="ef-promo__kicker">New</p>' +
      "<h2>Fit it yourself in under an hour</h2>" +
      "<p>Twenty-two of our stainless accessories bolt straight to factory mounting points. " +
      "No drilling, no fabrication, no workshop booking. Filter the range above, or see the " +
      "whole Easy Fit range on one page with fitting times, tools and what is in the box.</p>" +
      "</div>" +
      '<div class="ef-btnrow">' +
      '<a class="ef-btn" href="' +
      ROOT +
      'accessories/easy-fit/index.html">View the Easy Fit range</a>' +
      '<a class="ef-btn" href="' +
      ROOT +
      'dealers/easy-fit-range/index.html">Dealers: stock this range</a>' +
      "</div>";
    bar.parentNode.insertBefore(promo, bar.nextSibling);
  }

  /* ---------------------------------------------------------------------- */
  function mockupFlag() {
    var f = document.createElement("div");
    f.className = "ef-mockup-flag";
    f.innerHTML =
      "Digilari mockup &middot; <b>Easy Fit</b> attribute, filter, badge &amp; landing page";
    document.body.appendChild(f);
  }

  function init() {
    var counts = tagCards();
    productPage();
    productExtras();
    galleries();

    if (counts.total > 0 && document.querySelector(".elementor-loop-container")) {
      var bar = buildFilterBar(counts);
      if (bar) {
        promoStrip();
        var box = document.getElementById("ef-only");
        var clear = document.getElementById("ef-clear");
        box.addEventListener("change", function () {
          apply(box.checked, counts);
        });
        clear.addEventListener("click", function () {
          box.checked = false;
          apply(false, counts);
          bar.scrollIntoView({ block: "start", behavior: "smooth" });
        });
        // Deep link support: /accessories/?fit=easy
        var on = false;
        try {
          on = new URL(window.location.href).searchParams.get(PARAM) === VALUE;
        } catch (e) {}
        if (on) {
          box.checked = true;
        }
        apply(on, counts);
      }
    }
    mockupFlag();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
