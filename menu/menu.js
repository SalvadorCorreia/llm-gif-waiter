const extAPI = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener("DOMContentLoaded", () => {
  const timeDisplay = document.getElementById("time-display");
  const globalToggle = document.getElementById("global-toggle");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const resetBtn = document.getElementById("reset-time-btn");
  const openOptionsBtn = document.getElementById("open-options-btn");

  extAPI.storage.local.get(
    {
      globalEnabled: true,
      totalWaitTimeMs: 0,
      darkMode: false,
    },
    (data) => {
      const totalSeconds = Math.floor(data.totalWaitTimeMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timeDisplay.textContent = `${minutes}m ${seconds}s`;

      globalToggle.checked = data.globalEnabled;
      darkModeToggle.checked = data.darkMode;
      if (data.darkMode) document.body.classList.add("dark-mode");
    },
  );

  globalToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ globalEnabled: e.target.checked });
  });

  darkModeToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ darkMode: e.target.checked });
  });

  extAPI.storage.onChanged.addListener((changes) => {
    if (changes.darkMode) {
      darkModeToggle.checked = changes.darkMode.newValue;
      document.body.classList.toggle("dark-mode", changes.darkMode.newValue);
    }
  });

  resetBtn.addEventListener("click", () => {
    extAPI.storage.local.set({ totalWaitTimeMs: 0 }, () => {
      timeDisplay.textContent = "0m 0s";
    });
  });

  openOptionsBtn.addEventListener("click", () => {
    extAPI.runtime.openOptionsPage();
  });
});
