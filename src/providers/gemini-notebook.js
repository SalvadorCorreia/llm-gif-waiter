window.GeminiNotebookProvider = {
  name: "Gemini Notebook",
  urlMatch: /notebook\.google\.com\/notebook/,

  isGenerating: () => {
    return (
      document.querySelector('button[aria-label="Stop generating"]') !== null
    );
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const styles = window.getComputedStyle(document.body);

    return {
      background:
        styles.getPropertyValue("--nlm-fills-surface-page").trim() || "#1a1d22",
      text: styles.getPropertyValue("--mat-sys-primary").trim() || "#a8c7fa",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.GeminiNotebookProvider);
}
