import React from "react";

import { useSnackbar } from 'notistack';
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import { Button, IconButton, InputLabel, MenuItem, FormControl, Select, Tooltip } from '@mui/material';

import ConstructionIcon from '@mui/icons-material/Construction';

import { useDocumentTitle } from '/src/plug/hooks';
import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import OptionBoard from "/src/plug/widgets/container/options/options.module";

import COSUTOM_MODES from '/src/plug/widgets/code/custom-languages';

import styles from './text-root-stage.module.css';

const REDIRECT_MODES = {
    sql: '/kits/sql',
    mysql: '/kits/sql',
    json: '/kits/json',
};

export default function TextKitsLayout() {
    useDocumentTitle('文本工具集');
    const params = useParams();
    const navigate = useNavigate();
    const editorRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [editorOption, setEditorOption] = React.useState({});
    const languageInfo = React.useMemo(() => COSUTOM_MODES.find(item => item.id === params['*']), [params]);
    const getEditorContent = React.useCallback(() => editorRef.current ? editorRef.current.getValue() : '', [editorRef]);
    const setEditorContent = React.useCallback((value) => editorRef.current && editorRef.current.setValue(value), [editorRef]);
    const updateEditorOption = React.useCallback(() => { }, [editorOption, setEditorOption]);
    const setEditorLanguage = React.useCallback((newLanguage) => {
        if (editorRef && editorRef.current) {
            editorRef.current.setLanguage(newLanguage);
            navigate(REDIRECT_MODES[newLanguage] || '/kits/plaintext');
        }
    }, [navigate, editorRef]);
    const loadFileContent = React.useCallback((files) => {
        const reader = new FileReader();
        const file = files[0];
        reader.readAsText(file);
        reader.onload = () => {
            setEditorContent(reader.result);
            enqueueSnackbar(`【${file.name}】导入成功，文件类型：${file.type || 'text/plain'}`, {
                autoHideDuration: 10000,
                variant: 'success',
            });
        }
    }, [setEditorContent]);
    const sendToTextDifference = React.useCallback(() => {
        navigate('/kits/text/difference', { state: { language: params['*'], origin: getEditorContent() } });
    }, [getEditorContent, params]);
    return (
        <React.Fragment>
            <Splitter className={styles.root} sizes={[75, 25]} minSizes={[700, 300]}>
                <CodeEditor ref={editorRef} language={params['*']} />
                <div className={styles.extra}>
                    <div className={styles.bar}>
                        <div className={styles.language}>
                            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                                <InputLabel>当前语言</InputLabel>
                                <Select value={params['*']} label="切换语言" onChange={e => setEditorLanguage(e.target.value)}>
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
                        <Button variant="contained" onClick={sendToTextDifference}>比较</Button>
                        {languageInfo && languageInfo.snippet ? (
                            <Button variant="contained" onClick={() => enqueueSnackbar('功能暂未实现')}>代码片段</Button>
                        ) : null}
                        {languageInfo && languageInfo.options ? (
                            <React.Fragment>
                                <Button variant="contained" onClick={() => setEditorOption({ ...editorOption, showBoard: true })}>配置编辑器</Button>
                                <OptionBoard show={editorOption.showBoard} options={languageInfo.options} updateOption={updateEditorOption} onClose={() => setEditorOption({ ...editorOption, showBoard: false })} />
                            </React.Fragment>
                        ) : null}
                    </Group>
                    {params['*'].length > 0 && languageInfo ? (
                        <Group title="相关工具">
                            <Outlet context={{ getEditorContent, setEditorContent, setEditorLanguage, languageInfo }} />
                        </Group>
                    ) : null}
                </div>
            </Splitter>
        </React.Fragment>
    );
}
