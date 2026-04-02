import { displayError } from '../../app/ui.js';

export default {
    name: 'jwt',
    footer: true,
    action(scratchpad) {
        try {
            var token = jwt_decode(scratchpad.value);
            var decodedHeader = jwt_decode(scratchpad.value, { header: true });
            scratchpad.value = JSON.stringify(decodedHeader, null, 2) + "\n" + JSON.stringify(token, null, 2);
        } catch (e) {
            displayError(e.message);
        }
    }
};
