import React from 'react';

import { select, insert } from 'sql-bricks';
import { camelCase, trim, upperFirst, zipObject } from 'lodash';

import { useSnackbar } from 'notistack';

import { Parser } from 'sql-ddl-to-json-schema'

import { Alert, Box, Stack, SvgIcon, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SiJava, SiMysql } from "react-icons/si";

import SettingsIcon from '@mui/icons-material/Settings';

import { Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/code-editor.v1";
import CodeBlock from '/src/plug/widgets/code/code-block.v1';
import { DataxIcon, DataxOptionsDash } from '../datax/datax-options.kits.v1';
import { OptionsDash } from '/src/plug/widgets/options';


// import { KITS_AXIOS_INSTANCE, resolveServerKitResponse } from '/src/plug/server_kits';

import { useDocumentTitle } from '/src/plug/hooks';

import { format as formatSQL } from './sql-kits.v1';
import { createPojoClass } from '../java/java-kits.v1';
import ExtraButton from '../../../plug/widgets/buttons';



const parser = new Parser('mysql');

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
    const { enqueueSnackbar } = useSnackbar();
    const [state, dispatch] = React.useReducer(reducer, { message: '暂无可渲染数据' });
    const onChange = (content) => {
        const sql = trim(content);
        if (sql.length === 0) {
            dispatch({ type: 'message', level: 'error', message: '请输入一条 SQL' })
            enqueueSnackbar('请输入一条 SQL', {
                autoHideDuration: 3000,
                variant: 'error',
            });
            return;
        } else {
            // const jsonSchemaDocuments = parser.feed(sql).toJsonSchemaArray(options);
            const compactJsonTablesArray = parser.feed(sql).toCompactJson(parser.results);
            dispatch({ type: 'ddl/parsed', parsed: compactJsonTablesArray })
        }
    };
    return (
        <Splitter sizes={[45, 55]} minSize={[500, 300]}>
            <CodeEditor language="sql" onChange={onChange} />
            <Stack spacing={1} sx={{ overflowY: 'scroll' }}>
                {state.message ? (
                    <Alert sx={{ m: 2, p: 1.2 }} severity={state.level || 'info'}>{state.message}</Alert>
                ) : (
                    <Box sx={{ m: 1.5 }}>
                        {state.parsed.map((item, index) => (
                            <Accordion key={index} disableGutters elevation={0} square sx={{ border: `1px solid rgba(0, 0, 0, 0.1)` }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`stmt-${index}`} sx={{ bgcolor: 'background.paper', }}>
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>{item.name}</Typography>
                                    {item.options.comment && (
                                        <Typography sx={{ color: 'text.secondary' }}>{item.options.comment}</Typography>
                                    )}
                                </AccordionSummary>
                                <AccordionDetails sx={{ py: 0, borderTop: '1px solid rgba(0, 0, 0, .125)' }}>
                                    <CodeBlock language={state.language} dark={false} children={state.content} />
                                </AccordionDetails>
                            </Accordion>
                        ))}

                    </Box>

                )}
                <Stack spacing={2} sx={{ position: 'absolute', top: 70, right: 25 }}>
                    {state.parsed ? (
                        <ToggleButtonGroup orientation="vertical" size="small" sx={{ bgcolor: '#fff' }} onChange={(e, [type]) => dispatch({ type })}>
                            {Object.entries(rendersV1).map(([key, render]) => (
                                <ToggleButton key={key} value={key} aria-label={render.label}>
                                    <Tooltip placement="left" title={render.label}>{render.icon}</Tooltip>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    ) : null}

                </Stack>
            </Stack>
            {state.action && state.action === 'datax/options' ? (
                <React.Fragment>
                    <ExtraButton extra={<SettingsIcon />} onClick={(e) => dataxOptionsRef && dataxOptionsRef.current && dataxOptionsRef.current.show()}>
                        <SvgIcon>
                            <DataxIcon />
                        </SvgIcon>
                    </ExtraButton>
                    <OptionsDash ref={dataxOptionsRef} title="DataX Settings">
                        <DataxOptionsDash />
                    </OptionsDash>
                </React.Fragment>
            ) : null}
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