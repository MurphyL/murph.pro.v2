import React from "react";
import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { useDocumentTitle } from '/src/plug/hooks';

import { Splitter } from "/src/plug/widgets/containers";
import CodeBlock from "/src/plug/widgets/code/code-block.v1";

import { doAjaxRequest, renderResponse } from '../rest-request-maker';

import styles from './rest-template.v1.module.css';

const RestRequestEditor = React.lazy(() => import("../rest-request-editor"));

const REST_ENDPOINT = '/rest_template';

const TEMPLATE_REQUESTS = 'POST http://murph.pro/endpoints\n\n{\n\t"dependencies": {\n\t\n\t}\n}\n';

export default function RestTemplate() {
    useDocumentTitle('REST 请求');
    const { enqueueSnackbar } = useSnackbar();
    const [response, setResponse] = React.useState({ code: 100 });
    const execRequest = React.useCallback(async (params) => {
        setResponse({ status: 300 })
        setResponse(await doAjaxRequest(REST_ENDPOINT, params));
        enqueueSnackbar('请求成功', {
            autoHideDuration: 5000,
            variant: 'success',
        });
    }, [setResponse]);
    return (
        <Splitter className={styles.root} sizes={[60, 40]} minSize={[600, 400]}>
            <RestRequestEditor className={styles.editor} defaultValue={TEMPLATE_REQUESTS} execRequest={execRequest} />
            <div className={styles.response}>
                <RestStatusView {...response} />
            </div>
        </Splitter>
    );
}

const RestStatusView = ({ status, payload }) => {
    switch (status) {
        case 200:
            return <CodeBlock children={renderResponse(payload.request, payload.response)} />;
        case 300:
            return <CircularProgress />;
        case 500:
            return <Alert severity="error">请求出错：${payload}</Alert>;
        default:
            return <Alert severity="warning">暂未执行任何请求</Alert>;
    }
};
