import React from 'react';

import axios from 'axios';

import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';

export const KITS_AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINTS_ROOT,
    timeout: 15000,
    headers: {}
});

export const resolveServerKitResponse = ({ status, data = {} }) => {
    if(status === 200 && data.success) {
        return [ true, data.payload ];
    } else {
        return [ false, data.payload || '请求出错' ];
    }
};


export const useServerKit = (kit) => {
    const family = React.useMemo(() => selectorFamily({
        key: 'exec-server-kit-v1',
        get: (data) => async () => {
            return KITS_AXIOS_INSTANCE.post(kit, data).then(resp => {
                const { status, data = {} } = resp;
                if(status === 200 && data.success) {
                    return [ true, data.payload ];
                } else {
                    return [ false, data.payload || '请求出错' ];
                }
            }).catch(e => {
                return [ false, e.message || '解析出错' ];
            })
        }
    }), [kit]);
    return useRecoilValue(family);
};