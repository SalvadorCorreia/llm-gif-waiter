window.DuckAIProvider = {
  name: "Duck.ai",
  urlMatch: /duck\.ai/,

  isGenerating: () => {
    const stopButton = document.querySelector(
      'button[aria-label="Stop generating"]',
    );
    return stopButton !== null && stopButton.getAttribute("tabindex") === "0";
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const styles = window.getComputedStyle(document.body);
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      background:
        rootStyles.getPropertyValue("--theme-col-bg-page").trim() ||
        styles.backgroundColor ||
        "#161616",
      text:
        rootStyles.getPropertyValue("--theme-col-bg-button-primary").trim() ||
        "#7295f6",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.DuckAIProvider);
}
