import { createRouter, createWebHashHistory } from 'vue-router';

import dashLayout from '../plug/layouts/dash-layout.vue';

export default createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/json/kits',
        },
        {
            path: '/json',
            component: dashLayout,
            children: [{
                path: 'kits',
                name: 'json-kits',
                component: () => import('@/view/json/json-kits.vue')
            }]
        },
        {
            path: '/sql',
            component: dashLayout,
            children: [{
                path: 'formatter',
                name: 'sql-formatter',
                components: {
                    default: () => import('@/view/sql/sql-formatter.vue'),
                    sidebar: () => import('@/view/sql/sql-sidebar.vue'),
                }
            }]
        }
    ]
});