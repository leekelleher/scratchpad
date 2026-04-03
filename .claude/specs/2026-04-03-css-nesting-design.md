# Implementation Plan: Modernize CSS Selectors and Nesting

## Context

After the `color-scheme` migration, `style.css` still uses flat selectors with repeated parent prefixes. CSS nesting (supported in all modern browsers since Dec 2023) can group related rules under their parent, improving readability. There are also some simplification opportunities.

## Changes

### 1. Nest related selectors

Group child/modifier rules under their parent using CSS nesting (`&`):

- **`a`** — nest `&:visited` and `&:hover`
- **`main`** — nest `& > *`
- **`.dismissable`** — nest `& .close` → `& button.close` (or just `& .close`)
- **`textarea`** — nest `&.placeholder`
- **`#tools`** — nest `& button` styles (base, `&::before`, `&:hover`)
- **`#sidebar`** — nest `&[aria-hidden="false"]` and `& button` styles
- **`#markdownOutput`** — nest `& code, & pre`
- **`.outlook-md`** — nest `& blockquote`
- **`.hljs`** — nest all `.hljs-*` token selectors inside
- **Balloon tooltips** — nest `&:after`, `&:before`, `&:hover`, and `&[data-balloon-pos="down-left"]` under `[aria-label][data-balloon-pos]`

### 2. Shared button styles via `:is()`

Replace repeated `#tools button, #sidebar button` selectors with `:is(#tools, #sidebar) button`.

### 3. Remove dead CSS

- `textarea.placeholder` — class never applied in JS
- `.outlook-md` and `.outlook-md blockquote` — unused

### 4. Consistent formatting

The balloon tooltip section uses SCSS-style indentation (2-space, closing braces on same line). Normalize to match the rest of the file (4-space indent, standard brace placement).

## Files Modified

- `style.css` — all changes

## Verification

- Visual appearance identical in both light and dark themes
- All tools work (especially markdown preview, write-good tooltips)
- Sidebar toggle works
- Print styles work
