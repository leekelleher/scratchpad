# Design Spec: Lazy-Load Tool Modules

## Context

All 17 tool modules are statically imported in `app/index.js` at startup, meaning every tool's JS (and its dependencies) is fetched and evaluated on page load. Most tools are rarely used per session. By lazy-loading tool modules on first use, we reduce startup cost — only the metadata (name, description, footer flag) loads upfront.

We already proved this pattern works with Prettier in `tools/html-format/index.js`, which uses dynamic `import()` inside its action. This spec extends that approach to all tools.

## Design

### Tool Registry

The `tools` array in `app/index.js` becomes a registry of plain data objects with an inline import function:

```js
const tools = [
    { name: 'base64-decode', module: () => import('../tools/base64-decode/index.js') },
    { name: 'base64-encode', module: () => import('../tools/base64-encode/index.js') },
    { name: 'copy-formatted', module: () => import('../tools/copy-formatted/index.js') },
    { name: 'dark', footer: true, module: () => import('../tools/dark/index.js') },
    { name: 'dl', footer: true, module: () => import('../tools/download/index.js') },
    { name: 'dt', footer: true, module: () => import('../tools/dt/index.js') },
    { name: 'html-format', footer: true, module: () => import('../tools/html-format/index.js') },
    { name: 'jq', description: 'Format the current scratchpad value as JSON', footer: true, module: () => import('../tools/jq/index.js') },
    { name: 'jwt', footer: true, module: () => import('../tools/jwt/index.js') },
    { name: 'md', footer: true, module: () => import('../tools/markdown/index.js') },
    { name: 'passphrase', description: 'Generate a passphrase using the EFF short word list', module: () => import('../tools/passphrase/index.js') },
    { name: 'pw', description: 'Generate a random 12 character password', footer: true, module: () => import('../tools/pw/index.js') },
    { name: 'shuffle', description: 'Shuffle all lines in the scratchpad randomly', module: () => import('../tools/shuffle/index.js') },
    { name: 'sidebar', footer: true, module: () => import('../tools/sidebar/index.js') },
    { name: 'sort', description: 'Sort all lines in the scratchpad alphabetically', module: () => import('../tools/sort/index.js') },
    { name: 'uuid', footer: true, module: () => import('../tools/uuid/index.js') },
    { name: 'write-good', module: () => import('../tools/write-good/index.js') },
];
```

All 17 static import statements at the top of `app/index.js` are removed.

### UI Changes — `app/ui.js`

`makeToolButton`'s onclick handler calls `tool.module()` to get the loaded module, then calls its action:

```js
btn.onclick = async () => {
    const { default: mod } = await tool.module();
    await mod.action(scratchpad);
    save(scratchpad);
};
```

ES modules are cached by the browser after the first `import()`, so repeated calls to `tool.module()` return the cached module — no manual caching needed.

### Keyboard Shortcuts — `app/index.js`

The document-level keydown listener references `sidebar` and `download` tools directly. These need to use the same lazy pattern:

```js
document.addEventListener('keydown', async (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;

    if (e.shiftKey && e.key === 'K') {
        e.preventDefault();
        const { default: sidebar } = await import('../tools/sidebar/index.js');
        sidebar.action();
    } else if (e.key === 's') {
        e.preventDefault();
        const { default: download } = await import('../tools/download/index.js');
        download.action(scratchpad);
    }
});
```

### Tool Modules — No Changes

Each tool's `index.js` stays unchanged. They still export `{ default: { name, action, ... } }`. The `name` and `description` in the registry must match what each tool exports (the registry is the source of truth for UI rendering; the module export is used only for `action`).

### html-format Special Case

`tools/html-format/index.js` currently lazy-loads Prettier internally. With this change, the tool module itself is lazy-loaded, so Prettier is doubly deferred — which is fine. No change needed to the tool.

## Files Modified

- `app/index.js` — remove static imports, convert `tools` array to registry with `module` functions, update keyboard shortcuts
- `app/ui.js` — `makeToolButton` onclick calls `tool.module()` then `mod.action()`

## What Does NOT Change

- All 17 tool `index.js` files
- `app/editor.js`
- `app/storage.js`
- `style.css`
- `index.html`

## Verification

- All tools work from footer and sidebar (first click lazy-loads, subsequent clicks instant)
- Ctrl+Shift+K toggles sidebar
- Ctrl+S downloads
- Network tab shows tool modules loading on first use, not at startup
- Markdown preview and write-good panels work (including onsave live updates)