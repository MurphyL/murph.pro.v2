<template>
    <NConfigProvider :theme-overrides="themeOverrides" :hljs="hljs" :locale="zhCN" :date-locale="dateZhCN">
        <NSpin :show="spin">
            <RouterView />
        </NSpin>
    </NConfigProvider>
</template>

<script>
import { defineComponent } from 'vue';
import { NConfigProvider, NSpin, zhCN, dateZhCN } from 'naive-ui';

import hljs from 'highlight.js/lib/core';

import { RouterView } from 'vue-router';

export default defineComponent({
    name: 'app.v1',
    components: {
        NConfigProvider,
        NSpin,
    },
    setup() {
        return {
            hljs,
            zhCN,
            dateZhCN,
            themeOverrides: {
                common: { fontWeightStrong: '600' }
            }
        }
    },
    data() {
        return {
            spin: true,
        };
    },
    mounted() {
        setTimeout(() => {
            this.spin = false;
        }, 5);
    }
});
</script>