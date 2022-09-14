import React from "react";

import { useOutletContext } from "react-router-dom";
import Button from '@mui/material/Button';

import { useSnackbar } from 'notistack';

import { useDocumentTitle } from '/src/plug/hooks';

import { format, toYAML, toXML } from '../json-kits.v1';

export default React.memo(function JSONKitsTextReference() {
    useDocumentTitle('JSON 工具集');
    const { enqueueSnackbar } = useSnackbar();
    const { getEditorContent, setEditorContent, setEditorLanguage, pushState } = useOutletContext();
    const doConvent = React.useCallback((converter, language = 'json') => {
        const source = getEditorContent();
        if (source && source.trim().length) {
            setEditorContent(converter(source));
            language && setEditorLanguage(language);
        } else {
            enqueueSnackbar('JSON 内容为空，放弃操作', {
                autoHideDuration: 2000,
                variant: 'error',
            });
        }
    }, [getEditorContent, setEditorContent, setEditorLanguage]);
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={() => doConvent((source) => format(source, true, 4))}>格式化</Button>
            <Button variant="outlined" onClick={() => doConvent((source) => format(source, false))}>压缩</Button>
            <Button variant="outlined" onClick={() => pushState('/kits/json/tree-view')}>Tree View</Button>
            <br />
            <Button variant="outlined" onClick={() => pushState('/kits/json/path-query')}>发送到 JSONPath Query</Button>
            <br />
            <Button variant="outlined" onClick={() => doConvent(toYAML, 'yaml')}>转换为 YAML</Button>
            <Button variant="outlined" onClick={() => doConvent(toXML, 'xml')}>转换为 XML</Button>
        </React.Fragment>
    );
})