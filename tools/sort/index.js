export default {
    name: 'sort',
    description: 'Sort all lines in the scratchpad alphabetically',
    action(scratchpad) {
        let lines = scratchpad.value.split("\n");
        lines.sort()
        scratchpad.value = lines.join("\n");
    }
};
