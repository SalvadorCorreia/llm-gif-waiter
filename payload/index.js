window.LLMPayload = {
  container: null,
  animationInterval: null,

  asciiFrames: [
    "  [ - ] thinking... ",
    "  [ \\ ] thinking... ",
    "  [ | ] thinking... ",
    "  [ / ] thinking... ",
  ],
  frameIndex: 0,

  mount: function (targetElement, theme) {
    this.container = targetElement;

    const wrapper = document.createElement("div");
    wrapper.className = "llm-ascii-widget";

    wrapper.style.color = theme.text;
    wrapper.style.borderColor = theme.text; // Uses text color as border accent

    wrapper.style.backgroundColor = theme.background;

    this.asciiDisplay = document.createElement("pre");
    this.asciiDisplay.className = "ascii-art";
    this.asciiDisplay.innerText = this.asciiFrames[0];

    wrapper.appendChild(this.asciiDisplay);
    this.container.appendChild(wrapper);

    this.startAnimation();
  },

  startAnimation: function () {
    if (this.animationInterval) return;

    this.animationInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.asciiFrames.length;
      if (this.asciiDisplay) {
        this.asciiDisplay.innerText = this.asciiFrames[this.frameIndex];
      }
    }, 250);
  },

  unmount: function () {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    this.container = null;
    this.asciiDisplay = null;
  },
};
