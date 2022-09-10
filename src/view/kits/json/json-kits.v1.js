import YAML from 'js-yaml';
// import XML2JS from 'x2js';
import jstoxml from 'jstoxml';

const INDENT_SIZE = 4;
const INDENT_TEXT = new Array(INDENT_SIZE).join(' ');

// const x2js = new XML2JS({ attributePrefix: '' });

export const format = (source, pretty = true, indent = INDENT_SIZE) => {
    let parsed = typeof source === 'string' ? JSON.parse(source) : source;
    if (!pretty) {
        return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, indent);
};

export const fromINI = (source) => {
    return format({ ini: source });
};

export const toXML = (source) => {
    return jstoxml.toXML(JSON.parse(source), { indent: INDENT_TEXT }) || '';
};

export const fromYAML = (source) => {
    return format(YAML.load(source))
};

export const toYAML = (source) => {
    return YAML.dump(JSON.parse(source), { indent: INDENT_SIZE }) || ''
};

