import React from "react";

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeBlock from "/src/plug/widgets/code/block/code-block.v1.module";

import RestRequestMaker from "./rest-request-maker";

import styles from './rest-template.v1.module.css';

const x = 'POST http://cijian.us\n\n{\n\t"dependencies": {\n\t\t\n\t}\n}\n';

export default function RestTemplate() {
    const [payload, setPayload] = React.useState({});
    const doRequest = React.useCallback((payload) => {
        setPayload(payload);
    }, []);
    return (
        <Splitter className={styles.root} sizes={[60, 40]} minSizes={[600, 400]}>
            <RestRequestMaker className={styles.editor} defaultValue={x} doRequest={doRequest} />
            <CodeBlock dark={false} children={JSON.stringify(payload, null, 4)} />
        </Splitter>
    );
}