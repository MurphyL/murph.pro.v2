import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import Group from '/src/plug/widgets/container/group/group.v1.module';

import * as JSONKits from '../../json-kits.v1';

import styles from './json-kits-base.module.css';

export default function JSONKitsRoot() {
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