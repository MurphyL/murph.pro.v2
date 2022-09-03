import React from "react";

import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

import { useDocumentTitle } from '/src/plug/hooks';

import Group from '/src/plug/widgets/container/group/group.v1.module';
import FormItem from '/src/plug/widgets/form/item/form-item.module';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

import COSUTOM_MODES from '/src/plug/widgets/code/monaco-languages';

import * as JSON_KITS from '/src/view/kits/json/json-kits.v1';

import styles from './text-kits-layout.v1.module.css';

const languages = Object.fromEntries(COSUTOM_MODES.map(item => ([item.aliases[0], item.id])));

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
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            // JSON_KITS.fromINI(source)
            replaceEditorContent('json', 'TODO: convert to INI')
        }
    }],
    json: [{
        display: '格式化',
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            replaceEditorContent('json', JSON_KITS.format(source))
        }
    }, {
        display: '发送到 JSONPath Query',
        action: 'PUSH_STATE',
        execute(pushState) {
            pushState('/kits/json/path-query', { replace: true })
        }
    }, {
        line: true
    }, {
        display: '转换为 YAML',
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            replaceEditorContent('yaml', JSON_KITS.toYAML(source))
        }
    }, {
        display: '转换为 XML',
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            replaceEditorContent('xml', JSON_KITS.toXML(source))
        }
    }],
    mysql: [{
        display: '发送到 DDL Parser',
        action: 'PUSH_STATE',
        target: '/kits/mysql/ddl',
        execute(pushState) {
            pushState('/kits/mysql/ddl', { replace: true })
        }
    }],
    sql: [{
        display: '发送到 MySQL DDL',
        action: 'PUSH_STATE',
        execute(pushState) {
            pushState('/kits/mysql/ddl', { replace: true })
        }
    }],
    xml: [{
        display: '转换为 JSON',
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            replaceEditorContent('json', JSON_KITS.fromXML(source))
        }
    }],
    yaml: [{
        display: '转换为 JSON',
        action: 'CONVERT',
        execute(replaceEditorContent, source) {
            replaceEditorContent('json', JSON_KITS.fromYAML(source))
        }
    }]
};

export default function TextKitsLayout({ language: sourceLanguage = 'plaintext' }) {
    const navigate = useNavigate();
    const editorRef = React.useRef(null);
    const [content, setContent] = React.useState(null);
    const [language, setLanguage] = React.useState(sourceLanguage);
    const changeEditorLanguage = React.useCallback((newLanguage) => {
        if (editorRef && editorRef.current) {
            setLanguage(newLanguage);
            editorRef.current.setLanguage(newLanguage);
            const target = REDIRECT_MODES[newLanguage] ? REDIRECT_MODES[newLanguage] : REDIRECT_MODES['plaintext'];
            navigate(target, { replace: true });
        }
    }, [navigate, setLanguage, editorRef]);
    const replaceEditorContent = React.useCallback((language, source) => {
        if (editorRef && editorRef.current) {
            changeEditorLanguage(language);
            editorRef.current.setValue(source);
        }
    }, [setLanguage, editorRef]);
    return (
        <Splitter className={styles.root} sizes={[75, 25]} minSizes={[700, 300]}>
            <CodeEditor ref={editorRef} language={language} defaultValue={content} onValueChange={({ payload }) => setContent(payload)} />
            <div className={styles.extra}>
                <Outlet context={{ language, content, changeEditorLanguage, replaceEditorContent }} />
            </div>
        </Splitter>
    );
}

export function TextKitsHome() {
    useDocumentTitle('文本工具');
    const navigate = useNavigate();
    const { language, content, changeEditorLanguage, replaceEditorContent } = useOutletContext();
    const changeLanguage = React.useCallback(({ target }) => {
        changeEditorLanguage && changeEditorLanguage(target.value);
    }, [changeEditorLanguage]);
    const referenceKits = React.useMemo(() => {
        if (!language || !MODE_KITS[language]) {
            return null;
        }
        return MODE_KITS[language].map(item => ({
            ...item
        }))
    }, [language]);
    const doCallback = React.useCallback((kit) => {
        switch (kit.action) {
            case 'CONVERT':
                return kit.execute(replaceEditorContent, content);
            case 'PUSH_STATE':
                return kit.execute(navigate, content);
            default:
                console.log('不支持的操作', kit);
        }
    }, [content]);
    return (
        <React.Fragment>
            <Group>
                <FormItem label="切换语言" type="select" options={languages} value={language} onChange={changeLanguage} />
            </Group>
            <Group title="基本操作">
                <button>导入</button>
                <button>比较</button>
            </Group>
            {Array.isArray(referenceKits) ? (
                <Group title="相关操作">
                    {referenceKits.map((kit, index) => (
                        <React.Fragment key={index} >
                            {kit.line ? (<br />) : (<button onClick={() => doCallback(kit)}>{kit.display}</button>)}
                        </React.Fragment>
                    ))}
                </Group>
            ) : null}
        </React.Fragment>
    );
}