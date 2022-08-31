import React from 'react';

import * as monaco from 'monaco-editor';

import styles from './code-editor.v1.module.css';

const CodeEditor = React.forwardRef(function (props, ref) {
    const id = React.useId();
    const instanceId = React.useMemo(() => props.id || id, [props.id, id]);
    const [instance, setInstance] = React.useState(null);
    React.useEffect(() => () => instance && instance.dispose(), [instance]);
    React.useEffect(() => {
        const element = document.getElementById(instanceId);
        if (instance || element.dataset.modeId) {
            return;
        }
        const { showLineNumber = true } = props
        const editor = monaco.editor.create(element, {
            id: instanceId,
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
    }, [instanceId, instance, props]);
    React.useImperativeHandle(ref, () => ({
        getValue() {
            return instance ? instance.getValue() : '';
        },
        setValue(payload) {
            instance && instance.setValue(payload)
        }
    }));
    return (
        <div id={instanceId} className={styles.root}></div>
    )
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;