window.LLMPayload = {
  container: null,
  configKey: "llm-nyan-config",
  wrapper: null,
  boundResize: null,
  boundStopResize: null,
  boundMouseMove: null,
  boundMouseUp: null,

  mount: function (targetElement, theme) {
    this.container = targetElement;
    const extAPI = typeof browser !== "undefined" ? browser : chrome;

    extAPI.storage.local.get({ customGifUrl: "" }, (data) => {
      if (!this.container) return; // Prevent async race conditions

      this.wrapper = document.createElement("div");
      this.wrapper.className = "llm-nyan-widget";

      const img = document.createElement("img");
      const defaultUrl =
        "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif";
      img.src = data.customGifUrl || defaultUrl;
      img.alt = "Loading GIF";
      img.draggable = false;

      const savedConfig = JSON.parse(
        localStorage.getItem(this.configKey) || "{}",
      );

      img.style.width = savedConfig.width || "300px";

      if (savedConfig.left && savedConfig.top) {
        this.wrapper.style.left = savedConfig.left;
        this.wrapper.style.top = savedConfig.top;
        this.wrapper.style.transform = "none";
      }

      this.wrapper.appendChild(img);
      this.container.appendChild(this.wrapper);

      this.makeDraggable(this.wrapper);
      this.addResizeHandles(this.wrapper, img);
    });
  },

  saveConfig: function (wrapper, img) {
    const config = {
      width: img.style.width,
      left: wrapper.style.left,
      top: wrapper.style.top,
    };
    localStorage.setItem(this.configKey, JSON.stringify(config));
  },

  addResizeHandles: function (wrapper, img) {
    const positions = ["nw", "ne", "sw", "se"];
    const self = this;

    positions.forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle handle-${pos}`;
      wrapper.appendChild(handle);

      handle.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;
        const aspectRatio = startHeight / startWidth;

        const rect = wrapper.getBoundingClientRect();
        wrapper.style.transform = "none";
        wrapper.style.left = rect.left + "px";
        wrapper.style.top = rect.top + "px";

        const startLeft = rect.left;
        const startTop = rect.top;

        self.boundResize = function (event) {
          let deltaX = event.clientX - startX;
          let newWidth;

          if (pos.includes("w")) {
            newWidth = startWidth - deltaX;
          } else {
            newWidth = startWidth + deltaX;
          }

          newWidth = Math.max(100, newWidth);
          const actualDeltaX = newWidth - startWidth;
          const actualDeltaY = actualDeltaX * aspectRatio;
          img.style.width = newWidth + "px";

          if (pos.includes("w")) {
            wrapper.style.left = startLeft - actualDeltaX + "px";
          }
          if (pos.includes("n")) {
            wrapper.style.top = startTop - actualDeltaY + "px";
          }
        };

        self.boundStopResize = function () {
          document.removeEventListener("mousemove", self.boundResize);
          document.removeEventListener("mouseup", self.boundStopResize);
          self.saveConfig(wrapper, img);
        };

        document.addEventListener("mousemove", self.boundResize);
        document.addEventListener("mouseup", self.boundStopResize);
      };
    });
  },

  makeDraggable: function (element) {
    const self = this;
    element.onmousedown = function (event) {
      if (event.target.classList.contains("resize-handle")) return;
      event.preventDefault();

      const rect = element.getBoundingClientRect();
      const shiftX = event.clientX - rect.left;
      const shiftY = event.clientY - rect.top;

      element.style.transform = "none";
      element.style.left = rect.left + "px";
      element.style.top = rect.top + "px";

      self.boundMouseMove = function (e) {
        element.style.left = e.clientX - shiftX + "px";
        element.style.top = e.clientY - shiftY + "px";
      };

      self.boundMouseUp = function () {
        document.removeEventListener("mousemove", self.boundMouseMove);
        document.removeEventListener("mouseup", self.boundMouseUp);
        self.saveConfig(element, element.querySelector("img"));
      };

      document.addEventListener("mousemove", self.boundMouseMove);
      document.addEventListener("mouseup", self.boundMouseUp);
    };
  },

  unmount: function () {
    // Remove lingering global event listeners
    if (this.boundResize)
      document.removeEventListener("mousemove", this.boundResize);
    if (this.boundStopResize)
      document.removeEventListener("mouseup", this.boundStopResize);
    if (this.boundMouseMove)
      document.removeEventListener("mousemove", this.boundMouseMove);
    if (this.boundMouseUp)
      document.removeEventListener("mouseup", this.boundMouseUp);

    this.container = null;
    this.wrapper = null;
  },
};
