let prettier, prettierHtml;

export default {
    name: 'html-format',
    footer: true,
    async action(scratchpad) {
        if (!prettier) {
            [prettier, prettierHtml] = await Promise.all([
                import('./prettier.mjs'),
                import('./prettier-html.mjs')
            ]);
        }
        var formatted = await prettier.format(scratchpad.value, {
            parser: 'html',
            plugins: [prettierHtml]
        });
        scratchpad.value = formatted;
    }
};
