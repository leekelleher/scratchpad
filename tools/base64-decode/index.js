import { replaceAll } from '../../app/editor.js';

export default function(scratchpad) {
    replaceAll(scratchpad, atob(scratchpad.value));
}
