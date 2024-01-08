<template>
    <NConfigProvider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
        <RouterView />
    </NConfigProvider>
</template>

<script>
import { defineComponent } from 'vue';
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui';

import { RouterView } from 'vue-router';

export default defineComponent({
    name: 'app.v1',
    components: {
        NConfigProvider
    },
    setup() {
        return {
            zhCN,
            dateZhCN,
            themeOverrides: { 
                common: { fontWeightStrong: '600' } 
            }
        }
    }
});
</script>