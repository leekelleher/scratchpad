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

export function renderTools(tools, scratchpad) {
    let toolsEl = document.querySelector("#tools");
    let sidebarEl = document.querySelector("#sidebar");

    tools.forEach(tool => {
        if (tool.footer) {
            let a = document.createElement('a');
            a.innerText = "~" + tool.name + "   ";
            a.onclick = (e) => {
                e.preventDefault();
                tool.action(scratchpad);
                save(scratchpad);
            };
            a.href = "#";
            toolsEl.appendChild(a);
        }

        let a = document.createElement('a');
        a.innerText = "~" + tool.name;
        a.onclick = (e) => {
            e.preventDefault();
            tool.action(scratchpad);
            save(scratchpad);
        };
        a.href = "#";
        sidebarEl.appendChild(a);
    });

    toolsEl.appendChild(document.createElement("br"));
    toolsEl.appendChild(document.createTextNode("(sidebar: cmd+shift+k)"));
}
