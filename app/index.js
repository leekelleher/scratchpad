import { load, save } from './storage.js';
import { handleKeyDown, handleKeyUp, indentCurrentLine, unindentCurrentLine } from './editor.js';
import { renderTools } from './ui.js';

import base64decode from '../tools/base64-decode/index.js';
import base64encode from '../tools/base64-encode/index.js';
import copyFormatted from '../tools/copy-formatted/index.js';
import dark from '../tools/dark/index.js';
import download from '../tools/download/index.js';
import dt from '../tools/dt/index.js';
import htmlFormat from '../tools/html-format/index.js';
import jq from '../tools/jq/index.js';
import jwt from '../tools/jwt/index.js';
import markdown from '../tools/markdown/index.js';
import passphrase from '../tools/passphrase/index.js';
import pw from '../tools/pw/index.js';
import shuffle from '../tools/shuffle/index.js';
import sidebar from '../tools/sidebar/index.js';
import sort from '../tools/sort/index.js';
import uuid from '../tools/uuid/index.js';
import writeGood from '../tools/write-good/index.js';

const tools = [
    base64decode,
    base64encode,
    copyFormatted,
    dark,
    download,
    dt,
    htmlFormat,
    jq,
    jwt,
    markdown,
    passphrase,
    pw,
    shuffle,
    sidebar,
    sort,
    uuid,
    writeGood,
];

let scratchpad = document.querySelector('#scratchpad');
load(scratchpad);

scratchpad.onkeydown = (e) => handleKeyDown(e, scratchpad);
scratchpad.onkeyup = (e) => handleKeyUp(e, scratchpad);

renderTools(tools, scratchpad);

scratchpad.focus();

Mousetrap.bind('mod+shift+k', function(e) {
    sidebar.action();
});

Mousetrap.bind('mod+]', function(e) {
    indentCurrentLine(scratchpad);
});

Mousetrap.bind('mod+[', function(e) {
    unindentCurrentLine(scratchpad);
});
