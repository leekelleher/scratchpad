export default {
    name: 'copy-formatted',
    action(scratchpad) {
        function listener(e) {
            let el = document.createElement('div');
            el.classList = 'formatted-md';

            let content = scratchpad.value;
            el.innerHTML = marked.parse(content, {
                highlight: (code) => {
                    return hljs.highlightAuto(code).value;
                }
            });
            e.clipboardData.setData("text/html", el.innerHTML);
            e.clipboardData.setData("text/plain", el.innerHTML);
            e.preventDefault();
        }

        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    }
};
