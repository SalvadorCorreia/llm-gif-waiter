/*
  Provider Structure Requirements:
  Each provider file (e.g., chatgpt.js) must attach an object to the global window.
  
  Expected structure:
  {
    name: "ProviderName",
    urlMatch: /regex-to-match-url/, 
    isGenerating: () => boolean, // Returns true if the LLM is currently generating text
    getContainer: () => HTMLElement // Returns the DOM element where the payload should be injected
  }
*/

window.LLMRegistry = {
  providers: [],

  register: function (provider) {
    this.providers.push(provider);
  },

  getActiveProvider: function () {
    const currentUrl = window.location.href;
    return this.providers.find((provider) =>
      provider.urlMatch.test(currentUrl),
    );
  },
};
