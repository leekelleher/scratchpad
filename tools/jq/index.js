import { displayError } from '../../app/ui.js';

export default {
    name: 'jq',
    description: 'Format the current scratchpad value as JSON',
    footer: true,
    action(scratchpad) {
        try {
            var formatted = JSON.stringify(JSON.parse(scratchpad.value), null, 2);
            scratchpad.value = formatted;
        } catch (e) {
            displayError(e.message);
        }
    }
};
