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

export default {
    name: 'shuffle',
    description: 'Shuffle all lines in the scratchpad randomly',
    action(scratchpad) {
        let lines = scratchpad.value.split("\n");
        lines = shuffle(lines);
        scratchpad.value = lines.join("\n");
    }
};
