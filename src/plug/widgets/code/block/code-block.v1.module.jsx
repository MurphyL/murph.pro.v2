import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as styles from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ language, children, dark = true, showLineNumbers = true }) {
    const options = React.useMemo(() => ({
        children: children,
        language: language,
        showLineNumbers: showLineNumbers,
        style: dark ? styles.nord : styles.coy,
    }), [language, dark, children])
    return (
        <SyntaxHighlighter {...options} />
    );
}