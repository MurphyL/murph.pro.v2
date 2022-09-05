import React from 'react'
import * as monaco from 'monaco-editor'

const MONACO_EDITOR_LANG = 'rest';

const REST_REQUEST_RULE = /^(GET|POST|PUT|DELETE|PATCH)\s+/;

export default function RestRequestMaker(props) {
    const id = React.useId();
    React.useEffect(() => {
        const element = document.getElementById(id);
        if (element.dataset.modeId) {
            return;
        }
        monaco.languages.register({ id: MONACO_EDITOR_LANG });
        const editor = monaco.editor.create(element, {
            id,
            language: MONACO_EDITOR_LANG,
            value: props.defaultValue,
            fontSize: 16,
            lineNumbers: 'on',
            contextmenu: false,
            smoothScrolling: true,
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        });
        const commandSendRequest = editor.addCommand(0, (context, { startLineNumber, endLineNumber }) => {
            const model = editor.getModel();
            let request = { params: [] };
            for (var i = startLineNumber; i <= endLineNumber; i++) {
                let content = model.getLineContent(i).trim();
                if (i === startLineNumber) {
                    request.method = REST_REQUEST_RULE.exec(content)[0].trim();
                    request.url = content.replace(REST_REQUEST_RULE, '').trim();
                } else {
                    if (/^\s+/.test(content) && !request.headers) {
                        request.params.push(content);
                        continue;
                    }
                    if (!request.headers) {
                        request.headers = [];
                    }
                    if (content.length > 0) {
                        const pos = content.indexOf(':');
                        if (pos > 0) {
                            request.headers.push([content.substring(0, pos).trimEnd(), content.substring(pos + 1).trimStart()]);
                        }
                    } else if (content.length === 0) {
                        request.body = model.getValueInRange({ startLineNumber: i + 1, endLineNumber }).trim();
                        break;
                    }
                }
            }
            console.log(request);
        }, '');
        monaco.languages.registerCodeLensProvider(MONACO_EDITOR_LANG, {
            provideCodeLenses: function (model) {
                const endLineNumber = model.getLineCount();
                const hits = [];
                for (let i = 1; i <= endLineNumber; i++) {
                    let lineContent = model.getLineContent(i);
                    if (REST_REQUEST_RULE.test(lineContent)) {
                        hits.push(i);
                    }
                }
                const lenses = [];
                if (hits.length) {
                    hits.forEach((hit, index) => {
                        const range = {
                            startLineNumber: hit,
                            endLineNumber: hits[index + 1] ? hits[index + 1] - 1 : endLineNumber
                        };
                        lenses.push({
                            range,
                            id: 'send-request',
                            tooltip: '发送请求',
                            command: {
                                id: commandSendRequest,
                                title: 'Send Request',
                                arguments: [range]
                            }
                        });
                    });
                }
                return {
                    lenses,
                    dispose: () => { }
                };
            },
        });
        if (typeof props.onValueChange === 'function') {
            editor.onDidChangeModelContent(() => {
                const content = editor.getValue();
                props.onValueChange.call(null, {
                    payload: content
                });
            });
        }
    }, [id, props]);
    return (
        <div id={id} style={{ height: '100%' }} />
    );
}