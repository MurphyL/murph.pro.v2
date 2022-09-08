import React from 'react';

import * as monaco from 'monaco-editor';

import styles from './code-editor.v1.module.css';

const CodeEditor = React.forwardRef(function ({ defaultValue, language, showLineNumber = true, onValueChange }, ref) {
    const wrapper = React.useRef(null);
    const [instance, setInstance] = React.useState(null);
    React.useEffect(() => {
        if (!wrapper.current || wrapper.current.childElementCount) {
            return;
        }
        const editor = monaco.editor.create(wrapper.current, {
            value: defaultValue || '',
            language: language || 'plaintext',
            lineNumbers: showLineNumber ? 'on' : 'off',
            multiCursorMergeOverlapping: showLineNumber,
            fontSize: 20,
            smoothScrolling: true,
            automaticLayout: true,
        });
        setInstance(editor);

    }, [defaultValue, language, showLineNumber, wrapper]);
    React.useEffect(() => {
        if (instance && typeof onValueChange === 'function') {
            instance.onDidChangeModelContent(() => {
                onValueChange.call(null, {
                    payload: instance.getValue()
                });
            });
        }
        return () => instance && instance.dispose();
    }, [instance, onValueChange]);
    React.useImperativeHandle(ref, () => ({
        getValue() {
            return instance ? instance.getValue() : '';
        },
        setValue(payload) {
            instance && instance.setValue(payload)
        },
        setLanguage(language) {
            const model = instance.getModel();
            monaco.editor.setModelLanguage(model, language);
        }
    }));
    return (
        <div className={styles.root} ref={wrapper} />
    )
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;