import React from 'react';

import { pascalCase } from "pascal-case";
import { camelCase, trim } from 'lodash';

import { useSnackbar } from 'notistack';
import { select, insert } from 'sql-bricks';
import { zipObject } from 'lodash';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
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

import { useDocumentTitle, useServerKitRequest } from '/src/plug/hooks';

import { format as formatSQL } from '../sql/sql-kits.v1';
import { format as formatJSON } from '../json/json-kits.v1';

const renders = {
    // javaClass: {
    //     label: 'Java Class',
    //     action: 'display-java-class',
    //     icon: (<SimpleIconWrap {...siLeetcode} />)
    // },
    sqls: {
        label: 'Data Query Language',
        action: 'display-sqls',
        icon: (<SimpleIconWrap {...siCodeberg} />)
    }
};

function reducer(state, action) {
    switch (action.type) {
        case 'set-parsed':
            return {
                language: 'json',
                source: action.content,
                content: formatJSON(action.content)
            };
        case 'display-sqls':
            if(!state.source) {
                console.error('State 为空');
                return state;
            }
            let tableColumns = state.source.columns.map(({ name }) => name);
            let tableUnique = [state.source.schema, state.source.table].join('.');
            return {
                language: 'sql',
                source: state.source,
                content: formatSQL([
                    select(tableColumns).from(tableUnique).toString(),
                    insert(tableUnique).values(zipObject(tableColumns, tableColumns.map(col => `#{${col}}`))).toString()
                ].join(';'))
            };
        default:
            return state;
    }
}

export default function DDL2X() {
    useDocumentTitle('DDL 工具集');
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [state, dispatch] = React.useReducer(reducer, { source: null });
    const parseDDL = useServerKitRequest('/sql/ddl/parse');
    const doParse = () => {
        if (!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        if (sql.length === 0) {
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
        <Splitter sizes={[45, 55]} minSizes={[500, 300]}>
            <CodeEditor ref={editorRef} language="sql" />
            <Stack spacing={1} sx={{ display: 'flex', p: 1 }} direction="row">
                <Box sx={{ flex: 1 }}>
                    {state.content ? (
                        <CodeBlock language={state.language} children={state.content} />
                    ) : (
                        <Alert severity="info" sx={{ margin: 1 }} > 暂未配置相关解析器</Alert>
                    )}
                </Box>
                <Stack spacing={2}>
                    <IconButton size='small' onClick={doParse}>
                        <Avatar>
                            <PodcastsIcon />
                        </Avatar>
                    </IconButton>
                    <ToggleButtonGroup exclusive color="primary" orientation="vertical" size="small" value={state.renderType} onChange={(event, action) => dispatch({ type: action })}>
                        {Object.entries(renders).map(([key, render]) => (
                            <ToggleButton key={key} value={render.action} aria-label={render.label}>
                                {render.icon}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>
            </Stack>
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