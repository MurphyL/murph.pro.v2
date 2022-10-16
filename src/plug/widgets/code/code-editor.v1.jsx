import React from 'react';

import * as monaco from 'monaco-editor';

import { Box } from '@mui/material';

/**
 * 构造编辑器
 * @param {*} containerId 
 * @param {*} param1 
 * @returns 
 */
const createEditor = (containerId, { defaultValue, language, showLineNumber = true }) => {
    const container = document.getElementById(containerId);
    if (container.childElementCount) {
        // 兼容开发环境 hooks 会被调用两次的问题
        const editors = monaco.editor.getEditors();
        return editors.find(editor => editor._domElement.id === containerId);
    } else {
        console.log('Create a new editor:', containerId);
        return monaco.editor.create(container, {
            value: defaultValue || '',
            language: language || 'plaintext',
            lineNumbers: showLineNumber ? 'on' : 'off',
            multiCursorMergeOverlapping: showLineNumber,
            fontSize: 20,
            smoothScrolling: true,
            automaticLayout: true,
        });
    }
};

export default React.forwardRef(function CodeEditor({ sx, ...props }, ref) {
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
        <Box sx={sx}>
            <div id={containerId} style={{ height: '100%' }} />
        </Box>
    )
});


// TODO - Format Document - editor.action.formatDocument
// editor.getAction('editor.action.formatDocument').run();