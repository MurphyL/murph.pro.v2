import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import { extname } from 'path-browserify';


import { Avatar, Backdrop, Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Radio, RadioGroup, Select, Tooltip } from "@mui/material";

import CircularProgress from '@mui/material/CircularProgress';
import ConstructionIcon from '@mui/icons-material/Construction';
import DescriptionIcon from '@mui/icons-material/Description';
import ExtensionIcon from '@mui/icons-material/Extension';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

import { useSnackbar } from 'notistack';

import { useDocumentTitle, useTextFileReader } from '/src/plug/hooks';

import CodeBlock from "/src/plug/widgets/code/code-block.v1";
import CodeEditor from "/src/plug/widgets/code/code-editor.v1";

import { OptionBoard, OptionsDash } from "/src/plug/widgets/options";
import { Group, Splitter } from "/src/plug/widgets/containers";

import { COSUTOM_MODES } from '/src/plug/widgets/code/custom-languages';

import { getActions, reducer } from './code-support';
import { Stack } from "@mui/system";

const prepareState = {
    content: '', showOverlay: false, showOptionBoard: false, importCache: null, options: { snippet: true }
};

const makeImportCache = (current, fileMeta, content) => {
    const fileExt = extname(fileMeta.name);
    return {
        content, fileMeta, preferLanguage: current,
        languages: COSUTOM_MODES.filter(mode => mode.id === current || mode.extensions.includes(fileExt)),
    }
};

export default function CodeKits() {
    useDocumentTitle('源代码工具集');
    const navigate = useNavigate();
    const editorRef = React.useRef(null);
    const importDashRef = React.useRef(null);
    const readTextFile = useTextFileReader();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, dispatch] = React.useReducer(reducer, { editor: editorRef, ...prepareState }, (initial) => {
        return { ...initial, language: searchParams.get('language') || 'plaintext' };
    });
    React.useEffect(() => state.redirect && navigate(state.redirect, { state }), [state.redirect]);
    React.useEffect(() => editorRef.current && editorRef.current.setValue(state.content || ''), [state.content]);
    const actions = React.useMemo(() => getActions(state.language), [state.language]);
    React.useEffect(() => {
        setSearchParams({ language: state.language });
        editorRef.current && editorRef.current.setLanguage(state.language);
    }, [state.language]);
    const showMessage = (message, options) => {
        enqueueSnackbar(message, {
            autoHideDuration: options.timeout || 5000,
            variant: options.type || 'default ',
            preventDuplicate: true
        });
    };
    const loadFilesContent = (files) => {
        dispatch({ showOverlay: true });
        readTextFile(files).then(([result]) => {
            dispatch({ showOverlay: false });
            const [success, content, fileMeta] = result;
            if (success) {
                dispatch({ importCache: makeImportCache(state.language, fileMeta, content) });
            } else {
                showMessage(`导入文件出错：：${content}`, { type: 'error' });
                console.error('导入文件出错：', result);
            }
        });
    };
    const saveImportCache = () => {
        const { content, preferLanguage } = state.importCache;
        dispatch({ language: preferLanguage, importCache: null });
        editorRef.current && editorRef.current.setValue(content);
        importDashRef.current && importDashRef.current.hide();
    };
    return (
        <React.Fragment>
            <Splitter sizes={[75, 25]} minSize={[800, 400]}>
                <CodeEditor ref={editorRef} language={state.language} sx={{ my: 0.2 }} />
                <Box sx={{ m: 1 }}>
                    <Box sx={{ display: "flex", m: 1 }}>
                        <Box sx={{ flex: 1 }}>
                            <FormControl sx={{ minWidth: 160 }} size="small">
                                <InputLabel>当前语言</InputLabel>
                                <Select value={state.language} label="切换语言" onChange={e => dispatch({ action: 'set-language', language: e.target.value })}>
                                    {COSUTOM_MODES.map(item => (
                                        <MenuItem key={item.id} value={item.id}>{item.aliases[0]}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Tooltip title="设置">
                            <IconButton color="default" onClick={() => dispatch({ showOptionBoard: true })}>
                                <ConstructionIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Group title="基本操作">
                        <Button variant="contained" sx={{ m: 0.5 }} component="label">
                            <input hidden={true} accept="*" type="file" onChange={e => loadFilesContent(e.target.files)} />
                            <span>导入</span>
                        </Button>
                        <Button variant="contained" sx={{ m: 0.5 }} onClick={() => dispatch({ action: 'navigate-to', redirect: '/kits/difference' })}>比较</Button>
                        {state.options && state.options.snippet ? (
                            <Button variant="contained" sx={{ m: 0.5 }} onClick={() => enqueueSnackbar('功能暂未实现')}>代码片段</Button>
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
                                            <Button key={index} variant="outlined" sx={{ mx: 0.5, my: 0.3 }} component="label">
                                                <input hidden={true} accept={item.accept || '*'} type="file" onChange={e => dispatch({ ...item, files: e.target.files })} />
                                                <span>{item.display || '未知操作'}</span>
                                            </Button>
                                        );
                                    default:
                                        return (
                                            <Button key={index} variant="outlined" sx={{ mx: 0.5, my: 0.3 }} onClick={() => dispatch(item)}>{item.display || '未知操作'}</Button>
                                        );
                                }
                            })}
                        </Group>
                    ) : null}
                    {state.options && state.options ? (
                        <OptionBoard show={state.showOptionBoard} options={{}} onClose={() => dispatch({ showOptionBoard: false })} />
                    ) : null}
                </Box>
            </Splitter>
            {state.importCache ? (
                <OptionsDash direction="row" title="导入" spacing={2} ref={importDashRef} open={state.importCache !== null} onSave={saveImportCache} onClose={() => dispatch({ importCache: null })}>
                    <CodeBlock sx={{ p: 1, flex: 1, height: '100%', borderRight: '1px solid #efefef', overflow: 'auto' }} dark={false} language={state.importCache.preferLanguage} children={state.importCache.content} />
                    <Stack spacing={2} sx={{ py: 2, width: 350, }}>
                        <Group title="切换语言">
                            <RadioGroup row value={state.importCache.preferLanguage} onChange={(e, preferLanguage) => dispatch({ importCache: { ...state.importCache, preferLanguage } })}>
                                {state.importCache.languages.map(language => (
                                    <FormControlLabel key={language.id} value={language.id} control={<Radio />} label={language.aliases[0]} />
                                ))}
                            </RadioGroup>
                        </Group>
                        <Group title="相关操作">
                            {state.importCache.fileMeta.type === 'text/csv' ? (
                                <Button>转换为 JSON</Button>
                            ) : null}
                        </Group>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <DescriptionIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={state.importCache.fileMeta.name} secondary="File Name" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ExtensionIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={state.importCache.fileMeta.type} secondary="MIME Type" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <MoreTimeIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={dayjs(state.importCache.fileMeta.lastModified).format('YYYY-MM-DD HH:mm:ss')} secondary="Last Modified" />
                            </ListItem>
                        </List>
                    </Stack>
                </OptionsDash>
            ) : null}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={state.showOverlay}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    );
}
