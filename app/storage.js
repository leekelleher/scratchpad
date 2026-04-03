export function load(scratchpad) {
    if (localStorage.getItem("mode") == "night") {
        document.getElementsByTagName('body')[0].classList = 'night';
    }

    if (localStorage.getItem("scratchpad")) {
        scratchpad.value = localStorage.getItem("scratchpad");
    }
}

export function save(scratchpad) {
    localStorage.setItem("scratchpad", scratchpad.value);

    if (scratchpad.onsave) {
        scratchpad.onsave(scratchpad);
    }
}
