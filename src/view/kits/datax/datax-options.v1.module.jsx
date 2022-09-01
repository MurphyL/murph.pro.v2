import React from 'react';
import Group from '/src/plug/widgets/container/group/group.v1.module';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import * as JSONKits from '/src/view/kits/json/json-kits.v1';

import DATAX_TEMPLATE from './datax-options.v1.template.json';

export default function DataXOptionsMaker() {
    const [options, setOptions] = React.useState(DATAX_TEMPLATE);
    const value = React.useMemo(() => JSONKits.format(options), [options]);
    return (
        <Splitter sizes={[65, 35]} minSizes={[700, 300]}>
            <CodeEditor language="json" defaultValue={value} />
            <div>
                <Group title="Reader 配置">
                    <label>
                        <span>代理</span>
                        <select name="proxy">
                            <option value="">MySQL</option>
                        </select>
                    </label>
                </Group>
                <Group title="Writer 配置">
                    <label>
                        <span>代理</span>
                        <select name="proxy">
                            <option value="">MySQL</option>
                        </select>
                    </label>
                </Group>
                <Group title="通用配置">

                </Group>
            </div>
        </Splitter>
    );
}