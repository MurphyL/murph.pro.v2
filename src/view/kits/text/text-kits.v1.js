import utf8 from 'crypto-js/enc-utf8';
import base64 from 'crypto-js/enc-base64';
import md5 from 'crypto-js/md5';
import base_sha256 from 'crypto-js/sha256';
import hmac_sha256 from 'crypto-js/hmac-sha256';

export const toBase64 = (source) => {
    return base64.stringify(utf8.parse(source));
}

export const fromBase64 = (source) => {
    return utf8.stringify(base64.parse(source));
}

export const toMD5 = (source) => {
    return md5(source).toString()
};

export const toSHA256 = (source, hmac = false, key = '') => {
    if (hmac) {
        return hmac_sha256(source, key).toString();
    } else {
        return base_sha256(source).toString();
    }
};

export const fromUnicode = (source) => {
    return utf8.parse(source).toString();
}