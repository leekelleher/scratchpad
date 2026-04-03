import { replaceSelection } from '../../app/editor.js';

export default {
    name: 'pw',
    description: 'Generate a random 12 character password',
    footer: true,
    action(scratchpad) {
        var passwordCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%+-./:=@_"
        var result = "";
        while (result.length < 12) {
            result += passwordCharacters[Math.floor(Math.random() * passwordCharacters.length)];
        }
        replaceSelection(scratchpad, result);
    }
};
