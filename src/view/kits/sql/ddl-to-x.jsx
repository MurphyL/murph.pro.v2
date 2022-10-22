import React from 'react';

import { useSetRecoilState } from 'recoil';

import { select, insert } from 'sql-bricks';
import { camelCase, trim, upperFirst, zipObject } from 'lodash';

import { useSnackbar } from 'notistack';

import { Alert, Avatar, IconButton, Stack, SvgIcon, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

import { SiJava, SiMysql } from "react-icons/si";

import PodcastsIcon from '@mui/icons-material/Podcasts';
import SettingsIcon from '@mui/icons-material/Settings';

import { Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/code-editor.v1";
import CodeBlock from '/src/plug/widgets/code/code-block.v1';
import { DataxIcon, DataxOptionsDash } from '../datax/datax-options.kits.v1';
import { OptionsDash } from '/src/plug/widgets/options';


import { KITS_AXIOS_INSTANCE, resolveServerKitResponse } from '/src/plug/server_kits';

import { useDocumentTitle } from '/src/plug/hooks';

import { sqlEditorState, format as formatSQL } from '../sql/sql-kits.v1';
import { createPojoClass } from '../java/java-kits.v1';
import ExtraButton from '../../../plug/widgets/buttons';

const rendersV1 = {
    'java/classes': {
        label: 'Generate POJO class code',
        icon: (<SvgIcon><SiJava /></SvgIcon>),
    },
    'datax/options': {
        label: 'Generate DataX Options',
        icon: (<SvgIcon><DataxIcon /></SvgIcon>),
    },
    'common/sqls': {
        label: 'Generate common SQL',
        icon: (<SvgIcon><SiMysql /></SvgIcon>),
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'message':
            return {
                message: action.message || '暂无可渲染数据',
                level: action.level
            };
        case 'ddl/parsed':
            return {
                language: 'json', parsed: action.parsed, content: JSON.stringify(action.parsed, null, 4)
            };
        case 'java/classes':
            return {
                language: 'java',
                action: action.type,
                parsed: state.parsed,
                content: convertParsedDDL2POJO(state.parsed)
            };
        case 'common/sqls':
            return {
                language: 'sql',
                action: action.type,
                parsed: state.parsed,
                content: convertParsedDDL2SQLs(state.parsed)
            };
        case 'datax/options':
            return {
                language: 'json',
                action: action.type,
                parsed: state.parsed,
                content: convertParsedDDL2DataXOptions(state.parsed)
            };
        default:
            return state;
    }
};

export default function DDL2X() {
    useDocumentTitle('DDL 工具集');
    const editorRef = React.useRef(null);
    const dataxOptionsRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const setSqlEditorState = useSetRecoilState(sqlEditorState);
    const [state, dispatch] = React.useReducer(reducer, { message: '暂无可渲染数据' });
    const doParse = () => {
        dispatch({ type: 'message', message: '正在解析 DDL' })
        if (!editorRef || !editorRef.current) {
            return;
        }
        const sql = trim(editorRef.current.getValue());
        if (sql.length === 0) {
            dispatch({ type: 'message', level: 'error', message: '请输入一条 SQL' })
            enqueueSnackbar('请输入一条 SQL', {
                autoHideDuration: 3000,
                variant: 'error',
            });
            return;
        }
        KITS_AXIOS_INSTANCE.post('/sql/ddl/parse', { sql }).then(resp => {
            const [success, content] = resolveServerKitResponse(resp);
            if (success) {
                setSqlEditorState(sql);
                dispatch({ type: 'ddl/parsed', parsed: content })
            } else {
                dispatch({ type: 'message', level: 'error', message: content || '服务端错误' })
                enqueueSnackbar(content || '服务端错误', {
                    autoHideDuration: 3000,
                    variant: 'error',
                });
            }
        }).catch(e => {
            dispatch({ type: 'message', level: 'error', message: e.message || '请求出错' })
            enqueueSnackbar(e.message || '请求出错', {
                autoHideDuration: 3000,
                variant: 'error',
            });
        })
    };
    return (
        <Splitter sizes={[45, 55]} minSize={[500, 300]}>
            <CodeEditor ref={editorRef} language="sql" />
            <Stack spacing={1} sx={{ margin: 1, p: 1 }}>
                {state.message ? (
                    <Alert severity={state.level || 'info'} sx={{ p: 1.2 }}>{state.message}</Alert>
                ) : (
                    <CodeBlock language={state.language} children={state.content} />
                )}
                <Stack spacing={2} sx={{ position: 'absolute', top: 7, right: 16 }}>
                    <IconButton onClick={doParse}>
                        <Tooltip placement="left" title="Parse DDL">
                            <Avatar>
                                <PodcastsIcon />
                            </Avatar>
                        </Tooltip>
                    </IconButton>
                    {state.parsed ? (
                        <ToggleButtonGroup orientation="vertical" size="small" sx={{ bgcolor: '#fff' }} onChange={(e, [type]) => dispatch({ type })}>
                            {Object.entries(rendersV1).map(([key, render]) => (
                                <ToggleButton key={key} value={key} aria-label={render.label}>
                                    <Tooltip placement="left" title={render.label}>{render.icon}</Tooltip>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    ) : null}
                    {state.action && state.action === 'datax/options' ? (
                        <React.Fragment>
                            <ExtraButton extra={<SettingsIcon />} onClick={(e) => dataxOptionsRef && dataxOptionsRef.current && dataxOptionsRef.current.show() }>
                                <SvgIcon>
                                    <DataxIcon />
                                </SvgIcon>
                            </ExtraButton>
                            <OptionsDash ref={dataxOptionsRef} title="DataX Settings">
                                <DataxOptionsDash />
                            </OptionsDash>
                        </React.Fragment>
                    ) : null}
                </Stack>
            </Stack>
        </Splitter >
    );
}

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

const createTableUnique = (schema, table) => {
    const result = [table];
    if (schema) {
        result.unshift(schema);
    }
    return result.join('.');
};

const convertParsedDDL2SQLs = (schemaOfDDL) => {
    const tableColumns = schemaOfDDL.columns.map(({ name }) => name);
    const tableUnique = createTableUnique(schemaOfDDL.schema, schemaOfDDL.table);
    return formatSQL([
        select(tableColumns).from(tableUnique).toString(),
        insert(tableUnique).values(zipObject(tableColumns, tableColumns.map(col => `#{${col}}`))).toString()
    ].join(';'));
};

const convertParsedDDL2POJO = (schemaOfDDL) => {
    const tableUnique = createTableUnique(schemaOfDDL.schema, schemaOfDDL.table);
    const comment = `database table: ${tableUnique}`;
    const className = upperFirst(camelCase(schemaOfDDL.table));
    const fields = schemaOfDDL.columns.map((column, index) => ({
        index,
        name: camelCase(column.name),
        comment: column.comment,
        dataType: SCHEMA_TYPES_MAP2JAVA[column.dataType] || column.dataType,
        database: {
            column: column.name,
            length: column.length,
            defaultValue: column.default,
            notNull: column.not_null,
        },
    }));
    return createPojoClass({
        name: className, comment, fields
    });
};

const convertParsedDDL2DataXOptions = (schemaOfDDL) => {
    return JSON.stringify({
        "job": {
            "setting": {
                "speed": {
                    "channel": 1
                }
            },
            "content": [
                {
                    "reader": {
                        "name": "mysqlreader",
                        "parameter": {
                            "username": "root",
                            "password": "root",
                            "connection": [
                                {
                                    "querySql": [
                                        "select db_id,on_line_flag from db_info where db_id < 10;"
                                    ],
                                    "jdbcUrl": [
                                        "jdbc:mysql://bad_ip:3306/database",
                                        "jdbc:mysql://127.0.0.1:bad_port/database",
                                        "jdbc:mysql://127.0.0.1:3306/database"
                                    ]
                                }
                            ]
                        }
                    },
                    "writer": {
                        "name": "streamwriter",
                        "parameter": {
                            "print": false,
                            "encoding": "UTF-8"
                        }
                    }
                }
            ]
        }
    }, null, 4);
};