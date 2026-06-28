import { Marked } from './marked.esm.js';
import { markedHighlight } from './marked-highlight.js';
import hljs from './highlight.esm.min.js';
import { openDismissablePanel, dismissDismissablePanels } from '../../app/ui.js';

export const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }),
    {
        renderer: {
            link({ href, title, text }) {
                const titleAttr = title ? ` title="${title}"` : '';
                return `<a href="${href}"${titleAttr} target="_blank">${text}</a>`;
            }
        }
    }
);

function updateMarkdown(scratchpad) {
    let el = document.querySelector('#markdownOutput');
    el.innerHTML = marked.parse(scratchpad.value);
}

export default function(scratchpad) {
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
