import React from 'react';

import { pascalCase } from "pascal-case";
import { camelCase, trim } from 'lodash';

import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import PodcastsIcon from '@mui/icons-material/Podcasts';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { siCodeberg, siLeetcode } from 'simple-icons/icons';
import { SimpleIconWrap } from '/src/plug/widgets/wrapper/icons/icons.wrapper';

import { useDocumentTitle, useServerKit } from '/src/plug/hooks';

import styles from './sql-ddl2x.module.css';

const renders = {
    javaClass: {
        label: 'Java Class',
        action: 'display-java-class',
        icon: (<SimpleIconWrap {...siLeetcode} />),
        apply(parsed, options = {}) {
            const { columns, table } = parsed;
            const fields = columns.map(column2field).join(EMPTY_LINE);
            return `public class ${pascalCase(table)} {\n${fields}\n}`;
        }
    },
    dql: {
        label: 'Data Query Language',
        action: 'display-dql',
        icon: (<SimpleIconWrap {...siCodeberg} />),
        apply(parsed, options = {}) {
            const { separator = ', \n\t' } = options;
            const dql_no_alias = [
                `select ${parsed.columns.map(col => col.name).join(separator)}`,
                `from ${parsed.schema}.${parsed.table}`
            ].join(EMPTY_LINE);
            return dql_no_alias;
        }
    }
};

function reducer(state, action) {
    switch (action.type) {
        case 'set-parsed':
            return {
                language: 'sql',
                source: action.content,
                renderType: renders.dql.action,
                content: renders.dql.apply(action.content)
            };
        case 'display-ddl-meta':
            return { 
                ...state,
                language: 'sql',
                content: renders.dql.apply(state.source)
            };
        case 'display-java-class':
            return {
                ...state
            };
        default:
            throw state;
    }
}

export default function DDL2X() {
    useDocumentTitle('DDL 工具集');
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [state, dispatch] = React.useReducer(reducer, { source: null });
    const parseDDL = useServerKit('/sql/ddl/parse');
    const doParse = () => {
        if (!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        if (sql.length === 0) {
            setRenderType(null);
            enqueueSnackbar('请输入一条 SQL', {
                autoHideDuration: 3000,
                variant: 'error',
            });
        } else {
            parseDDL({ data: { sql } }).then(([success, payload]) => {
                if (success && payload) {
                    dispatch({ type: 'set-parsed', content: payload })
                } else {
                    console.log(payload || '解析出错');
                }
            });
        }
    };
    return (
        <Splitter className={styles.root} minSizes={500}>
            <CodeEditor ref={editorRef} language="sql" />
            <div className={styles.extra}>
                <div className={styles.stage}>
                    {state.content ? (
                        <CodeBlock language={state.language} children={state.content} />
                    ) : (
                        <Alert severity="info" sx={{ margin: 1 }} > 暂未配置相关解析器</Alert>
                    )}
                </div>
                <Stack className={styles.switch} spacing={2}>
                    <IconButton size='small' onClick={doParse}>
                        <Avatar>
                            <PodcastsIcon />
                        </Avatar>
                    </IconButton>
                    <ToggleButtonGroup exclusive color="primary" orientation="vertical" size="small" value={state.renderType} onChange={(event, selected) => dispatch(renders[selected])}>
                        {Object.entries(renders).map(([key, render]) => (
                            <ToggleButton key={key} value={key} aria-label={render.label}>
                                {render.icon}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>
            </div>
        </Splitter >
    );
}

const EMPTY_LINE = '\n';
const INDENT_STR = '   ';

const SCHEMA_TYPES_MAP2JAVA = {
    VARCHAR: 'String',
    STRING: 'String',
    TINYINT: 'Short',
    INT: 'Integer',
    INTEGER: 'Integer',
    BIGINT: 'Long',
    DECIMAL: 'BigDecimal',
    DATE: 'Date',
    DATETIME: 'Date',
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