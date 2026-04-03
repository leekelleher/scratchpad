# Implementation Plan: Modern CSS Color Scheme

## Context

The app uses `body.day` / `body.night` classes to toggle a Solarized light/dark theme. Every themed rule is duplicated — once for day, once for `body.night`. Modern CSS offers `color-scheme` and `light-dark()` to handle this more cleanly, with the bonus of respecting OS-level preference.

**Spec:** N/A (this is a straightforward CSS refactor)

## Current State

- `body class="day"` in HTML, toggled to `"night"` by `tools/dark/index.js`
- `localStorage["mode"]` stores `"day"` or `"night"`
- `app/storage.js` loads preference on startup
- `style.css` has ~30 duplicated rules for `body.night` variants
- Solarized palette: light bg `#eee8d5` / dark bg `#002b36`, fg inverted
- No `prefers-color-scheme` media query — manual toggle only

## Approach

Use CSS `color-scheme` on `:root` with `light-dark()` for all color values. Toggle by setting `document.documentElement.style.colorScheme` to `"light"` or `"dark"`. This eliminates all duplicated `body.night` rules.

## Steps

### Step 1: Define color variables with `light-dark()`

In `style.css`, replace the `body.day` / `body.night` rules with:

```css
:root {
    color-scheme: light dark;

    /* Solarized base */
    --color-bg: light-dark(#eee8d5, #002b36);
    --color-fg: light-dark(#002b36, #eee8d5);

    /* UI accents */
    --color-link: #268bd2;
    --color-error: #cb4b16;
    --color-highlight: light-dark(#d33682, #657b83);
    --color-hint: #868e96;

    /* Syntax highlighting (Solarized) */
    --color-hljs-bg: light-dark(#fdf6e3, #002b36);
    --color-hljs-fg: light-dark(#657b83, #839496);
    --color-hljs-comment: light-dark(#93a1a1, #586e75);
    --color-hljs-formula-bg: light-dark(#eee8d5, #073642);
    --color-hljs-green: #859900;
    --color-hljs-cyan: #2aa198;
    --color-hljs-blue: #268bd2;
    --color-hljs-yellow: #b58900;
    --color-hljs-orange: #cb4b16;
    --color-hljs-red: #dc322f;
}
```

Then replace all raw hex values in rules with the corresponding `var(--color-*)` references.

### Step 2: Remove all `body.night` and `body.day` rules

Delete every `body.night .hljs-*` block and the `body.day` / `body.night` base rules. The shared syntax token colors now use CSS variables defined once in `:root`.

### Step 3: Update `tools/dark/index.js`

Replace class toggle with:

```js
const root = document.documentElement;
const isDark = root.style.colorScheme === 'dark';
root.style.colorScheme = isDark ? 'light' : 'dark';
localStorage.setItem("mode", isDark ? "light" : "dark");
```

Also rename tool from "dark" to "theme" (or keep "dark" for backward compat — user preference).

### Step 4: Update `app/storage.js`

Replace class-based load with:

```js
const mode = localStorage.getItem("mode");
if (mode) {
    document.documentElement.style.colorScheme = mode;
}
```

If no stored preference, the browser respects OS preference via `color-scheme: light dark` on `:root`.

### Step 5: Update `index.html`

- Remove `class="day"` from `<body>` (no longer needed)

### Step 6: Update localStorage values

Change stored values from `"day"/"night"` to `"light"/"dark"` to match CSS terminology. Handle migration: if stored value is `"night"`, treat as `"dark"`; if `"day"`, treat as `"light"`.

## Files Modified

- `style.css` — bulk of the changes (eliminate duplicated rules)
- `tools/dark/index.js` — toggle logic
- `app/storage.js` — load logic  
- `index.html` — remove body class

## Benefits

- Eliminates ~80 lines of duplicated CSS rules
- Respects OS-level `prefers-color-scheme` when no user preference is stored
- Single source of truth for each color value
- Standard CSS approach, no class toggling

## Verification

- Light theme looks identical to current `body.day`
- Dark theme looks identical to current `body.night`
- Toggle tool works
- Preference persists across page reload
- Syntax highlighting in markdown preview works in both themes
- Print styles unaffected
- OS preference respected when no localStorage value set
