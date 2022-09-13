import React from 'react';

import { useDocumentTitle } from '/src/plug/hooks';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import Group from '/src/plug/widgets/container/group/group.v1.module';
import CodeBlock from '/src/plug/widgets/code/block/code-block.v1.module';

import styles from './datetime-kits.module.css';

export default function DatetimeKits() {
    useDocumentTitle('时间工具集');
    const [current, setCurrent] = React.useState('mysql');
    return (
        <Splitter className={styles.root} sizes={[65, 35]} minSizes={[700, 500]}>
            <div>

            </div>
            <div className={styles.extra}>
                <Group title="MySQL - Datetime Pattern">
                    <CodeBlock language="js" children="console.log({})" />
                </Group>
            </div>
        </Splitter>
    );
}
