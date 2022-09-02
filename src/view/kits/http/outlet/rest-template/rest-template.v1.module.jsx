import React from "react";

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeBlock from "/src/plug/widgets/code/block/code-block.v1.module";

import RestRequestMaker from "./rest-request-maker";

import styles from './rest-template.v1.module.css';

const x = '{\n\t"dependencies": {\n\t\t\n\t}\n}\n';

export default function RestTemplate() {
    const onChange = React.useCallback(({ payload }) => {
        console.log(payload);
    }, []);
    return (
        <Splitter sizes={[60, 40]} minSizes={[600, 400]}>
            <RestRequestMaker className={styles.root} defaultValue={x} onValueChange={onChange} />
            <CodeBlock dark={false} />
        </Splitter>
    );
}