import React from "react";
import { Link, Outlet, useParams, useNavigate, useOutletContext } from "react-router-dom";

import { useDocumentTitle } from "/src/plug/hooks";

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import Group from '/src/plug/widgets/container/group/group.v1.module';

import styles from './json-kits-layout.v1.module.css';

const ROOT_PROPS = {
    '': {
        sizes: [75, 25],
        minSizes: [700, 400]
    },
    formatter: {
        sizes: [45, 55],
        minSizes: [400, 700]
    }
};

export default function JSONKitsLayout() {
    useDocumentTitle('JSON 工具集');
    const editorRef = React.useRef();
    const params = useParams();
    const [source, setSource] = React.useState('{"hello": "world"}');
    const editorContext = React.useMemo(() => ({
        source,
        setEditorValue(payload) {
            editorRef.current && editorRef.current.setValue(payload);
        }
    }), [editorRef, source]);
    return (
        <Splitter className={styles.root} {...ROOT_PROPS[params['*']]}>
            <CodeEditor language="json" ref={editorRef} defaultValue={source} onValueChange={({ payload }) => setSource(payload)} />
            <div className={styles.extra}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Link to="./">JSON 工具集</Link>
                    </div>
                    <div className={styles.navi}>
                        <Link to="/">首页</Link>
                    </div>
                </div>
                <Outlet context={editorContext} />
            </div>
        </Splitter>
    );
}


export const JSONKitsHome = () => {
    let navigate = useNavigate();
    let payload = useOutletContext();
    let format = (pretty) => {
        let result = JSONKits.format(payload.source, pretty, 4);
        payload.setEditorValue && payload.setEditorValue(result);
    }
    return (
        <div className={styles.root}>
            <Group title="基础工具">
                <button onClick={() => format(true)}>格式化</button>
                <button onClick={() => format(false)}>压缩</button>
                <button onClick={() => format(true)}>转义</button>
                <br />
                <button onClick={() => navigate('./path-query', { replace: true })}>JSONPath 查询</button>
                <br />
                <button onClick={() => navigate('./to-yaml', { replace: true })}>转换为 YAML</button>
                <button onClick={() => navigate('./to-js', { replace: true })}>转换为 JavaScript 代码</button>
            </Group>
            <Group title="相关工具">
                <b>TODO</b>
            </Group>
        </div>
    );
}