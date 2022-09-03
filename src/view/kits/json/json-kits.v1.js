import YAML from 'js-yaml';
import XML2JS from 'x2js';
import jstoxml from 'jstoxml';

const x2js = new XML2JS({ attributePrefix: '' });

export const format = (source, pretty = true, indent = 4) => {
    let parsed = typeof source === 'string' ? JSON.parse(source) : source;
    if (!pretty) {
        return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, indent);
};

export const fromINI = (source) => {

};

export const fromXML = (source) => {
    return format(x2js.xml2js(source));
};

export const toXML = (source) => {
    return jstoxml.toXML(JSON.parse(source), { indent: '   ' });
};

export const fromYAML = (source) => {
    return format(YAML.load(source))
};

export const toYAML = (source) => {
    return YAML.dump(JSON.parse(source), { indent: 4 })
};

