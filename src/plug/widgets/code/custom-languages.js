import { languages } from 'monaco-editor';

/***
 * 站内用于自定义高亮的语言
 */
const MURPH_LANGS = {
    bat: {
        snippet: true
    },
    css: {
        snippet: true
    },
    dockerfile: {
        snippet: true
    },
    html: {},
    ini: {},
    java: {
        snippet: true
    },
    javascript: {
        snippet: true,
    },
    json: {
        options: {
            'sql.indent_width': {
                label: 'Tab 宽度',
                type: Number,
                value: 4,
                range: [3, 5]
            }
        }
    },
    markdown: {},
    mysql: {
        snippet: true,
        parent: 'sql'
    },
    pgsql: {
        snippet: true,
        parent: 'sql'
    },
    plaintext: {},
    python: {
        snippet: true
    },
    shell: {
        snippet: true
    },
    sql: {
        snippet: true,
        options: {
            'sql.keyword_case': {
                label: '关键字显示大写',
                type: Boolean,
                value: true,
                enum: ['UPPER', 'LOWER']
            },
            'sql.indent_width': {
                label: 'Tab 宽度',
                type: Number,
                value: 4,
                range: [3, 5]
            },
            'sql.indent_use_spaces': {
                label: '使用空格替换 Tab',
                type: Boolean,
                value: true
            }
        }
    },
    swift: {},
    typescript: {
        snippet: true
    },
    xml: {},
    yaml: {}
};

export const COSUTOM_MODES = languages.getLanguages().filter(item => {
    const custom = MURPH_LANGS[item.id];
    Object.assign(item, custom);
    return custom;
});
