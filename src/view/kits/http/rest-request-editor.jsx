import React from 'react'
import * as monaco from 'monaco-editor'

import { parseRequestSchema } from './rest-request-maker';

const MONACO_EDITOR_LANG = 'rest';

monaco.languages.register({ id: MONACO_EDITOR_LANG });

/**
 * 解析语法
 */
monaco.languages.setMonarchTokensProvider(MONACO_EDITOR_LANG, {
    tokenizer: {
        root: [
            [REST_REQUEST_RULE, 'method'],
        ]
    }
});

/**
 * 高亮
 */
monaco.editor.defineTheme(MONACO_EDITOR_LANG, {
    base: 'vs',
    inherit: false,
    rules: [
        { token: 'method', foreground: '008800', fontStyle: 'bold' },
    ],
    colors: {
        'editor.foreground': '#000000'
    }
});

const registerRequestCommand = (requestSender) => {
    monaco.editor.registerCommand('exec-http-request', (accessor, model, range) => {
        if (typeof requestSender === 'function') {
            const request = parseRequestSchema(model, range);
            requestSender.call(null, request);
        }
    });
};

/**
 * 渲染触发链接
 */
monaco.languages.registerCodeLensProvider(MONACO_EDITOR_LANG, {
    provideCodeLenses(model) {
        const endLineNumber = model.getLineCount();
        const hits = [];
        for (let i = 1; i <= endLineNumber; i++) {
            let lineContent = model.getLineContent(i);
            if (REST_REQUEST_RULE.test(lineContent)) {
                hits.push(i);
            }
        }
        return {
            lenses: hits.map((hit, index) => {
                const range = {
                    startLineNumber: hit,
                    endLineNumber: hits[index + 1] ? hits[index + 1] - 1 : endLineNumber
                };
                return {
                    range,
                    id: 'send-request',
                    command: {
                        id: 'exec-http-request',
                        title: 'Send Request',
                        arguments: [model, range]
                    }
                }
            }),
            dispose: () => { }
        };
    },
});

export default function RestRequestEditor({ defaultValue, execRequest, ...props }) {
    const wrapper = React.useRef(null);
    const [editorInstance, setEditorInstance] = React.useState(null);
    React.useEffect(() => {
        if (!wrapper.current || wrapper.current.childElementCount) {
            return;
        }
        setEditorInstance(monaco.editor.create(wrapper.current, {
            theme: MONACO_EDITOR_LANG,
            language: MONACO_EDITOR_LANG,
            value: defaultValue || '',
            fontSize: 20,
            lineNumbers: 'on',
            contextmenu: false,
            smoothScrolling: true,
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        }));
    }, [wrapper, defaultValue]);
    React.useEffect(() => {
        if (editorInstance) {
            return () => editorInstance.dispose();
        }
    }, [editorInstance]);
    React.useEffect(() => {
        if (editorInstance) {
            registerRequestCommand(execRequest);
        }
    }, [editorInstance, execRequest]);
    return (
        <div ref={wrapper} className={props.className} />
    );
}