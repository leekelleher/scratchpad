import { jwtDecode } from './jwt-decode.esm.js';
import { displayError } from '../../app/ui.js';

export default {
    name: 'jwt',
    footer: true,
    action(scratchpad) {
        try {
            var token = jwtDecode(scratchpad.value);
            var decodedHeader = jwtDecode(scratchpad.value, { header: true });
            scratchpad.value = JSON.stringify(decodedHeader, null, 2) + "\n" + JSON.stringify(token, null, 2);
        } catch (e) {
            displayError(e.message);
        }
    }
};
