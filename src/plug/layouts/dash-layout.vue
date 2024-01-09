<template>
    <div class="dash-layout">
        <div class="header">
            <NMenu responsive mode="horizontal" :options="topNavi" v-model:value="activeMenuItem" />
        </div>
        <div class="stage" :class="{ 'with-sidebar': hasSidebar }">
            <div class="content">
                <RouterView />
            </div>
            <div class="sidebar" v-if="hasSidebar">
                <RouterView name="sidebar" />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, h } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import { last, uniqueId } from 'lodash';

import { NMenu } from 'naive-ui';

import VIcon from '@/plug/widgets/v-icon.vue';

import { useLayoutStore } from '@/plug/stores/layout-store';

import preparedTopNavi from '@/plug/dataset/top-navi.json';

export default defineComponent({
    name: 'dash-layout.v1',
    components: {
        NMenu,
    },
    props: {
        hasSidebar: {
            type: Boolean,
            default: false,
        }
    },
    setup() {
        const layoutStore = useLayoutStore();
        return {
            layoutStore,
        };
    },
    computed: {
        activeMenuItem: {
            get() {
                return last(this.$route.matched.map(e => e.path));
            },
            set(val) {
                console.log(val);
            }
        },
        topNavi() {
            return this.wrapTopNavi(preparedTopNavi);
        }
    },
    methods: {
        wrapTopNavi(menus = []) {
            const result = [];
            menus.forEach((e = {}) => {
                const item = { key: 'key' in e ? e.key : uniqueId('top-navi-') };
                if ('icon' in e) {
                    if(typeof(e.icon) === 'string') {
                        item.icon = () => h(VIcon, { slug: e.icon, size: 20 });
                    } else {
                        item.icon = () => h(VIcon, { slug: e.icon.slug, group: e.icon.group, size: 20 });
                    }
                }
                if ('children' in e && Array.isArray(e.children)) {
                    item.label = () => h('a', e.target, { default: () => e.label });
                    item.children = this.wrapTopNavi(e.children);
                    result.push(item);
                } else if ('href' in e.target) {
                    item.label = () => h('a', e.target, { default: () => e.label });
                    result.push(item);
                } else if ('to' in e.target) {
                    item.label = () => h(RouterLink, e.target, { default: () => e.label });
                    result.push(item);
                }
            });
            return result;
        }
    }
});
</script>

<style scoped lang="less">
.dash-layout {
    display: grid;
    height: 100vh;
    grid-template-rows: 40px 1fr;
    row-gap: 3px;

    .header {
        box-shadow: 0px 6px 11px -2px rgba(120, 120, 120, 0.07);
    }

    .stage {
        padding: 5px 0;

        &.with-sidebar {
            display: grid;
            grid-template-columns: 1fr 230px;
            column-gap: 5px;

            border: 1px solid #efefef;
        }

    }
}
</style>