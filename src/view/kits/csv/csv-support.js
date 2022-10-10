import { parse as parseCSV } from 'papaparse';

export const parseCSVFile = (file) => {
    return new Promise((resolve) => {
        parseCSV(file, {
            header: true,
            worker: true,
            skipEmptyLines: true,
            complete: (result) => {
                console.log('CSV 文件解析成功：', file.name);
                resolve([true, result]);
            },
            error: (e) => {
                console.error('CSV 文件解析错误：', file.name, e);
                resolve([false, e.message || 'CSV 文件解析错误']);
            }
        })
    });
}