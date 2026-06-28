import writeGood from './write-good.esm.js';
import { openDismissablePanel, dismissDismissablePanels } from '../../app/ui.js';

function updateWriteGood(scratchpad) {
    let tempEl = document.createElement('div');
    tempEl.innerText = scratchpad.value;

    let html = tempEl.innerHTML;
    let results = writeGood(html);

    // Merge overlapping ranges so the reverse-splice loop always receives
    // non-overlapping entries and never cuts through injected markup.
    // results is already sorted ascending by index (from writeGood()).
    const merged = [];
    for (let r of results) {
        const prev = merged[merged.length - 1];
        if (prev && r.index < prev.index + prev.offset) {
            // Overlapping: extend the previous range and collect the reason.
            prev.offset = Math.max(prev.index + prev.offset, r.index + r.offset) - prev.index;
            prev.reasons.push(r.reason);
        } else {
            merged.push({ index: r.index, offset: r.offset, reasons: [r.reason] });
        }
    }

    for (let r of merged.reverse()) {
        html = html.substring(0, r.index) +
            "<span class='highlight' aria-label='" + r.reasons.join(' / ') + "' data-tooltip-pos='down-left'>" +
            html.substring(r.index, r.index + r.offset) +
            "</span>" + html.substring(r.index + r.offset);
    }

    let el = document.querySelector('#writeGoodOutput');
    el.innerHTML = html;
}

export default function(scratchpad) {
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
