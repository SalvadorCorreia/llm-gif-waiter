window.PerplexityProvider = {
  name: "Perplexity",
  urlMatch: /perplexity\.ai/,

  isGenerating: () => {
    return (
      document.querySelector('[aria-label="Stop response (Esc)"]') !== null
    );
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    return {
      background:
        rootStyles.getPropertyValue("--surface-base").trim() ||
        bodyStyles.backgroundColor ||
        "#171615",
      text:
        rootStyles.getPropertyValue("--accent-fg-primary").trim() || "#4e99a3",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.PerplexityProvider);
}
