import React from "react";

import clsx from "clsx";

import Split from 'react-split'

import styles from './splitter.v1.module.css';

export default function Splitter({ className, children, sizes = [50, 50], minSizes, layout = 'x' }) {
    const [major, minor] = React.useMemo(() => React.Children.toArray(children), [children]);
    return (
        <Split className={clsx(styles.root, styles[`layout-${layout}`], className)} sizes={sizes} minSize={minSizes}>
            <div>{major || <div>major view</div>}</div>
            <div>{minor || <div>minor view</div>}</div>
        </Split>
    );
}