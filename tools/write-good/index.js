import { openDismissablePanel, dismissDismissablePanels } from '../../app/ui.js';

function updateWriteGood(scratchpad) {
    let tempEl = document.createElement('div');
    tempEl.innerText = scratchpad.value;

    let html = tempEl.innerHTML;
    let results = writeGood(html);

    for (let r of results.reverse()) {
        console.log(r);
        html = html.substring(0, r.index) +
            "<span class='highlight' aria-label='" + r.reason + "' data-balloon-pos='down-left'>" +
            html.substring(r.index, r.index + r.offset) +
            "</span>" + html.substring(r.index + r.offset);
    }

    let el = document.querySelector('#writeGoodOutput');
    el.innerHTML = html;
}

export default {
    name: 'write-good',
    action(scratchpad) {
        let el = document.querySelector('#writeGoodOutput');

        if (!el) {
            openDismissablePanel('writeGoodOutput')
            updateWriteGood(scratchpad);
            scratchpad.onsave = updateWriteGood;
        } else {
            dismissDismissablePanels();
            scratchpad.onsave = null;
        }
    }
};
