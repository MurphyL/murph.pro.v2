export const format = (source, pretty=true, indent = 4) => {
    if (typeof source === 'string') {
        let parsed = JSON.parse(source);
        if(!pretty) {
            return JSON.stringify(parsed);
        }
        return JSON.stringify(parsed, null, indent);
    } else {
        return null;
    }
};