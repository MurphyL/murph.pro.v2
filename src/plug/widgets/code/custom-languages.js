import { languages } from 'monaco-editor';

/***
 * 站内用于自定义高亮的语言
 */
const MURPH_LANGS = {
    bat: {
        snippet: true
    },
    c: {},
    cpp: {},
    csharp: {},
    css: {
        snippet: true
    },
    dockerfile: {
        snippet: true
    },
    go: {},
    html: {},
    ini: {},
    java: {
        snippet: true
    },
    javascript: {
        snippet: true
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
    julia: {},
    kotlin: {},
    lua: {},
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
    powershell: {},
    proto: {},
    python: {
        snippet: true
    },
    redis: {},
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

export default languages.getLanguages().filter(item => {
    const custom = MURPH_LANGS[item.id];
    Object.assign(item, custom);
    return custom;
});