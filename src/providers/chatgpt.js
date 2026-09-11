window.ChatGPTProvider = {
  name: "ChatGPT",
  urlMatch: /chatgpt\.com/,

  isGenerating: () => {
    return document.querySelector('[data-testid="stop-button"]') !== null;
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    return {
      background:
        rootStyles.getPropertyValue("--main-surface-background").trim() ||
        bodyStyles.backgroundColor ||
        "#212121",
      text: bodyStyles.color || "#ececec",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.ChatGPTProvider);
}
