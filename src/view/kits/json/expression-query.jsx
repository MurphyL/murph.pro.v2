import React from 'react';
import { useLocation } from 'react-router-dom';

import { useDocumentTitle } from '/src/plug/hooks';

import { Group, Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { demo, format, parse, doJEMSPathQuery, doJSONPathQuery } from './json-kits.v1';

import { Alert, Box, TextField } from '@mui/material';
import { ButtonActions } from '/src/plug/widgets/buttons';

const evaluators = {
    JSONPath: doJSONPathQuery,
    JEMSPath: doJEMSPathQuery,
}

const doQuery = (evaluatorName, payload, expression) => {
    try {
        const evaluator = evaluators[evaluatorName];
        const result = evaluator(parse(payload), expression);
        return { result, message: null };
    } catch (e) {
        return { result: null, message: { text: `操作出错 - ${e.message}`, severity: 'error' } };
    }
};

export default function JSONPathQuery() {
    useDocumentTitle('JSONPath Evaluator');
    const editorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer((state, action) => {
        if (action.evaluatorName && editorRef.current) {
            const content = editorRef.current.getValue();
            const result = doQuery(action.evaluatorName, content, state.expression)
            return { ...state, content, ...result };
        } else {
            return { ...state, ...action };
        }
    }, { expression: '$', content: demo, message: { severity: 'info', text: '尚未进行查询' } });
    return (
        <Splitter sizes={[40, 60]} minSize={[500, 600]}>
            <CodeEditor language="json" ref={editorRef} defaultValue={state.content} />
            <Box sx={{ m: 1, width: '100%' }}>
                <Group title="JSONPath" padding={0}>
                    <TextField fullWidth multiline size="small" rows={3} placeholder="请输入 JSONPath" defaultValue={state.expression} onChange={(e) => dispatch({ expression: e.target.value })} />
                </Group>
                <Box sx={{ mx: 0.5, mt: 1.5, mb: 1 }}>
                    <ButtonActions labelPrefix="exec" options={['JSONPath', 'JMESPath']} onClick={(e, evaluatorName) => dispatch({ evaluatorName })} />
                </Box>
                {state.message ? (
                    <Alert severity={state.message.severity || 'warn'} sx={{ mx: 0.5, my: 2 }}>{state.message.text}</Alert>
                ) : null}
                {state.result ? (
                    <Group title="查询结果">
                        <CodeBlock language="json" children={format(state.result, true, 4)} />
                    </Group>
                ) : null}
            </Box>
        </Splitter>
    );
}