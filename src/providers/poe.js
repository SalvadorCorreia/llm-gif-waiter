window.PoeProvider = {
  name: "Poe",
  urlMatch: /poe\.com/,

  isGenerating: () => {
    return document.querySelector('[class*="AnimatedStopIcon"]') !== null;
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const styles = window.getComputedStyle(document.body);
    return {
      background:
        styles.getPropertyValue("background-color") || "rgb(16, 16, 18)",
      text: styles.getPropertyValue("color") || "rgb(252, 252, 252)",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.PoeProvider);
}
