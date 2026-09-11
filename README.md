# llm-wait-injector

A base harness for browser extensions that injects content into LLM interfaces (like ChatGPT or Claude) while waiting for a response. 

This repository is meant to be forked. It provides the core injection engine so you can focus on building the payload.

## Project Structure

- `payload/`: Your workspace. Modify `index.js` and `style.css` to build your custom injection.
- `src/`: The core engine. You do not need to touch this unless adding a new LLM provider.
- `src/providers/`: Contains target selectors for specific LLM websites.
- `icons/`: Store your extension icons here.
- `manifest.json`: The extension configuration file.

## Installation

1. Clone or download this repository.
2. Open your browser's extension management page:
   - Chrome/Edge: Navigate to `chrome://extensions/` and enable "Developer mode". Click "Load unpacked".
   - Firefox: Navigate to `about:debugging#/runtime/this-firefox` and click "Load Temporary Add-on".
3. Select the root `llm-wait-injector` folder.

## How to Use

To build your custom application, edit the files inside the `payload/` directory. The base engine automatically monitors the LLM page and injects your payload when a generation wait state is detected. The default payload is a simple placeholder.

## Adding a New LLM Provider

To support a new LLM website:
1. Create a new file in `src/providers/` (e.g., `gemini.js`).
2. Export the URL matching pattern, the CSS selector that indicates the model is generating, and the CSS selector for the target injection container.
3. Import and add your new provider to the exported list in `src/registry.js`.
