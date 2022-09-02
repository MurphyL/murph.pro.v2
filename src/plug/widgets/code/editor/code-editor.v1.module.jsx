import React from 'react';

import * as monaco from 'monaco-editor';

import styles from './code-editor.v1.module.css';

const CodeEditor = React.forwardRef(function (props, ref) {
    const id = React.useId();
    const [instance, setInstance] = React.useState(null);
    React.useEffect(() => () => instance && instance.dispose(), [instance]);
    React.useEffect(() => {
        const element = document.getElementById(id);
        if (instance || element.dataset.modeId) {
            return;
        }
        const { showLineNumber = true } = props
        const editor = monaco.editor.create(element, {
            id,
            value: props.defaultValue || '',
            language: props.language || 'txt',
            lineNumbers: showLineNumber ? 'on' : 'off',
            multiCursorMergeOverlapping: showLineNumber,
            fontSize: 20,
            readOnly: props.readonly,
            smoothScrolling: true,
            automaticLayout: true,
            minimap: {
                enabled: true
            }
        });
        if (typeof props.onValueChange === 'function') {
            editor.onDidChangeModelContent(() => {
                const content = editor.getValue();
                props.onValueChange.call(null, {
                    payload: content
                });
            });
        }
        setInstance(editor);
    }, [id, instance, props]);
    React.useImperativeHandle(ref, () => ({
        getValue() {
            return instance ? instance.getValue() : '';
        },
        setValue(payload) {
            instance && instance.setValue(payload)
        }
    }));
    return (
        <div id={id} className={styles.root} />
    )
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;