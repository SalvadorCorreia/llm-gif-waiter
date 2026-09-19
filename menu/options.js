const extAPI = typeof browser !== "undefined" ? browser : chrome;

const curatedGifs = [
  "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif",
  "https://media.giphy.com/media/11ISwbgCxEzMyY/giphy.gif",
  "https://media.giphy.com/media/uIJBFZoOaifHfqlptl/giphy.gif",
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/xTk9ZvMlsIlIrbZa1O/giphy.gif",
  "https://media.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif",
  "https://media.giphy.com/media/VseXvvxWOA0V2/giphy.gif",
  "https://media.giphy.com/media/jUwpNzg9IcyrK/giphy.gif",
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gif-grid");
  const customSlot = document.getElementById("custom-slot");
  const customPlaceholder = document.getElementById("custom-placeholder");
  const customInputContainer = document.getElementById(
    "custom-input-container",
  );
  const customUrlInput = document.getElementById("custom-gif-url");
  const saveCustomBtn = document.getElementById("save-custom-btn");

  extAPI.storage.local.get(
    { selectedGif: curatedGifs[0], customGifUrl: "" },
    (data) => {
      let activeUrl = data.selectedGif;
      let customUrl = data.customGifUrl;

      curatedGifs.forEach((url) => {
        const div = document.createElement("div");
        div.className = "grid-item";
        if (activeUrl === url) div.classList.add("selected");

        const img = document.createElement("img");
        img.src = url;
        div.appendChild(img);

        div.addEventListener("click", () => selectGif(url));
        grid.insertBefore(div, customSlot);
      });

      customUrlInput.value = customUrl;

      if (customUrl !== "") {
        customSlot.style.backgroundImage = `url(${customUrl})`;
        customSlot.style.backgroundSize = "cover";
        customSlot.style.backgroundPosition = "center";
        customPlaceholder.style.display = "none";
        if (activeUrl === customUrl) {
          customSlot.classList.add("selected");
        }
      }

      customPlaceholder.addEventListener("click", () => {
        customPlaceholder.style.display = "none";
        customInputContainer.style.display = "flex";
      });

      saveCustomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = customUrlInput.value.trim();
        if (val) {
          extAPI.storage.local.set({ customGifUrl: val }, () => {
            selectGif(val);
            customInputContainer.style.display = "none";
            customSlot.style.backgroundImage = `url(${val})`;
            customSlot.style.backgroundSize = "cover";
            customSlot.style.backgroundPosition = "center";
          });
        }
      });

      customSlot.addEventListener("click", (e) => {
        if (
          customPlaceholder.style.display === "none" &&
          customInputContainer.style.display === "none"
        ) {
          const val = customUrlInput.value.trim();
          if (val) selectGif(val);
        }
      });
    },
  );

  function selectGif(url) {
    extAPI.storage.local.set({ selectedGif: url }, () => {
      document.querySelectorAll(".grid-item, .custom-slot").forEach((item) => {
        item.classList.remove("selected");
      });

      let found = false;
      document.querySelectorAll(".grid-item img").forEach((img) => {
        if (img.src === url) {
          img.parentElement.classList.add("selected");
          found = true;
        }
      });

      if (!found && customUrlInput.value === url) {
        customSlot.classList.add("selected");
      }
    });
  }
});
