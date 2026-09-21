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

  const providerList = document.getElementById("provider-list");
  const providerLayoutToggle = document.getElementById(
    "provider-layout-toggle",
  );
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  extAPI.storage.local.get(
    {
      selectedGif: curatedGifs[0],
      customGifUrl: "",
      disabledProviders: [],
      useProviderLayouts: false,
      darkMode: false,
    },
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

      providerLayoutToggle.checked = data.useProviderLayouts;

      darkModeToggle.checked = data.darkMode;
      if (data.darkMode) document.body.classList.add("dark-mode");

      const manifest = extAPI.runtime.getManifest();
      const scripts = manifest.content_scripts[0].js;
      const providerScripts = scripts.filter((src) =>
        src.includes("/providers/"),
      );

      let loadedCount = 0;
      providerScripts.forEach((src) => {
        const script = document.createElement("script");
        script.src = extAPI.runtime.getURL(src);
        script.onload = () => {
          loadedCount++;
          if (loadedCount === providerScripts.length) {
            renderProviders(data.disabledProviders);
          }
        };
        document.body.appendChild(script);
      });
    },
  );

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

  providerLayoutToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ useProviderLayouts: e.target.checked });
  });

  darkModeToggle.addEventListener("change", (e) => {
    extAPI.storage.local.set({ darkMode: e.target.checked });
  });

  extAPI.storage.onChanged.addListener((changes) => {
    if (changes.darkMode) {
      darkModeToggle.checked = changes.darkMode.newValue;
      document.body.classList.toggle("dark-mode", changes.darkMode.newValue);
    }
  });

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

  function renderProviders(disabledProviders) {
    if (window.LLMRegistry && window.LLMRegistry.providers) {
      window.LLMRegistry.providers.forEach((provider) => {
        const label = document.createElement("label");
        label.className = "toggle-row";

        const span = document.createElement("span");
        span.textContent = provider.name;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "provider-toggle";
        input.value = provider.name;
        input.checked = !disabledProviders.includes(provider.name);

        input.addEventListener("change", () => {
          extAPI.storage.local.get({ disabledProviders: [] }, (currentData) => {
            let disabled = currentData.disabledProviders;

            if (input.checked) {
              disabled = disabled.filter((p) => p !== input.value);
            } else {
              if (!disabled.includes(input.value)) {
                disabled.push(input.value);
              }
            }

            extAPI.storage.local.set({ disabledProviders: disabled });
          });
        });

        label.appendChild(span);
        label.appendChild(input);
        providerList.appendChild(label);
      });
    }
  }
});
