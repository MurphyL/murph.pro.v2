import Group from '/src/plug/widgets/container/group/group.v1.module';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

export default function ElasticSearchLayout() {
    return (
        <Splitter sizes={[75, 25]} minSizes={[700, 300]}>
            <div>ElasticSearch Query</div>
            <div>
                <Group title="其他工具">
                    <a href="https://app.elasticvue.com" target="_blank">Elasticvue</a>
                </Group>
            </div>
        </Splitter>
    );
}