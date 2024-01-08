<template>
    <div class="dash-layout">
        <div class="header">
            <NMenu responsive mode="horizontal" :options="menuOptions" />
        </div>
        <div class="stage" :class="{ 'with-sidebar': hasSidebar }">
            <div class="content">
                <RouterView />
            </div>
            <RouterView name="sidebar" />
        </div>
    </div>
</template>

<script>
import { defineComponent, h } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

import { NIcon, NMenu } from 'naive-ui';

import { HomeRound, MoreHorizFilled } from '@vicons/material';

const renderIcon = (icon) => {
    return () => h(NIcon, null, { default: () => h(icon) });
};

const jumper = ({ label, link }, router = false) => {
    return () => h(router ? RouterLink : 'a', link, { default: () => label });
};

const menuOptions = [
    {
        key: 'home',
        icon: renderIcon(HomeRound),
        label: jumper({
            label: 'Home',
            link: { to: { name: 'json-kits', } },
        }, true),
    }, {
        key: 'more',
        label: '舞',
        icon: renderIcon(MoreHorizFilled),
        children: [
            {
                key: 'sql-formatter',
                label: jumper({
                    label: 'SQL Formatter',
                    link: { to: { name: 'sql-formatter', } },
                }, true),
            },
            {
                key: 'kits-dash',
                label: jumper({
                    label: 'Kits Dash',
                    link: { to: { name: 'sql-formatter', } },
                }, true),
            },
            {
                key: 'devdocs',
                label: jumper({
                    label: 'DevDocs',
                    link: {
                        href: 'https://devdocs.io/',
                        target: '_blank',
                        rel: 'noopenner noreferrer'
                    }
                }),
            }
        ]
    }
];

export default defineComponent({
    name: 'dash-layout.v1',
    components: {
        NMenu
    },
    setup() {
        return {
            menuOptions
        };
    },
    computed: {
        hasSidebar() {
            let ret = false;
            this.$route.matched.forEach(e => {
                if ('sidebar' in e.components) {
                    ret = true;
                }
            });
            return ret;
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
        padding: 5px;

        &.with-sidebar {
            display: grid;
            grid-template-columns: 1fr 230px;
            column-gap: 5px;

            border: 1px solid #efefef;
        }

    }
}
</style>