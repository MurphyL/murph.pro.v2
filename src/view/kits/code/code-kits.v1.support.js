const INDENT_SIZE = 4;

const parseJSON = (source) => {
    if (undefined === source || null === source) {
        return null;
    }
    return typeof source === 'string' ? JSON.parse(source) : source;
}

const format = (source, pretty = true, indent = INDENT_SIZE) => {
    let parsed = parseJSON(source);
    if (!pretty) {
        return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, indent);
};

export const execAction = (state, event) => {
    switch (event.action) {
        case 'format-json':
            return { ...state, content: format(state.content, event.pretty) };
    }
    return state;
};

export const getActions = (language) => {
    switch (language) {
        case 'json':
            return [{
                action: 'format-json',
                display: '格式化',
                pretty: true
            }, {
                action: 'format-json',
                display: '压缩',
                pretty: false
            }, {
                action: 'json-view',
                display: 'JSON 视图',
            }, null, {
                action: 'jsonpath-query',
                display: '发送到 JSONPath Query',
            }, null, {
                action: 'import-file',
                display: '导入 CSV 文件',
            }, null, {
                action: 'convert-to',
                display: '转换为 YAML',
            }, {
                action: 'convert-to',
                display: '转换为 XML',
            }];
        default:
            return [];
    }
};