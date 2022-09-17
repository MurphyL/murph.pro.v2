import utf8 from 'crypto-js/enc-utf8';
import base64 from 'crypto-js/enc-base64';

import md5 from 'crypto-js/md5';

import sha256 from 'crypto-js/sha256';
import hmac_sha256 from 'crypto-js/hmac-sha256';

export default function (state, action) {
    try {
        switch (action.type) {
            case 'url/encode':
                return { ...state, target: encodeURIComponent(state.source) };
            case 'url/dencode':
                return { source: state.source, target: decodeURIComponent(state.source) };
            case 'base64/encode':
                return { source: state.source, target: base64.stringify(utf8.parse(state.source)) };
            case 'base64/dencode':
                return { source: state.source, target: utf8.stringify(base64.parse(state.source)) };
            case 'md5/encode':
                return { source: state.source, target: md5(state.source).toString() };
            case 'sha256/encode':
                return { source: state.source, target: sha256(state.source).toString() };
            case 'hamc-sha256/encode':
                return { source: state.source, target: hmac_sha256(state.source, state.key || '').toString() };
            case 'exchange':
                return { source: action.source, target: '\n' };
            default:
                return { success: false, source: state.source, target: '\n', message: `不支持的操作：${action.type}` };
        }
    } catch (e) {
        console.error('操作出错', action, e);
        return { success: false, source: state.source, target: '\n', message: `${action.type}：${e.message || '未知错误'}` };
    }
};