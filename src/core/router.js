import { h } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import dashLayout from '../plug/layouts/dash-layout.vue';

export default createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/data/json-kits',
        },
        {
            path: '/data',
            component: dashLayout,
            props: { hasSidebar: true },
            children: [{
                path: 'json-kits',
                name: 'json-kits',
                component: () => import('@/view/data/json-kits.vue')
            }, {
                path: 'sql-formatter',
                name: 'sql-formatter',
                components: {
                    default: () => import('@/view/sql/sql-formatter.vue'),
                    sidebar: () => import('@/view/sql/sql-sidebar.vue'),
                }
            }]
        },
        {
            path: '/kits',
            component: dashLayout,
            children: [{
                path: 'dash',
                name: 'kits-dash',
                component: () => import('@/view/kits-dash.vue')
            }]
        },
    ]
});