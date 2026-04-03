import { marked } from '../markdown/index.js';

export default {
    name: 'copy-formatted',
    action(scratchpad) {
        function listener(e) {
            let el = document.createElement('div');
            el.classList = 'formatted-md';

            el.innerHTML = marked.parse(scratchpad.value);
            e.clipboardData.setData("text/html", el.innerHTML);
            e.clipboardData.setData("text/plain", el.innerHTML);
            e.preventDefault();
        }

        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    }
};
