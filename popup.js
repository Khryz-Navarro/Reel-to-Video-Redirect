const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function render(enabled) {
  toggle.checked = enabled;
  status.textContent = enabled
    ? "ON: open reels as video player."
    : "OFF: reels open normally.";
}

chrome.storage.sync.get({ enabled: true }, (v) => render(v.enabled));
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
  render(toggle.checked);
});
