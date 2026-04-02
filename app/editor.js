import { save } from './storage.js';

export function getLineNumber(textarea) {
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
}

export function replaceSelection(textarea, value) {
    var pos = textarea.selectionStart;
    textarea.value = textarea.value.slice(0, pos) + value + textarea.value.slice(textarea.selectionEnd);
    textarea.focus();
    textarea.setSelectionRange(pos + value.length, pos + value.length);
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

    if (["-", "*"].indexOf(prev_line[0]) >= 0) {
        let pos = scratchpad.selectionStart;
        scratchpad.value = scratchpad.value.slice(0, pos) + prev_line[0] + " " + scratchpad.value.slice(pos);
        scratchpad.setSelectionRange(pos + 2, pos + 2);
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

    if (e.key === "Tab") {
        e.preventDefault();
        handleTab(e, scratchpad);
    } else if (mod && e.key === ']') {
        e.preventDefault();
        indentCurrentLine(scratchpad);
    } else if (mod && e.key === '[') {
        e.preventDefault();
        unindentCurrentLine(scratchpad);
    }
}
