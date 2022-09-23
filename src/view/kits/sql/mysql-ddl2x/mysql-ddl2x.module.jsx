import React from 'react';
import { pascalCase } from "pascal-case";
import { camelCase, trim, upperCase } from 'lodash';

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

const renderJavaClass = (parsed) => {
    const fields = parsed.columns.map(column2field).join(EMPTY_LINE);
    return `public class ${pascalCase(parsed.table)} {\n${fields}\n}`;
};

const SCHEMA_TYPES_MAP2JAVA = {
    VARCHAR: 'String',
    STRING: 'String',
    INT: 'Integer',
    INTEGER: 'Integer',
    BIGINT: 'Long',
    DECIMAL: 'BigDecimal',
    DATE: 'Date',
    TIMESTAMP: 'Date',
};

const convertType = (type) => {
    const upperType = upperCase(type);

    switch(upperType) {
        case 'VARCHAR':
        case 'STRING':
            return 'String';
        case 'INT':
        case 'INTEGER':
            return 'Integer';
        case 'BIGINT':
            return 'Long';
        case 'DECIMAL':
            return 'BigDecimal';
        case 'DATE':
        case 'TIMESTAMP':
            return 'Date';
        default:
            return upperType;
    }
}

const column2field = (column, index) => {
    const fieldType = SCHEMA_TYPES_MAP2JAVA[column.dataType] || column.dataType;
    const fieldName = camelCase(column.name) || `field${index}`;
    const fieldValue = column.default ? `= ${fieldType === 'String' ? "" : column.default };` : ';'
    const comments = [ column.name ];
    column.comment && comments.push(column.comment);
    column.constraint && comments.push(column.constraint);
    const fieldParts = [ fieldType, fieldName];
    if(column.default !== 'NULL') {
        fieldParts.push(`=`);
        if(fieldType === 'String') {
            fieldParts.push(`"${column.default}"`)
        } else {
            fieldParts.push(column.default);
        }
    }
    return [
        INDENT_STR + `/** ${comments.join(' - ')} **/`,
        INDENT_STR + `private ${fieldParts.join(' ')};` + EMPTY_LINE
    ].join(EMPTY_LINE);
}