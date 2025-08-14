/* secure-links.js
 * Front-end-only hardening:
 * - Force noopener/noreferrer on all new-tab/external opens (incl. middle-click + programmatic window.open)
 * - Scrub auth-like tokens from the current URL (query/hash) via history.replaceState
 * - Add rel/referrerpolicy attributes to anchors now and in the future (MutationObserver)
 * - Basic frame-busting fallback (CSP also handles this)
 */

(function () {
  // ---- 0) Helpers -----------------------------------------------------------
  function isExternal(a) {
    // If anchor has a host and it's not our host, treat as external
    return a.host && a.host !== location.host;
  }

  function ensureRelNoopenerNoreferrer(a) {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer'); rel.add('nofollow');
    a.setAttribute('rel', Array.from(rel).join(' '));
  }

  function secureOpen(url) {
    // Always force noopener,noreferrer
    window.__ssv_orig_open = window.__ssv_orig_open || window.open.bind(window);
    return window.__ssv_orig_open(url, '_blank', 'noopener,noreferrer');
  }

  // ---- 1) Harden all anchors (now + future) --------------------------------
  function hardenAnchor(a) {
    if (!a || !a.href) return;

    const opensNewTab = (a.getAttribute('target') || '').toLowerCase() === '_blank';
    if (opensNewTab || isExternal(a)) {
      ensureRelNoopenerNoreferrer(a);
      a.setAttribute('referrerpolicy', 'no-referrer');

      if (!a.__ssvSecuredClick) {
        a.addEventListener('click', function (e) {
          // Route external/_blank navigations through secure window.open
          if (isExternal(a) || opensNewTab) {
            e.preventDefault();
            secureOpen(a.href);
          }
        });
        Object.defineProperty(a, '__ssvSecuredClick', { value: true });
      }

      if (!a.__ssvSecuredAux) {
        // Middle-click / auxclick hardened as well
        a.addEventListener('auxclick', function (e) {
          if (e.button === 1 && (isExternal(a) || opensNewTab)) {
            e.preventDefault();
            secureOpen(a.href);
          }
        });
        Object.defineProperty(a, '__ssvSecuredAux', { value: true });
      }
    }
  }

  function hardenAllAnchors() {
    document.querySelectorAll('a[href]').forEach(hardenAnchor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hardenAllAnchors);
  } else {
    hardenAllAnchors();
  }

  // Future/injected anchors
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === 'A' && node.href) hardenAnchor(node);
        const anchors = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
        anchors.forEach(hardenAnchor);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // ---- 2) Force-safe window.open globally ----------------------------------
  (function reinforceWindowOpen() {
    if (window.__ssv_wrapped_open) return;
    const origOpen = window.open;
    window.open = function (url, target, features) {
      const enforced = features ? features + ',noopener,noreferrer' : 'noopener,noreferrer';
      // If target absent, force _blank so opener is definitely null
      return origOpen.call(window, url, target || '_blank', enforced);
    };
    Object.defineProperty(window, '__ssv_wrapped_open', { value: true });
  })();

  // ---- 3) Strip sensitive tokens from current URL ---------------------------
  (function stripTokensFromURL() {
    try {
      const url = new URL(window.location.href);
      const SENSITIVE = new Set(['token','access_token','id_token','jwt','session','code','auth']);
      let changed = false;

      // Query
      for (const key of Array.from(url.searchParams.keys())) {
        if (SENSITIVE.has(key.toLowerCase())) {
          url.searchParams.delete(key);
          changed = true;
        }
      }

      // Hash (e.g., #access_token=...)
      if (url.hash) {
        const hash = url.hash.slice(1);
        const hp = new URLSearchParams(hash);
        let hashChanged = false;
        for (const key of Array.from(hp.keys())) {
          if (SENSITIVE.has(key.toLowerCase())) {
            hp.delete(key);
            hashChanged = true;
          }
        }
        if (hashChanged) {
          url.hash = hp.toString() ? ('#' + hp.toString()) : '';
          changed = true;
        }
      }

      if (changed) history.replaceState(null, '', url.toString());
    } catch (_) { /* ignore */ }
  })();

  // ---- 4) Frame-busting fallback (CSP handles most cases) -------------------
  (function frameBust() {
    try {
      if (window.top !== window.self) {
        window.top.location = window.location;
      }
    } catch (_) { /* cross-origin frame; nothing to do */ }
  })();
})();
