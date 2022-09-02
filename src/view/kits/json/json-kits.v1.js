export const format = (source, pretty = true, indent = 4) => {
    let parsed = typeof source === 'string' ? JSON.parse(source) : source;
    if (!pretty) {
        return JSON.stringify(parsed);
    }
    return JSON.stringify(parsed, null, indent);
};