import { replaceSelection } from '../../app/editor.js';

export default function(scratchpad) {
    replaceSelection(scratchpad, new Date().toISOString());
}
