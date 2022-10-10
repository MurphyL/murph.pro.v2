import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import ConstructionIcon from '@mui/icons-material/Construction';

import { useSnackbar } from 'notistack';

import { useDocumentTitle } from '/src/plug/hooks';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import OptionBoard from "/src/plug/widgets/container/options/options.module";

import COSUTOM_MODES from '/src/plug/widgets/code/custom-languages';

import { getActions, doConvert } from './code-support';

import { parseCSVFile } from "../csv/csv-support";

import styles from './code-kits.v1.module.css';

export const doImport = (event, callback) => {
    const [file] = (event.files || []);
    if (event.accept === '.csv') {
        parseCSVFile(file).then(([success, payload]) => {
            callback(success, success ? JSON.stringify(payload, null, 4) : payload);
        });
    } else {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            callback(true, reader.result);
        }
    }
};


export default function CodeKits() {
    useDocumentTitle('源代码工具集');
    const navigate = useNavigate();
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [showOptionBoard, setShowOptionBoard] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const showMessage = React.useCallback((message, options) => {
        enqueueSnackbar(message, {
            autoHideDuration: options.timeout || 5000,
            variant: options.type || 'default ',
            preventDuplicate: true
        });
    }, [enqueueSnackbar]);
    const [state, dispatch] = React.useReducer((state, event) => {
        const { language = 'plaintext', content = '' } = event;
        switch (event.action) {
            case 'set-language':
                return { ...state, language };
            case 'set-content':
                return { ...state, content };
            case 'set-options':
                return { ...state, options: { ...state.options, [event.option]: event.value } };
            case 'navigate-to':
                return { ...state, redirect: event.redirect };
            case 'convert-to':
                try {
                    const editorContent = editorRef.current ? editorRef.current.getValue() : '';
                    const { language, content } = doConvert(event.language, editorContent, event.pretty);
                    return { ...state, language, content };
                } catch (e) {
                    showMessage(`${event.display || '转换操作'}出错：${e.message || '未知错误'}`, { type: 'error' });
                    console.error(`${event.display || '转换操作'}出错：`, e);
                    return state;
                }
            case 'import-file':
                try {
                    doImport(event, (success, result) => {
                        if (success) {
                            dispatch({ action: 'set-content', content: result });
                        } else {
                            showMessage(`${event.display || '导入文件'}出错：${result}`, { type: 'error' });
                            console.error(`${event.display || '导入文件'}出错：`, result);
                        }
                    });
                } catch (e) {
                    showMessage(`${event.display || '导入文件'}出错：${e.message || '未知错误'}`, { type: 'error' });
                    console.error(`${event.display || '导入文件'}出错：`, e);
                }
                return state;
            default:
                return state;
        }
    }, {}, () => {
        const language = searchParams.get('language') || 'plaintext';
        return { language, content: '', options: { snippet: true } };
    });
    React.useEffect(() => {
        setSearchParams({ language: state.language });
        editorRef.current && editorRef.current.setLanguage(state.language);
    }, [state.language, editorRef]);
    React.useEffect(() => state.redirect && navigate(state.redirect, { state }), [state.redirect]);
    React.useEffect(() => editorRef.current && editorRef.current.setValue(state.content || ''), [state.content, editorRef]);
    const actions = React.useMemo(() => getActions(state.language), [state.language]);
    return (
        <Splitter className={styles.root} sizes={[75, 25]} minSizes={[800, 400]}>
            <CodeEditor ref={editorRef} language={state.language} />
            <div className={styles.extra}>
                <div className={styles.bar}>
                    <div className={styles.language}>
                        <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                            <InputLabel>当前语言</InputLabel>
                            <Select value={state.language} label="切换语言" onChange={e => dispatch({ action: 'set-language', language: e.target.value })}>
                                {COSUTOM_MODES.map(item => (
                                    <MenuItem key={item.id} value={item.id}>{item.aliases[0]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.actions}>
                        <Tooltip title="设置">
                            <IconButton color="default" onClick={() => setShowOptionBoard(true)}>
                                <ConstructionIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Group title="基本操作">
                    <Button variant="contained" component="label">
                        <input hidden={true} accept="*" type="file" onChange={e => dispatch({ action: 'import-file', files: e.target.files })} />
                        <span>导入</span>
                    </Button>
                    <Button variant="contained" onClick={() => dispatch({ action: 'navigate-to', redirect: '/kits/difference' })}>比较</Button>
                    {state.options && state.options.snippet ? (
                        <Button variant="contained" onClick={() => enqueueSnackbar('功能暂未实现')}>代码片段</Button>
                    ) : null}
                </Group>
                {Array.isArray(actions) && actions.length ? (
                    <Group title="相关操作">
                        {actions.map((item, index) => {
                            if (!item) {
                                return (
                                    <br key={index} />
                                );
                            }
                            switch (item.action) {
                                case 'import-file':
                                    return (
                                        <Button key={index} variant="outlined" component="label">
                                            <input hidden={true} accept={item.accept || '*'} type="file" onChange={e => dispatch({ ...item, files: e.target.files })} />
                                            <span>{item.display || '未知操作'}</span>
                                        </Button>
                                    );
                                default:
                                    return (
                                        <Button key={index} variant="outlined" onClick={() => dispatch(item)}>{item.display || '未知操作'}</Button>
                                    );
                            }
                        })}
                    </Group>
                ) : null}
                {state.options && state.options ? (
                    <OptionBoard show={showOptionBoard} options={{}} onClose={() => setShowOptionBoard(false)} />
                ) : null}
            </div>
        </Splitter >
    );
}
