# llm-gif-waiter

A browser extension that injects a customizable loading GIF into LLM interfaces (like ChatGPT or Claude) while waiting for a response. Built on top of the [llm-wait-injector](https://github.com/SalvadorCorreia/llm-wait-injector) engine.

## Installation

1. Clone or download this repository.
2. Initialize the core engine by running:
   ```bash
   git submodule update --init

   ```

3. Open your browser's extension management page:
* **Chrome/Edge**: Navigate to `chrome://extensions/` and enable "Developer mode". Click "Load unpacked". Select the root folder and use `manifest.json`.
* **Firefox**: Navigate to `about:debugging#/runtime/this-firefox` and click "Load Temporary Add-on". Select the `manifest-firefox.json` file.



## Settings

Click the extension icon in your browser toolbar to open the settings menu. From here you can:

* See how much total time you have saved staring at loading screens.
* Enable or disable specific AI platforms.
* Input a URL to any direct GIF link to replace the default Nyan Cat.
