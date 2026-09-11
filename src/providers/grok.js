window.GrokProvider = {
  name: "Grok",
  urlMatch: /grok\.com/,

  isGenerating: () => {
    return (
      document.querySelector('[aria-label="Stop model response"]') !== null
    );
  },

  getContainer: () => {
    return document.body;
  },

  getThemeColors: () => {
    const bodyStyles = window.getComputedStyle(document.body);

    let bgColor = bodyStyles.backgroundColor;
    if (!bgColor || bgColor === "rgba(0, 0, 0, 0)") {
      bgColor = "rgb(19, 18, 17)";
    }

    return {
      background: bgColor,
      text: bodyStyles.color || "rgb(252, 252, 252)",
    };
  },
};

if (window.LLMRegistry) {
  window.LLMRegistry.register(window.GrokProvider);
}
