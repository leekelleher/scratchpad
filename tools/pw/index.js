import { replaceSelection } from '../../app/editor.js';

export default function(scratchpad) {
    var passwordCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%+-./:=@_"
    var result = "";
    while (result.length < 12) {
        result += passwordCharacters[Math.floor(Math.random() * passwordCharacters.length)];
    }
    replaceSelection(scratchpad, result);
}
