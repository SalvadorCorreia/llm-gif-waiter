const extAPI = typeof browser !== "undefined" ? browser : chrome;

const curatedGifs = [
  "https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHA0bDRvMDJkcWM0MzRxdW1xdjZkZDhwb3dkd2JycXIwMXlhMGRrMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/sthmCnCpfr8M8jtTQy/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHA0bDRvMDJkcWM0MzRxdW1xdjZkZDhwb3dkd2JycXIwMXlhMGRrMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7NoNw4pMNTvgc/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeml6bGVpeWM0Zng4bnQydjBneG14c2E4aml4MGtkZnZzMmpoMXl1eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/smzfl3E7a4iHK/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRycnJnOGptbHp2NDYzNWw5a3E2dWFhODF0YXk4ODk3ZXlqdmhvayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3vRgqJIdbRp7Exfa/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzR4aWpwaHgyMTczMDFwbHY2ZXVtMWVib2gxb21zZzFpNDB6ZnU5OSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Z1BTGhofioRxK/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRycnJnOGptbHp2NDYzNWw5a3E2dWFhODF0YXk4ODk3ZXlqdmhvayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cPZdap8PGhSvABr6xW/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHRpc202N2t0dHQ5b3kxZHFidWVxbWlxc3VqNGUzOXRuYnUzajQ1NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rTnoTuupwRowE/giphy.gif",
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
  const randomizeToggle = document.getElementById("randomize-toggle");

  let activePool = [];
  let isRandomizeOn = false;

  extAPI.storage.local.get(
    {
      selectedGifs: [curatedGifs[0]],
      customGifUrl: "",
      disabledProviders: [],
      useProviderLayouts: false,
      darkMode: false,
      randomizeGifs: false,
    },
    (data) => {
      activePool = data.selectedGifs;
      isRandomizeOn = data.randomizeGifs;
      let customUrl = data.customGifUrl;

      randomizeToggle.checked = isRandomizeOn;

      curatedGifs.forEach((url) => {
        const div = document.createElement("div");
        div.className = "grid-item";

        const img = document.createElement("img");
        img.src = url;
        div.appendChild(img);

        div.addEventListener("click", () => handleGifClick(url));
        grid.insertBefore(div, customSlot);
      });

      customUrlInput.value = customUrl;

      if (customUrl !== "") {
        customSlot.style.backgroundImage = `url(${customUrl})`;
        customSlot.style.backgroundSize = "cover";
        customSlot.style.backgroundPosition = "center";
        customPlaceholder.style.display = "none";
      }

      updateGridUI();

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

  function handleGifClick(url) {
    if (!url) return;

    if (isRandomizeOn) {
      if (activePool.includes(url)) {
        if (activePool.length > 1) {
          activePool = activePool.filter((g) => g !== url);
        }
      } else {
        activePool.push(url);
      }
    } else {
      activePool = [url];
    }

    extAPI.storage.local.set({ selectedGifs: activePool }, updateGridUI);
  }

  function updateGridUI() {
    document.querySelectorAll(".grid-item, .custom-slot").forEach((item) => {
      item.classList.remove("selected");
    });

    document.querySelectorAll(".grid-item img").forEach((img) => {
      if (activePool.includes(img.src)) {
        img.parentElement.classList.add("selected");
      }
    });

    const currentCustom = customUrlInput.value.trim();
    if (currentCustom && activePool.includes(currentCustom)) {
      customSlot.classList.add("selected");
    }
  }

  randomizeToggle.addEventListener("change", (e) => {
    isRandomizeOn = e.target.checked;

    // If turning off, truncate pool to the first selected item
    if (!isRandomizeOn && activePool.length > 1) {
      activePool = [activePool[0]];
    }

    extAPI.storage.local.set(
      {
        randomizeGifs: isRandomizeOn,
        selectedGifs: activePool,
      },
      updateGridUI,
    );
  });

  customPlaceholder.addEventListener("click", () => {
    customPlaceholder.style.display = "none";
    customInputContainer.style.display = "flex";
  });

  saveCustomBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const val = customUrlInput.value.trim();
    if (val) {
      extAPI.storage.local.set({ customGifUrl: val }, () => {
        handleGifClick(val);
        customInputContainer.style.display = "none";
        customSlot.style.backgroundImage = `url(${val})`;
        customSlot.style.backgroundSize = "cover";
        customSlot.style.backgroundPosition = "center";
      });
    } else {
      // Handle clearing the custom URL
      extAPI.storage.local.set({ customGifUrl: "" }, () => {
        customSlot.style.backgroundImage = "none";
        customPlaceholder.style.display = "flex";
        customInputContainer.style.display = "none";
        if (activePool.includes(val)) {
          activePool = activePool.filter((g) => g !== val);
          if (activePool.length === 0) activePool = [curatedGifs[0]];
          extAPI.storage.local.set({ selectedGifs: activePool }, updateGridUI);
        }
      });
    }
  });

  customSlot.addEventListener("click", (e) => {
    if (
      customPlaceholder.style.display === "none" &&
      customInputContainer.style.display === "none"
    ) {
      const val = customUrlInput.value.trim();
      if (val) handleGifClick(val);
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
