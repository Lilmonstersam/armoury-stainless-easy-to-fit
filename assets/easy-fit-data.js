/* ==========================================================================
   Armoury Group | Easy Fit range - MOCKUP DATA
   --------------------------------------------------------------------------
   In production this comes from a single boolean product attribute
   ("Easy Fit") plus three text fields (fitting time, tools, drilling)
   set on each product category in WooCommerce. Nothing here is a new
   taxonomy, so products stay exactly where they already sit.

   The values below are PLACEHOLDER data for the mockup only. Armoury to
   confirm the real fitting times, tools and drilling requirements before
   this goes live.
   ========================================================================== */
window.EASY_FIT_DATA = {

  /* ---- Easy Fit: bolt-on, no drilling ---------------------------------- */
  "aircleaner-panels":                   { easyFit: true,  time: "30 min", tools: "Socket set, 4mm allen key", drill: false, box: "Panel pair, stainless fasteners, fitting template" },
  "mirrorbacks":                         { easyFit: true,  time: "20 min", tools: "Phillips driver", drill: false, box: "Mirror back pair, clips, fasteners" },
  "red-dot-cover":                       { easyFit: true,  time: "10 min", tools: "Phillips driver", drill: false, box: "Cover, 4 fasteners" },
  "tool-box-door-pocket":                { easyFit: true,  time: "25 min", tools: "Socket set", drill: false, box: "Pocket, mounting plate, fasteners" },
  "bonnet-latch-covers":                 { easyFit: true,  time: "15 min", tools: "Socket set", drill: false, box: "Cover pair, fasteners" },
  "hinge-covers":                        { easyFit: true,  time: "15 min", tools: "Phillips driver", drill: false, box: "Cover set, fasteners" },
  "kick-panels":                         { easyFit: true,  time: "30 min", tools: "Trim tool, Phillips driver", drill: false, box: "Panel pair, clips, fasteners" },
  "scuff-panels":                        { easyFit: true,  time: "30 min", tools: "Trim tool, Phillips driver", drill: false, box: "Panel set, clips, fasteners" },
  "wing-decals":                         { easyFit: true,  time: "20 min", tools: "Squeegee, isopropyl wipe", drill: false, box: "Decal pair, application kit" },
  "gear-stick-surround":                 { easyFit: true,  time: "10 min", tools: "None", drill: false, box: "Surround, clip retainer" },
  "air-vent-cover":                      { easyFit: true,  time: "10 min", tools: "Trim tool", drill: false, box: "Cover, clips" },
  "battery-box-cover":                   { easyFit: true,  time: "35 min", tools: "Socket set", drill: false, box: "Cover, brackets, fasteners" },
  "beacon-bracket":                      { easyFit: true,  time: "25 min", tools: "Socket set", drill: false, box: "Bracket, fasteners" },
  "driving-light-mount":                 { easyFit: true,  time: "30 min", tools: "Socket set, spanner", drill: false, box: "Mount pair, fasteners" },
  "grill-bar-mesh":                      { easyFit: true,  time: "40 min", tools: "Socket set", drill: false, box: "Bar and mesh, fasteners" },
  "headlight-surrounds":                 { easyFit: true,  time: "25 min", tools: "Phillips driver", drill: false, box: "Surround pair, clips" },
  "droopy-headlight-visor":              { easyFit: true,  time: "25 min", tools: "Socket set", drill: false, box: "Visor pair, brackets, fasteners" },
  "bug-deflectors":                      { easyFit: true,  time: "30 min", tools: "Socket set", drill: false, box: "Deflector set, brackets, fasteners" },
  "interior-double-watermelon-light-kit":{ easyFit: true,  time: "40 min", tools: "Phillips driver, wire crimper", drill: false, box: "Light kit, loom, connectors" },
  "mack-bunk-wing-decal":                { easyFit: true,  time: "20 min", tools: "Squeegee, isopropyl wipe", drill: false, box: "Decal pair, application kit" },
  "mack-alloy-deck-plate":               { easyFit: true,  time: "30 min", tools: "Socket set", drill: false, box: "Deck plate, fasteners" },
  "mack-precleaner-shroud":              { easyFit: true,  time: "25 min", tools: "Socket set", drill: false, box: "Shroud, clamp, fasteners" },

  /* ---- Workshop fit: drilling, trimming or alignment required ---------- */
  "flares":                              { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "steps-tank-skirts":                   { easyFit: false, time: "3-4 hrs",  tools: "Workshop fit", drill: true },
  "low-mount-guard-brackets":            { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "mudflap-brackets":                    { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "quarter-guards":                      { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "tail-light-bars-drop-sections":       { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "monster-look-exhaust-shroud":         { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "old-school-steps":                    { easyFit: false, time: "3-4 hrs",  tools: "Workshop fit", drill: true },
  "bunk-wings":                          { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "bunk-skirt-extensions":               { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "underdoor-panel":                     { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "sunvisors":                           { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "aircleaner-shrouds":                  { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "elephant-ears":                       { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "mack-under-door-panel":               { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "mack-tank-skirt":                     { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "mack-tail-light-bar-infil":           { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "mack-sunvisor":                       { easyFit: false, time: "2-3 hrs",  tools: "Workshop fit", drill: true },
  "mack-bunk-skirt":                     { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "adblue-tank-cover":                   { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "bunk-skirts":                         { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "drop-section":                        { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "egp-cover":                           { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "exhaust-shroud":                      { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "guard-infil":                         { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "tank-skirt":                          { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "tank-wrap":                           { easyFit: false, time: "3 hrs",    tools: "Workshop fit", drill: true },
  "tread-plate":                         { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "volvo-alloy-deck-plate":              { easyFit: false, time: "2 hrs",    tools: "Workshop fit", drill: true },
  "volvo-drive-guard-kit":               { easyFit: false, time: "3-4 hrs",  tools: "Workshop fit", drill: true }
};
