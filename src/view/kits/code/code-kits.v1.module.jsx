import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';

import ConstructionIcon from '@mui/icons-material/Construction';

import { useSnackbar } from 'notistack';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import styles from './code-kits.v1.module.css';

import COSUTOM_MODES from '/src/plug/widgets/code/custom-languages';

import { execAction, getActions } from './code-kits.v1.support';

export default function CodeKits() {
    const navigate = useNavigate();
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, dispatch] = React.useReducer((state, event) => {
        const { language = 'plaintext', content = '' } = event;
        switch (event.action) {
            case 'set-language':
                editorRef.current && editorRef.current.setLanguage(language);
                return { ...state, language };
            case 'set-content':
                editorRef.current && editorRef.current.setValue(content);
                return { ...state, content };
            case 'set-options':
                return { ...state, options: { ...state.options, [action.option]: action.value } };
            default:
                try {
                    const newState = execAction(state, event);
                    if (editorRef.current) {
                        editorRef.current.setLanguage(newState.language);
                        editorRef.current.setValue(newState.content);
                    }
                    return newState;
                } catch (e) {
                    enqueueSnackbar(`${event.action} - ${e.message || '未知错误'}`, {
                        autoHideDuration: 5000,
                        variant: 'error',
                    });
                    return { ...state };
                }
        }
    }, { content: '' }, () => {
        const language = searchParams.get('language') || 'plaintext';
        return { language, options: { snippet: true } };
    });
    React.useEffect(() => setSearchParams({ language: state.language }), [state.language]);
    const sendContentTo = React.useCallback((path) => navigate(path, { state }), [state]);
    const actions = React.useMemo(() => getActions(state.language), [state.language]);
    const loadFileContent = React.useCallback((files) => {
        const reader = new FileReader();
        const file = files[0];
        reader.readAsText(file);
        reader.onload = () => {
            dispatch({ action: 'set-content', content: reader.result });
            enqueueSnackbar(`【${file.name}】导入成功，文件类型：${file.type || 'text/plain'}`, {
                autoHideDuration: 10000,
                variant: 'success',
            });
        }
    }, [dispatch]);
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
                        <Tooltip title="全部工具">
                            <IconButton color="default" component={Link} to="/kits">
                                <ConstructionIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Group title="基本操作">
                    <Button variant="contained" component="label">
                        <input hidden={true} accept="*" type="file" onChange={e => loadFileContent(e.target.files)} />
                        <span>导入</span>
                    </Button>
                    <Button variant="contained" onClick={() => sendContentTo('/kits/text/difference')}>比较</Button>
                    {state.options && state.options.snippet ? (
                        <Button variant="contained" onClick={() => enqueueSnackbar('功能暂未实现')}>代码片段</Button>
                    ) : null}
                </Group>
                {Array.isArray(actions) && actions.length ? (
                    <Group title="相关操作">
                        {actions.map((action, index) => (
                            <React.Fragment key={index}>
                                {action ? (
                                    <Button key={index} variant="outlined" onClick={() => dispatch(action)}>{action.display}</Button>
                                ) : (
                                    <br />
                                )}
                            </React.Fragment>
                        ))}
                    </Group>
                ) : null}
            </div>
        </Splitter >
    );
}