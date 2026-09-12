// payload/index.js

window.LLMPayload = {
  container: null,

  mount: function (targetElement, theme) {
    this.container = targetElement;

    const wrapper = document.createElement("div");
    wrapper.className = "llm-nyan-widget";

    const img = document.createElement("img");
    img.src = "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif";
    img.alt = "Nyan Cat";

    wrapper.appendChild(img);
    this.container.appendChild(wrapper);
  },

  unmount: function () {
    this.container = null;
  },
};
