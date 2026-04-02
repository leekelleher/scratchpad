# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scratchpad is a static, client-side web app for temporary notes and quick text transformations. It runs entirely in the browser with no build step, bundler, or package manager. Notes persist via `localStorage`.

Deployed at: https://sesh.github.io/scratchpad/

## Development

Open `index.html` directly in a browser. No build or install step required.

## Architecture

- **`index.html`** — Single page entry point. Loads `app.js` synchronously; vendor libs loaded async.
- **`app.js`** — All application logic in a single file. Contains:
  - Text manipulation functions (sort, shuffle, indent, base64, JSON format, HTML format, JWT decode, UUID/password/passphrase generation, datetime insertion)
  - localStorage persistence (content + day/night mode)
  - Keyboard handling (Tab indent, Enter auto-indent/list continuation, Mousetrap bindings for `mod+shift+k`, `mod+]`, `mod+[`)
  - Tool registry: array of `{name, action, footer?, description?}` objects rendered as clickable links in footer and sidebar
  - Dismissable panel system for markdown preview and write-good analysis
- **`style.css`** — Solarized light/dark theme, print styles
- **`vendor/`** — Vendored third-party libraries (mousetrap, marked, highlight.js, prettier, write-good, jwt-decode, EFF passphrase wordlist). No npm — update by replacing files directly.

## Key Patterns

- All tool functions take the `scratchpad` textarea element as their single argument.
- `replaceSelection()` inserts at cursor position; other tools replace `textarea.value` entirely.
- The `onsave` callback on the textarea element is used for live-updating panels (markdown preview, write-good).
- Keyboard shortcuts use the Mousetrap library with the `.mousetrap` class on the textarea.
