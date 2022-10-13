import React from 'react';
import { useLocation } from 'react-router-dom';

import { useDocumentTitle } from '/src/plug/hooks';

import { Group, Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import { demo, format, doJSONPathQuery } from '../json-kits.v1';

import styles from './path-query.module.css';

export default function JSONPathQuery() {
    useDocumentTitle('JSONPath Evaluator');
    const location = useLocation();
    const [expr, setExpr] = React.useState('$');
    const [content, setContent] = React.useState(location.state ? location.state.content : demo);
    const [success, rows] = React.useMemo(() => {
        try {
            return [true, content.length > 0 ? doJSONPathQuery(content, expr) : null];
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
                {/* <Bar>
                    <Button variant="contained" size="small">查询</Button>
                </Bar> */}
                <div className={styles.result}>
                    {success ? (
                        <CodeBlock dark={false} language="json" children={format(rows, true, 2)} />
                    ) : (
                        <div>查询错误</div>
                    )}
                </div>
            </div>
        </Splitter>
    );
}