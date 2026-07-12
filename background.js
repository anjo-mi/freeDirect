const YT_PATTERN =
  /^https?:\/\/((www|m)\.)?youtube\.com\/(watch|shorts\/|live\/|playlist|channel\/|@)|^https?:\/\/youtu\.be\//;
const FRESH_TAB_URLS = new Set(["", "about:blank", "chrome://newtab/"]);
const isYTtab = (url) => (url ?? "").includes("youtube");

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0 || !YT_PATTERN.test(details.url)) return;
  const tab = await chrome.tabs.get(details.tabId).catch(() => null);
  if (!tab) return;
  const disposable = FRESH_TAB_URLS.has(tab.url ?? "") || isYTtab(tab.url);

  chrome.tabs.update(details.tabId, { url: "freetube://" + details.url });

  const { freeDirects = 0 } = await chrome.storage.local.get("freeDirects");
  await chrome.storage.local.set({ freeDirects: freeDirects + 1 });

  if (!disposable) return;
  if (freeDirects === 0) return;

  chrome.tabs.remove(details.tabId);
});
