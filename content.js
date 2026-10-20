// Handles Facebook's in-page (SPA) navigation, which never hits the network
// and so can't be caught by the declarativeNetRequest rule in rules.json.

const REEL_RE = /\/reel\/(\d+)/;

function toWatchUrl(id) {
  return `https://www.facebook.com/watch?v=${id}`;
}

// 1) Current page is a reel (e.g. arrived via SPA navigation or back/forward)
function checkCurrentUrl() {
  const m = location.pathname.match(REEL_RE);
  if (m) location.replace(toWatchUrl(m[1]));
}

// 2) Clicking any reel link anywhere on Facebook
document.addEventListener(
  "click",
  (e) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return; // keep new-tab clicks working
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    let url;
    try {
      url = new URL(a.href, location.href);
    } catch {
      return;
    }
    if (!/(^|\.)facebook\.com$/.test(url.hostname)) return;
    const m = url.pathname.match(REEL_RE);
    if (!m) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.assign(toWatchUrl(m[1]));
  },
  true
);

// 3) Catch pushState/replaceState navigations (content scripts can't patch
//    history directly, so watch the URL)
checkCurrentUrl();
let lastHref = location.href;
setInterval(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    checkCurrentUrl();
  }
}, 300);
window.addEventListener("popstate", checkCurrentUrl);
