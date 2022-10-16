import { JSONPath } from 'jsonpath-plus';

export const demo = '{"hello": "world"}';

// export const toXML = (source) => {
//     return jstoxml.toXML(parse(source), { indent: INDENT_TEXT }) || '';
// };

/**
 * @params source - JSON 文本
 * @params expr - JSONPath 表达式
 * @return { object }
 */
export const doJSONPathQuery = (source, expr) => {
    return JSONPath(expr, parse(source));
};

// TODO - https://jmespath.org/
export const doJEMSPathQuery = (source, expr) => {
    return null;
};

