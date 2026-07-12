document.getElementById("reset").addEventListener("click", async () => {
  await chrome.storage.local.set({ handoffs: 0 });
  const status = document.getElementById("status");
  status.textContent = "Your next YouTube link should wait for manual closure.";
  status.classList.add("visible");
});
