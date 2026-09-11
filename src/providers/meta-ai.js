window.MetaAIProvider = {
  name: "Meta AI",
  urlMatch: /meta\.ai/,
  isGenerating: () => {
    return (
      document.querySelector('[data-testid="composer-stop-button"]') !== null
    );
  },
  getContainer: () => {
    return document.body;
  },
  getThemeColors: () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    // Check body first, fallback to root, then hardcoded fallback
    const getVar = (varName, fallback) =>
      bodyStyles.getPropertyValue(varName).trim() ||
      rootStyles.getPropertyValue(varName).trim() ||
      fallback;

    return {
      background: getVar("--background-primary", "#181819"),
      text: getVar("--accent", "#0064d4"),
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.MetaAIProvider);
}
