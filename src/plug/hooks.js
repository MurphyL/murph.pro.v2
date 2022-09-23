import React from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';

import { selectorFamily, useRecoilValue } from 'recoil';

const KITS_AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINTS_ROOT,
    timeout: 15000,
    headers: {}
});

export const useDocumentTitle = (title) => {
    const oldTitle = React.useMemo(() => document.title, []);
    React.useEffect(() => {
        document.title = `${title} - MURPH.PRO`;
        return () => document.title = oldTitle
    }, [title, oldTitle]);
};

export const useClipboard = () => React.useMemo(() => copy, []);

export const useServerKit = (path) => React.useCallback(({ data, params }) => {
    return KITS_AXIOS_INSTANCE.request({
        method: 'post', 
        url: path, 
        data: data,
        params: params
    }).then(resp => {
        const { status, data = {} } = resp;
        const success = status === 200 && data.success;
        return [ success, success ? data.payload : '服务端执行请求出错' ];
    }).catch(e => {
        console.log('执行异步请求出错', request, e);
        return [ false, e.message || '未知错误' ];
    });
}, [path]);

