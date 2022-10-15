import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SettingsIcon from '@mui/icons-material/Settings';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';

import * as monaco from 'monaco-editor';

import { OptionBoard } from '/src/plug/widgets/options';

import { useDocumentTitle } from '/src/plug/hooks';

import styles from './text-difference.module.css';

export default function TextDifference({ renderSideBySide = true }) {
    useDocumentTitle('文本比较');
    const navigate = useNavigate();
    const { state } = useLocation();
    const wrapper = React.useRef(null);
    const [instance, setInstance] = React.useState(null);
    const [options, setOptions] = React.useState({ renderSideBySide });
    React.useEffect(() => {
        if (!wrapper.current || wrapper.current.childElementCount) {
            return;
        }
        const source = (state && state.content) ? state.content : '';
        const language = (state && state.language) ? state.language : 'plaintext';
        var originalModel = monaco.editor.createModel(source, language);
        var modifiedModel = monaco.editor.createModel(source, language);
        var diffEditor = monaco.editor.createDiffEditor(wrapper.current, {
            fontSize: 20,
            ariaLabel: '比较',
            originalAriaLabel: '原文',
            dragAndDrop: false,
            smoothScrolling: true,
            automaticLayout: true,
            originalEditable: true,
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
    }, [wrapper, state]);
    const updateOptions = React.useCallback((newOptions, updateEditorOption = true) => {
        setOptions({ ...options, ...newOptions });
        if (instance && updateEditorOption) {
            instance.updateOptions({ ...newOptions });
        }
    }, [instance, options, setOptions]);
    const actions = React.useMemo(() => ([
        { name: '行间显示', hide: !options.renderSideBySide, icon: <FormatLineSpacingIcon />, handler: () => updateOptions({ renderSideBySide: false }) },
        { name: '拆分视图', hide: options.renderSideBySide, icon: <CompareArrowsIcon />, handler: () => updateOptions({ renderSideBySide: true }) },
        { name: '全部工具', icon: <ArchitectureIcon />, handler: () => navigate('/kits') },
    ].filter(item => !item.hide)), [updateOptions, options]);
    return (
        <div className={styles.root}>
            <div className={styles.editor} ref={wrapper} />
            <SpeedDial ariaLabel="更多" sx={{ position: 'absolute', bottom: 16, right: 56 }} icon={<SettingsIcon />} onClick={() => updateOptions({ showOptionBoard: true }, false)}>
                {actions.map((action, index) => (
                    <SpeedDialAction key={index} icon={action.icon} tooltipTitle={action.name} onClick={action.handler} />
                ))}
            </SpeedDial>
            <OptionBoard open={options.showOptionBoard} title="设置 Text Difference" onClose={() => updateOptions({ showOptionBoard: false }, false)}>
                <div>设置语言</div>
            </OptionBoard>
        </div>
    );
}