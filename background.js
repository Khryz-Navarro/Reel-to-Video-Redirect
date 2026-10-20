// Keeps the redirect ruleset and toolbar badge in sync with the saved toggle.
async function apply(enabled) {
  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled
      ? { enableRulesetIds: ["reel_redirect"] }
      : { disableRulesetIds: ["reel_redirect"] }
  );
  await chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
}

async function sync() {
  const { enabled = true } = await chrome.storage.sync.get("enabled");
  apply(enabled);
}

chrome.runtime.onInstalled.addListener(sync);
chrome.runtime.onStartup.addListener(sync);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.enabled) apply(changes.enabled.newValue !== false);
});
