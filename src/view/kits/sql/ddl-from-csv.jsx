import React from "react";

import { Button, Checkbox, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";

import { chunk, mapKeys, zipObject } from "lodash";

import { insert } from 'sql-bricks';

import exportFromJSON from "export-from-json";

import { useDocumentTitle } from '/src/plug/hooks';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import { Splitter } from "/src/plug/widgets/containers";

import { parse as parseJSON } from '../json/json-kits.v1';

import { parseCSVFile } from "../csv/csv-support";

const wrapFieldName = (name) => '`' + name + '`';

export default function DdlFromCsv() {
    useDocumentTitle('CSV to SQL Inserts');
    const editorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer((state, payload) => {
        return { ...state, ...payload };
    }, { tableName: 'demo_table', batchSize: 5, fields: {} });
    const fields = React.useMemo(() => Object.entries(state.fields), [state.fields]);
    const doCsvImport = ([file]) => {
        parseCSVFile(file).then(([success, payload]) => {
            if (success) {
                editorRef && editorRef.current && editorRef.current.setValue(JSON.stringify(payload, null, 4));
                dispatch({ fields: zipObject(payload.meta.fields, payload.meta.fields) });
            } else {
                console.error('导入文件出错', payload);
            }
        });
    };
    const doSqlExport = () => {
        if (editorRef && editorRef.current) {
            const parsed = parseJSON(editorRef.current.getValue());
            const tableDataRows = parsed.data.map((row) => mapKeys(row, (value, key) => wrapFieldName(key)));
            const result = chunk(tableDataRows, state.batchSize).map(rows => insert(state.tableName, rows).toString());
            exportFromJSON({
                data: result.join(';\n\n'),
                extension: 'sql',
                fileName: state.tableName,
                withBOM: true
            });
        }
    };
    return (
        <Splitter sizes={[80, 20]} minSizes={[1100, 400]}>
            <CodeEditor ref={editorRef} language="json" />
            <Stack spacing={2} sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ border: '1px solid #fcfcfc' }}>
                        <Button variant="contained" component="label">
                            <input hidden={true} accept=".csv" type="file" onChange={e => doCsvImport(e.target.files)} />
                            <span>导入 CSV 文件</span>
                        </Button>
                        <Button variant="contained" onClick={doSqlExport}>
                            <span>导出 SQL 文件</span>
                        </Button>
                    </Stack>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography sx={{ mb: 3, fontSize: 12 }} color="text.secondary">导出配置</Typography>
                    <Stack spacing={3}>
                        <TextField size="small" label="Table Name" value={state.tableName} onChange={e => dispatch({ tableName: e.target.value })} />
                        <TextField size="small" type="number" label="Batch Size" value={state.batchSize} onChange={e => dispatch({ batchSize: e.target.value })} />
                    </Stack>
                </Paper>
                {Array.isArray(fields) && fields.length > 0 ? (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography sx={{ mb: 3, fontSize: 12 }} color="text.secondary">字段配置</Typography>
                        <Stack spacing={3}>
                            {fields.map(([field, alias], index) => (
                                <Stack key={index} direction="row" spacing={2}>
                                    <TextField size="small" label={field} value={alias} InputProps={{
                                        startAdornment: <InputAdornment position="start">alias</InputAdornment>,
                                    }} />
                                    <Checkbox size="small" />
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>
                ) : null}
            </Stack>
        </Splitter>
    );
}