import { replaceSelection } from '../../app/editor.js';

export default {
    name: 'dt',
    footer: true,
    action(scratchpad) {
        replaceSelection(scratchpad, new Date().toISOString());
    }
};
