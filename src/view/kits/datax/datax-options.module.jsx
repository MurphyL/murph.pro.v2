import React from 'react';
import Group from '/src/plug/widgets/container/group/group.v1.module';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import FormItem from '../../../plug/widgets/form/item/form-item.module';

import * as JSONKits from '/src/view/kits/json/json-kits.v1';

import DATAX_TEMPLATE from './datax-options.template.json';
import DATAX_PROXY_PROPS from './datax-proxy.properties.json';

const proxies = {
    readers: {},
    writers: {},
};

Object.entries(DATAX_PROXY_PROPS).forEach(([label, { reader, writer }]) => {
    if(reader) {
        proxies.readers[label] = reader;
    }
    if(writer) {
        proxies.writers[label] = writer;
    }
});

export default function DataXOptionsMaker() {
    const [options, setOptions] = React.useState(DATAX_TEMPLATE);
    const value = React.useMemo(() => JSONKits.format(options), [options]);
    return (
        <Splitter sizes={[65, 35]} minSizes={[700, 300]}>
            <CodeEditor language="json" defaultValue={value} />
            <div>
                <Group title="Reader 配置">
                    <FormItem type="select" name="reader" label="代理" options={proxies.readers} />
                </Group>
                <Group title="Writer 配置">
                    <FormItem type="select" name="writer" label="代理" options={proxies.writers} />
                </Group>
                <Group title="通用配置">

                </Group>
            </div>
        </Splitter>
    );
}