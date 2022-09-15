import YAML from 'js-yaml';
import jstoxml from 'jstoxml';
import { JSONPath } from 'jsonpath-plus';

const INDENT_SIZE = 4;
const INDENT_TEXT = new Array(INDENT_SIZE).join(' ');

const parseJSON = (source) => {
    if (undefined === source || null === source) {
        return null;
    }
    return typeof source === 'string' ? JSON.parse(source) : source;
}

export const format = (source, pretty = true, indent = INDENT_SIZE) => {
    let parsed = parseJSON(source);
    if (!pretty) {
        return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, indent);
};

export const demo = '{"hello": "world"}';

export const toXML = (source) => {
    return jstoxml.toXML(parseJSON(source), { indent: INDENT_TEXT }) || '';
};

export const fromYAML = (source) => {
    return format(YAML.load(source))
};

export const toYAML = (source) => {
    return YAML.dump(parseJSON(source), { indent: INDENT_SIZE }) || ''
};

/**
 * @params source - JSON 文本
 * @params expr - JSONPath 表达式
 * @return { object }
 */
export const doJSONPathQuery = (source, expr) => {
    return JSONPath(expr, parseJSON(source));
};


// papaparse
export const fromCSV() {};

// papaparse
export const toCSV() {};