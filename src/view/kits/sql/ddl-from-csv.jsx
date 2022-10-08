import React from "react";

import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";

import { chunk, mapKeys } from "lodash";
import { insert } from 'sql-bricks';

import exportFromJSON from "export-from-json";

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import { parseJSON } from '../json/json-kits.v1';
import { doImport } from '../source-code/code-kits.v1.support';
import { useDocumentTitle } from '/src/plug/hooks';

// Dialect
const SQL_DIALECTS = Object.entries({
    mysql: {
        label: 'MySQL',
        type: {
            text: 'varchar',
        }
    },
    sqlite: {
        label: 'SQLite',
        type: {
            text: 'text',
        }
    },
    hive: {
        label: 'Hive QL',
        type: {
            text: 'varchar',
        }
    }
});

const wrapFieldName = (name) => '`' + name + '`';

export default function DdlFromCsv() {
    useDocumentTitle('CSV to SQL Inserts');
    const editorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer((state, { type, ...payload }) => {
        switch (type) {
            case 'update-options':
                return { ...state, ...payload };
        }
    }, { tableName: 'demo_table', dialect: 'mysql' });
    const doCsvImport = (files) => {
        try {
            doImport({ accept: '.csv', files }, (success, result) => {
                if (success && editorRef && editorRef.current) {
                    editorRef.current.setValue(result);
                }
            });
        } catch (e) {
            console.error('导入文件出错', e);
        }
    };
    const doSqlExport = () => {
        if (editorRef && editorRef.current) {
            const parsed = parseJSON(editorRef.current.getValue());
            const fields = parsed.meta.fields;
            const tableCreateFields = fields.map(field => wrapFieldName(field) + ' text not null');
            const tableDataRows = parsed.data.map((row) => mapKeys(row, (value, key) => wrapFieldName(key, value)));
            const result = chunk(tableDataRows, 1).map(rows => insert(state.tableName, rows).toString());
            exportFromJSON({
                data: result.join(';\n\n'),
                extension: 'sql',
                fileName: state.tableName,
                withBOM: true
            });
        }
    };
    return (
        <Splitter sizes={[85, 15]} minSizes={[1100, 400]}>
            <CodeEditor ref={editorRef} language="json" />
            <Stack spacing={2} sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ border: '1px solid #fcfcfc' }}>
                        <Button variant="contained" component="label">
                            <input hidden={true} accept="*.csv" type="file" onChange={e => doCsvImport(e.target.files)} />
                            <span>导入 CSV 文件</span>
                        </Button>
                        <Button variant="contained" onClick={doSqlExport}>
                            <span>导出 SQL 文件</span>
                        </Button>
                    </Stack>
                </Paper>
                <Card variant="outlined">
                    <CardContent>
                        <Typography sx={{ mb: 3, fontSize: 12 }} color="text.secondary">导出配置</Typography>
                        <Stack spacing={3}>
                            <TextField size="small" label="Table Name" value={state.tableName} onChange={e => dispatch({ type: 'update-options', tableName: e.target.value })} />
                            <FormControl size="small" fullWidth>
                                <InputLabel id="demo-simple-select-label">SQL Dialect</InputLabel>
                                <Select value={state.dialect} label="SQL Dialect" onChange={e => dispatch({ type: 'update-options', dialect: e.target.value })} >
                                    {SQL_DIALECTS.map(([dialect, options]) => (
                                        <MenuItem key={dialect} value={dialect}>{options.label} Inserts</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Splitter>
    );
}