
/* The two mockups deploy independently. Use sibling files only in local previews. */
(() => {
  const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if (!local) return;
  document.querySelectorAll('a[data-ag-preview-href]').forEach(link => {
    link.setAttribute('href', link.dataset.agPreviewHref);
  });
})();
