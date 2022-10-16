import React from 'react';
import { parse as parseCSV } from 'papaparse';

export const useDocumentTitle = (title) => {
    const oldTitle = React.useMemo(() => document.title, []);
    React.useEffect(() => {
        document.title = `${title} - MURPH.PRO`;
        return () => document.title = oldTitle
    }, [title]);
};


export const useTextFilesReader = () => {
    return React.useMemo(() => (files) => {
        return Promise.all(Array.from(files).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    resolve([true, reader.result, file]);
                };
                reader.onerror = (e) => {
                    resolve([true, e.message || '文件导入错误']);
                };
            });
        }));
    }, []);
};

export const useCSVFilesReader = () => {
    return React.useMemo(() => (files) => {
        return Promise.all(Array.from(files).map(file => {
            return new Promise((resolve) => {
                parseCSV(file, {
                    header: true,
                    worker: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        console.log('CSV 文件解析成功：', file.name);
                        resolve([true, result, file]);
                    },
                    error: (e) => {
                        console.error('CSV 文件解析错误：', file.name, e);
                        resolve([false, e.message || 'CSV 文件解析错误']);
                    }
                })
            });
        }));
    });
};
