window.LLMPayload = {
  container: null,

  mount: function (targetElement, theme) {
    this.container = targetElement;

    const wrapper = document.createElement("div");
    wrapper.className = "llm-nyan-widget";

    const img = document.createElement("img");
    img.src = "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif";
    img.alt = "Nyan Cat";
    img.draggable = false;
    img.style.width = "300px";

    wrapper.appendChild(img);
    this.container.appendChild(wrapper);

    this.makeDraggable(wrapper);
    this.addResizeHandles(wrapper, img);
  },

  addResizeHandles: function (wrapper, img) {
    const positions = ["nw", "ne", "sw", "se"];

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

        function resize(event) {
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
        }

        function stopResize() {
          document.removeEventListener("mousemove", resize);
          document.removeEventListener("mouseup", stopResize);
        }

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
      };
    });
  },

  makeDraggable: function (element) {
    element.onmousedown = function (event) {
      event.preventDefault();

      const rect = element.getBoundingClientRect();
      const shiftX = event.clientX - rect.left;
      const shiftY = event.clientY - rect.top;

      element.style.transform = "none";
      element.style.left = rect.left + "px";
      element.style.top = rect.top + "px";

      function moveAt(clientX, clientY) {
        element.style.left = clientX - shiftX + "px";
        element.style.top = clientY - shiftY + "px";
      }

      function onMouseMove(e) {
        moveAt(e.clientX, e.clientY);
      }

      document.addEventListener("mousemove", onMouseMove);

      document.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        document.onmouseup = null;
      };
    };
  },

  unmount: function () {
    this.container = null;
  },
};
