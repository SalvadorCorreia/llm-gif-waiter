window.DeepSeekProvider = {
  name: "DeepSeek",
  urlMatch: /chat\.deepseek\.com/,

  isGenerating: () => {
    return (
      document.querySelector('div[role="button"] svg path[d^="M2 4.88C2"]') !==
      null
    );
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const target = document.querySelector("._58b31c9") || document.body;
    const styles = window.getComputedStyle(target);

    return {
      background:
        styles.getPropertyValue("--dsw-alias-bg-base").trim() || "#151517",
      text:
        styles.getPropertyValue("--dsw-alias-brand-primary").trim() ||
        "#5686fe",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.DeepSeekProvider);
}
