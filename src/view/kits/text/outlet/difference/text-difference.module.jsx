import React from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import { Settings, Flip, FormatAlignLeft } from '@mui/icons-material';

import * as monaco from 'monaco-editor';

import { useDocumentTitle } from '/src/plug/hooks';

import styles from './text-difference.module.css';

export default function TextDifference({ renderSideBySide = true }) {
    useDocumentTitle('文本比较');
    const wrapper = React.useRef(null);
    const [instance, setInstance] = React.useState(null);
    const [options, setOptions] = React.useState({ renderSideBySide });
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
            ariaLabel: '比较',
            originalAriaLabel: '原文',
            dragAndDrop: false,
            smoothScrolling: true,
            automaticLayout: true,
            renderSideBySide: true,
            accessibilitySupport: 'off',
            enableSplitViewResizing: true
        });
        setInstance(diffEditor);
        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
        return () => diffEditor && diffEditor.dispose();
    }, [wrapper]);
    const updateEditorOptions = React.useCallback((newOptions) => {
        setOptions({ ...options, ...newOptions });
        instance && instance.updateOptions(newOptions);
    }, [instance, options, setOptions]);
    const actions = React.useMemo(() => ([
        { name: '行间显示', show: options.renderSideBySide, icon: <FormatAlignLeft />, handler: () => updateEditorOptions({ renderSideBySide: false }) },
        { name: '拆分视图', show: !options.renderSideBySide, icon: <Flip />, handler: () => updateEditorOptions({ renderSideBySide: true }) },
    ]), [updateEditorOptions, options]);
    return (
        <div className={styles.root}>
            <div className={styles.editor} ref={wrapper} />
            <SpeedDial ariaLabel="设置" sx={{ position: 'absolute', bottom: 16, right: 56 }} icon={<Settings />}>
                {actions.filter(item => item.show).map((action, index) => (
                    <SpeedDialAction key={index} icon={action.icon} tooltipTitle={action.name} onClick={action.handler} />
                ))}
            </SpeedDial>
        </div>
    );
}