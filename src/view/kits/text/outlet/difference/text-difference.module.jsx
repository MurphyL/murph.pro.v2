import React from 'react';
import * as monaco from 'monaco-editor';

import { useDocumentTitle } from '/src/plug/hooks';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import styles from './text-difference.module.css';

export default function TextDifference() {
    useDocumentTitle('文本比较');
    const wrapper = React.useRef(null);
    React.useEffect(() => {
        if (!wrapper.current || wrapper.current.childElementCount) {
            return;
        }
        var originalModel = monaco.editor.createModel(
            'This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text',
            'text/plain'
        );
        var modifiedModel = monaco.editor.createModel(
            'just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.',
            'text/plain'
        );
        var diffEditor = monaco.editor.createDiffEditor(wrapper.current, {
            fontSize: 16,
            smoothScrolling: true,
            automaticLayout: true,
            renderSideBySide: true,
            enableSplitViewResizing: true,
        });
        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    }, [wrapper]);
    return (
        <Splitter sizes={[80, 20]} minSizes={[700, 200]}>
            <div className={styles.root} ref={wrapper} />
        </Splitter>
    );
}