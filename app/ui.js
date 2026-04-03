import { save } from './storage.js';

export function removeError() {
    const el = document.getElementById('errors');
    el.parentNode.removeChild(el);
}

export function displayError(message) {
    const el = document.createElement('div');
    el.id = "errors";
    el.role = "alert";
    el.tabIndex = 0;
    el.innerText = message;
    el.onclick = removeError;
    el.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') removeError();
    };
    document.body.appendChild(el);
    el.focus();
}

export function dismissDismissablePanels() {
    const els = document.getElementsByClassName('dismissable');

    for (const el of els) {
        el.parentNode.removeChild(el);
    }
}

export function openDismissablePanel(id) {
    dismissDismissablePanels();

    const el = document.createElement('div');
    el.classList = 'dismissable';

    const closeEl = document.createElement('button');
    closeEl.type = 'button';
    closeEl.textContent = 'x';
    closeEl.classList = 'close';
    closeEl.setAttribute('aria-label', 'Close panel');
    closeEl.onclick = dismissDismissablePanels;
    el.appendChild(closeEl);

    const contentEl = document.createElement('div');
    contentEl.id = id;
    el.appendChild(contentEl);

    document.querySelector('main').appendChild(el);
}

function makeToolButton(label, tool, scratchpad) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.onclick = async () => {
        const { default: action } = await tool.action();
        await action(scratchpad);
        save(scratchpad);
    };
    return btn;
}

export function renderTools(tools, scratchpad) {
    const toolsEl = document.getElementById("tools");
    const sidebarEl = document.getElementById("sidebar");

    tools.forEach(tool => {
        if (tool.footer) {
            toolsEl.appendChild(makeToolButton(tool.name, tool, scratchpad));
        }
        sidebarEl.appendChild(makeToolButton(tool.name, tool, scratchpad));
    });
}
