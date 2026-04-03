# Implementation Plan: Markdown Bold/Italic Keyboard Shortcuts

## Context

Add Ctrl+B (bold) and Ctrl+I (italic) keyboard shortcuts to wrap selected text or insert markdown formatting markers at the cursor position in the textarea.

## Behavior

- **Ctrl+B** with selection: wraps selected text with `**` (e.g. `**selected**`)
- **Ctrl+B** without selection: inserts `****` and places cursor between them
- **Ctrl+I** with selection: wraps selected text with `*` (e.g. `*selected*`)
- **Ctrl+I** without selection: inserts `**` and places cursor between them
- Both shortcuts only work in edit mode (consistent with existing Tab/indent behavior)

## Files Modified

- `app/editor.js` — add `wrapSelection` helper and handle Ctrl+B/I in `handleKeyDown`

## Implementation

Add a helper function `wrapSelection(textarea, wrapper)` that:
1. Gets `selectionStart` and `selectionEnd`
2. If they differ (text selected): wraps the selection with `wrapper` on both sides
3. If they're equal (no selection): inserts `wrapper` twice and places cursor between them

In `handleKeyDown`, add two cases inside the `mod` check:
- `e.key === 'b'` → `wrapSelection(scratchpad, '**')`
- `e.key === 'i'` → `wrapSelection(scratchpad, '*')`

## Verification

- Select text, press Ctrl+B → text wrapped with `**`
- Select text, press Ctrl+I → text wrapped with `*`
- No selection, press Ctrl+B → `****` inserted, cursor in middle
- No selection, press Ctrl+I → `**` inserted, cursor in middle
- Both work only in edit mode