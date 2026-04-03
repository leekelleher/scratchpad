export default function(scratchpad) {
    let lines = scratchpad.value.split("\n");
    lines.sort()
    scratchpad.value = lines.join("\n");
}
