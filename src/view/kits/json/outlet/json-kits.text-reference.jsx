import React from "react";

import { useOutletContext } from "react-router-dom";
import { Button } from '@mui/material';

import { useSnackbar } from 'notistack';

import * as JSONKits from '../json-kits.v1';

export default React.memo(function JSONKitsTextReference() {
    const { enqueueSnackbar } = useSnackbar();
    const { getEditorContent, setEditorContent, setEditorLanguage } = useOutletContext();
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
            <Button variant="outlined" onClick={() => doConvent(JSONKits.format)}>格式化</Button>
            <Button variant="outlined" onClick={() => enqueueSnackbar('TODO：相关工具未实现')}>发送到 JSONPath Query</Button>
            <br />
            <Button variant="outlined" onClick={() => doConvent(JSONKits.toYAML, 'yaml')}>转换为 YAML</Button>
            <Button variant="outlined" onClick={() => doConvent(JSONKits.toXML, 'xml')}>转换为 XML</Button>
        </React.Fragment>
    );
})