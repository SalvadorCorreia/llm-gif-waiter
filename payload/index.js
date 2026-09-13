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

    wrapper.appendChild(img);
    this.container.appendChild(wrapper);

    this.makeDraggable(wrapper);
  },

  makeDraggable: function (element) {
    element.onmousedown = function (event) {
      const rect = element.getBoundingClientRect();
      const shiftX = event.clientX - rect.left;
      const shiftY = event.clientY - rect.top;

      element.style.transform = "none";

      function moveAt(clientX, clientY) {
        element.style.left = clientX - shiftX + "px";
        element.style.top = clientY - shiftY + "px";
      }

      moveAt(event.clientX, event.clientY);

      function onMouseMove(event) {
        moveAt(event.clientX, event.clientY);
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
