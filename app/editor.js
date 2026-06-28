import { save } from './storage.js';

let editMode = false;

export function enterEditMode() { editMode = true; }
export function exitEditMode() { editMode = false; }

export function getLineNumber(textarea) {
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
}

// Core primitive: writes text at the current selection via the browser's editing
// pipeline so native undo/redo (Ctrl+Z/Y) works correctly.
// Falls back to direct .value mutation if execCommand isn't available.
function insertText(textarea, text) {
    textarea.focus();
    let ok = false;
    try {
        ok = document.execCommand('insertText', false, text);
    } catch { ok = false; }
    if (!ok) {
        // Fallback: direct mutation (works, but loses undo — no worse than before)
        const { selectionStart: s, selectionEnd: e, value } = textarea;
        textarea.value = value.slice(0, s) + text + value.slice(e);
        textarea.setSelectionRange(s + text.length, s + text.length);
    }
}

// Insert text at the current cursor position / replacing the current selection.
export function replaceSelection(textarea, value) {
    insertText(textarea, value);
}

// Replace the entire textarea content (whole-content transform tools).
// Cursor lands at end of content after the replacement.
export function replaceAll(textarea, text) {
    textarea.focus();
    textarea.setSelectionRange(0, textarea.value.length);
    insertText(textarea, text);
}

function wrapSelection(textarea, wrapper) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const len = wrapper.length;

    const before = text.slice(start - len, start);
    const after = text.slice(end, end + len);

    if (before === wrapper && after === wrapper) {
        // Unwrap: select the full wrapped span [start-len, end+len] and replace
        // with just the inner text — one undo entry, selection restored to inner.
        const inner = text.slice(start, end);
        textarea.focus();
        textarea.setSelectionRange(start - len, end + len);
        insertText(textarea, inner);
        textarea.setSelectionRange(start - len, end - len);
    } else {
        // Wrap: current selection [start, end] gets replaced with wrapper+selected+wrapper.
        const selected = text.slice(start, end);
        insertText(textarea, wrapper + selected + wrapper);
        if (selected.length > 0) {
            textarea.setSelectionRange(start + len, end + len);
        } else {
            textarea.setSelectionRange(start + len, start + len);
        }
    }
}

function indentNewline(scratchpad) {
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad);
    let prev_line = lines[current_line_number - 1];

    if (prev_line && prev_line.trim().length > 0) {
        let indent = prev_line.length - prev_line.trimLeft().length;
        if (indent > 0) {
            insertText(scratchpad, " ".repeat(indent));
        }
    }
}

function continueListOnNewline(scratchpad) {
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad);
    let prev_line = lines[current_line_number - 1];
    if (!prev_line) return;
    prev_line = prev_line.trimLeft();

    let insert = null;

    if (["-", "*"].indexOf(prev_line[0]) >= 0) {
        insert = prev_line[0] + " ";
    } else {
        const match = prev_line.match(/^(\d+)\.\s/);
        if (match) {
            insert = (parseInt(match[1]) + 1) + ". ";
        }
    }

    if (insert) {
        insertText(scratchpad, insert);
    }
}

export function indentCurrentLine(scratchpad) {
    const pos = scratchpad.selectionStart;
    const lineStart = scratchpad.value.lastIndexOf('\n', pos - 1) + 1;
    scratchpad.focus();
    scratchpad.setSelectionRange(lineStart, lineStart);
    insertText(scratchpad, '  ');
    scratchpad.setSelectionRange(pos + 2, pos + 2);
}

export function unindentCurrentLine(scratchpad) {
    const pos = scratchpad.selectionStart;
    const text = scratchpad.value;
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
    let spaces = 0;
    if (text[lineStart] === ' ') spaces++;
    if (spaces === 1 && text[lineStart + 1] === ' ') spaces++;
    if (spaces === 0) return;
    scratchpad.focus();
    scratchpad.setSelectionRange(lineStart, lineStart + spaces);
    insertText(scratchpad, '');
    scratchpad.setSelectionRange(pos - spaces, pos - spaces);
}

function handleTab(e, scratchpad) {
    const pos = scratchpad.selectionStart;
    if (!e.shiftKey) {
        scratchpad.setSelectionRange(pos, pos);
        insertText(scratchpad, '  ');
    } else {
        unindentCurrentLine(scratchpad);
    }
}

export function handleKeyUp(e, scratchpad) {
    if (e.key === "Enter") {
        indentNewline(scratchpad);
        !e.shiftKey && continueListOnNewline(scratchpad);
    }
    save(scratchpad);
}

export function handleKeyDown(e, scratchpad) {
    const mod = e.ctrlKey || e.metaKey;

    if (e.key === "Escape") {
        exitEditMode();
        return;
    }

    if (e.key === "Tab") {
        if (editMode) {
            e.preventDefault();
            handleTab(e, scratchpad);
        }
        return;
    }

    // Any other keypress enters edit mode
    if (!editMode) {
        enterEditMode();
    }

    if (mod && e.key === ']') {
        e.preventDefault();
        indentCurrentLine(scratchpad);
    } else if (mod && e.key === '[') {
        e.preventDefault();
        unindentCurrentLine(scratchpad);
    } else if (mod && e.key === 'b') {
        e.preventDefault();
        wrapSelection(scratchpad, '**');
    } else if (mod && e.key === 'i') {
        e.preventDefault();
        wrapSelection(scratchpad, '_');
    }
}
