export default {
    name: 'html-format',
    footer: true,
    action(scratchpad) {
        var formatted = prettier.format(scratchpad.value, {parser: 'html', plugins: prettierPlugins});
        scratchpad.value = formatted;
    }
};
