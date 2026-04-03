# Implementation Plan: Fix Keyboard Focus Trap in Textarea

## Context

The scratchpad textarea intercepts the Tab key in `handleKeyDown` to insert indentation. This creates a keyboard focus trap — users who Tab into the textarea cannot Tab out to reach other interactive elements (tool buttons, footer links). The fix introduces an "edit mode" concept: Tab only indents when the textarea is in edit mode. Pressing Escape exits edit mode, allowing normal Tab navigation to resume.

## Behavior

- **Clicking** the textarea or **pressing Enter** while it's focused enters edit mode
- In **edit mode**: Tab indents (current behavior), all editor shortcuts work as normal
- Pressing **Escape** exits edit mode — focus stays on the textarea but Tab now moves focus to the next element
- A subtle visual indicator (e.g. a CSS class) could distinguish the two modes, but is optional

## Files Modified

- `app/editor.js` — add edit mode state, gate Tab interception on it, handle Escape to exit
- `app/index.js` — set up click/Enter handlers to enter edit mode

## Implementation

### `app/editor.js`

Add a module-level `editMode` boolean:

```js
let editMode = false;

export function enterEditMode() { editMode = true; }
export function exitEditMode() { editMode = false; }
```

In `handleKeyDown`:
- Only intercept Tab when `editMode` is true
- On Escape: call `exitEditMode()` and `e.preventDefault()` (prevents Escape doing anything else)
- Ctrl+]/[ continue to work regardless of edit mode (they don't trap focus)

In `handleKeyUp`:
- Enter auto-indent and list continuation only apply in edit mode (they already require typing, which implies edit mode)

### `app/index.js`

- On textarea `click`: call `enterEditMode()`
- On textarea `keydown` for Enter: `enterEditMode()` is called (user is actively typing)
- Actually simpler: enter edit mode on any keydown that produces input (not just Enter). Since `handleKeyDown` already runs on every keydown, we can enter edit mode there for any non-Escape, non-Tab key. Or more precisely: enter edit mode on the first content-producing keystroke.

Simplest approach: enter edit mode inside `handleKeyDown` for any key that isn't Escape or Tab-without-edit-mode. This means:
- User Tabs into textarea → not in edit mode → Tab passes through (normal focus navigation)
- User clicks textarea → enters edit mode → Tab indents
- User types anything → enters edit mode → Tab indents
- User presses Escape → exits edit mode → Tab passes through

### Click handler

In `app/index.js`, add:
```js
scratchpad.onclick = () => enterEditMode();
```

## Verification

1. Tab into textarea from another element — Tab should move focus to the next element (not indent)
2. Click into textarea — Tab should indent text
3. Type some text — Tab should indent
4. Press Escape — Tab should move focus out
5. Ctrl+]/[ should work in both modes
6. Enter auto-indent and list continuation should work in edit mode
