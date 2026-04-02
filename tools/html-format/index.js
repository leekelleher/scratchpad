import * as prettier from './prettier.mjs';
import * as prettierHtml from './prettier-html.mjs';

export default {
    name: 'html-format',
    footer: true,
    async action(scratchpad) {
        var formatted = await prettier.format(scratchpad.value, {
            parser: 'html',
            plugins: [prettierHtml]
        });
        scratchpad.value = formatted;
    }
};
