import { replaceSelection } from '../../app/editor.js';

export default {
    name: 'passphrase',
    description: 'Generate a passphrase using the EFF short word list',
    action(scratchpad) {
        replaceSelection(scratchpad, generatePassphrase());
    }
};
