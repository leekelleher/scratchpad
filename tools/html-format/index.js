let prettier, prettierHtml;

export default async function(scratchpad) {
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
