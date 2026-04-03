# Fix Accessibility Anti-patterns — Design Spec

## Context

The scratchpad app uses several HTML anti-patterns for interactive elements: anchors as buttons, spans as close buttons, unlabelled form controls, and a suppressed focus indicator. These were inherited from the original codebase and carried through the ES modules refactor. This spec covers fixing the obvious anti-patterns — not a full WCAG AA audit.

## Goals

- Replace incorrect elements with semantically correct alternatives
- Ensure all interactive elements are keyboard-accessible
- Add missing labels for screen readers
- Restore visible focus indicators
- No visual or functional changes to the app

## Fixes

### 1. Tool links: `<a href="#">` → `<button>` (`app/ui.js`)

The `makeToolLink` function creates `<a href="#">` elements for tool actions. These should be `<button>` elements since they trigger JS actions, not navigation.

**Changes:**
- `makeToolLink` creates a `<button>` instead of an `<a>`
- Remove `href="#"` and `e.preventDefault()`
- Add CSS to reset button styles (no border, no background, inherit font/color) so they look the same as current links

### 2. Close button: `<span>` → `<button>` (`app/ui.js`)

The dismissable panel close element is a `<span>` with an `onclick`. It's not focusable and can't be activated via keyboard.

**Changes:**
- `openDismissablePanel` creates a `<button>` instead of a `<span>`
- Add `aria-label="Close panel"`
- Style to match current appearance (positioned top-right, no border/background)

### 3. Error banner: add `role="alert"` and keyboard dismiss (`app/ui.js`)

The error `<div>` has no ARIA role and is only dismissible by click.

**Changes:**
- Add `role="alert"` to the error element (screen readers will announce it automatically)
- Add `tabindex="0"` so it can receive focus
- Add a `keydown` listener for Enter/Escape to dismiss

### 4. Textarea label (`index.html`)

The `<textarea>` has no associated label.

**Changes:**
- Add `aria-label="Scratchpad"` to the textarea element
- Using `aria-label` rather than a visible `<label>` since the UI is intentionally minimal

### 5. Focus indicator (`style.css`)

`outline: none` on the textarea removes the browser's default focus ring with no replacement.

**Changes:**
- Replace `outline: none` with a custom focus style, e.g. a subtle outline that works in both day and night modes

## Files Modified

- `app/ui.js` — fixes 1, 2, 3
- `index.html` — fix 4
- `style.css` — fix 5, button reset styles, close button styles

## What Does NOT Change

- Visual appearance (buttons styled to match current anchors)
- Tool behavior and keyboard shortcuts
- localStorage persistence
- Panel open/close behavior (focus management is out of scope for this pass)

## Verification

- Tab through the page: all tool buttons, close buttons, and error banners should be reachable
- Activate each tool button with Enter and Space
- Dismiss a panel with the close button via keyboard
- Dismiss an error banner via keyboard (Enter or Escape)
- Verify focus indicator is visible on textarea
- Confirm no visual differences in day and night modes