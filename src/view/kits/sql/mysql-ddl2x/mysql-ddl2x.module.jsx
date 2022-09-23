import React from 'react';
import { camelCase, capitalize, trim } from 'lodash';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

import { useServerKit } from '/src/plug/hooks';

export default function MySQLDDL2X() {
    const editorRef = React.useRef(null);
    const [ parsed, setParsed ] = React.useState(null);
    const parseDDL = useServerKit('/sql/ddl/parse');
    const doParse = () => {
        if(!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        sql.length > 0 && parseDDL({ data: { sql } }).then(([ success, payload ]) => {
            if(success) {
                setParsed(payload);
            } else {
                console.log(payload || '解析出错');    
            }
        });
    };
    return (
        <Splitter>
            <CodeEditor ref={editorRef} language="sql" />
            <div>
                <div>
                    <button onClick={doParse}>点击</button>
                </div>
                <div>
                    {parsed ? (
                        <pre>
                            <code>{renderJavaClass(parsed)}</code>
                        </pre>
                    ) : (
                        <div>请输入内容</div>
                    )}
                </div>
            </div>
        </Splitter>
    );
}

const SPACE_CHAR = ' ';
const EMPTY_LINE = '\n';
const INDENT_STR = '   ';

const pascalCase = (text) => camelCase(trim(text));

const renderJavaClass = (parsed) => {
    const fields = parsed.columns.map(column2field);
    return [
        `/** ${parsed.schema}.${parsed.table} **/`,
        `public class ${capitalize(pascalCase(parsed.table))} {`,
            fields.join(EMPTY_LINE),
        '}'
    ].join(EMPTY_LINE);
};

const columnType2JavaType = {
    VARCHAR: 'String',
    STRING: 'String',
    INT: 'Integer',
    INTEGER: 'Integer',
    BIGINT: 'Long',
    DECIMAL: 'BigDecimal',
    DATE: 'Date',
    TIMESTAMP: 'Date',
};

const column2field = (column, index) => {
    const fieldType = columnType2JavaType[column.dataType] || column.dataType;
    const fieldName = pascalCase(column.name) || `field${index}`;
    const fieldComments = [ column.comment || fieldName ];
    column.constraint && fieldComments.push(column.constraint);
    return [
        `${INDENT_STR} /** ${fieldComments.join(' - ')} **/`,
        `${INDENT_STR} private ${fieldType} ${fieldName};`
    ].join(EMPTY_LINE);
}