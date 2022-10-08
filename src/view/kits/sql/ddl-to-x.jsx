import React from 'react';

import { useRecoilState } from 'recoil';

import { select, insert } from 'sql-bricks';
import { camelCase, trim, upperFirst, zipObject } from 'lodash';

import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

import { SiMysql } from "react-icons/si";
import { SiAlibabacloud } from "react-icons/si";


import PodcastsIcon from '@mui/icons-material/Podcasts';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { KITS_AXIOS_INSTANCE, resolveServerKitResponse } from '/src/plug/server_kits';

import { useDocumentTitle } from '/src/plug/hooks';

import { sqlEditorState, format as formatSQL } from '../sql/sql-kits.v1';
import { createPojoClass } from '../java/java-kits.v1';

const rendersV1 = {
    'java-classes': {
        label: 'DataX Options',
        icon: (<SvgIcon><SiAlibabacloud /></SvgIcon>),
        exec: (schema, source) => {
            return [true, {
                language: 'java',
                content: 'xx'
            }];
        }
    },
    'sqls-for-table': {
        label: 'Data Query Language',
        icon: (<SvgIcon><SiMysql /></SvgIcon>),
        exec: (schema) => {
            return [true, {
                language: 'sql',
                content: convertParsedDDL2SQLS(schema)
            }];
        }
    }
};

export default function DDL2X() {
    useDocumentTitle('DDL 工具集');
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [action, setAction] = React.useState(null);
    const [schema, setSchema] = React.useState(null);
    const [source, setSqlEditorState] = useRecoilState(sqlEditorState);
    const doParse = () => {
        setSchema(null);
        if (!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        if (sql.length === 0) {
            enqueueSnackbar('请输入一条 SQL', {
                autoHideDuration: 3000,
                variant: 'error',
            });
            return;
        }
        KITS_AXIOS_INSTANCE.post('/sql/ddl/parse', { sql }).then(resp => {
            const [success, content] = resolveServerKitResponse(resp);
            if (success) {
                setAction('parsed-ddl-schema');
                setSqlEditorState(sql);
                setSchema(content);
            } else {
                enqueueSnackbar(content || '服务端错误', {
                    autoHideDuration: 3000,
                    variant: 'error',
                });
            }
        }).catch(e => {
            enqueueSnackbar(e.message || '请求出错', {
                autoHideDuration: 3000,
                variant: 'error',
            });
        })
    };
    const [success, payload] = React.useMemo(() => {
        if (action && rendersV1[action] && rendersV1[action].exec) {
            return rendersV1[action].exec(schema, source);
        } else {
            return [false, '解析器不存在'];
        }
    }, [schema, action]);
    return (
        <Splitter sizes={[45, 55]} minSizes={[500, 300]}>
            <CodeEditor ref={editorRef} language="sql" />
            <Stack spacing={1} sx={{ margin: 1, p: 1 }}>
                {success ? (
                    <CodeBlock language={payload.language} children={payload.content} />
                ) : (
                    <Alert severity="info">{payload}</Alert>
                )}
                <Stack spacing={2} sx={{ position: 'absolute', top: 7, right: 16 }}>
                    <IconButton onClick={doParse}>
                        <Avatar>
                            <PodcastsIcon />
                        </Avatar>
                    </IconButton>
                    {schema ? (
                        <ToggleButtonGroup orientation="vertical" size="small" sx={{ bgcolor: '#fff' }} onChange={(e, [action]) => setAction(action)}>
                            {Object.entries(rendersV1).map(([key, render]) => (
                                <ToggleButton key={key} value={key} aria-label={render.label}>
                                    {render.icon}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    ) : null}
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


export const ddlKitsReducer = (state, action) => {
    switch (action.type) {
        case 'parsed-ddl-schema':
            return {
                language: 'json',
                origin: action.type,
                schema: action.content,
                content: JSON.stringify(action.content, null, 4)
            };
        case 'sqls-for-table':
            if (!state.schema) {
                return { ...state, error: '未发现解析过的 DDL' };
            } else {
                return {
                    language: 'sql',
                    origin: action.type,
                    schema: state.schema,
                    content: convertParsedDDL2SQLS(state.schema)
                };
            }

        case 'java-classes':
            console.log(state.schema);
            return {
                language: 'java',
                origin: action.type,
                schema: state.schema,
                content: convertParsedDDL2POJO(state.schema)
            };
        default:
            return state;
    }
};

const convertParsedDDL2SQLS = (schemaOfDDL = {}) => {
    const tableColumns = schemaOfDDL.columns.map(({ name }) => name);
    const tableUnique = [schemaOfDDL.schema, schemaOfDDL.table].join('.');
    return formatSQL([
        select(tableColumns).from(tableUnique).toString(),
        insert(tableUnique).values(zipObject(tableColumns, tableColumns.map(col => `#{${col}}`))).toString()
    ].join(';'));
};

const convertParsedDDL2POJO = (schemaOfDDL = {}) => {
    console.log(schemaOfDDL);
    const comment = `table: ${[schemaOfDDL.schema, schemaOfDDL.table].join('.')}`;
    return createPojoClass({
        comment
    });
}