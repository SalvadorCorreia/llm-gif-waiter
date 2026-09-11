window.MicrosoftCopilotProvider = {
  name: "Microsoft Copilot",
  urlMatch: /copilot\.microsoft\.com/,

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
        rootStyles.getPropertyValue("--color-stone-150").trim() ||
        bodyStyles.backgroundColor ||
        "#f8f4f1",
      text:
        rootStyles.getPropertyValue("--color-accent-550").trim() ||
        bodyStyles.color ||
        "#5369b6",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.MicrosoftCopilotProvider);
}
