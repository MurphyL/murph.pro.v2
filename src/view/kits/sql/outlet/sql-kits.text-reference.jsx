import React from "react";

import { useOutletContext } from "react-router-dom";
import { Button } from '@mui/material';

import { useSnackbar } from 'notistack';

import { useDocumentTitle } from '/src/plug/hooks';

import { format } from '../sql-kits.v1';

export default function SQLKitsTextReference() {
    useDocumentTitle('SQL 工具集');
    const { enqueueSnackbar } = useSnackbar();
    const { getEditorContent, setEditorContent } = useOutletContext();
    const format = React.useCallback(() => {
        const content = getEditorContent();
        if (content.length > 0) {
            setEditorContent(format(content));
        } else {
            enqueueSnackbar('SQL 内容为空，放弃操作', {
                autoHideDuration: 2000,
                variant: 'error',
            });
        }
    }, [getEditorContent, setEditorContent]);
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={format}>格式化</Button>
        </React.Fragment>
    );
}