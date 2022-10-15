import React from 'react';

export const useDocumentTitle = (title) => {
    const oldTitle = React.useMemo(() => document.title, []);
    React.useEffect(() => {
        document.title = `${title} - MURPH.PRO`;
        return () => document.title = oldTitle
    }, [title, oldTitle]);
};


export const useTextFileReader = () => {
    return (files) => {
        return Promise.all(Array.from(files).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    resolve([true, reader.result, file]);
                };
                reader.onerror = (e) => {
                    resolve([true, e.message || '解析错误']);
                };
            });
        }));
    };
}

export const useCSVReader = () => {

};