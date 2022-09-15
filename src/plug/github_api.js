import axios from 'axios';
import { selectorFamily } from 'recoil';
import { JSONPath } from 'jsonpath-plus';

const ENTRY_FIELDS = 'object(expression: $content_base) { ... on Tree { entries { oid, path, object { ... on Blob { text } } } } }';

const gh_client = axios.create({
    baseURL: import.meta.env.VITE_GH_ENDPOINT,
    timeout: 10000
});

export const fetchEntries = selectorFamily({
    key: 'fetch-entries-v1',
    get: (content_base) => async () => {
        const { status, data } = await gh_client.post('', {
            query: `query ($gh_login: String!, $repository: String!, $content_base: String!) { repository(owner: $gh_login, name: $repository) { ${ENTRY_FIELDS} } }`,
            variables: {
                gh_login: import.meta.env.VITE_GH_USERNAME,
                repository: import.meta.env.VITE_GH_REPOSITORY,
                content_base: `HEAD:${content_base}`,
            }
        });
        if (status === 200) {
            return [true, JSONPath('$.data.repository.object.entries.*', data)];
        } else {
            return [false, '查询出错'];
        }
    }
});