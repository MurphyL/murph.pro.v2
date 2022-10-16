import React from "react";

import { Backdrop, Button, Checkbox, CircularProgress, IconButton, InputAdornment, Stack, TextField, Tooltip } from "@mui/material";
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

import { chunk, mapKeys, zipObject } from "lodash";

import { insert } from 'sql-bricks';

import exportFromJSON from "export-from-json";

import { OptionBoard } from "/src/plug/widgets/options";

import { useDocumentTitle, useCSVFilesReader } from '/src/plug/hooks';

import CodeEditor from "/src/plug/widgets/code/code-editor.v1";
import { Group, Splitter } from "/src/plug/widgets/containers";

import { converters } from '/src/plug/widgets/code/custom-languages';

const wrapFieldName = (name) => '`' + name + '`';

export default function DdlFromCsv() {
    useDocumentTitle('CSV to SQL Inserts');
    const editorRef = React.useRef(null);
    const readCSVFiles = useCSVFilesReader();
    const [state, dispatch] = React.useReducer((state, event) => {
        return { ...state, ...event };
    }, { tableName: 'demo_table', batchSize: 5, showOverlay: false, showColumnsBoard: false, fields: {} });
    const fields = React.useMemo(() => Object.entries(state.fields), [state.fields]);
    const doCsvImport = (files) => {
        dispatch({ showOverlay: true })
        readCSVFiles(files).then(([result]) => {
            const [success, payload] = result;
            dispatch({ showOverlay: false });
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
            const parsed = converters.json.parse(editorRef.current.getValue());
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
        <React.Fragment>
            <Splitter sizes={[80, 20]} minSize={[1100, 400]}>
                <CodeEditor ref={editorRef} language="json" />
                <Stack spacing={2} sx={{ px: 2, height: '100vh', overflowY: 'auto' }}>
                    <Group title="基础操作" direction="row" spacing={1} sx={{ mt: 1, p: 1 }}>
                        <Stack direction="row" sx={{ flex: 1 }} spacing={1}>
                            <Button variant="contained" component="label">
                                <input hidden={true} accept=".csv" type="file" onChange={e => doCsvImport(e.target.files)} />
                                <span>导入 CSV 文件</span>
                            </Button>
                            <Button variant="contained" onClick={doSqlExport}>
                                <span>导出 SQL 文件</span>
                            </Button>
                        </Stack>
                        <Tooltip title="列配置">
                            <IconButton onClick={() => dispatch({ showColumnsBoard: true })}>
                                <PivotTableChartIcon />
                            </IconButton>
                        </Tooltip>
                    </Group>
                    <Group title="导出配置" spacing={3} sx={{ pb: 2 }}>
                        <TextField size="small" label="Table Name" value={state.tableName} onChange={e => dispatch({ tableName: e.target.value })} />
                        <TextField size="small" type="number" label="Batch Size" value={state.batchSize} onChange={e => dispatch({ batchSize: e.target.value })} />
                    </Group>
                </Stack>
            </Splitter>
            <OptionBoard title="字段配置" message="尚未配置任何字段" spacing={2} show={state.showColumnsBoard} sx={{ p: 2, pl: 3 }} onClose={() => dispatch({ showColumnsBoard: false })}>
                {Array.isArray(fields) && fields.length > 0 ? (
                    fields.map(([field, alias], index) => (
                        <Stack key={index} direction="row" spacing={2}>
                            <TextField size="small" label={field} value={alias} InputProps={{ startAdornment: <InputAdornment position="start">alias</InputAdornment> }} />
                            <Checkbox size="small" />
                        </Stack>
                    ))
                ) : null}
            </OptionBoard>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={state.showOverlay}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    );
}