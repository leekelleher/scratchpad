import { displayError } from '../../app/ui.js';
import { replaceAll } from '../../app/editor.js';

export default function(scratchpad) {
    try {
        var formatted = JSON.stringify(JSON.parse(scratchpad.value), null, 2);
        replaceAll(scratchpad, formatted);
    } catch (e) {
        displayError(e.message);
    }
}
