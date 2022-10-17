import YAML from 'js-yaml';
import stringifyObject from 'stringify-object';
import { format as formatSQL } from 'sql-formatter';

import { languages } from 'monaco-editor';

/**
 * 统一代码缩进
 */
const INDENT_SIZE = 4;
const INDENT_TEXT = new Array(INDENT_SIZE).join(' ');

/***
 * 站内用于自定义高亮的语言
 * - command - 执行编辑器操作
 * - redirect - 执行页面切换操作
 * - action - 执行自定义编码操作
 */
export const COSUTOM_MODES = {
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
        actions: [{
            display: '格式化',
            command: 'editor.action.formatDocument',
        }]
    },
    json: {
        actions: [{
            display: '格式化',
            command: 'editor.action.formatDocument',
        }, {
            display: 'JSON 视图',
            redirect: '/kits/json/tree-view'
        }, null, {
            display: '发送到 Expression Query',
            redirect: '/kits/json/expression-query'
        }, null, {
            action: 'convert-to',
            display: '转换为 YAML',
            language: 'yaml'
        }, {
            action: 'convert-to',
            display: '转换为 JavaScript',
            language: 'javascript'
        }],
        options: {
            'sql.indent_width': {
                label: 'Tab 宽度',
                type: Number,
                value: INDENT_SIZE,
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
        actions: [{
            action: 'convert-to',
            display: '格式化',
            language: 'sql',
        }],
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
                value: INDENT_SIZE,
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
    yaml: {
        actions: [{
            action: 'convert-to',
            display: '转换为 JSON',
            language: 'json'
        }, {
            action: 'convert-to',
            display: '转换为 JavaScript',
            language: 'javascript'
        }]
    }
};

/**
 * 逐条语言属性完善
 */
languages.getLanguages().forEach(language => {
    COSUTOM_MODES[language.id] && Object.assign(COSUTOM_MODES[language.id], language)
});


/**
 * 渲染 JavaScript 代码
 * @param {*} data 
 * @returns 
 */
const toJavaScript = (data = {}) => {
    return `const prepared = ${stringifyObject(data)}`;
};

/**
 * 代码之间的转换方法
 */
export const converters = {
    json: {
        parse(source) {
            try {
                return JSON.parse(source);
            } catch (e) {
                return new Error('解析 JSON 数据出错');
            }
        },
        stringify(source) {
            return JSON.stringify(source, null, INDENT_SIZE);
        },
        yaml(source) {
            return converters.yaml.stringify(converters.json.parse(source)) || '';
        },
        javascript(source) {
            return toJavaScript(converters.json.parse(source));
        }
    },
    sql: {
        sql(source) {
            return formatSQL(source, {
                tabWidth: INDENT_SIZE,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            });
        },
    },
    yaml: {
        parse(source) {
            try {
                return YAML.load(source);
            } catch (e) {
                return new Error('解析 YAML 数据出错');
            }
        },
        stringify(source) {
            return YAML.dump(source, {
                noRefs: true,
                indent: INDENT_SIZE,
                lineWidth: -1,
                quotingType: '"',
                forceQuotes: true,
            });
        },
        json(source) {
            return converters.json.stringify(converters.yaml.parse(source));
        },
        javascript(source) {
            return toJavaScript(converters.yaml.parse(source));
        }
    },
};

/**
 * 通用 reducer 
 * @param {*} state 
 * @param {*} event 
 * @returns 
 */
export const mapEvent = (state, event, content) => {
    if (event.action === 'convert-to') {
        console.log('语言转换', [state.language, event.language]);
        if (converters[state.language] && converters[state.language][event.language]) {
            const result = converters[state.language][event.language](content);
            return { ...state, language: event.language, content: result };
        } else {
            return { ...state, language: event.language, content };
        }
    } else {
        return { ...state, ...event };
    }
};
