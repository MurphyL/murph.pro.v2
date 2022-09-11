import axios from 'axios';

import { format } from '../json/json-kits.v1';

const AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINTS_ROOT,
    timeout: 15000,
    headers: {}
});

export const doAjaxRequest = async (url = '/', params = {}) => {
    return await AXIOS_INSTANCE.post(url, params)
        .then(({ status, data }) => ({ success: status === 200, payload: data || {} }))
        .catch(e => ({ success: false, message: e.message || '执行请求错误' }));
};

export const renderResponse = (request = {}, response = {}) => {
    return [
        `${request.method} ${request.url}\n`, 
        format(request.body),
        `HTTP/1 - ${response.status}\n`,
        format(response.payload)
    ].join('\n');
}