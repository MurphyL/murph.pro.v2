import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord, coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import styles from './code-block.v1.module.css';

export default function CodeBlock({ language, children, dark = true, showLineNumbers = true, showCopy = true }) {
    const options = React.useMemo(() => ({
        children: children,
        language: language,
        showLineNumbers: showLineNumbers,
        style: dark ? nord : coy,
        customStyle: { margin: 0, padding: '1rem', width: 'calc(100% - 1rem * 2)' }
    }), [language, dark, children])
    return (
        <div className={styles.root}>
            <div className={styles.actions}>
                {/* {showCopy ? (
                    <Tooltip title="Copy">
                        <IconButton className={styles.action} size="mini" onClick={() => copy(children)}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                ) : null} */}
            </div>
            <SyntaxHighlighter {...options} />
        </div>
    );
}