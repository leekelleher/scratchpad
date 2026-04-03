import { replaceSelection } from '../../app/editor.js';
import generatePassphrase from './eff-short-passphrase.esm.js';

export default function(scratchpad) {
    replaceSelection(scratchpad, generatePassphrase());
}
