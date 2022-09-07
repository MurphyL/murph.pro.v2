import React from 'react';

import * as monaco from 'monaco-editor';

import styles from './code-editor.v1.module.css';

const CodeEditor = React.forwardRef(function ({ defaultValue, language, showLineNumber = true, ...props }, ref) {
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
            readOnly: props.readonly,
            smoothScrolling: true,
            automaticLayout: true,
        });
        setInstance(editor);
        if (typeof props.onValueChange === 'function') {
            editor.onDidChangeModelContent(() => {
                props.onValueChange.call(null, {
                    payload: editor.getValue()
                });
            });
        }
    }, [defaultValue, language, showLineNumber, props, wrapper]);
    React.useEffect(() => () => instance && instance.dispose(), [instance]);
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