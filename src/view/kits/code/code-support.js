import YAML from 'js-yaml';
import { format as formatSQL } from 'sql-formatter';

const INDENT_SIZE = 4;

const converters = {
    json: {
        parse(source) {
            if (undefined === source || null === source) {
                return null;
            }
            return typeof source === 'string' ? JSON.parse(source) : source;
        },
        stringify(data, pretty) {
            return pretty ? JSON.stringify(data, null, INDENT_SIZE) : JSON.stringify(data);
        }
    },
    sql: {
        parse(source) {
            return source;
        },
        stringify(source) {
            return formatSQL(source, {
                tabWidth: 4,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            });
        }
    },
    yaml: {
        parse(source) {
            return YAML.load(source);
        },
        stringify(data) {
            return YAML.dump(data, { indent: INDENT_SIZE }) || ''
        }
    },
};

export const doConvert = (language, content = '', pretty = true) => {
    const { source, target } = (typeof language === 'string') ? { source: language, target: language } : language;
    if (converters[source] && converters[target] && converters[source].parse && converters[target].stringify) {
        const parsed = converters[source].parse(content);
        return { language: target, content: converters[target].stringify(parsed, pretty) };
    } else {
        return { language, content };
    }
}

export const getActions = (language) => {
    switch (language) {
        case 'json':
            return [{
                action: 'convert-to',
                display: '格式化',
                language: 'json',
                pretty: true
            }, {
                action: 'convert-to',
                display: '压缩',
                language: 'json',
                pretty: false
            }, {
                action: 'navigate-to',
                display: 'JSON 视图',
                redirect: '/kits/json/tree-view'
            }, null, {
                action: 'navigate-to',
                display: '发送到 JSONPath Query',
                redirect: '/kits/json/path-query'
            }, null, {
                action: 'import-file',
                display: '导入 CSV 文件',
                accept: '.csv',
            }, {
                action: 'convert-to',
                display: '转换为 YAML',
                language: { source: 'json', target: 'yaml' }
            }];
        case 'sql':
            return [{
                action: 'convert-to',
                display: '格式化',
                language: 'sql',
                pretty: true
            }];
        case 'yaml':
            return [{
                action: 'convert-to',
                display: '转换为 JSON',
                language: { source: 'yaml', target: 'json' }
            }];
        default:
            return [];
    }
};
