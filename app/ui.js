import { save } from './storage.js';

export function removeError() {
    let el = document.querySelector('#errors');
    el.parentNode.removeChild(el);
}

export function displayError(message) {
    let el = document.createElement('div');
    el.id = "errors";
    el.role = "alert";
    el.tabIndex = 0;
    el.innerText = message;
    el.onclick = removeError;
    el.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') removeError();
    };
    document.querySelector('body').appendChild(el);
    el.focus();
}

export function dismissDismissablePanels() {
    let els = document.getElementsByClassName('dismissable');

    for (let el of els) {
        el.parentNode.removeChild(el);
    }
}

export function openDismissablePanel(id) {
    dismissDismissablePanels();

    let el = document.createElement('div');
    el.classList = 'dismissable';

    let closeEl = document.createElement('button');
    closeEl.type = 'button';
    closeEl.textContent = 'x';
    closeEl.classList = 'close';
    closeEl.setAttribute('aria-label', 'Close panel');
    closeEl.onclick = dismissDismissablePanels;
    el.appendChild(closeEl);

    let contentEl = document.createElement('div');
    contentEl.id = id;
    el.appendChild(contentEl);

    document.querySelector('main').appendChild(el);
}

function makeToolButton(label, tool, scratchpad) {
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.onclick = async () => {
        await tool.action(scratchpad);
        save(scratchpad);
    };
    return btn;
}

export function renderTools(tools, scratchpad) {
    let toolsEl = document.querySelector("#tools");
    let sidebarEl = document.querySelector("#sidebar");

    tools.forEach(tool => {
        if (tool.footer) {
            toolsEl.appendChild(makeToolButton(tool.name, tool, scratchpad));
        }
        sidebarEl.appendChild(makeToolButton(tool.name, tool, scratchpad));
    });

    let hint = document.createElement('span');
    hint.textContent = "(sidebar: cmd+shift+k)";
    hint.style.width = "100%";
		hint.style.textAlign = "right";
    toolsEl.appendChild(hint);
}
