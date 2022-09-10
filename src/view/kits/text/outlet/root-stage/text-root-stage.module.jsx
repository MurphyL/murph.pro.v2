import React from "react";
import { Button, IconButton, InputLabel, MenuItem, FormControl, Select, Tooltip } from '@mui/material';

import PublishIcon from '@mui/icons-material/Publish';
import ConstructionIcon from '@mui/icons-material/Construction';
import { Sitepoint } from '@icons-pack/react-simple-icons';

import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';

import { useDocumentTitle } from '/src/plug/hooks';
import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

import COSUTOM_MODES from '/src/plug/widgets/code/monaco-languages';

import * as JSON_KITS from '/src/view/kits/json/json-kits.v1';

import styles from './text-root-stage.module.css';

const languages = COSUTOM_MODES.map(item => ({ value: item.id, text: item.aliases[0] }));

const REDIRECT_MODES = {
    sql: '/kits/sql',
    mysql: '/kits/sql',
    json: '/kits/json',
    // yaml: '/kits/yaml',
    plaintext: '/kits/text',
};

const MODE_KITS = {
    ini: [{
        display: '转换为 JSON',
        action: 'CONVERTOR',
        language: 'json',
        convert(source) {
            return JSON_KITS.format({ 'TODO': source });
        }
    }],
    json: [{
        display: '格式化',
        action: 'CONVERTOR',
        language: 'json',
        convert(source) {
            return JSON_KITS.format(source)
        }
    }, {
        display: '发送到 JSONPath Query',
        action: 'PUSH_STATE',
        target: '/kits/json/path-query'
    }, {
        line: true
    }, {
        display: '转换为 YAML',
        action: 'CONVERTOR',
        language: 'yaml',
        convert(source) {
            return JSON_KITS.toYAML(source);
        }
    }, {
        display: '转换为 XML',
        action: 'CONVERTOR',
        language: 'xml',
        convert(source) {
            return JSON_KITS.toXML(source);
        }
    }],
    mysql: [{
        display: '发送到 DDL Parser',
        action: 'PUSH_STATE',
        target: '/kits/mysql/ddl'
    }],
    sql: [{
        display: '发送到 MySQL DDL',
        action: 'PUSH_STATE',
        target: '/kits/mysql/ddl'
    }],
    xml: [],
    yaml: [{
        display: '转换为 JSON',
        action: 'CONVERTOR',
        language: 'json',
        convert(source) {
            return JSON_KITS.fromYAML(source);
        }
    }]
};

export default function TextKitsLayout({ language: sourceLanguage = 'plaintext' }) {
    useDocumentTitle('文本工具集');
    const navigate = useNavigate();
    const { state } = useLocation();
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [language, setLanguage] = React.useState(sourceLanguage);
    const [content, setContent] = React.useState(state ? state.origin : '');
    const referenceKits = React.useMemo(() => {
        if (!language || !MODE_KITS[language]) {
            return null;
        }
        return MODE_KITS[language];
    }, [language]);
    const changeViewState = React.useCallback((path, payload, language) => {
        return navigate(path, { state: { language, origin: payload || content } });
    }, [navigate, content]);
    const changeEditorLanguage = React.useCallback((newLanguage) => {
        if (editorRef && editorRef.current) {
            setLanguage(newLanguage);
            editorRef.current.setLanguage(newLanguage);
        }
        if (REDIRECT_MODES[newLanguage]) {
            return changeViewState(REDIRECT_MODES[newLanguage], content, newLanguage);
        }
    }, [navigate, content, setLanguage, editorRef]);
    const changeEditorContent = React.useCallback((source, newLanguage) => {
        if (editorRef && editorRef.current) {
            editorRef.current.setValue(source);
            changeEditorLanguage(newLanguage);
        }
    }, [setLanguage, editorRef]);
    const readFileContent = React.useCallback((files) => {
        const reader = new FileReader();
        const file = files[0];
        reader.readAsText(file);
        reader.onload = () => {
            changeEditorContent(reader.result, language);
            enqueueSnackbar(`【${file.name}】导入成功，文件类型：${file.type || 'text/plain'}`, {
                autoHideDuration: 10000,
                variant: 'success',
            });
        }
    }, [changeEditorContent, language]);
    const doCallback = React.useCallback((kit) => {
        try {
            switch (kit.action) {
                case 'CONVERTOR':
                    return changeEditorContent(kit.convert(content), kit.language);
                case 'PUSH_STATE':
                    return changeViewState(kit.target, content, language);
                default:
                    console.log('不支持的操作', kit);
            }
        } catch (e) {
            console.error('操作出错', kit, e);
            enqueueSnackbar(`【${kit.display}】操作出错：${e.message || '未知错误'}`, {
                preventDuplicate: true,
                variant: 'error'
            });
        }
    }, [navigate, enqueueSnackbar, language, content]);
    const onValueChange = React.useCallback(({ payload }) => {
        setContent(payload)
    }, [setContent]);
    return (
        <React.Fragment>
            <Splitter className={styles.root} sizes={[75, 25]} minSizes={[700, 300]}>
                <CodeEditor ref={editorRef} language={language} defaultValue={content} onValueChange={onValueChange} />
                <div className={styles.extra}>
                    <div className={styles.bar}>
                        <div className={styles.language}>
                            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                                <InputLabel>当前语言</InputLabel>
                                <Select value={language} label="切换语言" onChange={e => changeEditorLanguage(e.target.value)}>
                                    {languages.map(item => (
                                        <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.actions}>
                            <Tooltip title="全部工具">
                                <IconButton color="default" onClick={() => navigate('/kits')}>
                                    <ConstructionIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <Group title="基本操作">
                        <Button variant="contained" startIcon={<PublishIcon />} component="label">
                            <input hidden={true} accept="*" type="file" onChange={e => readFileContent(e.target.files)} />
                            <span>导入</span>
                        </Button>
                        <Button variant="contained" startIcon={<Sitepoint size={18} />} onClick={() => doCallback({ display: '发送到文本比较', action: 'PUSH_STATE', target: '/kits/text/difference' })}>比较</Button>
                    </Group>
                    {Array.isArray(referenceKits) ? (
                        <Group title="相关操作" className={styles.kits}>
                            {referenceKits.map((kit, index) => (
                                <React.Fragment key={index} >
                                    {kit.line ? (<br />) : (<Button variant="outlined" onClick={() => doCallback(kit)}>{kit.display}</Button>)}
                                </React.Fragment>
                            ))}
                        </Group>
                    ) : null}
                </div>
            </Splitter>
        </React.Fragment>
    );
}
