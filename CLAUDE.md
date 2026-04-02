# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scratchpad is a static, client-side web app for temporary notes and quick text transformations. It runs entirely in the browser with no build step, bundler, or package manager. Notes persist via `localStorage`.

Forked from: https://github.com/sesh/scratchpad

## Development

Serve with `npx serve` and open in a browser. A local server is required for ES module loading.

## Architecture

- **`index.html`** — Single page entry point. Loads a single stylesheet (`style.css`) and a single ES module (`app/index.js`).
- **`app/`** — Core application modules:
  - **`index.js`** — Entry point: imports all tool modules, wires up init, binds global keyboard shortcuts (Ctrl+Shift+K for sidebar).
  - **`storage.js`** — `load()` / `save()` for localStorage persistence (content + day/night mode).
  - **`editor.js`** — Text manipulation helpers (`getLineNumber`, `replaceSelection`, indent/unindent) and keyboard handling (Tab, Enter auto-indent/list continuation, Ctrl+]/[).
  - **`ui.js`** — Tool rendering (`makeToolLink`, `renderTools`), error display, dismissable panel system.
- **`tools/`** — Each tool is an ES module in its own sub-directory (`tools/*/index.js`). Vendor libraries are co-located with the tools that use them.
- **`style.css`** — Solarized light/dark theme, highlight.js syntax theme, balloon tooltips, print styles.

## Tool Interface

Each tool module exports a default object:

```js
export default {
    name: 'tool-name',        // required: identifier and display label
    action(textarea) { ... }, // required: receives the <textarea> element (may be async)
    description: '...',       // optional: help text
    footer: true,             // optional: show in footer bar
};
```

## Key Patterns

- Tools that insert at cursor position import `replaceSelection()` from `app/editor.js`.
- Tools that need error display import `displayError()` from `app/ui.js`.
- Tools with toggle panels (markdown, write-good) use `openDismissablePanel()` / `dismissDismissablePanels()` from `app/ui.js` and set `scratchpad.onsave` for live updates.
- The `marked` instance is created and exported from `tools/markdown/index.js` and re-used by `tools/copy-formatted/index.js`.
- Heavy dependencies (Prettier) are lazy-loaded via dynamic `import()` on first use.
- Keyboard shortcuts for the textarea are handled in `app/editor.js` (`handleKeyDown`); global shortcuts use a document-level listener in `app/index.js`.
