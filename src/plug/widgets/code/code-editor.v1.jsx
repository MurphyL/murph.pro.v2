import React from 'react';

import * as monaco from 'monaco-editor';

import { isFunction } from 'lodash';

import { Box } from '@mui/material';

/**
 * 构造编辑器
 * @param {*} containerId 
 * @param {*} param1 
 * @returns 
 */
const createEditor = (containerId, { defaultValue, language, onChange, showLineNumber = true, showMinimap = true, readOnly = false }) => {
    const container = document.getElementById(containerId);
    if (container.childElementCount) {
        // 兼容开发环境 hooks 会被调用两次的问题
        const editors = monaco.editor.getEditors();
        return editors.find(editor => editor._domElement.id === containerId);
    } else {
        const minimap = {
            enabled: showMinimap
        };
        console.log('Create a new editor:', containerId);
        const editor = monaco.editor.create(container, {
            minimap,
            readOnly,
            value: defaultValue || '',
            language: language || 'plaintext',
            lineNumbers: showLineNumber ? 'on' : 'off',
            multiCursorMergeOverlapping: showLineNumber,
            fontSize: 20,
            links: false,
            smoothScrolling: true,
            automaticLayout: true,
        });
        if (onChange && isFunction(onChange)) {
            editor.getModel().onDidChangeContent(() => {
                onChange.call(null, editor.getValue());
            });
        }
        return editor;
    }
};

const CodeEditor = React.forwardRef(function CodeEditor({ sx, ...props }, ref) {
    const containerId = React.useId();
    const [state, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case 'init':
                if (!state.instance) {
                    return { ...state, instance: createEditor(containerId, props) };
                }
            default:
                return state;
        }
    }, {});
    React.useEffect(() => {
        !state.instance && dispatch({ type: 'init' });
        return () => state.instance && state.instance.dispose();
    }, []);
    React.useImperativeHandle(ref, () => ({
        getValue() {
            return state.instance ? state.instance.getValue() : '';
        },
        setValue(payload) {
            if (state.instance) {
                state.instance.setValue(payload);
            }
        },
        runAction(action) {
            if (state.instance) {
                state.instance.getAction(action).run();
            }
        },
        setLanguage(language) {
            if (state.instance) {
                const model = state.instance.getModel();
                monaco.editor.setModelLanguage(model, language);
            }
        }
    }));
    return (
        <Box classes="editor" sx={sx}>
            <div id={containerId} style={{ height: '100%' }} />
        </Box>
    )
});

export default CodeEditor;

// TODO - Format Document - editor.action.formatDocument
// editor.getAction('editor.action.formatDocument').run();

export function ReadOnlyEditor({ value, sx }) {
    const resultRef = React.useRef(null);
    React.useEffect(() => resultRef.current && resultRef.current.setValue(value), [value]);
    return (
        <CodeEditor ref={resultRef} language="json" defaultValue={value} showLineNumber={false} showMinimap={false} readOnly={true} sx={sx} />
    );
};