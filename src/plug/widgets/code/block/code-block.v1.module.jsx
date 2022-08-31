import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ language, children, showLineNumbers = true }) {
    return (
        <SyntaxHighlighter style={nord} language={language} showLineNumbers={showLineNumbers} children={children} />
    );
}