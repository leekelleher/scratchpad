import { replaceAll } from '../../app/editor.js';

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export default function(scratchpad) {
    let lines = scratchpad.value.split("\n");
    lines = shuffle(lines);
    replaceAll(scratchpad, lines.join("\n"));
}
