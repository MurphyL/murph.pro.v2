import React from "react";

import clsx from "clsx";

import Split from 'react-split'

import styles from './splitter.v1.module.css';

export default function Splitter({ className, children, sizes = [50, 50], minSizes, layout = 'x' }) {
    const [major, minor] = React.useMemo(() => React.Children.toArray(children), [children]);
    return (
        <Split className={clsx(styles.root, styles[`layout-${layout}`], className)} sizes={sizes} minSize={minSizes}>
            <div className={styles.side}>{major || <div>major</div>}</div>
            <div className={styles.side}>{minor || <div>minor</div>}</div>
        </Split>
    );
}