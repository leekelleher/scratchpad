import { displayError } from '../../app/ui.js';

export default function(scratchpad) {
    try {
        var formatted = JSON.stringify(JSON.parse(scratchpad.value), null, 2);
        scratchpad.value = formatted;
    } catch (e) {
        displayError(e.message);
    }
}
