import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { useDocumentTitle } from '/src/plug/hooks';

const TEXT_AREA_PROPS = {
    fullWidth: true,
    multiline: true,
    minRows: 5,
};

const reducer = (state, [algorithm, payload]) => {
    switch (algorithm) {
        case 'set-value':
            return { ...state, content: payload, target: '' };
        case 'sha256':
            return { ...state, target: `${algorithm} - 加密`, language: 'plaintext', algorithm };
        case 'hamc-sha256':
            return { ...state, target: `${algorithm} - 加密`, language: 'plaintext', algorithm };
        default:
            return state;
    }

};

const algorithms = [
    'sha256',
    'hamc-sha256',
];

export default function CryptoDotJsKits() {
    useDocumentTitle('Crypto.JS 工具集');
    const [state, dispatch] = React.useReducer(reducer, { content: 'hello, world' });
    return (
        <Stack sx={{ p: 1 }} spacing={1}>
            <TextField label="Source" {...TEXT_AREA_PROPS} value={state.content} onChange={e => dispatch(['set-value', e.target.value])} />
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button disabled variant="contained" sx={{ width: 200 }}>{state.algorithm || 'none'}</Button>
                {algorithms.map((algorithm, index) => (
                    <Button key={index} variant="outlined" onClick={() => dispatch([algorithm])}>{algorithm}</Button>
                ))}
            </Stack>
            <CodeBlock language={state.language} children={state.target} />
        </Stack>
    );
}