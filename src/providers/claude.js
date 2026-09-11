window.ClaudeProvider = {
  name: "Claude",
  urlMatch: /claude\.ai/,

  isGenerating: () => {
    // The stop button now relies on its aria-label instead of a data-testid
    const stopButton = document.querySelector(
      'button[aria-label="Stop response"]',
    );

    // We check if it exists and is not hidden by an 'inert' attribute on parent containers
    return stopButton !== null && !stopButton.closest("[inert]");
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const styles = window.getComputedStyle(document.body);
    return {
      background: styles.getPropertyValue("--cds-page-bg").trim() || "#151515",
      text: styles.getPropertyValue("--cds-fill-brand").trim() || "#c6613f",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.ClaudeProvider);
}
