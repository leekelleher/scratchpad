import { openDismissablePanel, dismissDismissablePanels } from '../../app/ui.js';

function updateMarkdown(scratchpad) {
    let el = document.querySelector('#markdownOutput');
    let content = scratchpad.value;
    el.innerHTML = marked(content, {
        highlight: (code) => {
            return hljs.highlightAuto(code).value;
        }
    });
}

export default {
    name: 'md',
    footer: true,
    action(scratchpad) {
        let el = document.querySelector('#markdownOutput');

        if (!el) {
            openDismissablePanel('markdownOutput');
            updateMarkdown(scratchpad);
            scratchpad.onsave = updateMarkdown;
        } else {
            dismissDismissablePanels();
            scratchpad.onsave = null;
        }
    }
};
