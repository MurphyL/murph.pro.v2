import React from 'react';

import { pascalCase } from "pascal-case";
import { camelCase, trim } from 'lodash';

import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import TableViewIcon from '@mui/icons-material/TableView';

import PodcastsIcon from '@mui/icons-material/Podcasts';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { siCodeberg, siLeetcode } from 'simple-icons/icons';
import SimpleIconWrap from '/src/plug/widgets/container/x-icon/x-icon.module';

import { useServerKit } from '/src/plug/hooks';

import styles from './sql-ddl2x.module.css';

const renders = {
    javaClass: {
        label: 'Java Class',
        language: 'java',
        icon: (<SimpleIconWrap {...siLeetcode} />),
        apply({ columns, table }) {
            const fields = columns.map(column2field).join(EMPTY_LINE);
            return {
                language: 'java',
                content: `public class ${pascalCase(table)} {\n${fields}\n}`,
            };
        }
    },
    dql: {
        label: 'Data Query Language',
        icon: (<SimpleIconWrap {...siCodeberg} />),
        apply(parsed) {
            const dql_no_alias = [
                `select ${parsed.columns.map(col => col.name).join(', ')}`,
                `from ${parsed.schema}.${parsed.table}`
            ].join(EMPTY_LINE);
            return {
                language: 'sql',
                content: dql_no_alias
            };
        }
    }
};

export default function DDL2X() {
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [renderType, setRenderType] = React.useState(null);
    const [parsed, setParsed] = React.useState(null);
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
                if (success) {
                    setParsed(payload);
                } else {
                    console.log(payload || '解析出错');
                }
            });
        }
    };
    const rendered = React.useMemo(() => {
        if (!renderType || !parsed || !renders[renderType] || !renders[renderType].apply) {
            return null;
        }
        return renders[renderType].apply(parsed);
    }, [parsed, renderType]);
    return (
        <Splitter className={styles.root} minSizes={500}>
            <CodeEditor ref={editorRef} language="sql" />
            <div className={styles.extra}>
                <div className={styles.stage}>
                    {rendered ? (
                        <CodeBlock language={rendered.language} children={rendered.content} />
                    ) : (parsed ? (
                        <List sx={{ width: '100%' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PivotTableChartIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Columns" secondary={Array.isArray(parsed.columns) ? parsed.columns.map(col => col.name).join(', ') : ''} />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <TableViewIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Meta" secondary={`${parsed.schema}.${parsed.table}`} />
                            </ListItem>
                        </List>
                    ) : (
                        <Alert severity="info" sx={{ margin: 1 }} > 暂未配置相关解析器</Alert>
                    ))}
                </div>
                <Stack className={styles.switch} spacing={2}>
                    <IconButton size='small' onClick={doParse}>
                        <Avatar>
                            <PodcastsIcon />
                        </Avatar>
                    </IconButton>
                    <ToggleButtonGroup exclusive color="primary" orientation="vertical" size="small" value={renderType} onChange={(event, selected) => setRenderType(selected)}>
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