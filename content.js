// Handles Facebook's in-page (SPA) navigation, which never hits the network
// and so can't be caught by the declarativeNetRequest rule in rules.json.
const REEL_RE = /\/reel\/(\d+)/;
let enabled = true;

const toWatchUrl = (id) => `https://www.facebook.com/watch?v=${id}`;

function checkCurrentUrl() {
  if (!enabled) return;
  const m = location.pathname.match(REEL_RE);
  if (m) location.replace(toWatchUrl(m[1]));
}

chrome.storage.sync.get({ enabled: true }, (v) => {
  enabled = v.enabled;
  checkCurrentUrl();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.enabled) enabled = changes.enabled.newValue !== false;
});

document.addEventListener(
  "click",
  (e) => {
    if (!enabled) return;
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (!/(^|\.)facebook\.com$/.test(url.hostname)) return;
    const m = url.pathname.match(REEL_RE);
    if (!m) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.assign(toWatchUrl(m[1]));
  },
  true
);

let lastHref = location.href;
setInterval(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    checkCurrentUrl();
  }
}, 300);
window.addEventListener("popstate", checkCurrentUrl);
