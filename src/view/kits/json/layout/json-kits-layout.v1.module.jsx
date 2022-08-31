import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import { useDocumentTitle } from "/src/plug/hooks";

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

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