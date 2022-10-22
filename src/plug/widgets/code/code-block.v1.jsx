import React from 'react';

import { Box } from '@mui/material';

import coy from 'react-syntax-highlighter/dist/esm/styles/prism/coy';
import nord from 'react-syntax-highlighter/dist/esm/styles/prism/nord';

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';

export default function CodeBlock({ language, children, sx, dark = true, showLineNumbers = true }) {
    const options = React.useMemo(() => ({
        children: children,
        language: language,
        showLineNumbers: showLineNumbers,
        style: dark ? nord : coy,
        customStyle: { padding: '1rem' }
    }), [language, dark, children])
    return (
        <Box sx={sx}>
            <SyntaxHighlighter {...options} />
        </Box>
    );
}