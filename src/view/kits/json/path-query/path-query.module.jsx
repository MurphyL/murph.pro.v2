import React from 'react';
import { useLocation } from 'react-router-dom';

import { useDocumentTitle } from '/src/plug/hooks';

import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { demo, format, doJSONPathQuery } from '../json-kits.v1';

import styles from './path-query.module.css';

export default function JSONPathQuery() {
    useDocumentTitle('JSONPath Evaluator');
    const location = useLocation();
    const [expr, setExpr] = React.useState('$');
    const [content, setContent] = React.useState(location.state ? location.state.origin : demo);
    const [success, rows] = React.useMemo(() => {
        try {
            if (content.length === 0) {
                return [true, null]
            }
            return [true, doJSONPathQuery(content, expr)];
        } catch (e) {
            return [false, `查询出错：${e.message || 未知错误}`];
        }
    }, [expr, content]);
    return (
        <Splitter className={styles.root} sizes={[40, 60]} minSizes={[500, 600]}>
            <CodeEditor language="json" defaultValue={content} />
            <div className={styles.board}>
                <Group title="JSONPath" padding={0}>
                    <textarea className={styles.query} placeholder="请输入 JSONPath" value={expr} onChange={e => setExpr(e.target.value)} />
                </Group>
                <Group title="查询结果">
                    {success ? (
                        <CodeBlock dark={false} language="json" children={format(rows, true, 2)} />
                    ) : (
                        <div>查询错误</div>
                    )}
                </Group>
            </div>
        </Splitter>
    );
}