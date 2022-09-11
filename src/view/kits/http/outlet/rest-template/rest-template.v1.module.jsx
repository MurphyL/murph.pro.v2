import React from "react";

import { useDocumentTitle } from '/src/plug/hooks';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeBlock from "/src/plug/widgets/code/block/code-block.v1.module";

import { doAjaxRequest, renderResponse } from '../../rest-request-maker';

import styles from './rest-template.v1.module.css';

const RestRequestEditor = React.lazy(() => import("../../rest-request-editor"));

const TEMPLATE_REQUESTS = 'POST http://murph.pro/endpoints\n\n{\n\t"dependencies": {\n\t\t\n\t}\n}\n';

const REST_ENDPOINT = '/rest_template';

export default function RestTemplate() {
    useDocumentTitle('REST 请求');
    const [response, setResponse] = React.useState(null);
    const doRequest = React.useCallback(async (params) => {
        const x = await doAjaxRequest(REST_ENDPOINT, params);
        setResponse(x);
    }, [setResponse]);
    return (
        <Splitter className={styles.root} sizes={[60, 40]} minSizes={[600, 400]}>
            <RestRequestEditor className={styles.editor} defaultValue={TEMPLATE_REQUESTS} doRequest={doRequest} />
            <div className={styles.response}>
                {response ? (
                    response.success ? (
                        <CodeBlock children={renderResponse(response.payload.request, response.payload.response)} />
                    ) : (
                        <div>请求出错</div>
                    )
                ) : (
                    <div>Nothing here!</div>
                )}
            </div>
        </Splitter>
    );
}
