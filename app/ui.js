import { save } from './storage.js';

export function removeError() {
    let el = document.querySelector('#errors');
    el.parentNode.removeChild(el);
}

export function displayError(message) {
    let el = document.createElement('div');
    el.id = "errors";
    el.innerText = message;
    el.onclick = removeError;
    document.querySelector('body').appendChild(el);
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

    let closeEl = document.createElement('span');
    closeEl.innerHTML = 'x';
    closeEl.classList = 'close';
    closeEl.onclick = dismissDismissablePanels;
    el.appendChild(closeEl);

    let contentEl = document.createElement('div');
    contentEl.id = id;
    el.appendChild(contentEl);

    document.querySelector('main').appendChild(el);
}

function makeToolLink(label, tool, scratchpad) {
    let a = document.createElement('a');
    a.innerText = label;
    a.href = "#";
    a.onclick = async (e) => {
        e.preventDefault();
        await tool.action(scratchpad);
        save(scratchpad);
    };
    return a;
}

export function renderTools(tools, scratchpad) {
    let toolsEl = document.querySelector("#tools");
    let sidebarEl = document.querySelector("#sidebar");

    tools.forEach(tool => {
        if (tool.footer) {
            toolsEl.appendChild(makeToolLink("~" + tool.name + "   ", tool, scratchpad));
        }
        sidebarEl.appendChild(makeToolLink("~" + tool.name, tool, scratchpad));
    });

    toolsEl.appendChild(document.createElement("br"));
    toolsEl.appendChild(document.createTextNode("(sidebar: cmd+shift+k)"));
}
