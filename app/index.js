import { load } from './storage.js';
import { handleKeyDown, handleKeyUp, enterEditMode } from './editor.js';
import { renderTools } from './ui.js';

const tools = [
    { name: 'base64-decode', action: () => import('../tools/base64-decode/index.js') },
    { name: 'base64-encode', action: () => import('../tools/base64-encode/index.js') },
    { name: 'copy-formatted', action: () => import('../tools/copy-formatted/index.js') },
    { name: 'dark', footer: true, icon: 'icon-dark', action: () => import('../tools/dark/index.js') },
    { name: 'dl', footer: true, icon: 'icon-dl', action: () => import('../tools/download/index.js') },
    { name: 'datetime', footer: true, icon: 'icon-datetime', action: () => import('../tools/datetime/index.js') },
    { name: 'html-format', footer: true, icon: 'icon-html-format', action: () => import('../tools/html-format/index.js') },
    { name: 'json-format', footer: true, icon: 'icon-json-format', action: () => import('../tools/json-format/index.js') },
    { name: 'jwt', footer: true, icon: 'icon-jwt', action: () => import('../tools/jwt/index.js') },
    { name: 'md', footer: true, icon: 'icon-md', action: () => import('../tools/markdown/index.js') },
    { name: 'passphrase', description: 'Generate a passphrase using the EFF short word list', action: () => import('../tools/passphrase/index.js') },
    { name: 'password', footer: true, icon: 'icon-password', action: () => import('../tools/password/index.js') },
    { name: 'shuffle', description: 'Shuffle all lines in the scratchpad randomly', action: () => import('../tools/shuffle/index.js') },
    { name: 'sidebar', footer: true, icon: 'icon-more', action: () => import('../tools/sidebar/index.js') },
    { name: 'sort', description: 'Sort all lines in the scratchpad alphabetically', action: () => import('../tools/sort/index.js') },
    { name: 'uuid', footer: true, icon: 'icon-uuid', action: () => import('../tools/uuid/index.js') },
    { name: 'write-good', action: () => import('../tools/write-good/index.js') },
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
