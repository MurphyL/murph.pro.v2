import React from 'react';

import useComponentSize from '@rehooks/component-size';

import { JSONPath } from 'jsonpath-plus';
import { get as pathGet } from 'lodash';

import { Alert, Box, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { Inspector, TableInspector, chromeLight } from 'react-inspector';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

import { useDocumentTitle } from '/src/plug/hooks';

import { FullHeightBox, Group, Splitter } from "/src/plug/widgets/containers";
import CodeEditor, { ReadOnlyEditor } from "/src/plug/widgets/code/code-editor.v1";

import { converters } from '/src/plug/widgets/code/custom-languages';
import { demo } from './json-kits.v1';

import { ButtonOptions } from '/src/plug/widgets/buttons';
import { useLocation, useSearchParams } from 'react-router-dom';

const VIEWS = ['tree', 'table', 'code'];

const evaluators = {
    JSONPath(source, expr) {
        return JSONPath(expr, source);
    },
    'lodash.get': (source, expr) => {
        return pathGet(source, expr);
    },
}

const doQuery = (evaluatorName, payload, expression) => {
    try {
        const evaluator = evaluators[evaluatorName];
        const result = evaluator(converters.json.parse(payload), expression);
        return { data: result, result: converters.json.stringify(result), message: null };
    } catch (e) {
        console.error('查询数据出错', e)
        return { result: null, message: { text: `操作出错 - ${e.message}`, severity: 'error' } };
    }
};

export default function JSONPathQuery() {
    useDocumentTitle('JSON Expression Evaluator');
    const location = useLocation();
    const editorRef = React.useRef(null);
    const queryFormRef = React.useRef(null);
    const [searchParams] = useSearchParams();
    const { height: queryFormHeight } = useComponentSize(queryFormRef);
    const [state, dispatch] = React.useReducer((state, action) => {
        if (action.evaluatorName && editorRef.current) {
            const content = editorRef.current.getValue();
            const result = doQuery(action.evaluatorName, content, state.expression);
            return { ...state, content, ...action, ...result };
        } else {
            return { ...state, ...action };
        }
    }, { expression: '$', message: { severity: 'info', text: '尚未进行查询' } }, (initial) => {
        const view = searchParams.get('view') || VIEWS[0];
        const engine = searchParams.get('engine') || 'JSONPath';
        const content = (location.state || {}).content || demo;
        return { ...initial, evaluatorName: engine, content, selected: [view] };
    });
    return (
        <Splitter sizes={[40, 60]} minSize={[500, 600]}>
            <CodeEditor language="json" ref={editorRef} defaultValue={state.content} />
            <Box sx={{ p: '10px', pb: 2, width: '100%' }}>
                <Box ref={queryFormRef}>
                    <Group title="Expression">
                        <TextField fullWidth multiline size="small" rows={3} placeholder="请输入 JSONPath" defaultValue={state.expression} onChange={(e) => dispatch({ expression: e.target.value })} />
                    </Group>
                    <Box sx={{ display: 'flex', ml: 0.5, mr: 1, mt: 1.5, mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                            <ButtonOptions label="exec" selected={state.evaluatorName} options={Object.keys(evaluators)} onClick={(e, evaluatorName) => dispatch({ evaluatorName })} />
                        </Box>
                        <ToggleButtonGroup size="small" value={state.selected} onChange={(e, [_, view]) => dispatch({ selected: [view] })}>
                            <ToggleButton value="tree">
                                <AccountTreeIcon />
                            </ToggleButton>
                            <ToggleButton value="table">
                                <CalendarViewMonthIcon />
                            </ToggleButton>
                            <ToggleButton value="code">
                                <DataObjectIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
                <Group title={`${state.evaluatorName} - 查询结果`} sx={{ height: `calc(100% - ${queryFormHeight}px - 26px)`, overflowY: 'auto' }} Component={FullHeightBox}>
                    {state.message ? (
                        <Alert severity={state.message.severity || 'warn'} sx={{ mx: 0.5, my: 2 }}>{state.message.text}</Alert>
                    ) : null}
                    {state.data && state.selected.includes('tree') ? (
                        <Inspector expandLevel={3} data={state.data} theme={{ ...chromeLight, ARROW_COLOR: '#cfcfcf', ARROW_MARGIN_RIGHT: 5, TREENODE_FONT_SIZE: '18px', TREENODE_LINE_HEIGHT: 1.5 }} />
                    ) : null}
                    {state.data && state.selected.includes('table') ? (
                        <TableInspector data={Array.isArray(state.data) ? state.data : [state.data]} theme={{ ...chromeLight, BASE_LINE_HEIGHT: '30px' }} />
                    ) : null}
                    {state.data && state.selected.includes('code') ? (
                        <ReadOnlyEditor value={state.result} sx={{ height: '100%' }} />
                    ) : null}
                </Group>
            </Box>
        </Splitter>
    );
}