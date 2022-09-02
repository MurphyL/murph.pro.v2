import React from 'react'
import * as monaco from 'monaco-editor'

import * as parser from './rest-request-parser';

const LANG = 'rest';

export default function RestRequestMaker(props) {
    const id = React.useId();
    React.useEffect(() => {
        const element = document.getElementById(id);
        if (element.dataset.modeId) {
            return;
        }
        monaco.languages.register({ id: LANG });
        const editor = monaco.editor.create(element, {
            id,
            language: LANG,
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
        const commandSendRequest = editor.addCommand(0, () => {
            alert('my command is executing!');
        });
        monaco.languages.registerCodeLensProvider(LANG, {
            provideCodeLenses: function (model, token) {
                return {
                    lenses: [
                        {
                            range: {
                                startLineNumber: 1,
                                startColumn: 1,
                                endLineNumber: 2,
                                endColumn: 1
                            },
                            id: 'send-request',
                            command: {
                                id: commandSendRequest,
                                title: 'Send Request'
                            }
                        }
                    ],
                    dispose: () => { }
                };
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
    }, [id, props]);
    return (
        <div id={id} style={{ height: '100%' }} />
    );
}