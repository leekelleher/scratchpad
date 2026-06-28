import { load } from './storage.js';
import { handleKeyDown, handleKeyUp, enterEditMode } from './editor.js';
import { renderTools } from './ui.js';

const tools = [
    { name: 'base64-decode', action: () => import('../tools/base64-decode/index.js') },
    { name: 'base64-encode', action: () => import('../tools/base64-encode/index.js') },
    { name: 'copy-formatted', action: () => import('../tools/copy-formatted/index.js') },
    { name: 'dark', toolbar: true, icon: 'icon-dark', label: 'Toggle dark mode', action: () => import('../tools/dark/index.js') },
    { name: 'download', toolbar: true, icon: 'icon-dl', label: 'Download contents (ctrl+s)', action: () => import('../tools/download/index.js') },
    { name: 'datetime', toolbar: true, icon: 'icon-datetime', label: 'Insert date/time', action: () => import('../tools/datetime/index.js') },
    { name: 'html-format', icon: 'icon-html-format', label: 'Format HTML', action: () => import('../tools/html-format/index.js') },
    { name: 'json-format', icon: 'icon-json-format', label: 'Format JSON', action: () => import('../tools/json-format/index.js') },
    { name: 'jwt', icon: 'icon-jwt', label: 'Decode JWT', action: () => import('../tools/jwt/index.js') },
    { name: 'markdown', toolbar: true, icon: 'icon-md', label: 'Markdown', action: () => import('../tools/markdown/index.js') },
    { name: 'passphrase', description: 'Generate a passphrase using the EFF short word list', action: () => import('../tools/passphrase/index.js') },
    { name: 'password', icon: 'icon-password', label: 'Generate password', action: () => import('../tools/password/index.js') },
    { name: 'shuffle', description: 'Shuffle all lines in the scratchpad randomly', action: () => import('../tools/shuffle/index.js') },
    { name: 'sort', description: 'Sort all lines in the scratchpad alphabetically', action: () => import('../tools/sort/index.js') },
    { name: 'uuid', icon: 'icon-uuid', label: 'Generate UUID', action: () => import('../tools/uuid/index.js') },
    { name: 'write-good', action: () => import('../tools/write-good/index.js') },
    { name: 'sidebar', toolbar: true, icon: 'icon-more', label: 'More tools (ctrl+shift+k)', action: () => import('../tools/sidebar/index.js') },
];

const scratchpad = document.getElementById('scratchpad');
load(scratchpad);

scratchpad.onkeydown = (e) => handleKeyDown(e, scratchpad);
scratchpad.onkeyup = (e) => handleKeyUp(e, scratchpad);
scratchpad.onclick = () => enterEditMode();

renderTools(tools, scratchpad);

scratchpad.focus();
enterEditMode();

document.addEventListener('keydown', async (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;

    if (e.shiftKey && e.key === 'K') {
        e.preventDefault();
        const { default: toggleSidebar } = await import('../tools/sidebar/index.js');
        toggleSidebar();
    } else if (e.key === 's') {
        e.preventDefault();
        const { default: download } = await import('../tools/download/index.js');
        download(scratchpad);
    }
});
