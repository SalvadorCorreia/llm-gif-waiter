window.GoogleAiStudioProvider = {
  name: "Google AI Studio",
  urlMatch: /aistudio\.google\.com/,
  isGenerating: () => {
    return document.querySelector("ms-run-button .spin") !== null;
  },
  getContainer: () => {
    return document.body;
  },
  getThemeColors: () => {
    const bodyStyles = window.getComputedStyle(document.body);
    const rootStyles = window.getComputedStyle(document.documentElement);

    return {
      background:
        bodyStyles.backgroundColor !== "rgba(0, 0, 0, 0)" && bodyStyles.backgroundColor
          ? bodyStyles.backgroundColor
          : "#ffffff",
      text:
        rootStyles.getPropertyValue("--mat-pseudo-checkbox-minimal-selected-checkmark-color").trim() ||
        "#1a73e8",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.GoogleAiStudioProvider);
}