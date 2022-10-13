import React from 'react';

const SyntaxHighlighter = React.lazy(() => import('react-syntax-highlighter/dist/esm/prism'))

const coy = React.lazy(() => import('react-syntax-highlighter/dist/esm/styles/prism/coy'))
const nord = React.lazy(() => import('react-syntax-highlighter/dist/esm/styles/prism/nord'))


export default function CodeBlock({ language, children, dark = true, showLineNumbers = true }) {
    const options = React.useMemo(() => ({
        children: children,
        language: language,
        showLineNumbers: showLineNumbers,
        style: dark ? nord : coy,
        customStyle: { margin: 0, padding: '1rem', width: 'calc(100% - 1rem * 2)' }
    }), [language, dark, children])
    return (
        <SyntaxHighlighter {...options} />
    );
}