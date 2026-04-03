import { save } from './storage.js';

let editMode = false;

export function enterEditMode() { editMode = true; }
export function exitEditMode() { editMode = false; }

export function getLineNumber(textarea) {
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
}

export function replaceSelection(textarea, value) {
    var pos = textarea.selectionStart;
    textarea.value = textarea.value.slice(0, pos) + value + textarea.value.slice(textarea.selectionEnd);
    textarea.focus();
    textarea.setSelectionRange(pos + value.length, pos + value.length);
}

function wrapSelection(textarea, wrapper) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const len = wrapper.length;

    const before = text.slice(start - len, start);
    const after = text.slice(end, end + len);

    if (before === wrapper && after === wrapper) {
        textarea.value = text.slice(0, start - len) + text.slice(start, end) + text.slice(end + len);
        textarea.focus();
        textarea.setSelectionRange(start - len, end - len);
    } else {
        const selected = text.slice(start, end);
        textarea.value = text.slice(0, start) + wrapper + selected + wrapper + text.slice(end);
        textarea.focus();

        if (selected.length > 0) {
            textarea.setSelectionRange(start + len, end + len);
        } else {
            const cursor = start + len;
            textarea.setSelectionRange(cursor, cursor);
        }
    }
}

function indentNewline(scratchpad) {
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad)
    let prev_line = lines[current_line_number - 1];

    if (prev_line.trim().length > 0) {
        let indent = prev_line.length - prev_line.trimLeft().length;
        let pos = scratchpad.selectionStart;
        scratchpad.value = scratchpad.value.slice(0, pos) + " ".repeat(indent) + scratchpad.value.slice(pos);
        scratchpad.setSelectionRange(pos + indent, pos + indent);
    }
}

function continueListOnNewline(scratchpad) {
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad)

    let prev_line = lines[current_line_number - 1];
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
        let pos = scratchpad.selectionStart;
        scratchpad.value = scratchpad.value.slice(0, pos) + insert + scratchpad.value.slice(pos);
        scratchpad.setSelectionRange(pos + insert.length, pos + insert.length);
    }
}

export function indentCurrentLine(scratchpad) {
    let pos = scratchpad.selectionStart;
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad);

    let line = lines[current_line_number];
    line = "  " + line;
    lines[current_line_number] = line;

    scratchpad.value = lines.join('\n');
    scratchpad.setSelectionRange(pos + 2, pos + 2);
}

export function unindentCurrentLine(scratchpad) {
    let pos = scratchpad.selectionStart;
    let lines = scratchpad.value.split("\n");
    let current_line_number = getLineNumber(scratchpad);

    let line = lines[current_line_number];
    let line_length = line.length;

    line = line[0] === " " ? line.substring(1) : line;
    line = line[0] === " " ? line.substring(1) : line
    let length_change = line_length - line.length;
    lines[current_line_number] = line;

    scratchpad.value = lines.join('\n');
    scratchpad.setSelectionRange(pos - length_change, pos - length_change);
}

function handleTab(e, scratchpad) {
    let pos = scratchpad.selectionStart;

    if (!e.shiftKey) {
        scratchpad.value = scratchpad.value.slice(0, pos) + "  " + scratchpad.value.slice(pos);
        scratchpad.setSelectionRange(pos + 2, pos + 2);
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
