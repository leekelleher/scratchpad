# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scratchpad is a static, client-side web app for temporary notes and quick text transformations. It runs entirely in the browser with no build step, bundler, or package manager. Notes persist via `localStorage`.

Forked from: https://github.com/sesh/scratchpad

## Development

Serve with `npx serve` and open in a browser. A local server is required for ES module loading.

## Architecture

- **`index.html`** — Single page entry point. Loads a single stylesheet (`style.css`) and a single ES module (`app/index.js`). Uses semantic HTML (`<nav>`, `<main>`, `<footer>`) with ARIA attributes.
- **`app/`** — Core application modules:
  - **`index.js`** — Entry point: defines the tool registry (metadata + lazy import functions), wires up init, binds global keyboard shortcuts (Ctrl+Shift+K for sidebar, Ctrl+S for download).
  - **`storage.js`** — `load()` / `save()` for localStorage persistence (content + color scheme). Migrates legacy `"day"`/`"night"` values to `"light"`/`"dark"`.
  - **`editor.js`** — Text manipulation helpers (`getLineNumber`, `replaceSelection`, `wrapSelection`, indent/unindent) and keyboard handling (Tab, Enter auto-indent/list continuation, Ctrl+]/[, Ctrl+B bold, Ctrl+I italic). Manages edit mode (Escape to exit, allowing Tab to navigate focus).
  - **`ui.js`** — Tool rendering (`makeToolButton`, `renderTools`), error display (`role="alert"`, keyboard-dismissible), dismissable panel system. Uses `<button>` elements for all interactive controls.
- **`tools/`** — Each tool is an ES module in its own sub-directory (`tools/*/index.js`), lazy-loaded on first use via dynamic `import()`. Vendor libraries are co-located with the tools that use them.
- **`style.css`** — Uses CSS custom properties with `light-dark()` for theming (Solarized palette), CSS nesting, `:is()` selectors. Includes highlight.js syntax theme, balloon tooltips, and print styles.

## Tool Registry

Tools are defined in the `tools` array in `app/index.js` as plain data with a lazy import function:

```js
{ name: 'tool-name', footer: true, action: () => import('../tools/tool-name/index.js') }
```

Each tool module exports a default function that receives the `<textarea>` element:

```js
export default function(scratchpad) { ... }
```

## Key Patterns

- Tool modules are lazy-loaded — `import()` is called on first use, browser caches subsequent calls.
- Tools that insert at cursor position import `replaceSelection()` from `app/editor.js`.
- Tools that need error display import `displayError()` from `app/ui.js`.
- Tools with toggle panels (markdown, write-good) use `openDismissablePanel()` / `dismissDismissablePanels()` from `app/ui.js` and set `scratchpad.onsave` for live updates.
- The `marked` instance is created and exported from `tools/markdown/index.js` and re-used by `tools/copy-formatted/index.js`.
- Color scheme uses CSS `color-scheme` property on `:root`, toggled via `document.documentElement.style.colorScheme`. No body classes.
- Edit mode: the textarea intercepts Tab only when in edit mode (entered by clicking or typing). Pressing Escape exits edit mode, allowing normal Tab focus navigation.
- Sidebar visibility is driven by `aria-hidden` attribute, with CSS `#sidebar[aria-hidden="false"] { display: flex; }`.

## Keyboard Shortcuts

| Shortcut | Scope | Action |
|----------|-------|--------|
| Tab / Shift+Tab | Textarea (edit mode) | Indent / unindent |
| Ctrl+] / Ctrl+[ | Textarea | Indent / unindent current line |
| Ctrl+B | Textarea | Toggle bold (`**`) |
| Ctrl+I | Textarea | Toggle italic (`_`) |
| Ctrl+S | Global | Download scratchpad content |
| Ctrl+Shift+K | Global | Toggle sidebar |
| Escape | Textarea | Exit edit mode |
| Enter | Textarea | Auto-indent, continue list (unordered and ordered) |
