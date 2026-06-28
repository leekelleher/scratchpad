import { replaceAll } from '../../app/editor.js';

export default function(scratchpad) {
    let lines = scratchpad.value.split("\n");
    lines.sort()
    replaceAll(scratchpad, lines.join("\n"));
}
