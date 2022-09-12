import axios from 'axios';

import { format } from '../json/json-kits.v1';

const REST_REQUEST_RULE = /^(GET|POST|PUT|DELETE|PATCH)\s+/;

const AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINTS_ROOT,
    timeout: 15000,
    headers: {}
});

/**
 * 解析请求体
 * @param {*} model - monaco-editor model
 * @param {*} range - 数据范围
 * @returns 
 */
export const parseRequestSchema = (model, range) => {
    const { startLineNumber, endLineNumber } = range;
    let request = { params: [] };
    for (var i = startLineNumber; i <= endLineNumber; i++) {
        let content = model.getLineContent(i).trim();
        if (i === startLineNumber) {
            request.method = REST_REQUEST_RULE.exec(content)[0].trim();
            request.url = content.replace(REST_REQUEST_RULE, '').trim();
        } else {
            if (/^\s+/.test(content) && !request.headers) {
                request.params.push(content);
                continue;
            }
            if (!request.headers) {
                request.headers = {};
            }
            if (content.length > 0) {
                const pos = content.indexOf(':');
                if (pos > 0) {
                    request.headers[content.substring(0, pos).trimEnd()] = content.substring(pos + 1).trimStart();
                }
            } else if (content.length === 0) {
                request.body = model.getValueInRange({ startLineNumber: i + 1, endLineNumber }).trim();
                break;
            }
        }
    }
    return request;
};

/**
 * 执行请求
 * @param {*} url - 请求地址
 * @param {*} params - 请求参数
 * @returns 
 */
export const doAjaxRequest = async (url = '/', params = {}) => {
    // console.log(params);
    return await AXIOS_INSTANCE.post(url, params)
        .then(({ status, data }) => ({ status, payload: data || {} }))
        .catch(e => ({ status: 500, payload: e.message || '执行请求错误' }));
};

/**
 * 渲染请求结果
 * @param {*} request - 请求体
 * @param {*} response - 请求结果
 * @returns 
 */
export const renderResponse = (request = {}, response = {}) => {
    return [
        `${request.method} ${request.url}\n`,
        format(request.body),
        `\n`,
        `HTTP/1 - ${response.status}\n`,
        format(response.payload)
    ].join('\n');
}

