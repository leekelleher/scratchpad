# Modernize Scratchpad Codebase — Design Spec

## Context

Scratchpad is a static, client-side web app for temporary notes and text transformations. The codebase hasn't been updated in ~4 years. All logic lives in a single `app.js` (489 lines) inside an IIFE, and vendor libraries are loaded via `<script async>` tags. Modern JavaScript (ES modules) enables better separation of concerns, co-location of tools with their dependencies, and a foundation for future pluggable tool architecture and UI simplification.

## Goals

- Convert `app.js` into ES modules with clean separation of concerns
- Make each tool its own module in a sub-directory under `tools/`
- Co-locate vendor libraries with the tools that use them
- Keep the UI behavior identical — no visual or functional changes
- No build step, no bundler — stays a static HTML app
- Small, incremental steps

## File Structure

```
index.html                          <!-- single <script type="module" src="app/index.js"> -->
style.css
app/
  index.js                          <!-- entry point: imports modules + tools, wires up init -->
  storage.js                        <!-- localStorage load/save, day/night mode persistence -->
  editor.js                         <!-- getLineNumber, replaceSelection, indent, newline, tab/key handling -->
  ui.js                             <!-- footer/sidebar rendering, dismissable panels, dark mode toggle -->
tools/
  sort/index.js
  shuffle/index.js
  jq/index.js
  base64-encode/index.js
  base64-decode/index.js
  uuid/index.js
  dt/index.js
  pw/index.js
  download/index.js
  dark/index.js
  sidebar/index.js
  copy-formatted/index.js
  passphrase/
    index.js
    eff-short-passphrase.js         <!-- vendor, moved from vendor/ -->
  jwt/
    index.js
    jwt-decode.js                   <!-- vendor, moved from vendor/ -->
  markdown/
    index.js
    marked.min.js                   <!-- vendor, moved from vendor/ -->
  html-format/
    index.js
    prettier.js                     <!-- vendor, moved from vendor/ -->
    prettier-parser-html.js         <!-- vendor, moved from vendor/ -->
  write-good/
    index.js
    write-good.dist.js              <!-- vendor, moved from vendor/ -->
    balloon.css                     <!-- vendor, moved from vendor/ -->
vendor/
  mousetrap.min.js                  <!-- shared: used by app/editor.js -->
  highlight.min.js                  <!-- shared: used by markdown + copy-formatted -->
  highlight.min.css                 <!-- shared: loaded by index.html -->
```

## Tool Interface

Each tool module exports a single object:

```js
// tools/jq/index.js
export default {
  name: 'jq',
  description: 'Format the current scratchpad value as JSON',
  footer: true,
  action(textarea) {
    // operates on the textarea element
  }
};
```

**Contract:**
- `name` (string, required) — identifier and display label
- `action` (function, required) — receives the `<textarea>` element
- `description` (string, optional) — tooltip/help text
- `footer` (boolean, optional) — whether to show in the footer bar

Tools that need shared helpers (e.g. `replaceSelection`, `displayError`) import them from `app/editor.js` or `app/ui.js`.

## Module Responsibilities

### `app/index.js` (entry point)
- Imports `storage`, `editor`, `ui`, and all tool modules
- Assembles the tools array from imports
- Calls `storage.load()`, sets up keyboard event listeners via `editor`, renders tools via `ui`
- Binds Mousetrap shortcuts

### `app/storage.js`
- `load(textarea)` — restore content and day/night mode from localStorage
- `save(textarea)` — persist content, call `onsave` callback if set

### `app/editor.js`
- `getLineNumber(textarea)`, `replaceSelection(textarea, value)`
- `indentNewline(textarea)`, `continueListOnNewline(textarea)`
- `indentCurrentLine(textarea)`, `unindentCurrentLine(textarea)`
- `handleTab(event, textarea)`, `handleKeyUp(event, textarea)`, `handleKeyDown(event, textarea)`

### `app/ui.js`
- `renderTools(tools, textarea)` — creates footer links and sidebar links
- `displayError(message)`, `removeError()`
- `dismissDismissablePanels()`, `openDismissablePanel(id)`

## Vendor Library Migration

- Libraries used by a single tool move into that tool's sub-directory
- Shared libraries (`mousetrap`, `highlight.js`) stay in `vendor/`
- Vendor libs that aren't ESM-compatible remain as globals loaded via `<script>` in `index.html`, or are accessed by the tool that owns them
- ESM-compatible replacements can be evaluated per-tool in future iterations

## `index.html` Changes

- Remove all `<script async>` tags for vendor libs that move into tool directories
- Keep `<script>` tags for shared vendor libs (mousetrap, highlight.js) that aren't ESM-compatible
- Replace `<script src="app.js">` with `<script type="module" src="app/index.js">`
- Keep `<link rel="stylesheet" href="vendor/highlight.min.css">`
- Remove `<link rel="stylesheet" href="vendor/balloon.css">` (moves to write-good tool)

## What Does NOT Change

- Visual appearance and behavior — identical to current
- localStorage data format — existing saved notes continue to work
- `style.css` — untouched
- The set of available tools and their functionality

## Verification

- Open `index.html` via a local server (`npx serve`) and confirm:
  - Saved notes load from localStorage
  - Day/night mode persists
  - All tools work from both footer and sidebar
  - Keyboard shortcuts work (Tab, Shift+Tab, Cmd+], Cmd+[, Cmd+Shift+K, Enter auto-indent/list)
  - Markdown preview, write-good analysis, and copy-formatted all function
  - JWT decode, JSON format, HTML format, base64, UUID, datetime, password, passphrase all function
  - Download works
  - No console errors