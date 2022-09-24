import React from 'react';

import { pascalCase } from "pascal-case";
import { camelCase, trim } from 'lodash';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { siCodereview, siCodeberg, siLeetcode } from 'simple-icons/icons';
import SimpleIconWrap from '/src/plug/widgets/container/x-icon/x-icon.module';


import { useServerKit } from '/src/plug/hooks';

import styles from './sql-ddl2x.module.css';

const renders = {
    javaClass: {
        label: 'Java Class',
        language: 'java',
        icon: (<SimpleIconWrap {...siCodereview} />),
        apply({ columns, table }) {
            const fields = columns.map(column2field).join(EMPTY_LINE);
            return {
                language: 'java',
                content: `public class ${pascalCase(table)} {\n${fields}\n}`,
            };
        }
    },
    javaClass1: {
        label: 'Java Class',
        icon: (<SimpleIconWrap {...siCodeberg} />)
    },
    javaClass2: {
        label: 'Java Class',
        icon: (<SimpleIconWrap {...siLeetcode} />)
    }
};

export default function MySQLDDL2X() {
    const editorRef = React.useRef(null);
    const [renderType, setRenderType] = React.useState(null);
    const [parsed, setParsed] = React.useState(null);
    const parseDDL = useServerKit('/sql/ddl/parse');
    const doParse = () => {
        if (!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        sql.length > 0 && parseDDL({ data: { sql } }).then(([success, payload]) => {
            if (success) {
                const render = renders[renderType];
                setParsed([ render.language, render && render.apply ? render.apply(payload) : '' ]);
            } else {
                console.log(payload || '解析出错');
            }
        });
    };
    return (
        <Splitter className={styles.root} minSizes={500}>
            <CodeEditor ref={editorRef} language="sql" />
            <div className={styles.extra}>
                <div className={styles.switch}>
                    <ToggleButtonGroup exclusive color="primary" orientation="vertical" size="small" value={renderType} onChange={(event, selected) => setRenderType(selected)}>
                        {Object.entries(renders).map(([key, render]) => (
                            <ToggleButton key={key} value={key} aria-label={render.label}>
                                {render.icon}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
                <div>
                    <button onClick={doParse}>点击</button>
                </div>
                <div>
                    {parsed ? (
                        <CodeBlock language="java" children={''} />
                    ) : (
                        <div>请输入内容</div>
                    )}
                </div>
            </div>
        </Splitter>
    );
}

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

const column2field = (column, index) => {
    const fieldType = SCHEMA_TYPES_MAP2JAVA[column.dataType] || column.dataType;
    const fieldName = camelCase(column.name) || `field${index}`;
    const comments = [column.name];
    column.comment && comments.push(column.comment);
    column.constraint && comments.push(column.constraint);
    const fieldParts = [fieldType, fieldName];
    if (column.default && column.default !== 'NULL') {
        fieldParts.push(`=`);
        if (fieldType === 'String') {
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