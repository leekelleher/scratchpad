export function load(scratchpad) {
    const mode = localStorage.getItem("mode");
    if (mode) {
        // migrate legacy values
        const scheme = mode === "night" ? "dark" : mode === "day" ? "light" : mode;
        document.documentElement.style.colorScheme = scheme;
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
