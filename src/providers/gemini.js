window.GeminiProvider = {
  name: "Gemini",
  urlMatch: /gemini\.google\.com/,

  isGenerating: () => {
    return (
      document.querySelector('button[aria-label="Stop response"]') !== null
    );
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const styles = window.getComputedStyle(document.body);
    return {
      background:
        styles.getPropertyValue("--gem-sys-color--surface").trim() || "#131314",
      text:
        styles.getPropertyValue("--gem-sys-color--primary").trim() || "#a8c7fa",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.GeminiProvider);
}
